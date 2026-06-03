import React from "react";

const SpotParkBrandMobile = ({
  panelType = "Administrativo",
}: {
  panelType?: string;
}) => {
  return (
    <div className="flex items-center gap-2.5 mb-6 md:hidden">
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "var(--sp-lime)",
          boxShadow: "var(--sp-sh-lime)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--sp-display)",
          fontWeight: 700,
          fontSize: 20,
          color: "var(--sp-ink)",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        P
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--sp-display)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--sp-ink)",
          }}
        >
          SpotPark
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--sp-t3)",
          }}
        >
          Panel {panelType}
        </div>
      </div>
    </div>
  );
};
export default SpotParkBrandMobile;
