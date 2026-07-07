"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"

export default function SignIn() {
  const t = useTranslations("auth.signIn")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

   const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/account",
    })
    if(error){
      return toast.error(t('error'))
    }
    toast.success(t('success'))
    setLoading(false)
  }

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/account",
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
            <FieldLabel className="text-white font-bold" htmlFor="email">{t("email.label")}</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email webauthn"
              className="bg-white text-border border-3 border-border rounded-full"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-white font-bold" htmlFor="password">{t("password.label")}</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="bg-white text-border border-3 border-border rounded-full"
            />
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full bg-white text-border border-3 border-border rounded-full" disabled={loading}>
          {loading ? t("submit.loading") : t("submit.default")}
        </Button>

        <Separator className="bg-white" />

        <div className="space-y-3">
          <Button type="button" className="w-full rounded-full bg-white text-border border-3 border-border" onClick={signInWithGoogle}>
            <FcGoogle className="size-5" />
            {t("google")}
          </Button>
        </div>
      </form>
    </div>
  )
}