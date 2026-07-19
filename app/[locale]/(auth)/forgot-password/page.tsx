"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckCircle2, KeyRound, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/auth-client";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState("");

  const search = useSyncExternalStore(
    () => () => undefined,
    () => window.location.search,
    () => "",
  );
  const searchParams = new URLSearchParams(search);
  const token = searchParams.get("token");
  const invalidToken = searchParams.get("error") === "INVALID_TOKEN";

  async function handleRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: requestError } = await authClient.requestPasswordReset({
      email,
      redirectTo: window.location.pathname,
    });

    setLoading(false);

    if (requestError) {
      setError(t("request.error"));
      return;
    }

    setSent(true);
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("reset.passwordLength"));
      return;
    }

    if (password !== confirmation) {
      setError(t("reset.passwordMismatch"));
      return;
    }

    if (!token) {
      setError(t("reset.invalidToken"));
      return;
    }

    setLoading(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);

    if (resetError) {
      setError(t("reset.error"));
      return;
    }

    setReset(true);
  }

  const isResetForm = Boolean(token) || invalidToken;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 py-12">
      <div className="rounded-[2rem] border-3 border-border bg-white/15 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="mb-7 space-y-3 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full border-2 border-border bg-white text-border">
            {isResetForm ? (
              <KeyRound className="size-5" />
            ) : (
              <Mail className="size-5" />
            )}
          </span>
          <h1 className="text-2xl font-semibold text-white">
            {isResetForm ? t("reset.title") : t("request.title")}
          </h1>
          <p className="text-sm font-semibold leading-relaxed text-white/90">
            {isResetForm ? t("reset.description") : t("request.description")}
          </p>
        </div>

        {sent || reset ? (
          <div className="space-y-6 text-center" role="status">
            <CheckCircle2 className="mx-auto size-10 text-emerald-700" />
            <p className="font-bold text-white">
              {reset ? t("reset.success") : t("request.success")}
            </p>
            <Button
              asChild
              className="h-10 w-full rounded-full border-3 border-border bg-white text-border hover:bg-white/90"
            >
              <Link href="/sign-in">{t("backToSignIn")}</Link>
            </Button>
          </div>
        ) : isResetForm && invalidToken ? (
          <div className="space-y-6 text-center">
            <p className="text-sm font-bold text-red-800" role="alert">
              {t("reset.invalidToken")}
            </p>
            <Button
              asChild
              className="h-10 w-full rounded-full border-3 border-border bg-white text-border hover:bg-white/90"
            >
              <Link href="/forgot-password">{t("reset.newLink")}</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={isResetForm ? handleReset : handleRequest}
            className="space-y-6"
          >
            <FieldGroup>
              {isResetForm ? (
                <>
                  <Field>
                    <FieldLabel
                      className="font-bold text-white"
                      htmlFor="password"
                    >
                      {t("reset.password")}
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="h-10 rounded-full border-3 border-border bg-white text-border"
                      required
                      minLength={8}
                    />
                  </Field>
                  <Field>
                    <FieldLabel
                      className="font-bold text-white"
                      htmlFor="password-confirmation"
                    >
                      {t("reset.confirmPassword")}
                    </FieldLabel>
                    <Input
                      id="password-confirmation"
                      type="password"
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                      autoComplete="new-password"
                      className="h-10 rounded-full border-3 border-border bg-white text-border"
                      required
                      minLength={8}
                    />
                  </Field>
                </>
              ) : (
                <Field>
                  <FieldLabel className="font-bold text-white" htmlFor="email">
                    {t("request.email")}
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="h-10 rounded-full border-3 border-border bg-white text-border"
                    required
                    autoFocus
                  />
                </Field>
              )}
            </FieldGroup>

            {error && (
              <p
                className="text-center text-sm font-bold text-red-800"
                role="alert"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-10 w-full rounded-full border-3 border-border bg-white text-border hover:bg-white/90"
              disabled={loading}
            >
              {loading
                ? isResetForm
                  ? t("reset.loading")
                  : t("request.loading")
                : isResetForm
                  ? t("reset.submit")
                  : t("request.submit")}
            </Button>

            <Link
              href="/sign-in"
              className="block text-center text-sm font-bold text-white underline-offset-4 hover:underline"
            >
              {t("backToSignIn")}
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
