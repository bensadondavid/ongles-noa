"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { authClient } from "@/lib/auth/auth-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { FcGoogle } from "react-icons/fc"
import { Separator } from "@/components/ui/separator"

export default function SignUp() {
  const t = useTranslations("auth.signUp")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    await authClient.signUp.email({
      name,
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

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-accent">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <FieldGroup>
          <Field className="">
            <FieldLabel className="text-accent" htmlFor="name">
              {t("name.label")}
            </FieldLabel>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="bg-white text-border border-3 border-border"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-accent" htmlFor="email">
              {t("email.label")}
            </FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email webauthn"
              className="bg-white text-border border-3 border-border"
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-accent" htmlFor="password">
              {t("password.label")}
            </FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="bg-white text-border border-3 border-border"
              required
            />
            <FieldDescription>{t("password.description")}</FieldDescription>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full bg-white text-border border-3 border-border"
          disabled={loading}
        >
          {loading ? t("submit.loading") : t("submit.default")}
        </Button>

        <Separator />

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full bg-white text-border border-3 border-border"
            onClick={signInWithGoogle}
          >
            <FcGoogle className="size-5" />
            {t("google")}
          </Button>

          <Button
            type="button"
            className="w-full bg-white text-border border-3 border-border"
          >
           <Link href='/sign-in'>{t("compte_existant")}</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}