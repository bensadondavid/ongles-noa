const DEFAULT_REMINDER_LEAD_HOURS = 24;

export type WhatsAppConfig = {
  accessToken: string;
  apiVersion: string;
  phoneNumberId: string;
  reminderLeadHours: number;
  templateLanguage: string;
  templateName: string;
};

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

export function getWhatsAppReminderLeadHours() {
  const rawValue = process.env.WHATSAPP_REMINDER_LEAD_HOURS?.trim();

  if (!rawValue) {
    return DEFAULT_REMINDER_LEAD_HOURS;
  }

  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < 1 || value > 168) {
    throw new Error(
      "WHATSAPP_REMINDER_LEAD_HOURS doit être un entier compris entre 1 et 168",
    );
  }

  return value;
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

  const templateLanguage = readRequiredEnv("WHATSAPP_TEMPLATE_LANGUAGE");
  if (!/^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(templateLanguage)) {
    throw new Error(
      "WHATSAPP_TEMPLATE_LANGUAGE doit être un code Meta valide (ex. fr, he ou en_US)",
    );
  }

  return {
    accessToken: readRequiredEnv("WHATSAPP_ACCESS_TOKEN"),
    apiVersion,
    phoneNumberId,
    reminderLeadHours: getWhatsAppReminderLeadHours(),
    templateLanguage,
    templateName,
  };
}

export function getWhatsAppDateLocale(templateLanguage: string) {
  const language = templateLanguage.slice(0, 2).toLowerCase();

  if (language === "fr") return "fr-FR";
  if (language === "he") return "he-IL";

  return "en-GB";
}
