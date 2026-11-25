import { ImageResponse } from "next/og";

const THEMES = {
  bank_alert: {
    bg: "#0F172A",
    panel: "#111827",
    accent: "#0F766E",
    badge: "BANKING & RATES",
  },
  data_breach: {
    bg: "#18181B",
    panel: "#09090B",
    accent: "#B91C1C",
    badge: "SECURITY ADVISORY",
  },
  web_security: {
    bg: "#06201E",
    panel: "#041514",
    accent: "#059669",
    badge: "WEB & WP SECURITY",
  },
  settlement: {
    bg: "#1C1917",
    panel: "#0C0A09",
    accent: "#B45309",
    badge: "CONSUMER CLAIMS",
  },
  insurance: {
    bg: "#1E1B4B",
    panel: "#0F172A",
    accent: "#4338CA",
    badge: "INSURANCE & RISK",
  },
  saas: {
    bg: "#0F172A",
    panel: "#020617",
    accent: "#475569",
    badge: "SAAS & CLOUD",
  },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = (
    searchParams.get("title") || "Nexura Security & Financial Dispatch"
  ).slice(0, 120);
  const category = searchParams.get("category") || "bank_alert";
  const entity = (searchParams.get("entity") || "Nexura Research").slice(0, 45);
  const country = (searchParams.get("country") || "GLOBAL").toUpperCase();
  const isCard = searchParams.get("size") === "card";

  const width = isCard ? 640 : 1200;
  const height = isCard ? 360 : 675;
  const padOuter = isCard ? 26 : 48;
  const padInnerV = isCard ? 26 : 48;
  const padInnerH = isCard ? 30 : 56;
  const borderLeftW = isCard ? 8 : 14;
  const badgeFontSize = isCard ? 11 : 18;
  const metaFontSize = isCard ? 12 : 20;
  const footerFontSize = isCard ? 11 : 18;
  const baseFontSize = title.length > 78 ? 40 : title.length > 55 ? 46 : 52;
  const fontSize = isCard ? Math.round(baseFontSize * 0.54) : baseFontSize;

  const theme = THEMES[category] || THEMES.bank_alert;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: theme.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `${padOuter}px`,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: theme.panel,
            border: "2px solid rgba(255,255,255,0.16)",
            borderLeft: `${borderLeftW}px solid ${theme.accent}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: `${padInnerV}px ${padInnerH}px`,
          }}
        >
          {/* Top Metadata Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: isCard ? "10px" : "16px" }}>
              <div
                style={{
                  display: "flex",
                  backgroundColor: theme.accent,
                  color: "#FFFFFF",
                  fontSize: `${badgeFontSize}px`,
                  fontWeight: 700,
                  letterSpacing: isCard ? "1.2px" : "2px",
                  padding: isCard ? "5px 10px" : "8px 18px",
                  fontFamily: "sans-serif",
                }}
              >
                {theme.badge}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#CBD5E1",
                  fontSize: `${metaFontSize}px`,
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                }}
              >
                {`${country} • ${entity.toUpperCase()}`}
              </div>
            </div>
          </div>

          {/* Unique Article Headline */}
          <div
            style={{
              color: "#FFFFFF",
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              lineHeight: 1.22,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            {title}
          </div>

          {/* Bottom Masthead */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: isCard ? "12px" : "22px",
              fontFamily: "monospace",
              fontSize: `${footerFontSize}px`,
              color: "#94A3B8",
            }}
          >
            <span>NEXURA DISPATCH</span>
            <span>news.nexurasecurity.com</span>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
