"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getFirebaseAuthErrorMessage } from "@/services/auth.service";

const authSchema = z.object({
  email: z.email("Informe um email valido."),
  password: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres.")
    .max(72, "A senha informada está acima do limite suportado."),
});

type AuthFormValues = z.infer<typeof authSchema>;

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { signIn, signUp, error } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLogin = mode === "login";

  function onSubmit(values: AuthFormValues) {
    setSubmitError(null);

    startTransition(async () => {
      try {
        if (isLogin) {
          await signIn(values.email, values.password);
        } else {
          await signUp(values.email, values.password);
        }

        const nextPath =
          isLogin && typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("next") || "/dashboard"
            : "/dashboard";
        router.replace(nextPath);
      } catch (submitAuthError) {
        setSubmitError(getFirebaseAuthErrorMessage(submitAuthError));
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
          {isLogin ? "Acesso" : "Nova conta"}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {isLogin ? "Entrar com email e senha" : "Criar conta com email e senha"}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {isLogin
            ? "Use seu email para abrir sua area autenticada."
            : "Seu cadastro será a base para salvar treinos, exercícios e histórico."}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <FormField
          label="Senha"
          type={showPassword ? "text" : "password"}
          placeholder="Digite sua senha"
          autoComplete={isLogin ? "current-password" : "new-password"}
          error={form.formState.errors.password?.message}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
          {...form.register("password")}
        />

        {(submitError || error) && (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError ?? error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Processando
            </>
          ) : isLogin ? (
            "Entrar"
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>

      <div className="text-sm text-muted-foreground">
        {isLogin ? "Ainda nao tem conta? " : "Ja possui conta? "}
        <Link
          href={isLogin ? "/cadastro" : "/login"}
          className="font-medium text-primary transition-colors hover:text-primary/85"
        >
          {isLogin ? "Criar agora" : "Entrar"}
        </Link>
      </div>
    </div>
  );
}
