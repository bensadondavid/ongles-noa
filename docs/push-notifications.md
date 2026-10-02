# Notifications iPhone des nouveaux rendez-vous

Le tableau de bord permet au compte administrateur `amouyalnoa25@gmail.com`
d'activer les notifications Web Push. Chaque rendez-vous confirmé par
`POST /api/confirmation` déclenche une alerte sur les appareils abonnés de ce
compte. La réservation reste valide si l'envoi échoue.

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
6. Créer un rendez-vous de test et vérifier l'arrivée de l'alerte lorsque le
   site est fermé. Vérifier aussi que le bouton « Désactiver » coupe les alertes
   de cet appareil.

Le service worker est servi par `/push-sw.js`. L'API `/api/dashboard/push`
accepte uniquement les abonnements Apple et le compte administrateur indiqué
ci-dessus. Elle supprime les abonnements expirés lorsque le service push
renvoie 404 ou 410.
