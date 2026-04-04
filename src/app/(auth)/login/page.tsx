import { AuthForm } from "@/components/auth/auth-form";
import { AuthScreen } from "@/components/auth/auth-screen";

export default function LoginPage() {
  return (
    <AuthScreen
      eyebrow="Login"
      title="Entre para seguir seu ritmo de treino."
      description="Acesse sua base de treinos, acompanhe sua constância e mantenha sua execução organizada em qualquer dispositivo."
    >
      <AuthForm mode="login" />
    </AuthScreen>
  );
}
