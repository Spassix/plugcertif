# Adaptation Telegram Mini App

## Vue d'ensemble

Cette application a été adaptée pour fonctionner parfaitement comme une Telegram Mini App. Les adaptations incluent :

1. **Détection automatique de l'environnement Telegram**
2. **Interface responsive optimisée pour mobile**
3. **Styles spécifiques pour Telegram**
4. **Navigation adaptée**
5. **Gestion des thèmes clair/sombre**

## Composants principaux

### TelegramProvider

Le `TelegramProvider` détecte automatiquement si l'application s'exécute dans Telegram et fournit :

```tsx
const { isTelegram, webApp, theme } = useTelegram()
```

- `isTelegram`: boolean indiquant si on est dans Telegram
- `webApp`: objet Telegram WebApp API
- `theme`: 'light' ou 'dark' selon le thème Telegram

### Adaptations automatiques

Quand `isTelegram` est `true`, l'application :

- Réduit les tailles de police et d'éléments
- Simplifie la navigation
- Désactive les animations lourdes
- Optimise pour les écrans tactiles
- Utilise `webApp.openLink()` pour ouvrir les liens externes

## Styles CSS

Le fichier `telegram.css` contient tous les styles spécifiques :

- `.telegram-app` : classe appliquée au HTML quand dans Telegram
- Grilles de produits adaptées (2 colonnes max)
- Boutons tactiles optimisés (min 44px)
- Support du thème clair/sombre

## Pages adaptées

### MaintenancePage

- Logo plus petit (24x24 au lieu de 48x48)
- Textes réduits
- Boutons compacts
- Pas d'image de fond (performance)

### HomePage

- Pas de splash screen
- Animations réduites
- Grille de stats 2x2
- Sections simplifiées

### Navbar

- Hauteur réduite (48px)
- Menu hamburger toujours visible
- Navigation simplifiée

## Utilisation

### Dans vos composants

```tsx
import { useTelegram } from '@/components/TelegramProvider'

export default function MyComponent() {
  const { isTelegram, webApp } = useTelegram()
  
  // Classes conditionnelles
  const titleSize = isTelegram ? "text-2xl" : "text-4xl"
  
  // Ouvrir des liens
  const handleClick = (url: string) => {
    if (isTelegram && webApp) {
      webApp.openLink(url)
    } else {
      window.open(url, '_blank')
    }
  }
  
  return (
    <h1 className={titleSize}>Mon titre</h1>
  )
}
```

### Configuration Telegram Bot

Pour utiliser cette app dans Telegram :

1. Créez un bot avec @BotFather
2. Utilisez `/setmenubutton` pour définir l'URL de votre app
3. L'app détectera automatiquement l'environnement Telegram

## Performance

Les optimisations incluent :

- Animations réduites à 0.2s
- Pas d'effets de survol sur mobile
- Images responsives
- Scroll optimisé avec `-webkit-overflow-scrolling: touch`

## Test

Pour tester l'adaptation :

1. Ouvrez l'app dans Telegram
2. Vérifiez que la classe `.telegram-app` est appliquée
3. Testez la navigation et les interactions tactiles
4. Vérifiez les deux thèmes (clair/sombre)