import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { BUSINESS } from "@/lib/legal/business";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Mentions légales",
    description: "Informations légales relatives au site Noa Bensadon.",
    alternates: { canonical: `/${locale}/mentions-legales` },
  };
}

export default function LegalNoticePage() {
  return (
    <LegalDocument title="Mentions légales" updatedAt="24 août 2026">
      <section>
        <h2>1. Éditeur du site</h2>
        <p>
          Le présent site est édité par <b>{BUSINESS.legalName}</b>, exerçant
          sous le nom commercial <b>{BUSINESS.tradeName}</b>.
        </p>
        <ul>
          <li>Numéro d’immatriculation : {BUSINESS.registrationNumber}</li>
          <li>Adresse officielle : {BUSINESS.address}</li>
          <li>
            Téléphone :{" "}
            <a href={`tel:${BUSINESS.phoneHref}`}>{BUSINESS.phoneDisplay}</a>
          </li>
          <li>
            E-mail : <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Responsable de la publication</h2>
        <p>La responsable de la publication est {BUSINESS.legalName}.</p>
      </section>

      <section>
        <h2>3. Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133,
          Covina, CA 91723, États-Unis.
        </p>
      </section>

      <section>
        <h2>4. Propriété intellectuelle</h2>
        <p>
          Les textes, photographies, éléments graphiques, logos et autres
          contenus du site sont protégés par les règles applicables à la
          propriété intellectuelle. Toute reproduction ou utilisation sans
          autorisation préalable est interdite, sauf exception prévue par la
          loi.
        </p>
      </section>

      <section>
        <h2>5. Données personnelles</h2>
        <p>
          Les informations transmises lors de la création d’un compte, d’une
          réservation ou d’une prise de contact sont utilisées pour gérer les
          comptes clients, les rendez-vous, les communications et la sécurité du
          service. Elles ne doivent être conservées que pendant la durée
          nécessaire à ces finalités et aux obligations légales applicables.
        </p>
        <p>
          Toute demande d’accès, de rectification ou de suppression peut être
          adressée à <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>,
          sous réserve des obligations légales de conservation.
        </p>
      </section>

      <section>
        <h2>6. Responsabilité</h2>
        <p>
          L’éditeur s’efforce de maintenir des informations exactes et un site
          accessible, sans garantir l’absence permanente d’erreurs ou
          d’interruptions. Les informations publiées ne remplacent pas un avis
          médical ou professionnel adapté à la situation de la cliente.
        </p>
      </section>

      <section>
        <h2>7. Droit applicable</h2>
        <p>
          Le site et les services proposés sont soumis au droit de l’État
          d’Israël, sans préjudice des dispositions impératives protégeant les
          consommateurs.
        </p>
      </section>
    </LegalDocument>
  );
}
