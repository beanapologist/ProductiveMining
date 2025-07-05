import { db } from "./db";
import { 
  mathMiners, 
  achievements, 
  minerAchievements, 
  miningStreaks, 
  levelProgression,
  type MathMiner,
  type Achievement,
  type MinerAchievement,
  type MiningStreak,
  type LevelProgression
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export class MathMinerEngine {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    await this.setupLevelProgression();
    await this.setupAchievements();
    this.initialized = true;
    console.log("🎮 MATH MINER ENGINE: Initialized gamification system");
  }

  private async setupLevelProgression() {
    // Check if level progression is already set up
    const existingLevels = await db.select().from(levelProgression).limit(1);
    if (existingLevels.length > 0) return;

    // Define level progression system with exponential XP requirements
    const levels = [
      { level: 1, xpRequired: 0, rank: "Apprentice", title: "Math Explorer", perks: ["Basic mining"], description: "Welcome to the productive mining network!" },
      { level: 2, xpRequired: 100, rank: "Apprentice", title: "Number Seeker", perks: ["Basic mining", "Discovery tracking"], description: "You're getting the hang of mathematical discovery." },
      { level: 3, xpRequired: 250, rank: "Apprentice", title: "Pattern Hunter", perks: ["Basic mining", "Discovery tracking", "Pattern recognition"], description: "Starting to see mathematical patterns emerge." },
      { level: 4, xpRequired: 500, rank: "Journeyman", title: "Theorem Tracker", perks: ["Enhanced mining", "Advanced tracking"], description: "Advancing your mathematical computation skills." },
      { level: 5, xpRequired: 1000, rank: "Journeyman", title: "Prime Investigator", perks: ["Enhanced mining", "Prime specialization"], description: "Specializing in prime number research." },
      { level: 6, xpRequired: 1800, rank: "Journeyman", title: "Riemann Explorer", perks: ["Enhanced mining", "Riemann specialization"], description: "Delving into the mysteries of the Riemann Hypothesis." },
      { level: 7, xpRequired: 3000, rank: "Expert", title: "Yang-Mills Theorist", perks: ["Expert mining", "Field theory access"], description: "Mastering quantum field theory calculations." },
      { level: 8, xpRequired: 4500, rank: "Expert", title: "Navier-Stokes Analyst", perks: ["Expert mining", "Fluid dynamics"], description: "Solving complex fluid dynamics equations." },
      { level: 9, xpRequired: 6500, rank: "Expert", title: "Goldbach Verifier", perks: ["Expert mining", "Conjecture testing"], description: "Verifying one of mathematics' greatest conjectures." },
      { level: 10, xpRequired: 9000, rank: "Master", title: "Poincaré Researcher", perks: ["Master mining", "Topology research"], description: "Exploring the frontiers of topological mathematics." },
      { level: 11, xpRequired: 12500, rank: "Master", title: "Birch-Swinnerton-Dyer Scholar", perks: ["Master mining", "Elliptic curves"], description: "Advancing elliptic curve mathematics." },
      { level: 12, xpRequired: 17000, rank: "Master", title: "Cryptography Pioneer", perks: ["Master mining", "Crypto research"], description: "Pioneering next-generation cryptographic methods." },
      { level: 13, xpRequired: 22500, rank: "Grandmaster", title: "Lattice Architect", perks: ["Grandmaster mining", "Lattice mastery"], description: "Architecting quantum-resistant cryptographic systems." },
      { level: 14, xpRequired: 30000, rank: "Grandmaster", title: "Discovery Synthesizer", perks: ["Grandmaster mining", "Cross-domain synthesis"], description: "Synthesizing discoveries across mathematical domains." },
      { level: 15, xpRequired: 40000, rank: "Grandmaster", title: "Breakthrough Catalyst", perks: ["Grandmaster mining", "Breakthrough acceleration"], description: "Catalyzing major mathematical breakthroughs." },
      { level: 16, xpRequired: 55000, rank: "Legend", title: "Mathematical Visionary", perks: ["Legendary mining", "Visionary insights"], description: "Achieving legendary status in mathematical discovery." },
      { level: 17, xpRequired: 75000, rank: "Legend", title: "Theorem Architect", perks: ["Legendary mining", "Theorem creation"], description: "Architecting new mathematical theorems." },
      { level: 18, xpRequired: 100000, rank: "Legend", title: "Discovery Engine", perks: ["Legendary mining", "Discovery amplification"], description: "Becoming a powerhouse of mathematical discovery." },
      { level: 19, xpRequired: 135000, rank: "Mythic", title: "Mathematical Oracle", perks: ["Mythic mining", "Oracle insights"], description: "Achieving mythical understanding of mathematics." },
      { level: 20, xpRequired: 180000, rank: "Mythic", title: "Infinity Master", perks: ["Mythic mining", "Infinite potential"], description: "Mastering the infinite realm of mathematical possibility." }
    ];

    for (const level of levels) {
      await db.insert(levelProgression).values({
        level: level.level,
        xpRequired: level.xpRequired,
        rank: level.rank,
        title: level.title,
        perks: level.perks,
        description: level.description
      });
    }

    console.log("📊 LEVEL SYSTEM: Setup 20 progression levels with exponential XP scaling");
  }

  private async setupAchievements() {
    // Check if achievements are already set up
    const existingAchievements = await db.select().from(achievements).limit(1);
    if (existingAchievements.length > 0) return;

    const achievementData = [
      // Discovery Achievements
      { id: "first_discovery", name: "First Steps", description: "Make your first mathematical discovery", icon: "🔍", rarity: "common", xpReward: 50, category: "discovery", requirements: { discoveries: 1 } },
      { id: "ten_discoveries", name: "Pattern Seeker", description: "Complete 10 mathematical discoveries", icon: "🧩", rarity: "common", xpReward: 150, category: "discovery", requirements: { discoveries: 10 } },
      { id: "fifty_discoveries", name: "Discovery Specialist", description: "Complete 50 mathematical discoveries", icon: "💎", rarity: "rare", xpReward: 500, category: "discovery", requirements: { discoveries: 50 } },
      { id: "hundred_discoveries", name: "Mathematical Pioneer", description: "Complete 100 mathematical discoveries", icon: "🏆", rarity: "epic", xpReward: 1200, category: "discovery", requirements: { discoveries: 100 } },
      { id: "thousand_discoveries", name: "Discovery Legend", description: "Complete 1000 mathematical discoveries", icon: "👑", rarity: "legendary", xpReward: 5000, category: "discovery", requirements: { discoveries: 1000 } },

      // Mining Achievements
      { id: "first_block", name: "Block Builder", description: "Mine your first productive block", icon: "⛏️", rarity: "common", xpReward: 75, category: "mining", requirements: { blocks: 1 } },
      { id: "ten_blocks", name: "Persistent Miner", description: "Mine 10 productive blocks", icon: "🏗️", rarity: "common", xpReward: 200, category: "mining", requirements: { blocks: 10 } },
      { id: "hundred_blocks", name: "Block Master", description: "Mine 100 productive blocks", icon: "🏰", rarity: "epic", xpReward: 1500, category: "mining", requirements: { blocks: 100 } },

      // Efficiency Achievements
      { id: "efficient_miner", name: "Efficiency Expert", description: "Achieve 95%+ average efficiency", icon: "⚡", rarity: "rare", xpReward: 400, category: "efficiency", requirements: { efficiency: 0.95 } },
      { id: "energy_saver", name: "Energy Guardian", description: "Generate more energy than consumed", icon: "🌱", rarity: "epic", xpReward: 800, category: "efficiency", requirements: { energyRatio: 1.1 } },

      // Work Type Specialists
      { id: "riemann_specialist", name: "Riemann Scholar", description: "Complete 25 Riemann Hypothesis calculations", icon: "ζ", rarity: "rare", xpReward: 600, category: "discovery", requirements: { workType: "riemann_zero", count: 25 } },
      { id: "prime_specialist", name: "Prime Hunter", description: "Complete 25 prime pattern discoveries", icon: "🔢", rarity: "rare", xpReward: 600, category: "discovery", requirements: { workType: "prime_pattern", count: 25 } },
      { id: "yang_mills_specialist", name: "Field Theorist", description: "Complete 25 Yang-Mills validations", icon: "🌊", rarity: "rare", xpReward: 600, category: "discovery", requirements: { workType: "yang_mills", count: 25 } },
      { id: "navier_stokes_specialist", name: "Fluid Dynamics Expert", description: "Complete 25 Navier-Stokes solutions", icon: "💧", rarity: "rare", xpReward: 600, category: "discovery", requirements: { workType: "navier_stokes", count: 25 } },

      // Streak Achievements
      { id: "daily_streak_7", name: "Week Warrior", description: "Mine discoveries for 7 consecutive days", icon: "🔥", rarity: "common", xpReward: 300, category: "streak", requirements: { dailyStreak: 7 } },
      { id: "daily_streak_30", name: "Month Master", description: "Mine discoveries for 30 consecutive days", icon: "🌟", rarity: "epic", xpReward: 1000, category: "streak", requirements: { dailyStreak: 30 } },

      // Milestone Achievements
      { id: "level_5", name: "Rising Star", description: "Reach Level 5", icon: "⭐", rarity: "common", xpReward: 250, category: "milestone", requirements: { level: 5 } },
      { id: "level_10", name: "Mathematical Master", description: "Reach Level 10", icon: "🎓", rarity: "rare", xpReward: 750, category: "milestone", requirements: { level: 10 } },
      { id: "level_15", name: "Breakthrough Achiever", description: "Reach Level 15", icon: "🚀", rarity: "epic", xpReward: 2000, category: "milestone", requirements: { level: 15 } },
      { id: "level_20", name: "Infinity Reached", description: "Reach the maximum Level 20", icon: "∞", rarity: "legendary", xpReward: 5000, category: "milestone", requirements: { level: 20 } }
    ];

    for (const achievement of achievementData) {
      await db.insert(achievements).values({
        achievementId: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity,
        xpReward: achievement.xpReward,
        category: achievement.category,
        requirements: achievement.requirements,
        isActive: true
      });
    }

    console.log("🏆 ACHIEVEMENTS: Setup 21 achievements across 5 categories");
  }

  async createOrUpdateMiner(minerId: string, nickname?: string): Promise<MathMiner> {
    // Check if miner already exists
    const existingMiner = await db.select().from(mathMiners).where(eq(mathMiners.minerId, minerId)).limit(1);
    
    if (existingMiner.length > 0) {
      // Update last active time
      const [updatedMiner] = await db
        .update(mathMiners)
        .set({ lastActiveAt: new Date() })
        .where(eq(mathMiners.minerId, minerId))
        .returning();
      return updatedMiner;
    }

    // Create new miner
    const [newMiner] = await db.insert(mathMiners).values({
      minerId,
      nickname: nickname || `Miner-${minerId.slice(-6)}`,
      level: 1,
      experience: 0,
      totalDiscoveries: 0,
      totalScientificValue: '0',
      rank: 'Apprentice',
      avatar: '⚡',
      title: 'Math Explorer'
    }).returning();

    console.log(`🎮 NEW MINER: Created ${newMiner.nickname} (${minerId})`);
    return newMiner;
  }

  async awardExperience(minerId: string, xp: number, source: string): Promise<{ levelUp: boolean; newLevel?: number; unlockedAchievements: Achievement[] }> {
    const miner = await this.createOrUpdateMiner(minerId);
    const newExperience = miner.experience + xp;
    
    // Check for level up
    const currentLevelData = await db.select().from(levelProgression).where(eq(levelProgression.level, miner.level)).limit(1);
    const nextLevelData = await db.select().from(levelProgression).where(eq(levelProgression.level, miner.level + 1)).limit(1);
    
    let levelUp = false;
    let newLevel = miner.level;
    
    if (nextLevelData.length > 0 && newExperience >= nextLevelData[0].xpRequired) {
      levelUp = true;
      newLevel = miner.level + 1;
      const levelData = nextLevelData[0];
      
      await db.update(mathMiners).set({
        experience: newExperience,
        level: newLevel,
        rank: levelData.rank,
        title: levelData.title
      }).where(eq(mathMiners.minerId, minerId));
      
      console.log(`🎉 LEVEL UP: ${miner.nickname} reached Level ${newLevel} (${levelData.title})`);
    } else {
      await db.update(mathMiners).set({
        experience: newExperience
      }).where(eq(mathMiners.minerId, minerId));
    }

    // Check for achievement unlocks
    const unlockedAchievements = await this.checkAchievements(minerId);
    
    console.log(`⭐ XP AWARDED: ${xp} XP to ${miner.nickname} for ${source}`);
    
    return { levelUp, newLevel: levelUp ? newLevel : undefined, unlockedAchievements };
  }

  async checkAchievements(minerId: string): Promise<Achievement[]> {
    const miner = await db.select().from(mathMiners).where(eq(mathMiners.minerId, minerId)).limit(1);
    if (miner.length === 0) return [];

    const minerData = miner[0];
    const unlockedAchievements: Achievement[] = [];

    // Get all achievements not yet unlocked by this miner
    const existingAchievements = await db.select({ achievementId: minerAchievements.achievementId })
      .from(minerAchievements)
      .where(eq(minerAchievements.minerId, minerId));
    
    const unlockedIds = existingAchievements.map(a => a.achievementId);
    
    const availableAchievements = await db.select()
      .from(achievements)
      .where(and(
        eq(achievements.isActive, true),
        sql`${achievements.achievementId} NOT IN (${unlockedIds.length > 0 ? unlockedIds.join("','") : "''"}')`
      ));

    for (const achievement of availableAchievements) {
      const requirements = achievement.requirements as any;
      let qualifies = false;

      switch (achievement.category) {
        case 'discovery':
          if (requirements.discoveries && minerData.totalDiscoveries >= requirements.discoveries) {
            qualifies = true;
          }
          if (requirements.workType && requirements.count) {
            // This would require checking specific work type counts - implement if needed
          }
          break;
        
        case 'milestone':
          if (requirements.level && minerData.level >= requirements.level) {
            qualifies = true;
          }
          break;
          
        // Add other achievement categories as needed
      }

      if (qualifies) {
        await db.insert(minerAchievements).values({
          minerId: minerId,
          achievementId: achievement.achievementId,
          progress: null
        });
        
        // Award XP for achievement
        await this.awardExperience(minerId, achievement.xpReward, `Achievement: ${achievement.name}`);
        
        unlockedAchievements.push(achievement);
        console.log(`🏆 ACHIEVEMENT: ${minerData.nickname} unlocked "${achievement.name}"`);
      }
    }

    return unlockedAchievements;
  }

  async updateMinerStats(minerId: string, discoveries: number, scientificValue: number) {
    await db.update(mathMiners).set({
      totalDiscoveries: discoveries,
      totalScientificValue: scientificValue.toString(),
      lastActiveAt: new Date()
    }).where(eq(mathMiners.minerId, minerId));
  }

  async getMinerProfile(minerId: string): Promise<MathMiner | null> {
    const miners = await db.select().from(mathMiners).where(eq(mathMiners.minerId, minerId)).limit(1);
    return miners.length > 0 ? miners[0] : null;
  }

  async getLeaderboard(limit: number = 50) {
    return await db.select().from(mathMiners)
      .orderBy(desc(mathMiners.level), desc(mathMiners.experience))
      .limit(limit);
  }

  async getMinerAchievements(minerId: string) {
    return await db.select({
      achievement: achievements,
      unlockedAt: minerAchievements.unlockedAt,
      progress: minerAchievements.progress
    })
    .from(minerAchievements)
    .innerJoin(achievements, eq(achievements.achievementId, minerAchievements.achievementId))
    .where(eq(minerAchievements.minerId, minerId))
    .orderBy(desc(minerAchievements.unlockedAt));
  }

  async getProgressToNextLevel(minerId: string) {
    const miner = await this.getMinerProfile(minerId);
    if (!miner) return null;

    const nextLevel = await db.select().from(levelProgression)
      .where(eq(levelProgression.level, miner.level + 1))
      .limit(1);

    if (nextLevel.length === 0) {
      return { isMaxLevel: true, progress: 100 };
    }

    const currentLevelXp = await db.select().from(levelProgression)
      .where(eq(levelProgression.level, miner.level))
      .limit(1);

    const currentXp = currentLevelXp.length > 0 ? currentLevelXp[0].xpRequired : 0;
    const nextXp = nextLevel[0].xpRequired;
    const progress = Math.min(100, ((miner.experience - currentXp) / (nextXp - currentXp)) * 100);

    return {
      isMaxLevel: false,
      progress,
      currentXp: miner.experience,
      nextLevelXp: nextXp,
      xpNeeded: nextXp - miner.experience,
      nextLevel: nextLevel[0]
    };
  }
}

export const mathMinerEngine = new MathMinerEngine();