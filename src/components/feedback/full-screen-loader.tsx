import { LoaderCircle } from "lucide-react";

type FullScreenLoaderProps = {
  label: string;
};

export function FullScreenLoader({ label }: FullScreenLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-white/8 bg-card/80 px-6 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <LoaderCircle className="size-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">VFit está preparando a próxima tela.</p>
        </div>
      </div>
    </div>
  );
}
