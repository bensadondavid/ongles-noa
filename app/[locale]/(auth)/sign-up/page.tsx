"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function SignUp() {
  const t = useTranslations("auth.signUp");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = [
    {
      key: "length",
      label: t("password.nombre_caracteres"),
      valid: password.length >= 8,
    },
    { key: "maj", label: t("password.maj"), valid: /[A-Z]/.test(password) },
    {
      key: "special",
      label: t("password.caractere_special"),
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const allValid = rules.every((r) => r.valid);
    if (!allValid) {
      setLoading(false);
      return toast.error(t("passwordProblem"));
    }

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/account",
    });
    if (error) {
      if (password.length < 8) {
        setLoading(false);
        return toast.error(t("passwordProblem"));
      }
      setLoading(false);
      return toast.error(t("error"));
    }
    setLoading(false);
    toast.success(t("success"));
  }

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/account",
    });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">{t("title")}</h1>
        </div>

        <FieldGroup>
          <Field className="">
            <FieldLabel className="text-white font-bold" htmlFor="name">
              {t("name.label")}
            </FieldLabel>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="bg-white rounded-full text-border border-3 border-border"
              required
            />
          </Field>

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
              className="bg-white rounded-full text-border border-3 border-border"
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
              autoComplete="new-password"
              className="bg-white rounded-full text-border border-3 border-border"
              required
            />
            <div className="flex flex-col gap-1.5 mt-1">
              {rules.map((rule) => (
                <div
                  key={rule.key}
                  className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                    rule.valid ? "text-emerald-700" : "text-white"
                  }`}
                >
                  {rule.valid ? (
                    <Check className="size-3.5 shrink-0" />
                  ) : (
                    <X className="size-3.5 shrink-0" />
                  )}
                  <span>{rule.label}</span>
                </div>
              ))}
            </div>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full rounded-full bg-white text-border border-3 border-border"
          disabled={loading}
        >
          {loading ? t("submit.loading") : t("submit.default")}
        </Button>

        <Separator className="bg-white"/>

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full rounded-full bg-white text-border border-3 border-border"
            onClick={signInWithGoogle}
          >
            <FcGoogle className="size-5" />
            {t("google")}
          </Button>

          <Button
            asChild
            className="w-full rounded-full bg-white text-border border-3 border-border"
          >
            <Link href="/sign-in">{t("compte_existant")}</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
