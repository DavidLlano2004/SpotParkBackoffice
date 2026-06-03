"use client";

import React, { useState } from "react";
import { TextField, Label, InputGroup, FieldError } from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import type { LucideProps } from "lucide-react";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface SimpleInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "url";
  isRequired?: boolean;
  isDisabled?: boolean;
  className?: string;
  leadingIcon?: React.ComponentType<LucideProps>;
  trailingIcon?: React.ComponentType<LucideProps>;
  onTrailingIconPress?: () => void;
}

export const SimpleInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  isRequired = false,
  isDisabled = false,
  className,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  onTrailingIconPress,
}: SimpleInputProps<T>) => {
  const [isVisible, setIsVisible] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const isPassword = type === "password";
  const inputType = isPassword ? (isVisible ? "text" : "password") : type;

  return (
    <TextField
      name={field.name}
      value={field.value ?? ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
      className={className}
    >
      <Label className="t-micro upper block mb-1.5 text-(--sp-t3)">
        {label}
      </Label>
      <InputGroup>
        {LeadingIcon && (
          <InputGroup.Prefix>
            <LeadingIcon className="size-4 text-muted" />
          </InputGroup.Prefix>
        )}

        <InputGroup.Input
          placeholder={placeholder}
          type={inputType}
          className="w-full h-11.25 focus:outline-none focus:ring-0 focus:border-(--sp-lime)"
        />

        {isPassword && (
          <InputGroup.Suffix className="pr-0">
            <button
              type="button"
              aria-label={
                isVisible ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              onClick={() => setIsVisible(!isVisible)}
              className="flex items-center justify-center px-3 cursor-pointer"
            >
              {isVisible ? (
                <EyeIcon className="size-4" />
              ) : (
                <EyeSlashIcon className="size-4" />
              )}
            </button>
          </InputGroup.Suffix>
        )}

        {TrailingIcon && !isPassword && (
          <InputGroup.Suffix className="pr-0">
            <button
              type="button"
              onClick={onTrailingIconPress}
              className="flex items-center justify-center px-2"
            >
              <TrailingIcon className="size-4" />
            </button>
          </InputGroup.Suffix>
        )}
      </InputGroup>

      {error && <FieldError>{error.message}</FieldError>}
    </TextField>
  );
};
