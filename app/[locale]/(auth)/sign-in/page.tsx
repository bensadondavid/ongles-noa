"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Link } from "@/i18n/navigation";

export default function SignIn() {
  const t = useTranslations("auth.signIn");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });
    if (error) {
      if (error.status == 401) {
        setLoading(false);
        return toast.error(t("wrong_id"));
      }
      setLoading(false);
      return toast.error(t("error"));
    }
    toast.success(t("success"));
    setLoading(false);
  }

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <form onSubmit={handleSignIn} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-accent">{t("title")}</h1>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel className="text-white font-bold" htmlFor="email">
              {t("email.label")}
            </FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email webauthn"
              className="bg-white text-border border-3 border-border rounded-full py-4 text-2xl"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-white font-bold" htmlFor="password">
              {t("password.label")}
            </FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="bg-white text-border border-3 border-border rounded-full h-[40px]"
            />
          </Field>
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-white underline-offset-4 hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full bg-white text-border border-3 border-border rounded-full h-[40px] text-md"
          disabled={loading}
        >
          {loading ? t("submit.loading") : t("submit.default")}
        </Button>

        <Separator className="bg-white" />

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full h-[40px] rounded-full bg-white text-border border-3 border-border text-md"
            onClick={signInWithGoogle}
          >
            <FcGoogle className="size-5" />
            {t("google")}
          </Button>
        </div>
      </form>
    </div>
  );
}
