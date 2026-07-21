"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth/auth-client";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, X, Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const t = useTranslations("auth.signUp");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const rules = [
    {
      key: "length",
      label: t("password.nombre_caracteres"),
      valid: password.length >= 8,
    },
    {
      key: "maj",
      label: t("password.maj"),
      valid: /[A-Z]/.test(password),
    },
    {
      key: "special",
      label: t("password.caractere_special"),
      valid: /[^A-Za-z0-9]/.test(password),
    },
    {
      key: "same_password",
      label: t("password.same"),
      valid:
        password.length > 0 &&
        confirmedPassword.length > 0 &&
        password === confirmedPassword,
    },
  ];

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const allValid = rules.every((rule) => rule.valid);

    if (!allValid) {
      return toast.error(t("passwordProblem"));
    }

    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      setLoading(false);
      return toast.error(t("error"));
    }

    setLoading(false);
    toast.success(t("success"));
  }

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col py-10 px-4">
      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {t("title")}
          </h1>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel className="text-white font-bold" htmlFor="name">
              {t("name.label")}
            </FieldLabel>

            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="bg-white rounded-full text-border border-3 border-border h-[40px]"
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
              className="bg-white rounded-full text-border border-3 border-border h-[40px]"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-white font-bold" htmlFor="password">
              {t("password.label")}
            </FieldLabel>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="bg-white rounded-full text-border border-3 border-border h-[40px] pr-10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-border"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </Field>

          <Field>
            <FieldLabel
              className="text-white font-bold"
              htmlFor="confirmedPassword"
            >
              {t("password.confirmed_password")}
            </FieldLabel>

            <div className="relative">
              <Input
                id="confirmedPassword"
                type={showConfirmedPassword ? "text" : "password"}
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                autoComplete="new-password"
                className="bg-white rounded-full text-border border-3 border-border h-[40px] pr-10"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmedPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-border"
              >
                {showConfirmedPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </Field>

          <div className="space-y-1">
            {rules.map((rule) => (
              <div
                key={rule.key}
                className="flex items-center gap-2 text-sm text-white"
              >
                {rule.valid ? (
                  <div className="flex flex-row text-emerald-600">
                    <Check className="size-4" />
                    <span>{rule.label}</span>
                  </div>
                ) : (
                  <div className="flex flex-row text-white">
                    <X className="size-4" />
                    <span>{rule.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full rounded-full bg-white text-border text-md border-3 border-border h-[40px]"
          disabled={loading}
        >
          {loading ? t("submit.loading") : t("submit.default")}
        </Button>

        <Separator className="bg-white" />

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full rounded-full bg-white text-border border-3 border-border text-md h-[40px]"
            onClick={signInWithGoogle}
          >
            <FcGoogle className="size-5" />
            {t("google")}
          </Button>

          <Button
            asChild
            className="w-full rounded-full bg-white text-border border-3 border-border h-[40px]"
          >
            <Link href="/sign-in" className="text-md">
              {t("compte_existant")}
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}