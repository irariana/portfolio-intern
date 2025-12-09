/* ==========================================
   GESTIONNAIRE DE DONNÉES (DATA MANAGER)
   ==========================================
   
   Ce fichier gère toutes les données du portfolio.
   Il utilise localStorage pour sauvegarder les données
   directement dans le navigateur de l'utilisateur.
   
   localStorage = stockage persistant dans le navigateur
   - Les données restent même après fermeture du navigateur
   - Capacité d'environ 5MB par domaine
   - Données stockées en format texte (JSON)
   
   IMPORTANT : Ces données sont locales à chaque navigateur.
   Si vous voulez des données partagées, il faudrait un backend.
*/

// ==========================================
// INTERFACES TYPESCRIPT
// ==========================================
// Les interfaces définissent la "forme" de nos données
// TypeScript vérifiera que nos données respectent ces formes

/**
 * Interface pour les liens vers les réseaux sociaux
 * Chaque propriété est optionnelle (?)
 */
export interface SocialLinks {
  github?: string;      // Lien vers le profil GitHub
  linkedin?: string;    // Lien vers le profil LinkedIn
  email?: string;       // Adresse email
  twitter?: string;     // Lien vers Twitter/X
}

/**
 * Interface pour le profil utilisateur
 * Contient toutes les informations personnelles
 */
export interface Profile {
  name: string;         // Nom complet
  title: string;        // Titre professionnel
  bio: string;          // Biographie courte
  avatar: string;       // URL de la photo de profil
  socials: SocialLinks; // Liens réseaux sociaux
  passwordHash?: string; // Hash du mot de passe admin
}

/**
 * Interface pour une compétence
 */
export interface Skill {
  id: string;           // Identifiant unique (généré automatiquement)
  name: string;         // Nom de la compétence (ex: "Python")
  category: string;     // Catégorie (ex: "Langages", "Data")
  level: number;        // Niveau de maîtrise (0-100)
  icon?: string;        // Nom de l'icône (optionnel)
}

/**
 * Interface pour un projet
 */
export interface Project {
  id: string;           // Identifiant unique
  title: string;        // Titre du projet
  description: string;  // Description détaillée
  image: string;        // URL de l'image/screenshot
  technologies: string[]; // Liste des technologies utilisées
  githubUrl?: string;   // Lien GitHub (optionnel)
  demoUrl?: string;     // Lien démo live (optionnel)
  featured: boolean;    // Projet mis en avant ?
}

/**
 * Interface pour un article de blog
 */
export interface Article {
  id: string;           // Identifiant unique
  title: string;        // Titre de l'article
  excerpt: string;      // Résumé/extrait
  content: string;      // Contenu complet (Markdown)
  date: string;         // Date de publication
  published: boolean;   // Publié ou brouillon ?
  tags: string[];       // Tags/catégories
}

/**
 * Interface pour un message de contact
 */
export interface ContactMessage {
  id: string;           // Identifiant unique
  name: string;         // Nom de l'expéditeur
  email: string;        // Email de l'expéditeur
  message: string;      // Contenu du message
  date: string;         // Date de réception
  read: boolean;        // Lu ou non lu ?
}

/**
 * Interface principale contenant TOUTES les données du site
 */
export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  articles: Article[];
  messages: ContactMessage[];
}

// ==========================================
// DONNÉES PAR DÉFAUT
// ==========================================
// Ces données sont utilisées lors de la première visite
// ou si les données sont corrompues/supprimées

// Données importées depuis le fichier JSON central
import contentData from "@/data/content.json";

const defaultData: PortfolioData = contentData as PortfolioData;

// ==========================================
// CLÉ DE STOCKAGE LOCALSTORAGE
// ==========================================
// Cette clé identifie nos données dans le localStorage
// ==========================================
// CLÉ DE STOCKAGE LOCALSTORAGE
// ==========================================
// Cette clé identifie nos données dans le localStorage
// Changement en v2 pour invalider l'ancien cache sur les téléphones
const STORAGE_KEY = "portfolio_data_v2";

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

