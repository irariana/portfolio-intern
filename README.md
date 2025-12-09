# Portfolio Data Science - Style RPG 🎮

Portfolio personnel avec un design inspiré des jeux vidéo rétro.

## ⚙️ Configuration

### Base Path (si nécessaire)

Si ton site n'est PAS à la racine (ex: `username.github.io/mon-portfolio`), modifie `vite.config.ts` :

```typescript
base: mode === "production" ? "/mon-portfolio/" : "/",
```

### EmailJS (optionnel)

Pour recevoir les messages du formulaire de contact par email :

1. Créer un compte sur [emailjs.com](https://www.emailjs.com/)
2. Créer un service email et un template
3. Ajouter ces variables d'environnement :
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`


## 📁 Structure du projet

```
src/
├── components/     # Composants React
│   ├── ui/        # Composants shadcn/ui
│   └── ...        # Sections du portfolio
├── lib/           # Utilitaires et services
│   ├── dataManager.ts   # Gestion des données (localStorage)
│   ├── authManager.ts   # Authentification admin
│   ├── emailService.ts  # Service EmailJS
│   └── imageManager.ts  # Upload d'images
├── pages/         # Pages de l'application
└── index.css      # Styles globaux et thème
```

## 🎨 Personnalisation

- **Thème** : Modifier `src/index.css` et `tailwind.config.ts`
- **Données** : Via le panneau admin ou directement dans `src/lib/dataManager.ts`
- **Polices** : Press Start 2P (pixel) et VT323 (retro)

## 📝 Technologies

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- EmailJS (optionnel)

---
