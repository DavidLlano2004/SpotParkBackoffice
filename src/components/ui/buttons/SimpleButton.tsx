"use client";

import React from "react";
import { Button, Spinner } from "@heroui/react";
import { Ripple } from "m3-ripple";
import type { LucideProps } from "lucide-react";
import "m3-ripple/ripple.css";

interface SimpleButtonProps {
  textButton?: string;
  className?: string;
  isIconOnly?: boolean;
  isDisabled?: boolean;
  isPending?: boolean;
  actionButton?: () => void;
  buttonType?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentType<LucideProps>;
}

export const SimpleButton = ({
  textButton,
  className,
  isIconOnly = false,
  isDisabled = false,
  isPending = false,
  actionButton = () => {},
  size = "md",
  buttonType = "button",
  icon: Icon,
}: SimpleButtonProps) => {
  return (
    <Button
      isDisabled={isDisabled || isPending}
      isIconOnly={isIconOnly}
      className={className}
      size={size}
      onPress={actionButton}
      type={buttonType}
    >
      <Ripple />
      {isPending ? (
        <Spinner color="current" size="sm" />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {!isIconOnly && textButton}
        </>
      )}
    </Button>
  );
};