/**
 * Génère un identifiant unique
 * Utilise la date actuelle + un nombre aléatoire
 * @returns {string} - ID unique (ex: "1703234567890-abc123")
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Récupère toutes les données du portfolio
 * Si aucune donnée n'existe, retourne les données par défaut
 * @returns {PortfolioData} - Toutes les données du portfolio
 */
export function getData(): PortfolioData {
  // On privilégie désormais le fichier JSON (content.json) comme source de vérité
  // Cela permet que ce qu'on voit sur le PC (qui édite le JSON) soit exactement
  // ce qui sera déployé, sans interférence d'un vieux cache localStorage.

  // Si besoin de fusionner avec des brouillons locaux, on pourrait ajouter une logique ici,
  // mais pour votre usage "Édition PC -> Vue Mobile", le JSON doit être prioritaire.
  return defaultData;
}

/**
 * Sauvegarde toutes les données dans le localStorage
 * @param {PortfolioData} data - Les données à sauvegarder
 */
export function saveData(data: PortfolioData): void {
  try {
    // 1. Mise à jour des données en mémoire vive (pour affichage immédiat sans recharger)
    Object.assign(defaultData, data);

    // 2. Sauvegarde dans le localStorage (pour effet immédiat/cache)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // 3. Si on est en mode développement (localhost), on sauvegarde aussi dans le fichier JSON
    // Cela permet de "persister" les changements dans le code source pour pouvoir les commit
    if (import.meta.env.DEV) {
      fetch("/api/save-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).catch((e) => console.error("Erreur save API:", e));
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données:", error);
  }
}

// ==========================================
// FONCTIONS SPÉCIFIQUES PAR TYPE DE DONNÉE
// ==========================================

/**
 * Met à jour le profil utilisateur
 * @param {Partial<Profile>} updates - Les champs à mettre à jour
 * 
 * Partial<Profile> signifie que seuls certains champs peuvent être fournis
 * Exemple: updateProfile({ name: "Nouveau Nom" }) 
 */
export function updateProfile(updates: Partial<Profile>): void {
  const data = getData();
  // Spread operator (...) fusionne l'ancien profil avec les nouvelles valeurs
  data.profile = { ...data.profile, ...updates };
  saveData(data);
}

/**
 * Récupère le profil utilisateur
 * @returns {Profile} - Le profil complet
 */
export function getProfile(): Profile {
  return getData().profile;
}

// ------------------------------------------
// GESTION DES COMPÉTENCES (SKILLS)
// ------------------------------------------

/**
 * Récupère toutes les compétences
 * @returns {Skill[]} - Tableau de compétences
 */
export function getSkills(): Skill[] {
  return getData().skills;
}

/**
 * Ajoute une nouvelle compétence
 * @param {Omit<Skill, "id">} skill - Compétence sans ID (sera généré)
 * 
 * Omit<Skill, "id"> = type Skill mais sans le champ "id"
 */
export function addSkill(skill: Omit<Skill, "id">): void {
  const data = getData();
  // Crée un nouvel objet avec un ID généré automatiquement
  const newSkill: Skill = {
    ...skill,
    id: generateId(),
  };
  // Ajoute à la fin du tableau
  data.skills.push(newSkill);
  saveData(data);
}

/**
 * Met à jour une compétence existante
 * @param {string} id - ID de la compétence à modifier
 * @param {Partial<Skill>} updates - Les champs à mettre à jour
 */
export function updateSkill(id: string, updates: Partial<Skill>): void {
  const data = getData();
  // Trouve l'index de la compétence dans le tableau
  const index = data.skills.findIndex((s) => s.id === id);
  if (index !== -1) {
    // Fusionne les anciennes et nouvelles valeurs
    data.skills[index] = { ...data.skills[index], ...updates };
    saveData(data);
  }
}

/**
 * Supprime une compétence
 * @param {string} id - ID de la compétence à supprimer
 */
export function deleteSkill(id: string): void {
  const data = getData();
  // filter crée un nouveau tableau sans l'élément à supprimer
  data.skills = data.skills.filter((s) => s.id !== id);
  saveData(data);
}

// ------------------------------------------
// GESTION DES PROJETS
// ------------------------------------------

/**
 * Récupère tous les projets
 * @returns {Project[]} - Tableau de projets
 */
export function getProjects(): Project[] {
  return getData().projects;
}

/**
 * Ajoute un nouveau projet
 * @param {Omit<Project, "id">} project - Projet sans ID
 */
export function addProject(project: Omit<Project, "id">): void {
  const data = getData();
  const newProject: Project = {
    ...project,
    id: generateId(),
  };
  data.projects.push(newProject);
  saveData(data);
}

/**
 * Met à jour un projet existant
 * @param {string} id - ID du projet
 * @param {Partial<Project>} updates - Modifications
 */
export function updateProject(id: string, updates: Partial<Project>): void {
  const data = getData();
  const index = data.projects.findIndex((p) => p.id === id);
  if (index !== -1) {
    data.projects[index] = { ...data.projects[index], ...updates };
    saveData(data);
  }
}

/**
 * Supprime un projet
 * @param {string} id - ID du projet
 */
export function deleteProject(id: string): void {
  const data = getData();
  data.projects = data.projects.filter((p) => p.id !== id);
  saveData(data);
}

// ------------------------------------------
// GESTION DES ARTICLES
// ------------------------------------------

/**
 * Récupère tous les articles
 * @param {boolean} publishedOnly - Si true, retourne seulement les publiés
 */
export function getArticles(publishedOnly = false): Article[] {
  const articles = getData().articles;
  if (publishedOnly) {
    return articles.filter((a) => a.published);
  }
  return articles;
}

/**
 * Ajoute un nouvel article
 */
export function addArticle(article: Omit<Article, "id">): void {
  const data = getData();
  const newArticle: Article = {
    ...article,
    id: generateId(),
  };
  data.articles.push(newArticle);
  saveData(data);
}

/**
 * Met à jour un article
 */
export function updateArticle(id: string, updates: Partial<Article>): void {
  const data = getData();
  const index = data.articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    data.articles[index] = { ...data.articles[index], ...updates };
    saveData(data);
  }
}

/**
 * Supprime un article
 */
export function deleteArticle(id: string): void {
  const data = getData();
  data.articles = data.articles.filter((a) => a.id !== id);
  saveData(data);
}

// ------------------------------------------
// GESTION DES MESSAGES DE CONTACT
// ------------------------------------------

/**
 * Récupère tous les messages
 */
export function getMessages(): ContactMessage[] {
  return getData().messages;
}

/**
 * Ajoute un nouveau message de contact
 * Appelé quand quelqu'un soumet le formulaire de contact
 */
export function addMessage(
  message: Omit<ContactMessage, "id" | "date" | "read">
): void {
  const data = getData();
  const newMessage: ContactMessage = {
    ...message,
    id: generateId(),
    date: new Date().toISOString(), // Date actuelle au format ISO
    read: false, // Non lu par défaut
  };
  data.messages.push(newMessage);
  saveData(data);
}

/**
 * Marque un message comme lu
 */
export function markMessageAsRead(id: string): void {
  const data = getData();
  const index = data.messages.findIndex((m) => m.id === id);
  if (index !== -1) {
    data.messages[index].read = true;
    saveData(data);
  }
}

/**
 * Supprime un message
 */
export function deleteMessage(id: string): void {
  const data = getData();
  data.messages = data.messages.filter((m) => m.id !== id);
  saveData(data);
}

// ------------------------------------------
// EXPORT/IMPORT DES DONNÉES
// ------------------------------------------

/**
 * Exporte toutes les données en JSON
 * Permet de sauvegarder une copie de ses données
 * @returns {string} - Données au format JSON
 */
export function exportData(): string {
  return JSON.stringify(getData(), null, 2);
  // null, 2 = formatage avec indentation de 2 espaces (plus lisible)
}

/**
 * Importe des données depuis un JSON
 * Permet de restaurer une sauvegarde
 * @param {string} jsonString - Données JSON à importer
 * @returns {boolean} - true si succès, false si erreur
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as PortfolioData;
    // Vérifie que les données ont la bonne structure
    if (data.profile && data.skills && data.projects) {
      saveData(data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Réinitialise toutes les données aux valeurs par défaut
 * ATTENTION : Cette action est irréversible !
 */
export function resetData(): void {
  saveData(defaultData);
}
