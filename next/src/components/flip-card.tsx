"use client";

import { useState } from "react";
import type { CareerDetail } from "@/app/actions/career";

function formatSalary(amount: number): string {
  return amount.toLocaleString("fr-CH");
}

export function FlipCard({ career }: { career: CareerDetail }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      data-flip-card
      className={`flip-card${flipped ? " flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front">
          <div className="card-icon">{career.icon}</div>
          <h2>{career.name}</h2>
          <span className="card-type">
            {career.type} &middot; {career.duration} ans
          </span>
          <span
            className="sector-label"
            style={{ color: `var(${career.sectorColor})` }}
          >
            {career.sectorName}
          </span>
          <div className="flip-hint">↻ Clique pour voir les détails</div>
        </div>

        {/* Back */}
        <div className="flip-card-back">
          {/* Description */}
          <div className="card-detail-section">
            <h3>Description</h3>
            <p>{career.description}</p>
          </div>

          {/* Activities */}
          {career.activities.length > 0 && (
            <div className="card-detail-section">
              <h3>Activités quotidiennes</h3>
              <ul>
                {career.activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Salary */}
          {career.salary && (
            <div className="card-detail-section">
              <h3>Salaire apprentissage (CHF/mois)</h3>
              <div className="salary-grid">
                {career.salary.apprenticeYears.map((y) => (
                  <div key={y.year} className="salary-item">
                    <div className="year">{y.year}e année</div>
                    <div className="amount">{formatSalary(y.amount)}.-</div>
                  </div>
                ))}
              </div>
              <div className="salary-post">
                <div className="label">Salaire après {career.type}</div>
                <div className="range">
                  CHF {formatSalary(career.salary.postCfcMin)} -{" "}
                  {formatSalary(career.salary.postCfcMax)} / mois
                </div>
              </div>
            </div>
          )}

          {/* Qualities */}
          {career.qualities.length > 0 && (
            <div className="card-detail-section">
              <h3>Qualités requises</h3>
              <div className="tag-list">
                {career.qualities.map((q) => (
                  <span key={q} className="tag">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Passerelle */}
          {career.passerelle && (
            <div className="passerelle-box">
              <h4>✈️ Passerelle aéronautique</h4>
              <p>{career.passerelle}</p>
            </div>
          )}

          {/* Link */}
          <a
            href={career.urlOrientation}
            target="_blank"
            rel="noopener noreferrer"
            className="link-orientation"
            onClick={(e) => e.stopPropagation()}
          >
            Voir sur orientation.ch →
          </a>

          <div className="flip-hint" style={{ marginTop: 12 }}>
            ↻ Retourner la carte
          </div>
        </div>
      </div>
    </div>
  );
}
