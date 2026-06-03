"use client";

import { Button } from "@heroui/react";
import { Ripple } from "m3-ripple";
import "m3-ripple/ripple.css";

interface PropsButtonFilter {
  textButton: string;
  k: string;
  range: string;
  actionButton: () => void;
}

const ButtonFilter = ({
  textButton,
  k,
  actionButton,
  range,
}: PropsButtonFilter) => {
  return (
    <Button
      className={`px-3 py-1.5 transition-colors duration-200 rounded-[11px] text-sm ${
        range === k
          ? "bg-sp-ink text-white shadow-none border-none"
          : "bg-sp-surface text-sp-t2 shadow-card border border-sp-border"
      }`}
      onPress={actionButton}
    >
      {textButton}
    </Button>
  );
};
export default ButtonFilter;
