# Rappels WhatsApp

Chaque jour à 20 h, heure d'Israël, Inngest recherche les rendez-vous confirmés
du lendemain et crée un envoi indépendant pour chacun. Une réservation pour le
lendemain créée après 20 h déclenche immédiatement son rappel. Avant l'envoi,
le rendez-vous est rechargé depuis la base ; un rendez-vous annulé, déjà commencé
ou déjà rappelé n'est jamais envoyé.

## 1. Préparer Meta WhatsApp Business

1. Dans Meta for Developers, créer ou ouvrir une application **Business**, puis
   ajouter le produit **WhatsApp**.
2. Dans **WhatsApp > API Setup**, relever le **Phone number ID** (ce n'est pas le
   numéro de téléphone affiché).
3. Dans Meta Business Settings, créer un utilisateur système, lui attribuer
   l'application et le compte WhatsApp Business, puis générer un jeton permanent
   avec les permissions `whatsapp_business_messaging` et
   `whatsapp_business_management`.
4. Dans WhatsApp Manager, créer le modèle `appointment_reminder` dans les
   langues `fr`, `he` et `en`. Chaque corps doit avoir exactement deux variables,
   dans cet ordre :

   ```text
   Rappel : votre rendez-vous est prévu le {{1}} à {{2}}.
   ```

   Attendre que chaque traduction soit marquée **Approved**. La langue est
   choisie automatiquement à partir de la locale enregistrée sur le rendez-vous.
5. Dans la configuration WhatsApp de l'application Meta, renseigner le callback
   `https://VOTRE-DOMAINE/api/webhook/whatsapp`, choisir soi-même une longue
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
- `WHATSAPP_VERIFY_TOKEN` : secret choisi par vous et recopié à
  l'identique dans le formulaire de webhook Meta ;
- `WHATSAPP_APPOINTMENT_REMINDER_TEMPLATE` : `appointment_reminder` ;
- `WHATSAPP_REMINDERS_ENABLED` : garder `false` jusqu'au test final, puis `true`.

Ne jamais préfixer ces variables par `NEXT_PUBLIC_` et ne jamais committer le
jeton. Après toute modification sur Vercel, redéployer l'application.

Le webhook accepte le challenge `GET` de Meta et refuse tout événement `POST`
dont la signature ne correspond pas au secret de l'application.

Les réponses entrantes sont enregistrées de façon idempotente dans
`WhatsAppInboundMessage`, puis affichées aux administrateurs dans
`/dashboard/messages`. Seuls l'identifiant Meta, le numéro expéditeur, le nom
de profil éventuel, le type, le texte et la date sont conservés ; le payload
Meta complet n'est pas stocké. La migration Prisma doit être appliquée avant de
déployer le code qui active cette boîte de réception.

Depuis `/dashboard/messages`, un administrateur peut répondre en texte pendant
les 24 heures qui suivent le dernier message du contact. Les réponses envoyées
sont enregistrées dans `WhatsAppOutboundMessage` et affichées dans la
conversation. Une fois cette fenêtre terminée, WhatsApp impose l'utilisation
d'un modèle approuvé.

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
3. Vérifier dans Inngest que les fonctions
   `schedule-daily-appointment-whatsapp-reminders`,
   `schedule-late-appointment-whatsapp-reminder` et
   `send-appointment-whatsapp-reminder` sont synchronisées.
4. Pour un test rapide après 20 h, créer un rendez-vous pour le lendemain :
   l'heure du rappel étant déjà passée, la fonction poursuit immédiatement.
5. Après réception du message de test et validation des trois langues, passer
   `WHATSAPP_REMINDERS_ENABLED=true` dans l'environnement de production.

Les erreurs Meta (modèle non approuvé, langue incorrecte, jeton expiré, numéro
non autorisé) apparaissent dans l'exécution Inngest et sont automatiquement
retentées par la plateforme.

Un envoi `accepted` dans Inngest signifie que Meta a accepté la demande, pas
que le message est livré. Dans les logs Vercel de `/api/webhook/whatsapp`,
chercher `whatsapp.message_status` : `sent`, `delivered`, `read` ou `failed`.
Le champ `messageId` permet de retrouver l'envoi Inngest ; `errorCodes` contient
les codes numériques Meta en cas d'échec. Aucun numéro, contenu de message ou
détail libre d'erreur n'est journalisé par ce diagnostic.

Test local du webhook (sans envoi réel) :
`node --experimental-strip-types --test tests/whatsapp-webhook.test.mjs`.
