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
    title: "Conditions générales de vente",
    description: "Conditions applicables aux réservations et prestations.",
    alternates: { canonical: `/${locale}/cgv` },
  };
}

export default function TermsPage() {
  return (
    <LegalDocument
      title="Conditions générales de vente"
      updatedAt="24 août 2026"
    >
      <section>
        <h2>1. Identité du prestataire</h2>
        <p>
          Les prestations sont proposées par <b>{BUSINESS.legalName}</b>, sous
          le nom commercial <b>{BUSINESS.tradeName}</b>, numéro
          d’immatriculation {BUSINESS.registrationNumber}, à l’adresse suivante
          :{` ${BUSINESS.address}`}.
        </p>
      </section>

      <section>
        <h2>2. Objet et acceptation</h2>
        <p>
          Les présentes conditions encadrent la réservation et la réalisation
          des prestations ongulaires proposées sur le site. La validation d’une
          réservation après acceptation des conditions d’annulation emporte
          acceptation des présentes conditions.
        </p>
      </section>

      <section>
        <h2>3. Prestations et prix</h2>
        <p>
          Les caractéristiques et prix des prestations sont affichés en shekels
          israéliens (₪) dans le parcours de réservation. Le prix applicable est
          celui présenté au moment de la confirmation, sous réserve d’une
          modification demandée et acceptée lors du rendez-vous. Les modalités
          de paiement sont communiquées avant ou au moment de la prestation.
        </p>
      </section>

      <section>
        <h2>4. Réservation</h2>
        <p>
          La cliente doit fournir des informations exactes et un numéro de
          téléphone joignable. Le rendez-vous est confirmé lorsque le site
          affiche la confirmation. Une indisponibilité exceptionnelle peut
          nécessiter une proposition de nouveau créneau ou une annulation sans
          frais pour la cliente.
        </p>
      </section>

      <section>
        <h2>5. Annulation et retard</h2>
        <p>
          Toute annulation doit être effectuée depuis l’espace personnel ou en
          contactant directement le prestataire par téléphone ou e-mail.
        </p>
        <p>
          En cas d’annulation moins de 48 heures avant le rendez-vous, ou de
          retard supérieur à 15 minutes, 50 % du prix de la prestation réservée
          pourra être facturé. Un retard important peut également entraîner
          l’adaptation ou l’annulation de la prestation lorsque le créneau
          restant ne permet pas de la réaliser correctement.
        </p>
        <p>
          Cette politique commerciale ne limite aucun droit impératif de
          rétractation ou d’annulation reconnu au consommateur par la loi
          israélienne, notamment la Consumer Protection Law, 5741-1981 et ses
          règlements. Toute disposition impérative contraire prévaut sur les
          présentes conditions.
        </p>
      </section>

      <section>
        <h2>6. Santé, sécurité et refus de prestation</h2>
        <p>
          La cliente doit signaler avant la prestation toute allergie,
          infection, blessure, sensibilité ou contre-indication connue. Le
          prestataire peut reporter, adapter ou refuser une prestation
          lorsqu’elle présente un risque pour la santé ou ne peut être réalisée
          dans de bonnes conditions d’hygiène et de sécurité.
        </p>
      </section>

      <section>
        <h2>7. Réclamations</h2>
        <p>
          Toute question ou réclamation peut être adressée au
          <a href={`tel:${BUSINESS.phoneHref}`}> {BUSINESS.phoneDisplay}</a> ou
          à<a href={`mailto:${BUSINESS.email}`}> {BUSINESS.email}</a>. La
          demande doit préciser l’identité de la cliente, la date du rendez-vous
          et la nature de la réclamation.
        </p>
      </section>

      <section>
        <h2>8. Responsabilité</h2>
        <p>
          La responsabilité du prestataire ne peut être exclue ou limitée
          lorsqu’une telle exclusion est interdite par la loi. Elle ne saurait
          toutefois être engagée pour les conséquences d’informations inexactes
          ou d’une contre-indication connue qui n’aurait pas été signalée.
        </p>
      </section>

      <section>
        <h2>9. Droit applicable et litiges</h2>
        <p>
          Les présentes conditions sont soumises au droit de l’État d’Israël.
          Les parties rechercheront d’abord une solution amiable. À défaut, le
          litige relèvera des juridictions compétentes conformément aux règles
          impératives applicables.
        </p>
      </section>
    </LegalDocument>
  );
}
