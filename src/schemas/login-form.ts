import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório.")
    .email("Preencha um email válido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}
