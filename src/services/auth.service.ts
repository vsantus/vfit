import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase não configurado. Preencha o arquivo .env.local para usar a autenticação.");
  }
}

async function signInUser(email: string, password: string) {
  assertFirebaseConfigured();
  await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

async function signUpUser(email: string, password: string) {
  assertFirebaseConfigured();
  await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

async function signOutUser() {
  assertFirebaseConfigured();
  await signOut(getFirebaseAuth());
}

export function getFirebaseAuthErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Este email já está em uso.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email ou senha inválidos.";
      case "auth/invalid-email":
        return "O email informado não é válido.";
      case "auth/weak-password":
        return "Use uma senha mais forte, com pelo menos 6 caracteres.";
      case "auth/too-many-requests":
        return "Muitas tentativas. Aguarde um pouco antes de tentar novamente.";
      default:
        return "Não foi possível autenticar no momento.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível autenticar no momento.";
}

export const authService = {
  signIn: signInUser,
  signUp: signUpUser,
  signOut: signOutUser,
};
