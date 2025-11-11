# Guide de Configuration Cloudinary

## Problème actuel
L'erreur "Upload preset not found" indique que votre compte Cloudinary n'a pas de preset configuré.

## Solution : Créer un Upload Preset

### 1. Connectez-vous à Cloudinary
- Allez sur [console.cloudinary.com](https://console.cloudinary.com)
- Connectez-vous avec votre compte

### 2. Créer un Upload Preset

1. Dans le menu de gauche, cliquez sur **Settings** (Paramètres)
2. Cliquez sur l'onglet **Upload**
3. Descendez jusqu'à **Upload presets**
4. Cliquez sur **Add upload preset**

### 3. Configuration du preset

Configurez comme suit :
- **Preset name**: `ml_default`
- **Signing Mode**: **Unsigned** (Important !)
- **Folder**: `plugs-crtfs` (optionnel)

Options recommandées :
- **Allowed formats**: jpg, png, gif, webp
- **Max file size**: 10MB
- **Transformation**: Vous pouvez ajouter des transformations automatiques

### 4. Sauvegarder
Cliquez sur **Save** en haut de la page

### 5. Vérifier votre Cloud Name
Dans le Dashboard Cloudinary, vérifiez votre **Cloud Name** (en haut)

### 6. Mettre à jour le code
Si votre cloud name est différent de `dtjab1akq`, mettez à jour dans :
- `/web-app/lib/image-upload.ts`
- `/web-app/app/api/upload/route.ts`

## Alternative temporaire

En attendant, l'application utilise :
1. **Imgur** comme service de backup
2. **Base64 URLs** pour un stockage temporaire local

## Variables d'environnement (optionnel)

Pour une configuration plus sécurisée, créez un fichier `.env.local` :

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
```

## Test

Après configuration :
1. Allez dans le panel admin
2. Essayez d'uploader une image
3. Vérifiez dans la console Cloudinary que l'image apparaît

## Support

Si le problème persiste :
1. Vérifiez que le preset est bien "Unsigned"
2. Vérifiez qu'il n'y a pas de restrictions sur votre compte Cloudinary
3. Consultez les logs dans la console du navigateur