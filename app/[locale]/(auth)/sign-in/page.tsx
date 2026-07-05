"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { authClient } from "@/lib/auth/auth-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { Fingerprint } from "lucide-react"

export default function SignIn() {
  const t = useTranslations("auth.signIn")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    await authClient.signIn.email({
      email,
      password,
      callbackURL: "/account",
    })

    setLoading(false)
  }

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/account",
    })
  }

  async function signInWithPasskey() {
    await authClient.signIn.passkey({
      autoFill: false,
      fetchOptions: {
        onSuccess() {
          window.location.href = "/account"
        },
      },
    })
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <form onSubmit={handleSignIn} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-accent">{t("title")}</h1>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel className="text-accent" htmlFor="email">{t("email.label")}</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={t("email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email webauthn"
              className="bg-white text-border border-3 border-border"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-accent" htmlFor="password">{t("password.label")}</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="bg-white text-border border-3 border-border"
            />
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full bg-white text-border border-3 border-border" disabled={loading}>
          {loading ? t("submit.loading") : t("submit.default")}
        </Button>

        <Separator />

        <div className="space-y-3">
          <Button type="button" className="w-full bg-white text-border border-3 border-border" onClick={signInWithGoogle}>
            <FcGoogle className="size-5" />
            {t("google")}
          </Button>

          <Button type="button" className="w-full bg-white text-border border-3 border-border" onClick={signInWithPasskey}>
            <Fingerprint className="size-5" />
            {t("passkey")}
          </Button>
        </div>
      </form>
    </div>
  )
}