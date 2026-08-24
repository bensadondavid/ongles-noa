# Rappels WhatsApp

Le site programme un rappel WhatsApp avant chaque rendez-vous confirmé. Inngest
attend jusqu'à l'heure du rappel, recharge le rendez-vous depuis la base, puis
envoie un modèle approuvé via la WhatsApp Cloud API. Un rendez-vous annulé ou
déjà commencé n'est jamais envoyé.

## 1. Préparer Meta WhatsApp Business

1. Dans Meta for Developers, créer ou ouvrir une application **Business**, puis
   ajouter le produit **WhatsApp**.
2. Dans **WhatsApp > API Setup**, relever le **Phone number ID** (ce n'est pas le
   numéro de téléphone affiché).
3. Dans Meta Business Settings, créer un utilisateur système, lui attribuer
   l'application et le compte WhatsApp Business, puis générer un jeton permanent
   avec les permissions `whatsapp_business_messaging` et
   `whatsapp_business_management`.
4. Dans WhatsApp Manager, créer le modèle `appointment_reminder` dans la langue
   choisie. Le corps doit avoir exactement deux variables, dans cet ordre :

   ```text
   Rappel : votre rendez-vous est prévu le {{1}} à {{2}}.
   ```

   Attendre que le modèle soit marqué **Approved**. Le nom et le code de langue
   doivent correspondre exactement aux variables d'environnement.
5. Dans la configuration WhatsApp de l'application Meta, renseigner le callback
   `https://VOTRE-DOMAINE/api/whatsapp/webhook`, choisir soi-même une longue
   valeur aléatoire comme token de vérification, puis s'abonner au champ
   `messages`.

## 2. Variables d'environnement

Copier les clés WhatsApp de `.env.example` dans `.env` pour le développement et
dans les variables du projet Vercel pour la production :

- `WHATSAPP_GRAPH_API_VERSION` : version Graph actuellement supportée par Meta,
  au format `vXX.X` ;
- `WHATSAPP_ACCESS_TOKEN` : jeton permanent de l'utilisateur système ;
- `WHATSAPP_PHONE_NUMBER_ID` : identifiant numérique relevé dans API Setup ;
- `META_APP_SECRET` : secret de l'application Meta, utilisé pour vérifier la
  signature `X-Hub-Signature-256` des webhooks ;
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` : secret choisi par vous et recopié à
  l'identique dans le formulaire de webhook Meta ;
- `WHATSAPP_APPOINTMENT_REMINDER_TEMPLATE` : `appointment_reminder` ;
- `WHATSAPP_TEMPLATE_LANGUAGE` : code exact du modèle (`fr`, `he`, `en_US`, etc.) ;
- `WHATSAPP_REMINDER_LEAD_HOURS` : nombre entier de 1 à 168, `24` par défaut ;
- `WHATSAPP_REMINDERS_ENABLED` : garder `false` jusqu'au test final, puis `true`.

Ne jamais préfixer ces variables par `NEXT_PUBLIC_` et ne jamais committer le
jeton. Après toute modification sur Vercel, redéployer l'application.

Le webhook accepte le challenge `GET` de Meta et refuse tout événement `POST`
dont la signature ne correspond pas au secret de l'application.

## 3. Relier Inngest

L'endpoint du projet est `/api/inngest`. En production, renseigner
`INNGEST_EVENT_KEY` et `INNGEST_SIGNING_KEY`, puis synchroniser l'URL déployée
dans Inngest. Si Vercel Deployment Protection est actif, autoriser Inngest à
atteindre cet endpoint.

En local, lancer le site puis le Dev Server Inngest :

```bash
pnpm dev
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

## 4. Test de bout en bout

1. Utiliser d'abord un numéro destinataire autorisé par Meta si l'application est
   encore en mode test.
2. Créer un rendez-vous futur avec un numéro au format `+972...`, `05...` ou un
   autre format E.164 international.
3. Vérifier dans Inngest que l'événement `appointment/created` a lancé la fonction
   `appointment-whatsapp-reminder` et qu'elle est en attente.
4. Pour un test rapide, régler temporairement `WHATSAPP_REMINDER_LEAD_HOURS=1`
   et créer un rendez-vous un peu plus d'une heure dans le futur.
5. Après réception du message, remettre le délai voulu et passer
   `WHATSAPP_REMINDERS_ENABLED=true` dans l'environnement de production.

Les erreurs Meta (modèle non approuvé, langue incorrecte, jeton expiré, numéro
non autorisé) apparaissent dans l'exécution Inngest et sont automatiquement
retentées par la plateforme.
