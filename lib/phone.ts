export const supportedPhoneCountries = ["IL", "FR"] as const;

export type SupportedPhoneCountry = (typeof supportedPhoneCountries)[number];

const callingCodes: Record<SupportedPhoneCountry, string> = {
  IL: "972",
  FR: "33",
};

export function normalizePhoneNumber(
  phone: string,
  phoneCountry: SupportedPhoneCountry,
) {
  let normalized = phone.trim().replace(/^whatsapp:/i, "");
  normalized = normalized.replace(/[\s().-]/g, "");

  if (normalized.startsWith("00")) {
    normalized = normalized.slice(2);
  } else if (normalized.startsWith("+")) {
    normalized = normalized.slice(1);
  } else {
    normalized = normalized.replace(/^0/, "");
    normalized = `${callingCodes[phoneCountry]}${normalized}`;
  }

  if (!/^[1-9]\d{6,14}$/.test(normalized)) {
    throw new Error("Le numéro de téléphone doit être au format international E.164");
  }

  return `+${normalized}`;
}
