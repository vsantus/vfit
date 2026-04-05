"use client";

import { FileJson, LoaderCircle, Upload, X } from "lucide-react";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import { buttonVariants } from "@/components/ui/button-variants";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { workoutImportService } from "@/services/workout-import.service";

type WorkoutImportModalProps = {
  triggerClassName?: string;
};

const samplePayload = `{
  "day": "sexta",
  "category": "upper",
  "name": "UPPER",
  "variant": "variacao",
  "notes": "",
  "optional": false,
  "exercises": [
    {
      "name": "Supino inclinado",
      "sets": null,
      "reps": null,
      "restSeconds": null,
      "notes": ""
    }
  ]
}`;

export function WorkoutImportModal({ triggerClassName }: WorkoutImportModalProps) {
  const fileInputId = useId();
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [rawJson, setRawJson] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"error" | "success">("success");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function resetState() {
    setRawJson("");
    setFeedback(null);
    setFeedbackTone("success");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleOpen() {
    resetState();
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      setRawJson(content);
      setFeedback(`Arquivo "${file.name}" carregado. Revise e importe quando quiser.`);
      setFeedbackTone("success");
    } catch {
      setFeedback("Nao foi possivel ler o arquivo selecionado.");
      setFeedbackTone("error");
    }
  }

  function handleImport() {
    if (!user) {
      setFeedback("Usuario nao autenticado.");
      setFeedbackTone("error");
      return;
    }

    if (!rawJson.trim()) {
      setFeedback("Cole o JSON ou envie um arquivo antes de importar.");
      setFeedbackTone("error");
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      try {
        const payload = JSON.parse(rawJson);
        const result = await workoutImportService.importWorkouts(user.uid, payload);

        setFeedback(
          result.importedCount === 1
            ? "Treino importado com sucesso."
            : `${result.importedCount} treinos importados com sucesso.`,
        );
        setFeedbackTone("success");

        if (result.importedCount === 1) {
          router.push(`/treinos/${result.createdWorkoutIds[0]}`);
        } else {
          router.push("/treinos");
        }

        router.refresh();
        handleClose();
      } catch (error) {
        setFeedback(workoutImportService.getImportErrorMessage(error));
        setFeedbackTone("error");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          buttonVariants({
            variant: "outline",
            className:
              "h-11 rounded-2xl border-border/70 bg-secondary/55 px-5 text-foreground hover:bg-secondary",
          }),
          triggerClassName,
        )}
      >
        <Upload className="size-4" />
        Importar treino
      </button>

      {typeof document !== "undefined" && isOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/78 px-4 py-5 backdrop-blur-md sm:px-6 sm:py-8">
          <div className="surface-glow relative max-h-[min(88vh,860px)] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-border/70 bg-card p-5 sm:p-7">
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "absolute right-4 top-4 size-10 rounded-2xl p-0 text-muted-foreground hover:text-foreground",
                }),
              )}
              aria-label="Fechar importacao"
            >
              <X className="size-4" />
            </button>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
                  Importacao JSON
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">Importe um treino pronto</h2>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    Envie um arquivo <code>.json</code> ou cole o conteudo manualmente. O app valida o formato,
                    converte para o modelo atual e grava treino + exercicios no Firebase.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
                <label className="block rounded-3xl border border-dashed border-primary/25 bg-muted/35 p-5">
                  <div className="space-y-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <FileJson className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Upload do arquivo</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Ideal para importar um treino salvo localmente sem precisar colar o JSON.
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      id={fileInputId}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileChange}
                      className="block w-full cursor-pointer rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                </label>

                <div className="rounded-3xl border border-border/60 bg-muted/20 p-5">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Formato esperado</p>
                    <pre className="premium-scrollbar max-h-72 overflow-auto rounded-2xl border border-border/60 bg-background p-4 text-xs leading-6 text-muted-foreground">
                      <code>{samplePayload}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">JSON do treino</span>
                <textarea
                  rows={10}
                  value={rawJson}
                  onChange={(event) => setRawJson(event.target.value)}
                  placeholder="Cole aqui um treino em JSON ou carregue um arquivo acima."
                  className="premium-scrollbar flex min-h-56 w-full rounded-3xl border border-border/80 bg-background px-4 py-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/12"
                />
              </label>

              {feedback ? (
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm",
                    feedbackTone === "error"
                      ? "border border-destructive/25 bg-destructive/10 text-destructive"
                      : "border border-primary/20 bg-primary/10 text-primary",
                  )}
                >
                  {feedback}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={isPending}
                  className={cn(
                    buttonVariants({
                      className: "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90",
                    }),
                  )}
                >
                  {isPending ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Importando
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      Importar agora
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      className:
                        "h-11 rounded-2xl border-border/70 bg-secondary/55 px-5 text-foreground hover:bg-secondary",
                    }),
                  )}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>,
            document.body,
          )
        : null}
    </>
  );
}
