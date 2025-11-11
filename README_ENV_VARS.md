# Variables d'environnement requises pour Vercel

Les variables suivantes doivent être configurées dans les paramètres de votre projet Vercel :

## Base de données
- `MONGODB_URI` : L'URI de connexion MongoDB (doit être la même que celle utilisée par le bot)
  - Exemple : `mongodb+srv://juniorakz:w7q4GYF4NsXpGqUw@plgscrtf.tp0afas.mongodb.net/?retryWrites=true&w=majority&appName=PLGSCRTF`

## Telegram
- `TELEGRAM_BOT_TOKEN` : Le token de votre bot Telegram (nécessaire pour envoyer des notifications)
  - Exemple : `6754912345:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Cloudinary (pour l'upload d'images)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` : Votre nom de cloud Cloudinary
- `CLOUDINARY_API_KEY` : Votre clé API Cloudinary
- `CLOUDINARY_API_SECRET` : Votre secret API Cloudinary

## Comment configurer sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans "Settings" > "Environment Variables"
4. Ajoutez chaque variable avec sa valeur
5. Redéployez votre application

⚠️ IMPORTANT : Assurez-vous que MONGODB_URI pointe vers la même base de données que votre bot Telegram !