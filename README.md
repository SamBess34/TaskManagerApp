# TaskManagerApp

## Application de gestion de tâches avec synchronisation backend

TaskManagerApp est une application mobile qui vous permet de gérer vos tâches quotidiennes et à venir avec une interface élégante et intuitive, disponible en français et en anglais.

---

## 📥 Comment installer l'application

### Prérequis

- Node.js (v16 ou supérieur)
- npm
- Expo CLI (`npm install -g expo-cli`)
- Un compte Supabase (gratuit)

### Étapes d'installation

1. **Cloner le dépôt**

```bash
 git clone git@github.com:SamBess34/TaskManagerApp.git
 cd TaskManagerApp
```

2. **Installer les dépendances**

```bash
 npm install
```

3. **Configurer Supabase**

- Créez un nouveau projet sur Supabase
- Dans l'éditeur SQL de votre projet, exécutez le script suivant :

```sql
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for secure access
CREATE POLICY "Users can CRUD their own tasks" ON tasks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

- Activez l'authentification par email dans les paramètres `Authentication > Providers`

4. **Configurer les variables d'environnement**

- Créez un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

- Remplacez les valeurs par celles disponibles dans votre projet Supabase (`Settings > API`)

5. **Lancer l'application**

```bash
 npx expo start
```

- Scannez le QR code avec l'application Expo Go sur votre smartphone
- Ou appuyez sur `i` ou `a` dans le terminal pour ouvrir un émulateur iOS ou Android

---

## 📌 Comment utiliser l'application

### Première utilisation

- **Inscription** : Créez un compte avec votre email et un mot de passe
- **Connexion** : Connectez-vous avec vos identifiants

### Fonctionnalités principales

✅ **Écran Today** : Affiche les tâches du jour  
📆 **Écran Upcoming** : Affiche les tâches à venir, organisées par date  
➕ **Ajout de tâche** : Appuyez sur le bouton `+` pour ajouter une nouvelle tâche

#### Formulaire de tâche :

- Ajoutez un **titre** (obligatoire)
- Ajoutez une **description** (optionnel)
- Définissez une **date et une heure d'échéance**

#### Gestion des tâches :

- Marquez une tâche comme **terminée** en appuyant sur le cercle
- Supprimez une tâche en appuyant sur l'icône de corbeille 🗑️

#### Changement de langue :

- Accédez au **menu (⋮)** en haut à droite
- Sélectionnez **"Langue" / "Language"**
- Choisissez entre **français et anglais**

---

Développé avec en **React Native, Expo et Supabase**.
