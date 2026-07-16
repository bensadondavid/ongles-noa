import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../data/prisma";
import { resend } from "../mail/resend";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: ["http://localhost:3000", process.env.BETTER_AUTH_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CLIENT",
        input: false,
      },
      phone : {
        type: 'string',
        required: false
      }
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 120,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: "Réinitialisez votre mot de passe",
        html: `
        <a href="${url}">
        Réinitialiser mon mot de passe
        </a>
      `,
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    onExistingUserSignUp: async ({ user }) => {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: "Tentative de création de compte",
        html: `
      <p>Bonjour ${user.name ?? ""},</p>
      <p>
        Quelqu'un vient d'essayer de créer un compte avec votre adresse email.
        Si c'était vous, vous avez déjà un compte : connectez-vous plutôt.
      </p>
      <p><a href="${process.env.BETTER_AUTH_URL}/sign-in">Se connecter</a></p>
      <p>
        Si ce n'était pas vous, ignorez cet email. Votre compte n'a pas été modifié.
      </p>
    `,
      });

      // NE PAS throw : un échec d'envoi ne doit pas transformer
      // la réponse synthétique en 500 (fuite d'énumération).
      if (error) {
        console.error("[onExistingUserSignUp] échec envoi email:", error);
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: "Vérifiez votre email",
        html: `
        <a href="${url}">
          Vérifier mon email
        </a>
      `,
      });
      if (error) {
        throw new Error(error.message);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "email-password"],
      allowDifferentEmails: false,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
  },
});

// pnpm dlx auth@latest generate --config ./lib/data/auth.ts
