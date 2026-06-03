import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type FormDataLogin = z.infer<typeof LoginSchema>;
