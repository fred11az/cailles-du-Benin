# Mahutin Ferme - Cailles du Bénin

Site e-commerce professionnel pour Mahutin Ferme, une ferme d'élevage de cailles au Bénin.

## Fonctionnalités

### Frontend (Client)
- Page d'accueil attractive avec Hero section
- Catalogue de produits (oeufs et viande de caille)
- Panier dynamique avec récapitulatif
- Formulaire de commande avec validation
- Sélection de zone de livraison avec calcul automatique des frais
- Design responsive mobile-first
- Animations et micro-interactions

### Backend (Administration)
- Authentification sécurisée (`/admin/login`)
- Dashboard avec statistiques (CA jour/mois, commandes)
- Gestion des commandes (validation, suivi des statuts)
- Gestion des produits (modification prix, descriptions)
- Gestion des zones de livraison (CRUD complet)
- Ajout manuel de commandes

## Stack Technique

- **Framework**: Next.js 14+ (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **État**: Zustand (avec persistance localStorage)
- **Icônes**: Lucide React
- **Déploiement**: Vercel

## Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone <url-du-repo>
cd cailles-du-benin
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

Éditer `.env.local` avec vos valeurs :
```env
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
ADMIN_PASSWORD=VotreMotDePasseSecurise
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## Déploiement sur Vercel

1. Connecter votre repository GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel :
   - `NEXT_PUBLIC_SITE_URL`: votre domaine (ex: https://cailledubenin.com)
   - `ADMIN_PASSWORD`: mot de passe admin sécurisé
3. Déployer

## Structure du Projet

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx      # Page de connexion admin
│   │   └── page.tsx          # Dashboard admin
│   ├── panier/
│   │   └── page.tsx          # Page panier et commande
│   ├── globals.css           # Styles globaux
│   ├── layout.tsx            # Layout principal + SEO
│   ├── page.tsx              # Page d'accueil
│   ├── robots.ts             # Configuration robots.txt
│   └── sitemap.ts            # Sitemap XML
├── components/
│   ├── sections/
│   │   ├── Hero.tsx          # Section héro
│   │   ├── ProductsSection.tsx
│   │   └── DeliverySection.tsx
│   └── ui/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ProductCard.tsx
├── store/
│   └── useStore.ts           # État global Zustand
└── types/
    └── index.ts              # Types TypeScript
```

## Accès Administration

- **URL**: `/admin/login`
- **Mot de passe par défaut**: `MAHUTIN11@@`

> ⚠️ **Important**: Changez le mot de passe en production dans les variables d'environnement.

## Données de Test

### Produits
| Produit | Prix | Unité |
|---------|------|-------|
| Oeufs de cailles | 2 000 FCFA | douzaine |
| Viande de caille | 15 000 FCFA | kg |

### Zones de Livraison
| Zone | Prix livraison | Délai |
|------|----------------|-------|
| Cotonou | 1 000 FCFA | 1-2 heures |
| Calavi | 600 FCFA | 2-3 heures |
| Porto-Novo | 1 500 FCFA | 3-4 heures |

## Personnalisation

### Couleurs
Les couleurs sont configurées dans `tailwind.config.ts` :
- **Primaire**: `#22C55E` (vert)
- **Primaire foncé**: `#16A34A`
- **Arrière-plan**: `#FFFFFF`
- **Surface**: `#F3F4F6`

### Images
Remplacez les fichiers dans `/public/images/` par vos propres images :
- `hero-quail.jpg`: Image principale de la page d'accueil
- `eggs.jpg`: Photo des oeufs de caille
- `meat.jpg`: Photo de la viande de caille
- `og-image.jpg`: Image pour le partage sur les réseaux sociaux

## Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Démarrer la production
npm run lint     # Vérification ESLint
```

## SEO

Le site est optimisé pour le référencement :
- Méta-tags complets (title, description, keywords)
- Open Graph pour les réseaux sociaux
- Sitemap XML automatique
- robots.txt configuré
- Images optimisées avec next/image

## Support

Pour toute question ou problème, contactez l'équipe de développement.

## Licence

Ce projet est propriétaire. Tous droits réservés à Mahutin Ferme.
