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

  const theme = THEMES[category] || THEMES.bank_alert;
  const fontSize = title.length > 78 ? 40 : title.length > 55 ? 46 : 52;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "675px",
          backgroundColor: theme.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: theme.panel,
            border: "2px solid rgba(255,255,255,0.16)",
            borderLeft: `14px solid ${theme.accent}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 56px",
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
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  backgroundColor: theme.accent,
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  padding: "8px 18px",
                  fontFamily: "sans-serif",
                }}
              >
                {theme.badge}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#CBD5E1",
                  fontSize: "20px",
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
              paddingTop: "22px",
              fontFamily: "monospace",
              fontSize: "18px",
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
      width: 1200,
      height: 675,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
