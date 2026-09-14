export type WhatsAppConfig = {
  accessToken: string;
  apiVersion: string;
  phoneNumberId: string;
  templateName: string;
};

export type WhatsAppTemplateLanguage = "fr" | "he" | "en";

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }

  return value;
}

export function areWhatsAppRemindersEnabled() {
  return process.env.WHATSAPP_REMINDERS_ENABLED?.trim().toLowerCase() === "true";
}

export function getWhatsAppConfig(): WhatsAppConfig {
  const apiVersion = readRequiredEnv("WHATSAPP_GRAPH_API_VERSION");
  if (!/^v\d+\.\d+$/.test(apiVersion)) {
    throw new Error("WHATSAPP_GRAPH_API_VERSION doit être au format vXX.X");
  }

  const phoneNumberId = readRequiredEnv("WHATSAPP_PHONE_NUMBER_ID");
  if (!/^\d+$/.test(phoneNumberId)) {
    throw new Error("WHATSAPP_PHONE_NUMBER_ID doit contenir uniquement des chiffres");
  }

  const templateName = readRequiredEnv(
    "WHATSAPP_APPOINTMENT_REMINDER_TEMPLATE",
  );
  if (!/^[a-z0-9_]+$/.test(templateName)) {
    throw new Error(
      "WHATSAPP_APPOINTMENT_REMINDER_TEMPLATE doit utiliser uniquement des minuscules, chiffres et underscores",
    );
  }

  return {
    accessToken: readRequiredEnv("WHATSAPP_ACCESS_TOKEN"),
    apiVersion,
    phoneNumberId,
    templateName,
  };
}

export function getWhatsAppDateLocale(
  templateLanguage: WhatsAppTemplateLanguage,
) {
  const language = templateLanguage.slice(0, 2).toLowerCase();

  if (language === "fr") return "fr-FR";
  if (language === "he") return "he-IL";

  return "en-GB";
}
