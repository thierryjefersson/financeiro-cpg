"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginSchema } from "@/schemas/login-form";
import ErrorMessageInput from "./error-message-input";
import login from "@/actions/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(formData: LoginSchema) {
    setError("");
    startTransition(async () => {
      const response = await login(formData);
      if (response && !response.success && response.message)
        setError(response.message);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-1">
          <CardTitle className="text-center text-2xl font-bold">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="mt-5 flex flex-col gap-4"
          >
            <div>
              <div className="relative flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="exemplo@exemplo.com"
                  id="email"
                  autoComplete="off"
                  {...register("email")}
                />
              </div>

              {errors.email?.message && (
                <ErrorMessageInput text={errors.email?.message} />
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    id="password"
                    autoComplete="off"
                    className="pr-9"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant={"ghost"}
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
              {errors.password?.message && (
                <ErrorMessageInput text={errors.password?.message} />
              )}
              {error && <ErrorMessageInput text={error} />}
            </div>

            <Button disabled={isPending} className="w-full">
              {isPending ? "Carregando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
