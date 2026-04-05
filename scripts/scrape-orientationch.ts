/**
 * Scrape CFC professions from orientation.ch
 *
 * Usage:
 *   npx tsx scripts/scrape-orientationch.ts              # Test run: 3 careers
 *   npx tsx scripts/scrape-orientationch.ts --all         # All CFC careers
 *   npx tsx scripts/scrape-orientationch.ts --limit 10    # First 10 careers
 *
 * Output: scripts/output/professions-cfc.json
 */

import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://www.orientation.ch";
const INDEX_URL = `${BASE_URL}/dyn/show/2086?lang=fr`;
const OUTPUT_DIR = join(__dirname, "output");

// Delay between requests to be polite to the server
const DELAY_MS = 1000;

interface Profession {
  name: string;
  url: string;
  orientationId: string;
  domainesProfessionnels: string;
  niveauxDeFormation: string;
  swissdoc: string;
  miseAJour: string;
  description: string;
  formation: string;
  perspectivesProfessionnelles: string;
  autresInformations: string;
  adressesUtiles: string;
}

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

/**
 * Extract inner HTML from a toggleBox section, preserving exact text content.
 * Converts HTML to clean text while preserving structure (lists, paragraphs).
 */
function extractSectionText($: cheerio.CheerioAPI, anchorId: string): string {
  const anchor = $(`#${anchorId}`);
  const boxContent = anchor.closest(".toggleBox").find(".boxContent");
  if (!boxContent.length) return "";

  // Get inner HTML and convert to readable text
  return htmlToText($, boxContent);
}

/**
 * Convert cheerio element's HTML to clean, structured plain text.
 * Preserves paragraphs, headings, lists, and line breaks.
 */
function htmlToText(
  $: cheerio.CheerioAPI,
  el: cheerio.Cheerio<import("domhandler").Element>
): string {
  const html = el.html();
  if (!html) return "";

  // Load the HTML fragment
  const frag = cheerio.load(html, { xml: false });

  // Replace <br> with newline
  frag("br").replaceWith("\n");

  // Process headings: add newline before and after, with markdown-style markers
  frag("h3").each((_, h) => {
    const text = frag(h).text().trim();
    frag(h).replaceWith(`\n\n### ${text}\n`);
  });
  frag("h4").each((_, h) => {
    const text = frag(h).text().trim();
    frag(h).replaceWith(`\n\n#### ${text}\n`);
  });

  // Process list items
  frag("li").each((_, li) => {
    const text = frag(li).text().trim();
    frag(li).replaceWith(`\n- ${text}`);
  });

  // Process paragraphs
  frag("p").each((_, p) => {
    const text = frag(p).text().trim();
    frag(p).replaceWith(`\n\n${text}\n`);
  });

  // Get text, clean up excessive whitespace
  let text = frag.root().text();
  // Normalize whitespace: collapse multiple blank lines to double
  text = text.replace(/\n{3,}/g, "\n\n");
  // Trim each line
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
  return text.trim();
}

/** Scrape the index page to get all profession links */
async function scrapeIndex(): Promise<{ name: string; url: string; id: string }[]> {
  console.log("Fetching index page...");
  const html = await fetchPage(INDEX_URL);
  const $ = cheerio.load(html);

  const professions: { name: string; url: string; id: string }[] = [];

  $("#result-wrapper-custom .result").each((_, el) => {
    const linkEl = $(el).find(".title a");
    const href = linkEl.attr("href");
    const name = linkEl.text().trim();
    if (href && name) {
      // Extract ID from href like /dyn/show/2093?lang=fr&idx=10000&id=152
      const idMatch = href.match(/id=(\d+)/);
      const id = idMatch ? idMatch[1] : "";
      professions.push({
        name,
        url: `${BASE_URL}${href.replace(/&amp;/g, "&")}`,
        id,
      });
    }
  });

  console.log(`Found ${professions.length} professions on index page.`);
  return professions;
}

/** Scrape a single profession detail page */
async function scrapeProfession(
  name: string,
  url: string,
  id: string
): Promise<Profession> {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // Extract metadata from the categories box in #roof-bottom
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

  // Extract main content sections
  const description = extractSectionText($, "anchor1");
  const formation = extractSectionText($, "anchor2");
  const perspectivesProfessionnelles = extractSectionText($, "anchor3");
  const adressesUtiles = extractSectionText($, "anchor6");
  const autresInformations = extractSectionText($, "anchor7");

  return {
    name,
    url,
    orientationId: id,
    domainesProfessionnels,
    niveauxDeFormation,
    swissdoc,
    miseAJour,
    description,
    formation,
    perspectivesProfessionnelles,
    autresInformations,
    adressesUtiles,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const isAll = args.includes("--all");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : isAll ? Infinity : 3;

  // 1. Get all profession links from index
  const allProfessions = await scrapeIndex();

  // 2. Determine which ones to scrape
  const toScrape = allProfessions.slice(0, Math.min(limit, allProfessions.length));
  console.log(`\nScraping ${toScrape.length} profession(s)...\n`);

  // 3. Scrape each one
  const results: Profession[] = [];
  for (let i = 0; i < toScrape.length; i++) {
    const { name, url, id } = toScrape[i];
    console.log(`[${i + 1}/${toScrape.length}] ${name}`);
    try {
      const profession = await scrapeProfession(name, url, id);
      results.push(profession);
      console.log(`  ✓ swissdoc=${profession.swissdoc}, domaines=${profession.domainesProfessionnels}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err}`);
    }
    if (i < toScrape.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // 4. Write output
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputPath = join(OUTPUT_DIR, "professions-cfc.json");
  writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\nDone! Wrote ${results.length} professions to ${outputPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
