# Notifications iPhone de l'administration

Le tableau de bord permet au compte administrateur `amouyalnoa25@gmail.com`
d'activer les notifications Web Push. Un rendez-vous confirmé par
`POST /api/confirmation`, une annulation par la cliente ou l'administration,
et chaque nouveau message WhatsApp entrant déclenchent une alerte sur les
appareils abonnés de ce compte. Le message WhatsApp affiche le nom du contact
ou son numéro. L'envoi Push ne bloque ni la réservation, ni l'annulation, ni
l'enregistrement d'un message. Les renvois d'un même webhook WhatsApp ne
créent pas de nouvelle alerte.

## Mise en service

1. Reprendre la paire VAPID déjà générée dans `.env.local` (fichier local ignoré
   par Git). Ne pas publier la clé privée dans le dépôt.
2. Configurer `VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY` dans l'environnement de
   production. Conserver ces mêmes clés lors des redéploiements : changer la
   paire impose de réactiver les notifications sur les appareils.
3. Après accord explicite pour la base de données, appliquer la migration
   `20261002000000_admin_web_push` à la base de production.
4. Déployer le code et les variables d'environnement sur `https://noa-bensadon.art`.
5. Sur l'iPhone (iOS 16.4 ou plus récent), ouvrir le site dans Safari, choisir
   « Ajouter à l'écran d'accueil », puis ouvrir l'icône. Se connecter avec le
   compte administrateur et toucher « Activer les notifications ».
6. Créer un rendez-vous de test, l'annuler, puis envoyer un message WhatsApp
   entrant de test. Vérifier les trois alertes lorsque le site est fermé et
   l'ouverture du tableau de bord ou de la page Messages au toucher. Vérifier
   aussi que « Désactiver » coupe les alertes de cet appareil.

Le service worker est servi par `/push-sw.js`. L'API `/api/dashboard/push`
accepte uniquement les abonnements Apple et le compte administrateur indiqué
ci-dessus. Elle supprime les abonnements expirés lorsque le service push
renvoie 404 ou 410.
