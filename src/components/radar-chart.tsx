"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface RadarDatum {
  labelKeyA: string;
  labelKeyB: string;
  value: number; // 0..1 — 0 = fully B, 1 = fully A
}

interface RadarChartProps {
  data: RadarDatum[];
  animated?: boolean;
}

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 50;
const NS = "http://www.w3.org/2000/svg";

export function RadarChart({ data, animated = true }: RadarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  useEffect(() => {
    if (!containerRef.current) return;
    const numAxes = data.length;
    const angleStep = 360 / numAxes;

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    function polarToXY(angle: number, radius: number) {
      const rad = ((angle - 90) * Math.PI) / 180;
      return {
        x: CENTER + radius * Math.cos(rad),
        y: CENTER + radius * Math.sin(rad),
      };
    }

    function createEl(tag: string, attrs: Record<string, string>) {
      const el = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      return el;
    }

    // Grid
    for (const level of [0.33, 0.66, 1.0]) {
      const r = RADIUS * level;
      const points = Array.from({ length: numAxes }, (_, i) => {
        const p = polarToXY(i * angleStep, r);
        return `${p.x},${p.y}`;
      }).join(" ");
      svg.appendChild(
        createEl("polygon", {
          points,
          fill: "none",
          stroke: "var(--color-border, #e5e7eb)",
          "stroke-width": "1",
        })
      );
    }

    // Axis lines
    for (let i = 0; i < numAxes; i++) {
      const p = polarToXY(i * angleStep, RADIUS);
      svg.appendChild(
        createEl("line", {
          x1: String(CENTER),
          y1: String(CENTER),
          x2: String(p.x),
          y2: String(p.y),
          stroke: "var(--color-border, #e5e7eb)",
          "stroke-width": "1",
        })
      );
    }

    // Labels
    const labelRadius = RADIUS + 30;
    for (let i = 0; i < numAxes; i++) {
      const p = polarToXY(i * angleStep, labelRadius);
      let anchor = "middle";
      if (p.x < CENTER - 10) anchor = "end";
      else if (p.x > CENTER + 10) anchor = "start";

      const text = createEl("text", {
        x: String(p.x),
        y: String(p.y),
        "text-anchor": anchor,
        "dominant-baseline": "central",
        fill: "var(--color-muted, #6b7280)",
        "font-size": "11",
        "font-weight": "600",
        "font-family": "var(--font-nunito), sans-serif",
      });
      text.textContent = t(data[i].labelKeyA);
      svg.appendChild(text);
    }

    // Data polygon
    const endPoints = data.map((d, i) => {
      const r = RADIUS * d.value;
      return polarToXY(i * angleStep, r);
    });

    const startStr = Array(numAxes)
      .fill(`${CENTER},${CENTER}`)
      .join(" ");
    const endStr = endPoints.map((p) => `${p.x},${p.y}`).join(" ");

    const polygon = createEl("polygon", {
      points: animated ? startStr : endStr,
      fill: "rgba(108, 99, 255, 0.2)",
      stroke: "var(--color-accent, #6c63ff)",
      "stroke-width": "2",
      style: "transition: all 0.6s ease-out",
    });
    svg.appendChild(polygon);

    // Dots
    const dots = endPoints.map((ep) => {
      const dot = createEl("circle", {
        cx: animated ? String(CENTER) : String(ep.x),
        cy: animated ? String(CENTER) : String(ep.y),
        r: "4",
        fill: "var(--color-accent, #6c63ff)",
        style: "transition: all 0.6s ease-out",
      });
      svg.appendChild(dot);
      return dot;
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg);

    if (animated) {
      requestAnimationFrame(() => {
        polygon.setAttribute("points", endStr);
        dots.forEach((dot, i) => {
          dot.setAttribute("cx", String(endPoints[i].x));
          dot.setAttribute("cy", String(endPoints[i].y));
        });
      });
    }
  }, [data, animated, t]);

  return <div ref={containerRef} className="mx-auto w-full max-w-[300px]" />;
}
