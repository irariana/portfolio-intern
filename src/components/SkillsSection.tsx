/* ==========================================
   COMPOSANT SKILLS SECTION (COMPÉTENCES)
   ==========================================
   
   Style RPG : Barres de stats comme dans les jeux vidéo
   avec des effets néon et des animations pixel art.
*/

import { useEffect, useState, useRef } from "react";
import { Code, Database, BarChart3, GitBranch, Calculator, LineChart, PieChart, Brain, Wrench, Sword, Shield, Zap } from "lucide-react";
import { getSkills, type Skill } from "@/lib/dataManager";
import { cn } from "@/lib/utils";

// ==========================================
// MAPPING DES ICÔNES RPG
// ==========================================

const iconMap: Record<string, typeof Code> = {
  code: Code,
  database: Database,
  "bar-chart": BarChart3,
  "git-branch": GitBranch,
  calculator: Calculator,
  "line-chart": LineChart,
  "pie-chart": PieChart,
  brain: Brain,
  wrench: Wrench
};

// ==========================================
// COMPOSANT BARRE DE STATS RPG
// ==========================================

interface StatBarProps {
  value: number;
  animated: boolean;
  delay: number;
}

function StatBar({ value, animated, delay }: StatBarProps) {
  // Détermine la couleur selon le niveau (comme dans les RPG)
  const getBarColor = (level: number) => {
    if (level >= 80) return "from-accent to-accent/70"; // Or/Légendaire
    if (level >= 60) return "from-secondary to-secondary/70"; // Magenta/Épique
    if (level >= 40) return "from-primary to-primary/70"; // Cyan/Rare
    return "from-muted-foreground to-muted-foreground/70"; // Gris/Commun
  };

  return (
    <div className="relative h-4 rounded pixel-border bg-muted/50 overflow-hidden">
      {/* Fond pixelisé */}
      <div className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.3) 8px)" 
        }} 
      />
      
      {/* Barre de progression avec effet néon */}
      <div
        className={cn(
          "h-full rounded-sm",
          "bg-gradient-to-r",
          getBarColor(value),
          "transition-all duration-1000 ease-out",
          "shadow-[0_0_10px_currentColor]"
        )}
        style={{
          width: animated ? `${value}%` : "0%",
          transitionDelay: `${delay}ms`
        }}
      />
      
      {/* Segments de barre (style RPG) */}
      <div className="absolute inset-0 flex">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex-1 border-r border-background/30 last:border-r-0" />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPOSANT CARTE DE COMPÉTENCE RPG
// ==========================================

interface SkillCardProps {
  skill: Skill;
  index: number;
  animated: boolean;
}

function SkillCard({ skill, index, animated }: SkillCardProps) {
  const IconComponent = iconMap[skill.icon || "code"] || Code;
  
  // Rang selon le niveau (vocabulaire RPG)
  const getRank = (level: number) => {
    if (level >= 90) return { name: "LÉGENDAIRE", color: "text-accent" };
    if (level >= 75) return { name: "ÉPIQUE", color: "text-secondary" };
    if (level >= 50) return { name: "RARE", color: "text-primary" };
    if (level >= 25) return { name: "COMMUN", color: "text-muted-foreground" };
    return { name: "NOVICE", color: "text-muted-foreground/50" };
  };

  const rank = getRank(skill.level);

  return (
    <div
      className={cn(
        "rpg-box p-4",
        "group relative overflow-hidden",
        "hover:border-accent/50",
        "transition-all duration-300",
        animated && "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* En-tête avec icône et rang */}
      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-3">
          {/* Icône avec effet néon */}
          <div className="p-2 rounded pixel-border bg-primary/20 group-hover:shadow-glow transition-shadow">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          {/* Nom de la compétence */}
          <span className="font-pixel text-xs text-foreground uppercase tracking-wide">
            {skill.name}
          </span>
        </div>
        
        {/* Badge de rang */}
        <span className={cn("font-pixel text-[10px]", rank.color)}>
          {rank.name}
        </span>
      </div>

      {/* Barre de stats */}
      <StatBar value={skill.level} animated={animated} delay={index * 100 + 200} />
      
      {/* Niveau numérique */}
      <div className="flex justify-between mt-2">
        <span className="font-pixel text-[10px] text-muted-foreground">LVL</span>
        <span className="font-pixel text-sm text-accent">{skill.level}</span>
      </div>
    </div>
  );
}

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Charger les compétences
  useEffect(() => {
    setSkills(getSkills());
  }, []);

  // Détecter la visibilité pour animer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Regrouper par catégorie
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Autres";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section ref={sectionRef} id="skills" className="py-20 md:py-32 relative">
      {/* Particules de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
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
          {/* Badge style inventaire */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rpg-box text-accent font-pixel text-xs mb-4">
            <Sword className="w-4 h-4" />
            STATS DU PERSONNAGE
            <Shield className="w-4 h-4" />
          </div>

          {/* Titre avec effet néon */}
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="neon-text">Compétences</span>
          </h2>

          {/* Description */}
          <p className="text-muted-foreground max-w-2xl mx-auto font-pixel text-xs leading-relaxed">
            Mes points de compétences acquis au fil des quêtes et des aventures...
          </p>
        </div>

        {/* Grille des compétences par catégorie */}
        <div className="space-y-12">
          {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
            <div key={category}>
              {/* Titre de catégorie style RPG */}
              <h3 className="flex items-center gap-3 text-lg font-display font-semibold text-foreground mb-6">
                <Zap className="w-5 h-5 text-accent" />
                <span className="pixel-border px-3 py-1 bg-muted/30">{category}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent" />
              </h3>

              {/* Grille des skills */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill, skillIndex) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    index={categoryIndex * 3 + skillIndex}
                    animated={isVisible}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats globales style RPG */}
        <div className="mt-16 rpg-box p-6 max-w-md mx-auto text-center">
          <h4 className="font-pixel text-xs text-accent mb-4">RÉSUMÉ DU JOUEUR</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-display font-bold text-primary">{skills.length}</div>
              <div className="font-pixel text-[10px] text-muted-foreground">SKILLS</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-secondary">
                {Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length || 0)}
              </div>
              <div className="font-pixel text-[10px] text-muted-foreground">MOY. LVL</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-accent">
                {Object.keys(skillsByCategory).length}
              </div>
              <div className="font-pixel text-[10px] text-muted-foreground">CLASSES</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
