import { AuthForm } from "@/components/auth/auth-form";
import { AuthScreen } from "@/components/auth/auth-screen";

export default function SignupPage() {
  return (
    <AuthScreen
      eyebrow="Cadastro"
      title="Crie sua conta e comece a estruturar seus treinos."
      description="Cadastre-se com email e senha para desbloquear a área autenticada do VFit e preparar suas próximas rotinas."
    >
      <AuthForm mode="signup" />
    </AuthScreen>
  );
}
