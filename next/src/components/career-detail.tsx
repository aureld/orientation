"use client";

import { useTranslations } from "next-intl";
import type { CareerDetail } from "@/app/actions/career";

/**
 * Render orientation.ch text content as structured HTML.
 * The text uses markdown-like formatting:
 *   ### Heading  →  <h4>
 *   #### Heading →  <h5>
 *   - item       →  <li>
 *   blank lines  →  <p> breaks
 */
function ContentSection({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let key = 0;

  function flushList() {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key++} className="career-list">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      flushList();
      elements.push(<h5 key={key++} className="career-subheading">{trimmed.slice(5)}</h5>);
    } else if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(<h4 key={key++} className="career-heading">{trimmed.slice(4)}</h4>);
    } else if (trimmed.startsWith("- ")) {
      currentList.push(trimmed.slice(2));
    } else {
      flushList();
      elements.push(<p key={key++} className="career-text">{trimmed}</p>);
    }
  }
  flushList();

  return <>{elements}</>;
}

export function CareerDetailView({ career }: { career: CareerDetail }) {
  const t = useTranslations("career");

  const hasFullContent = career.descriptionFull || career.formation;

  return (
    <div className="career-detail">
      {/* Header */}
      <div className="career-detail-header">
        <span className="career-detail-icon">{career.icon}</span>
        <h2 className="career-detail-name">{career.name}</h2>
        <div className="career-detail-meta">
          <span className="career-badge">{career.type}</span>
          <span className="career-badge">{career.duration} ans</span>
          {career.domainesProfessionnels && (
            <span className="career-domain">{career.domainesProfessionnels}</span>
          )}
        </div>
      </div>

      {/* Full orientation.ch content sections */}
      {hasFullContent ? (
        <>
          {career.descriptionFull && (
            <section className="career-section">
              <h3>{t("description")}</h3>
              <ContentSection text={career.descriptionFull} />
            </section>
          )}

          {career.formation && (
            <section className="career-section">
              <h3>{t("formation")}</h3>
              <ContentSection text={career.formation} />
            </section>
          )}

          {career.perspectivesProfessionnelles && (
            <section className="career-section">
              <h3>{t("perspectives")}</h3>
              <ContentSection text={career.perspectivesProfessionnelles} />
            </section>
          )}

          {career.autresInformations && (
            <section className="career-section">
              <h3>{t("otherInfo")}</h3>
              <ContentSection text={career.autresInformations} />
            </section>
          )}

          {career.adressesUtiles && (
            <section className="career-section">
              <h3>{t("usefulAddresses")}</h3>
              <ContentSection text={career.adressesUtiles} />
            </section>
          )}
        </>
      ) : (
        /* Fallback for professions without orientation.ch content */
        career.description && (
          <section className="career-section">
            <h3>{t("description")}</h3>
            <p className="career-text">{career.description}</p>
          </section>
        )
      )}

      {/* Link to orientation.ch */}
      {career.urlOrientation && (
        <a
          href={career.urlOrientation}
          target="_blank"
          rel="noopener noreferrer"
          className="link-orientation"
        >
          {t("viewOnOrientation")} →
        </a>
      )}
    </div>
  );
}
