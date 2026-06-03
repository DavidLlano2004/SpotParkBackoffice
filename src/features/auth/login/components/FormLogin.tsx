import React from "react";
import { motion } from "framer-motion";
import { type Control, type FieldErrors, useWatch } from "react-hook-form";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { SimpleButton } from "@/components/ui/buttons/SimpleButton";
import { SimpleInput } from "@/components/ui/inputs/SimpleInput";

export type LoginFormValues = {
  email: string;
  password: string;
};

interface PropsFormLogin {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<LoginFormValues>;
  loading: boolean;
  errors: FieldErrors<LoginFormValues>;
  emailPlaceholder?: string;
  buttonText?: string;
}

export const FormLogin = ({
  onSubmit,
  control,
  loading,
  errors,
  emailPlaceholder = "nombre@correo.com",
  buttonText = "Ingresar al panel",
}: PropsFormLogin) => {
  const watched = useWatch({ control });
  const isEmpty = !watched.email?.trim() || !watched.password?.trim();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <SimpleInput
        name="email"
        control={control}
        label="Correo electrónico"
        placeholder={emailPlaceholder}
        type="email"
        isRequired
        leadingIcon={EnvelopeIcon}
      />
      <SimpleInput
        name="password"
        control={control}
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        isRequired
        leadingIcon={LockClosedIcon}
      />

      <div className="text-right mt-1.5">
        <button
          type="button"
          className="text-xs font-semibold"
          style={{
            background: "none",
            border: "none",
            color: "var(--sp-lime-deep)",
            cursor: "pointer",
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <SimpleButton
          className="h-14 rounded-[18px] w-full shadow-(--sp-sh-lime) bg-(--sp-lime) font-(family-name:--sp-font) text-(--sp-ink) text-[15px] font-semibold mt-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          textButton={buttonText}
          isDisabled={loading || isEmpty}
          isPending={loading}
          buttonType="submit"
        />
      </motion.div>
    </form>
  );
};
