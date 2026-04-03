import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import type { Scraper, ScrapedRecord, ScrapeOptions } from "../types";
import type { OrientationChProfession } from "./types";

const BASE_URL = "https://www.orientation.ch";
const DELAY_MS = 1000;

const INDEX_URLS: Record<string, string> = {
  fr: `${BASE_URL}/dyn/show/2086?lang=fr`,
  de: `${BASE_URL}/dyn/show/2086?lang=de`,
  en: `${BASE_URL}/dyn/show/2086?lang=en`,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string> {
  const resp = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (educational-scraper; orientation-game-project)",
      "Accept-Language": "fr-CH,fr;q=0.9",
    },
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} for ${url}`);
  }
  return resp.text();
}

function extractSectionText($: cheerio.CheerioAPI, anchorId: string): string {
  const anchor = $(`#${anchorId}`);
  const boxContent = anchor.closest(".toggleBox").find(".boxContent");
  if (!boxContent.length) return "";
  return htmlToText($, boxContent);
}

function htmlToText(
  $: cheerio.CheerioAPI,
  el: cheerio.Cheerio<Element>
): string {
  const html = el.html();
  if (!html) return "";

  const frag = cheerio.load(html, { xml: false });
  frag("br").replaceWith("\n");
  frag("h3").each((_, h) => {
    const text = frag(h).text().trim();
    frag(h).replaceWith(`\n\n### ${text}\n`);
  });
  frag("h4").each((_, h) => {
    const text = frag(h).text().trim();
    frag(h).replaceWith(`\n\n#### ${text}\n`);
  });
  frag("li").each((_, li) => {
    const text = frag(li).text().trim();
    frag(li).replaceWith(`\n- ${text}`);
  });
  frag("p").each((_, p) => {
    const text = frag(p).text().trim();
    frag(p).replaceWith(`\n\n${text}\n`);
  });

  let text = frag.root().text();
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
  return text.trim();
}

async function scrapeIndex(
  locale: string
): Promise<{ name: string; url: string; id: string }[]> {
  const indexUrl = INDEX_URLS[locale];
  if (!indexUrl) throw new Error(`Unsupported locale: ${locale}`);

  const html = await fetchPage(indexUrl);
  const $ = cheerio.load(html);

  const professions: { name: string; url: string; id: string }[] = [];
  $("#result-wrapper-custom .result").each((_, el) => {
    const linkEl = $(el).find(".title a");
    const href = linkEl.attr("href");
    const name = linkEl.text().trim();
    if (href && name) {
      const idMatch = href.match(/id=(\d+)/);
      const id = idMatch ? idMatch[1] : "";
      professions.push({
        name,
        url: `${BASE_URL}${href.replace(/&amp;/g, "&")}`,
        id,
      });
    }
  });

  return professions;
}

async function scrapeProfession(
  name: string,
  url: string,
  id: string
): Promise<OrientationChProfession> {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const catBox = $("#roof-bottom .boxContent");
  let domainesProfessionnels = "";
  let niveauxDeFormation = "";
  let swissdoc = "";
  let miseAJour = "";

  catBox.find("dl dt").each((_, dt) => {
    const label = $(dt).text().trim();
    const value = $(dt).next("dd").text().trim();
    if (label === "Domaines professionnels") domainesProfessionnels = value;
    if (label === "Niveaux de formation") niveauxDeFormation = value;
    if (label === "Swissdoc") swissdoc = value;
  });

  const eDoc = catBox.find(".eDoc span").text().trim();
  if (eDoc) miseAJour = eDoc;

  return {
    name,
    url,
    orientationId: id,
    domainesProfessionnels,
    niveauxDeFormation,
    swissdoc,
    miseAJour,
    description: extractSectionText($, "anchor1"),
    formation: extractSectionText($, "anchor2"),
    perspectivesProfessionnelles: extractSectionText($, "anchor3"),
    adressesUtiles: extractSectionText($, "anchor6"),
    autresInformations: extractSectionText($, "anchor7"),
  };
}

export class OrientationChScraper implements Scraper {
  readonly sourceId = "orientation-ch";
  readonly supportedLocales = ["fr", "de", "en"];

  async scrape(locale: string, options?: ScrapeOptions): Promise<ScrapedRecord[]> {
    const limit = options?.limit ?? Infinity;
    const allProfessions = await scrapeIndex(locale);
    const toScrape = allProfessions.slice(0, Math.min(limit, allProfessions.length));

    const results: ScrapedRecord[] = [];
    for (let i = 0; i < toScrape.length; i++) {
      const { name, url, id } = toScrape[i];
      const profession = await scrapeProfession(name, url, id);
      results.push({
        externalId: id,
        sourceId: this.sourceId,
        locale,
        data: profession as unknown as Record<string, unknown>,
      });
      if (i < toScrape.length - 1) {
        await sleep(DELAY_MS);
      }
    }

    return results;
  }
}
