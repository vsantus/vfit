"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";

import { type ButtonVariantProps } from "@/components/ui/button-variants";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type LogoutButtonProps = ComponentProps<"button"> &
  ButtonVariantProps & {
    className?: string;
  };

export function LogoutButton({
  children,
  className,
  variant,
  size,
  ...props
}: LogoutButtonProps) {
  const router = useRouter();
  const { signOutUser } = useAuth();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await signOutUser();
      router.replace("/login");
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isPending}
      className={cn(className)}
      {...props}
    >
      {isPending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Saindo
        </>
      ) : (
        children
      )}
    </Button>
  );
}
