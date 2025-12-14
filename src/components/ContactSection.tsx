/* ==========================================
   COMPOSANT CONTACT SECTION - STYLE RPG
   ==========================================
   
   Formulaire de contact façon "Message au Héros"
   Intégration EmailJS pour envoi direct par email.
*/

import { useState, useEffect } from "react";
import { Send, Mail, MapPin, Github, Linkedin, CheckCircle, Loader2, Scroll, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addMessage, getProfile, type Profile } from "@/lib/dataManager";
import { sendContactEmail, isEmailJSConfigured } from "@/lib/emailService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ==========================================
// INTERFACE DU FORMULAIRE
// ==========================================

interface FormData {
  name: string;
  email: string;
  message: string;
}

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

export function ContactSection() {
  // États
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  // Charger le profil
  useEffect(() => {
    setProfile(getProfile());
  }, []);

  // Mise à jour des champs
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "⚠️ Quête incomplète !",
        description: "Tous les champs du parchemin doivent être remplis.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "⚠️ Adresse invalide",
        description: "Le pigeon voyageur ne trouve pas cette adresse...",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Sauvegarder dans localStorage (pour l'admin)
      addMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      // Envoyer par email via EmailJS si configuré
      if (isEmailJSConfigured()) {
        const emailResult = await sendContactEmail({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });

        if (!emailResult.success) {
          console.warn("EmailJS non envoyé:", emailResult.message);
          // On continue quand même car le message est sauvegardé
        }
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      toast({
        title: "✨ Parchemin envoyé !",
        description: "Votre message a été transmis au héros.",
      });

      // Reset après 3 secondes
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: "", email: "", message: "" });
      }, 3000);

    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "❌ Échec de la quête",
        description: "Le pigeon s'est perdu en chemin. Réessayez !",
        variant: "destructive",
      });
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 relative bg-gradient-to-b from-background to-muted/20"
    >
      {/* Particules magiques */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative">
        {/* En-tête RPG */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rpg-box text-accent font-pixel text-xs mb-4">
            <Scroll className="w-4 h-4" />
            BUREAU DE POSTE
            <MessageSquare className="w-4 h-4" />
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="neon-text">Envoyer un Parchemin</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto font-pixel text-xs leading-relaxed">
            Une quête à proposer ? Une alliance à forger ? Envoyez votre message !
          </p>
        </div>

        {/* Contenu en 2 colonnes */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Colonne gauche : Infos de contact */}
          <div className="space-y-6">
            {/* Carte Email */}
            <div className="rpg-box p-6 flex items-start gap-4 group hover:border-primary/50 transition-colors">
              <div className="p-3 rounded pixel-border bg-primary/20 group-hover:shadow-glow transition-shadow">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-pixel text-xs text-accent mb-1">PIGEON VOYAGEUR</h3>
                <p className="text-muted-foreground text-sm">
                  {profile?.socials?.email || "contact@example.com"}
                </p>
              </div>
            </div>

            {/* Carte Localisation */}
            <div className="rpg-box p-6 flex items-start gap-4 group hover:border-secondary/50 transition-colors">
              <div className="p-3 rounded pixel-border bg-secondary/20 group-hover:shadow-glow-secondary transition-shadow">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-pixel text-xs text-accent mb-1">ZONE DE SPAWN</h3>
                <p className="text-muted-foreground text-sm">France 🇫🇷</p>
              </div>
            </div>

            {/* Liens sociaux */}
            <div className="rpg-box p-6">
              <h3 className="font-pixel text-xs text-accent mb-4">GUILDES & RÉSEAUX</h3>
              <div className="flex gap-4">
                {profile?.socials?.github && (
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "p-3 rounded pixel-border bg-muted/50",
                      "text-muted-foreground hover:text-primary",
                      "transition-all duration-300",
                      "hover:scale-110 hover:shadow-glow"
                    )}
                    aria-label="GitHub"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {profile?.socials?.linkedin && (
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "p-3 rounded pixel-border bg-muted/50",
                      "text-muted-foreground hover:text-primary",
                      "transition-all duration-300",
                      "hover:scale-110 hover:shadow-glow"
                    )}
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Colonne droite : Formulaire */}
          <div className="rpg-box p-8">
            {isSuccess ? (
              /* Message de succès style RPG */
              <div className="h-full flex flex-col items-center justify-center text-center animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4 animate-pulse">
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  <span className="neon-text-gold">Quête accomplie !</span>
                </h3>
                <p className="text-muted-foreground font-pixel text-xs">
                  +100 XP de communication
                </p>
              </div>
            ) : (
              /* Formulaire */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="font-pixel text-xs text-accent">RÉDIGER UN PARCHEMIN</h3>
                </div>

                {/* Champ Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-pixel text-xs text-muted-foreground">
                    NOM DU HÉROS
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Entrez votre nom..."
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-background/50 border-border focus:border-primary font-mono"
                    required
                  />
                </div>

                {/* Champ Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-pixel text-xs text-muted-foreground">
                    ADRESSE DU PIGEON
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-background/50 border-border focus:border-primary font-mono"
                    required
                  />
                </div>

                {/* Champ Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-pixel text-xs text-muted-foreground">
                    CONTENU DU PARCHEMIN
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Écrivez votre message..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="bg-background/50 border-border focus:border-primary min-h-[150px] font-mono"
                    required
                  />
                </div>

                {/* Bouton d'envoi */}
                <Button
                  type="submit"
                  size="lg"
                  className={cn(
                    "w-full",
                    "bg-gradient-to-r from-primary to-accent",
                    "text-background font-pixel text-xs",
                    "pixel-border",
                    "hover:shadow-glow hover:scale-[1.02]",
                    "transition-all duration-300"
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ENVOI EN COURS...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      ENVOYER LE PARCHEMIN
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
