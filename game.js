"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const pauseScreen = document.getElementById("pauseScreen");
const resultScreen = document.getElementById("resultScreen");
const shopScreen = document.getElementById("shopScreen");
const rankScreen = document.getElementById("rankScreen");
const toast = document.getElementById("toast");

const scoreText = document.getElementById("scoreText");
const timeText = document.getElementById("timeText");
const bucketText = document.getElementById("bucketText");
const comboText = document.getElementById("comboText");
const durabilityBar = document.getElementById("durabilityBar");
const durabilityText = document.getElementById("durabilityText");
const durabilityWrap = document.querySelector(".durability-wrap");
const coinTotal = document.getElementById("coinTotal");
const menuLevelText = document.getElementById("menuLevelText");
const levelText = document.getElementById("levelText");
const taskStateText = document.getElementById("taskStateText");
const taskList = document.getElementById("taskList");
const equippedNetText = document.getElementById("equippedNetText");
const shopCoinText = document.getElementById("shopCoinText");
const netList = document.getElementById("netList");
const playerNameText = document.getElementById("playerNameText");
const rankList = document.getElementById("rankList");
const rankStatusText = document.getElementById("rankStatusText");

const finalScore = document.getElementById("finalScore");
const finalCount = document.getElementById("finalCount");
const finalCombo = document.getElementById("finalCombo");
const finalCoins = document.getElementById("finalCoins");
const finalLevel = document.getElementById("finalLevel");
const finalTask = document.getElementById("finalTask");
const resultTitle = document.getElementById("resultTitle");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const W = canvas.width;
const H = canvas.height;
const NET_RADIUS = 110;
const PERFECT_RADIUS = NET_RADIUS * 0.6;
const GAME_DURATION = 60;
const NET_ESCAPE_IDLE_SPEED = 70;
const NET_ESCAPE_SNEAK_SPEED = 180;
const NET_ESCAPE_FAST_SPEED = 620;
const NET_ESCAPE_TAIL_SPEED = 260;
const SCORE_COIN_RATE = 0.04;
const CLEAR_COIN_BASE = 20;
const CLEAR_COIN_STEP = 4;
const ECONOMY_VERSION = "2";
const LEGACY_COIN_SCALE = 0.18;

const NET_DAMAGE_HOLES = [
  { x: -48, y: -24, rx: 15, ry: 8, stage: 75 },
  { x: 42, y: 26, rx: 18, ry: 10, stage: 65 },
  { x: -10, y: 38, rx: 22, ry: 12, stage: 55 },
  { x: 54, y: -30, rx: 25, ry: 14, stage: 45 },
  { x: -62, y: 24, rx: 27, ry: 15, stage: 35 },
  { x: 4, y: -10, rx: 38, ry: 21, stage: 25 },
  { x: -22, y: -44, rx: 30, ry: 16, stage: 18 },
];

const NET_DAMAGE_CRACKS = [
  { stage: 82, points: [[-52, -58], [-36, -34], [-45, -10]] },
  { stage: 72, points: [[35, -62], [18, -35], [28, -10], [8, 8]] },
  { stage: 62, points: [[-80, 8], [-48, 16], [-28, 34]] },
  { stage: 52, points: [[70, 8], [38, 18], [22, 45]] },
  { stage: 42, points: [[-8, -70], [-4, -36], [-20, -2], [-10, 28]] },
  { stage: 32, points: [[-88, -36], [-54, -24], [-26, -30], [-2, -18]] },
  { stage: 22, points: [[86, -42], [52, -20], [26, 10], [2, 44]] },
  { stage: 14, points: [[-54, 62], [-20, 40], [20, 48], [58, 24]] },
];

const fishTypes = [
  { id: "goldfish", name: "小金鱼", color: "#ffd166", accent: "#ef476f", cruiseSpeed: 54, escapeSpeed: 150, alertRadius: 100, alertAngle: 90, durabilityCost: 5, score: 10, size: 38, weight: 9, shape: "round", pattern: "spots" },
  { id: "koi", name: "锦鲤", color: "#fff3b0", accent: "#f3722c", cruiseSpeed: 82, escapeSpeed: 225, alertRadius: 150, alertAngle: 120, durabilityCost: 15, score: 50, size: 72, weight: 5, shape: "long", pattern: "patches" },
  { id: "tropical", name: "热带鱼", color: "#64dfdf", accent: "#ffb703", cruiseSpeed: 150, escapeSpeed: 355, alertRadius: 185, alertAngle: 120, durabilityCost: 20, score: 80, size: 54, weight: 4, shape: "thin", pattern: "stripes" },
  { id: "bigkoi", name: "大锦鲤", color: "#f7ede2", accent: "#d00000", cruiseSpeed: 46, escapeSpeed: 135, alertRadius: 190, alertAngle: 120, durabilityCost: 40, score: 200, size: 124, weight: 2, shape: "large", pattern: "patches" },
  { id: "medaka", name: "青鳉", color: "#caffbf", accent: "#2d6a4f", cruiseSpeed: 118, escapeSpeed: 275, alertRadius: 135, alertAngle: 105, durabilityCost: 8, score: 24, size: 42, weight: 7, shape: "thin", pattern: "stripe" },
  { id: "guppy", name: "孔雀鱼", color: "#ffadad", accent: "#9d4edd", cruiseSpeed: 132, escapeSpeed: 310, alertRadius: 150, alertAngle: 110, durabilityCost: 10, score: 35, size: 46, weight: 6, shape: "fan", pattern: "tail" },
  { id: "betta", name: "斗鱼", color: "#bdb2ff", accent: "#f72585", cruiseSpeed: 92, escapeSpeed: 245, alertRadius: 160, alertAngle: 120, durabilityCost: 14, score: 55, size: 60, weight: 5, shape: "fan", pattern: "fins" },
  { id: "angelfish", name: "神仙鱼", color: "#f8edeb", accent: "#111827", cruiseSpeed: 86, escapeSpeed: 220, alertRadius: 170, alertAngle: 130, durabilityCost: 16, score: 70, size: 66, weight: 4, shape: "tall", pattern: "stripes" },
  { id: "clownfish", name: "小丑鱼", color: "#ff7b00", accent: "#ffffff", cruiseSpeed: 116, escapeSpeed: 285, alertRadius: 165, alertAngle: 120, durabilityCost: 18, score: 85, size: 58, weight: 4, shape: "round", pattern: "bands" },
  { id: "zebrafish", name: "斑马鱼", color: "#e0fbfc", accent: "#293241", cruiseSpeed: 160, escapeSpeed: 380, alertRadius: 175, alertAngle: 125, durabilityCost: 18, score: 95, size: 52, weight: 4, shape: "thin", pattern: "stripes" },
  { id: "bluegill", name: "蓝鳃鱼", color: "#90e0ef", accent: "#0077b6", cruiseSpeed: 96, escapeSpeed: 245, alertRadius: 155, alertAngle: 115, durabilityCost: 22, score: 120, size: 76, weight: 3, shape: "round", pattern: "gill" },
  { id: "puffer", name: "河豚", color: "#ffd6a5", accent: "#6c584c", cruiseSpeed: 58, escapeSpeed: 155, alertRadius: 135, alertAngle: 110, durabilityCost: 32, score: 160, size: 78, weight: 3, shape: "round", pattern: "spots" },
  { id: "eel", name: "小鳗鱼", color: "#8d99ae", accent: "#2b2d42", cruiseSpeed: 142, escapeSpeed: 340, alertRadius: 175, alertAngle: 130, durabilityCost: 20, score: 140, size: 84, weight: 3, shape: "eel", pattern: "stripe" },
  { id: "catfish", name: "鲶鱼", color: "#b08968", accent: "#432818", cruiseSpeed: 70, escapeSpeed: 190, alertRadius: 150, alertAngle: 110, durabilityCost: 28, score: 170, size: 88, weight: 3, shape: "long", pattern: "whisker" },
  { id: "carp", name: "草鱼", color: "#a7c957", accent: "#386641", cruiseSpeed: 74, escapeSpeed: 200, alertRadius: 165, alertAngle: 115, durabilityCost: 30, score: 180, size: 96, weight: 3, shape: "large", pattern: "stripe" },
  { id: "silver", name: "银鳞鱼", color: "#f1faee", accent: "#adb5bd", cruiseSpeed: 128, escapeSpeed: 310, alertRadius: 180, alertAngle: 125, durabilityCost: 24, score: 210, size: 70, weight: 2, shape: "long", pattern: "shine" },
  { id: "ruby", name: "红宝鱼", color: "#ef233c", accent: "#ffccd5", cruiseSpeed: 108, escapeSpeed: 275, alertRadius: 170, alertAngle: 120, durabilityCost: 26, score: 240, size: 68, weight: 2, shape: "round", pattern: "shine" },
  { id: "emerald", name: "翡翠鱼", color: "#52b788", accent: "#d8f3dc", cruiseSpeed: 122, escapeSpeed: 295, alertRadius: 175, alertAngle: 125, durabilityCost: 28, score: 260, size: 66, weight: 2, shape: "thin", pattern: "bands" },
  { id: "lantern", name: "灯笼鱼", color: "#023e8a", accent: "#ffd60a", cruiseSpeed: 92, escapeSpeed: 235, alertRadius: 180, alertAngle: 130, durabilityCost: 30, score: 300, size: 72, weight: 2, shape: "round", pattern: "glow" },
  { id: "butterfly", name: "蝴蝶鱼", color: "#ffe45e", accent: "#7209b7", cruiseSpeed: 136, escapeSpeed: 320, alertRadius: 185, alertAngle: 130, durabilityCost: 30, score: 330, size: 64, weight: 2, shape: "tall", pattern: "bands" },
  { id: "dragon", name: "金龙鱼", color: "#ffb703", accent: "#fb8500", cruiseSpeed: 100, escapeSpeed: 285, alertRadius: 210, alertAngle: 150, durabilityCost: 60, score: 500, size: 118, weight: 1, shape: "long", pattern: "shine" },
  { id: "moon", name: "月光鱼", color: "#e0aaff", accent: "#5a189a", cruiseSpeed: 112, escapeSpeed: 280, alertRadius: 190, alertAngle: 130, durabilityCost: 34, score: 360, size: 74, weight: 2, shape: "fan", pattern: "glow" },
  { id: "tiger", name: "虎纹鱼", color: "#f4a261", accent: "#1d3557", cruiseSpeed: 138, escapeSpeed: 335, alertRadius: 195, alertAngle: 135, durabilityCost: 36, score: 390, size: 78, weight: 2, shape: "long", pattern: "stripes" },
  { id: "crystal", name: "水晶鱼", color: "#caf0f8", accent: "#ffffff", cruiseSpeed: 126, escapeSpeed: 315, alertRadius: 200, alertAngle: 140, durabilityCost: 38, score: 420, size: 72, weight: 1, shape: "thin", pattern: "shine" },
  { id: "rainbow", name: "彩虹鱼", color: "#ffafcc", accent: "#80ffdb", cruiseSpeed: 152, escapeSpeed: 365, alertRadius: 205, alertAngle: 145, durabilityCost: 42, score: 460, size: 76, weight: 1, shape: "fan", pattern: "bands" },
];

const mechanicCatalog = [
  { id: "none", name: "标准鱼池", desc: "完成捕捉目标。" },
  { id: "crab", name: "螃蟹巡逻", desc: "螃蟹入网会夹破纸网。", maxCrabs: 1 },
  { id: "weed", name: "水草缠网", desc: "拖过水草会额外磨损纸网。", weedCount: 3 },
  { id: "shell", name: "贝壳奖励", desc: "松手捞起贝壳可获得金币或耐久。", shellCount: 4 },
  { id: "current", name: "水流推动", desc: "水流会轻推鱼群和纸网。", currentX: 38 },
  { id: "time", name: "限时挑战", desc: "时间更短，动作要更果断。", durationMod: -10 },
  { id: "fragile", name: "脆纸水域", desc: "拖动和捕捉会额外损耗耐久。", durabilityMultiplier: 1.18 },
  { id: "school", name: "鱼群密集", desc: "鱼更多，适合一网多鱼。", fishBonus: 5 },
  { id: "calm", name: "静水潜行", desc: "慢速移动更不容易惊鱼。", escapeMultiplier: 0.78 },
  { id: "sensitive", name: "敏感鱼群", desc: "鱼更警觉，快速靠近更危险。", escapeMultiplier: 1.24 },
  { id: "perfect", name: "精准捕捞", desc: "需要达成 Perfect 次数。", perfectGoal: 2 },
  { id: "combo", name: "连捞挑战", desc: "需要达成指定连击。", comboGoal: 3 },
  { id: "big", name: "大鱼任务", desc: "目标更偏向高损耗大鱼。", bigFishBias: 2 },
  { id: "night", name: "夜池", desc: "水面变暗，观察难度提高。", darkness: 0.22 },
  { id: "rush", name: "急流乱游", desc: "鱼速提升，巡游更快。", fishSpeedMultiplier: 1.18 },
  { id: "heavy", name: "重鱼池", desc: "目标鱼更耗纸网。", catchCostMultiplier: 1.15 },
  { id: "bonus", name: "金币鱼潮", desc: "分数更高，但目标数量更多。", scoreMultiplier: 1.2, taskBonus: 2 },
  { id: "double", name: "双目标", desc: "任务会要求更多鱼种。", extraTaskTypes: 1 },
  { id: "master", name: "达人考验", desc: "鱼更多、更警觉、螃蟹更多。", maxCrabs: 2, fishBonus: 4, escapeMultiplier: 1.15 },
];

const encounterCycle = [
  { id: "crab", label: "螃蟹", desc: "螃蟹巡逻", maxCrabs: 1 },
  { id: "shell", label: "贝壳", desc: "贝壳奖励", shellCount: 3 },
  { id: "weed", label: "水草", desc: "水草缠网", weedCount: 2 },
  { id: "school", label: "鱼群", desc: "鱼群聚集", fishBonus: 3 },
];

const fishTypeById = Object.fromEntries(fishTypes.map((type) => [type.id, type]));
Object.assign(fishTypeById.tropical, { dashInterval: 2.8, dashDuration: 0.45, dashMultiplier: 1.45 });
Object.assign(fishTypeById.zebrafish, { dashInterval: 2.2, dashDuration: 0.5, dashMultiplier: 1.7, escapeSensitivity: 1.12 });
Object.assign(fishTypeById.eel, { dashInterval: 3.2, dashDuration: 0.7, dashMultiplier: 1.55 });
Object.assign(fishTypeById.rainbow, { dashInterval: 2.6, dashDuration: 0.55, dashMultiplier: 1.65, bonusCoinAmount: 18 });
Object.assign(fishTypeById.puffer, { costMultiplier: 1.35, escapeSensitivity: 0.72 });
Object.assign(fishTypeById.bigkoi, { costMultiplier: 1.18, escapeSensitivity: 0.82 });
Object.assign(fishTypeById.carp, { costMultiplier: 1.2, escapeSensitivity: 0.86 });
Object.assign(fishTypeById.silver, { bonusCoinAmount: 10 });
Object.assign(fishTypeById.ruby, { bonusCoinAmount: 14 });
Object.assign(fishTypeById.lantern, { repairAmount: 5 });
Object.assign(fishTypeById.moon, { repairAmount: 6 });
Object.assign(fishTypeById.crystal, { repairAmount: 8, escapeSensitivity: 1.08 });
Object.assign(fishTypeById.dragon, { costMultiplier: 1.28, bonusCoinAmount: 26, escapeSensitivity: 1.22 });

function effectiveCatchCost(type) {
  return type.durabilityCost * (type.costMultiplier || 1);
}

function mechanicDurabilityMultiplier(mechanic) {
  return mechanic.catchCostMultiplier || mechanic.durabilityMultiplier || 1;
}

function levelTaskDurabilityBudget(levelNumber, mechanic) {
  let budget = clamp(74 + levelNumber * 1.15, 76, 124);
  if (mechanic.durabilityMultiplier) budget -= 6;
  if (mechanic.catchCostMultiplier) budget -= 5;
  if (mechanic.weedCount) budget -= 5;
  if (mechanic.maxCrabs) budget -= 4;
  if (mechanic.perfectGoal || mechanic.comboGoal) budget -= 4;
  return Math.max(58, budget);
}

function difficultyForLevel(levelNumber) {
  if (levelNumber <= 5) {
    return {
      tier: 0,
      taskBonus: 0,
      extraTaskTypes: 0,
      fishSpeedMultiplier: 1,
      escapeMultiplier: 1,
      durationMod: 0,
      fishBonus: 0,
      maxCrabsBonus: 0,
      weedBonus: 0,
      shellBonus: 0,
      perfectGoalBonus: 0,
      comboGoalBonus: 0,
    };
  }

  const tier = Math.min(5, Math.floor((levelNumber - 6) / 9) + 1);
  return {
    tier,
    taskBonus: tier >= 2 ? 1 : 0,
    extraTaskTypes: tier >= 3 ? 1 : 0,
    fishSpeedMultiplier: 1 + tier * 0.035,
    escapeMultiplier: 1 + tier * 0.04,
    durationMod: -Math.min(8, tier * 2),
    fishBonus: Math.min(5, tier),
    maxCrabsBonus: tier >= 4 ? 1 : 0,
    weedBonus: tier >= 3 ? 1 : 0,
    shellBonus: tier >= 2 ? 1 : 0,
    perfectGoalBonus: tier >= 4 ? 1 : 0,
    comboGoalBonus: tier >= 4 ? 1 : 0,
  };
}

function taskDurabilityRequirement(task, mechanic) {
  const multiplier = mechanicDurabilityMultiplier(mechanic);
  return Object.entries(task).reduce((sum, [fishId, count]) => {
    const type = fishTypeById[fishId];
    return type ? sum + effectiveCatchCost(type) * count * multiplier : sum;
  }, 0);
}

function maxTargetCountByWeight(type) {
  if (type.weight <= 1) return 2;
  if (type.weight <= 2) return 3;
  if (type.weight <= 3) return 4;
  return 8;
}

function minTargetCount(fishId, newestId) {
  if (fishId !== newestId) return 0;
  const type = fishTypeById[fishId];
  return type && effectiveCatchCost(type) >= 28 ? 1 : 2;
}

function balanceTaskForDurability(task, mechanic, levelNumber, newestId) {
  for (const [fishId, count] of Object.entries(task)) {
    const type = fishTypeById[fishId];
    if (!type) {
      delete task[fishId];
      continue;
    }
    task[fishId] = Math.min(count, maxTargetCountByWeight(type));
  }

  const budget = levelTaskDurabilityBudget(levelNumber, mechanic);
  while (taskDurabilityRequirement(task, mechanic) > budget) {
    const reducible = Object.keys(task)
      .filter((fishId) => task[fishId] > minTargetCount(fishId, newestId))
      .sort((a, b) => effectiveCatchCost(fishTypeById[b]) - effectiveCatchCost(fishTypeById[a]))[0];

    if (reducible) {
      task[reducible] -= 1;
      if (task[reducible] <= 0) delete task[reducible];
      continue;
    }

    const removable = Object.keys(task)
      .filter((fishId) => fishId !== newestId)
      .sort((a, b) => effectiveCatchCost(fishTypeById[b]) - effectiveCatchCost(fishTypeById[a]))[0];

    if (!removable) break;
    delete task[removable];
  }
}

function mergeEncounter(mechanic, encounter) {
  const merged = { ...mechanic };
  const tags = new Set(merged.encounterTags || []);
  tags.add(encounter.label);

  if (encounter.maxCrabs) merged.maxCrabs = Math.max(merged.maxCrabs || 0, encounter.maxCrabs);
  if (encounter.shellCount) merged.shellCount = Math.max(merged.shellCount || 0, encounter.shellCount);
  if (encounter.weedCount) merged.weedCount = Math.max(merged.weedCount || 0, encounter.weedCount);
  if (encounter.fishBonus) merged.fishBonus = (merged.fishBonus || 0) + encounter.fishBonus;

  merged.encounterTags = [...tags];
  return merged;
}

function buildLevelMechanic(baseMechanic, levelNumber) {
  let mechanic = { ...baseMechanic };
  const blockIndex = Math.floor((levelNumber - 1) / 3);
  const difficulty = difficultyForLevel(levelNumber);

  if (levelNumber >= 3) {
    const encounter = encounterCycle[(blockIndex - 1 + encounterCycle.length) % encounterCycle.length];
    if (encounter.id !== mechanic.id) mechanic = mergeEncounter(mechanic, encounter);
  }

  if (difficulty.tier > 0) {
    mechanic.fishSpeedMultiplier = (mechanic.fishSpeedMultiplier || 1) * difficulty.fishSpeedMultiplier;
    mechanic.escapeMultiplier = (mechanic.escapeMultiplier || 1) * difficulty.escapeMultiplier;
    mechanic.durationMod = (mechanic.durationMod || 0) + difficulty.durationMod;
    mechanic.fishBonus = (mechanic.fishBonus || 0) + difficulty.fishBonus;
    mechanic.taskBonus = (mechanic.taskBonus || 0) + difficulty.taskBonus;
    mechanic.extraTaskTypes = (mechanic.extraTaskTypes || 0) + difficulty.extraTaskTypes;
    if (mechanic.maxCrabs) mechanic.maxCrabs += difficulty.maxCrabsBonus;
    if (mechanic.weedCount) mechanic.weedCount += difficulty.weedBonus;
    if (mechanic.shellCount) mechanic.shellCount += difficulty.shellBonus;
    if (mechanic.perfectGoal) mechanic.perfectGoal += difficulty.perfectGoalBonus;
    if (mechanic.comboGoal) mechanic.comboGoal += difficulty.comboGoalBonus;
    mechanic.difficultyTier = difficulty.tier;
  }

  const tags = mechanic.encounterTags || [];
  if (tags.length > 0) {
    mechanic.name = `${mechanic.name} · ${tags.join("+")}`;
    mechanic.desc = `${mechanic.desc} 本关还有${tags.join("、")}。`;
  }

  return mechanic;
}

function createLevelConfigs() {
  const chapterNames = ["夜市小摊", "庙会鱼池", "锦鲤池塘", "海洋触摸池", "金鳞挑战"];
  const configs = [];

  for (let i = 1; i <= 50; i += 1) {
    const chapter = Math.ceil(i / 10);
    const step = ((i - 1) % 10) + 1;
    const mechanicIndex = i < 3 ? 0 : Math.floor((i - 3) / 3) + 1;
    const mechanic = buildLevelMechanic(mechanicCatalog[Math.min(mechanicIndex, mechanicCatalog.length - 1)], i);
    const unlockedCount = Math.min(fishTypes.length, Math.floor((i - 1) / 2) + 1);
    const availableTypes = fishTypes.slice(Math.max(0, unlockedCount - 4), unlockedCount);
    const newest = availableTypes[availableTypes.length - 1];
    const second = availableTypes[Math.max(0, availableTypes.length - 2)];
    const third = availableTypes[Math.max(0, availableTypes.length - 3)];
    const fourth = availableTypes[Math.max(0, availableTypes.length - 4)];
    const difficulty = difficultyForLevel(i);
    const taskTypeCount = Math.min(availableTypes.length, 1 + Math.floor(i / 10) + (mechanic.extraTaskTypes || 0), 4);
    const baseNewestTarget = i <= 5 ? 3 : 3 + Math.floor((i - 1) / 9);
    const task = {};

    task[newest.id] = Math.min(8, baseNewestTarget + (mechanic.taskBonus || 0));
    if (taskTypeCount >= 2 && second.id !== newest.id) task[second.id] = Math.min(6, 1 + Math.floor(i / 14) + (difficulty.tier >= 3 ? 1 : 0));
    if (taskTypeCount >= 3 && third.id !== newest.id && third.id !== second.id) task[third.id] = Math.min(5, 1 + Math.floor(i / 22));
    if (taskTypeCount >= 4 && fourth.id !== newest.id && fourth.id !== second.id && fourth.id !== third.id) task[fourth.id] = Math.min(4, 1 + Math.floor(i / 30));
    balanceTaskForDurability(task, mechanic, i, newest.id);

    const fishWeights = {};
    for (const type of availableTypes) {
      const age = availableTypes.length - 1 - availableTypes.indexOf(type);
      const baseWeight = Math.max(1, 9 - age);
      fishWeights[type.id] = baseWeight + (task[type.id] ? 6 : 0);
      if (mechanic.bigFishBias && type.size >= 88) fishWeights[type.id] += mechanic.bigFishBias;
    }

    configs.push({
      id: `${chapter}-${step}`,
      name: `${chapterNames[chapter - 1]} · ${mechanic.name}`,
      mechanic,
      duration: Math.max(42, 62 + (mechanic.durationMod || 0)),
      initialFish: Math.min(34, Math.max(Object.values(task).reduce((sum, count) => sum + count, 0) + 6, 17 + Math.floor(i / 4) + (mechanic.fishBonus || 0))),
      minFish: Math.min(30, Math.max(Object.values(task).reduce((sum, count) => sum + count, 0), 15 + Math.floor(i / 6) + Math.floor((mechanic.fishBonus || 0) / 2))),
      activeFishIds: availableTypes.map((type) => type.id),
      task,
      fishWeights,
      maxCrabs: mechanic.maxCrabs || 0,
    });
  }

  return configs;
}

const levelConfigs = createLevelConfigs();

const savedLevelIndex = Number(localStorage.getItem("fishMasterLevel") || 0);
const savedClearCount = Number(localStorage.getItem("fishMasterClears") ?? localStorage.getItem("fishMasterLevel") ?? 0);
const savedCoins = migrateSavedCoins(Number(localStorage.getItem("fishMasterCoins") || 0));
let playerName = localStorage.getItem("fishMasterPlayerName") || "";
const leaderboardConfig = window.LAODAREN_LEADERBOARD || {};
const playerId = getOrCreatePlayerId();

const netConfigs = [
  {
    id: "paper",
    name: "普通纸网",
    price: 0,
    maxDurability: 100,
    desc: "基础纸网，适合练习。",
    frame: "#7e582f",
    rim: "#ffffff",
    paper: "255,255,255",
    accent: "#ffe66d",
    attr: "无特殊属性",
  },
  {
    id: "sakura",
    name: "樱花纸网",
    price: 1800,
    unlockClears: 1,
    maxDurability: 120,
    desc: "通关 1 次后可购买。",
    frame: "#9d4edd",
    rim: "#ffafcc",
    paper: "255,214,232",
    accent: "#ffafcc",
    attr: "捕到鱼 12% 概率额外 +5 金币",
    bonusCoinChance: 0.12,
    bonusCoinAmount: 5,
  },
  {
    id: "wave",
    name: "海浪纸网",
    price: 4200,
    unlockClears: 5,
    maxDurability: 140,
    desc: "通关 5 次后可购买。",
    frame: "#0077b6",
    rim: "#90e0ef",
    paper: "202,240,248",
    accent: "#48cae4",
    attr: "捕到鱼 18% 概率恢复 6 耐久，拖动损耗 -10%",
    repairChance: 0.18,
    repairAmount: 6,
    dragCostMultiplier: 0.9,
  },
  {
    id: "gold",
    name: "金鳞纸网",
    price: 7600,
    unlockClears: 10,
    maxDurability: 180,
    desc: "通关 10 次后可购买。",
    frame: "#c99700",
    rim: "#ffd60a",
    paper: "255,236,179",
    accent: "#f77f00",
    attr: "捕到鱼 20% 概率 +12 金币，15% 概率恢复 8 耐久",
    bonusCoinChance: 0.2,
    bonusCoinAmount: 12,
    repairChance: 0.15,
    repairAmount: 8,
  },
];

const netById = Object.fromEntries(netConfigs.map((net) => [net.id, net]));
const ownedNetIds = new Set(JSON.parse(localStorage.getItem("fishMasterOwnedNets") || '["paper"]'));
const savedEquippedNet = localStorage.getItem("fishMasterEquippedNet") || "paper";

const state = {
  mode: "menu",
  levelIndex: Number.isFinite(savedLevelIndex) ? clamp(savedLevelIndex, 0, levelConfigs.length - 1) : 0,
  clearCount: Number.isFinite(savedClearCount) ? clamp(savedClearCount, 0, levelConfigs.length) : 0,
  taskProgress: {},
  taskCompleted: false,
  resultPassed: false,
  perfectCatches: 0,
  equippedNetId: ownedNetIds.has(savedEquippedNet) && netById[savedEquippedNet] ? savedEquippedNet : "paper",
  score: 0,
  coins: savedCoins,
  bonusCoins: 0,
  caught: 0,
  maxCombo: 0,
  combo: 0,
  comboTimer: 0,
  durability: 100,
  maxDurability: 100,
  timeLeft: GAME_DURATION,
  fishes: [],
  crabs: [],
  weeds: [],
  shells: [],
  schoolTimer: 0,
  ripples: [],
  popups: [],
  splashes: [],
  damageFlash: 0,
  damagePulseTimer: 0,
  dragDrainFeedbackTimer: 0,
  weedFeedbackTimer: 0,
  lastTime: performance.now(),
  net: {
    x: W * 0.5,
    y: H * 0.68,
    prevX: W * 0.5,
    prevY: H * 0.68,
    speed: 0,
    active: false,
    visible: false,
    shake: 0,
  },
};

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function chooseWeighted(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[0];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function migrateSavedCoins(rawCoins) {
  const coins = Number.isFinite(rawCoins) ? Math.max(0, rawCoins) : 0;
  if (localStorage.getItem("fishMasterEconomyVersion") === ECONOMY_VERSION) return coins;
  const migratedCoins = Math.floor(coins * LEGACY_COIN_SCALE);
  localStorage.setItem("fishMasterCoins", String(migratedCoins));
  localStorage.setItem("fishMasterEconomyVersion", ECONOMY_VERSION);
  return migratedCoins;
}

function dist(a, b, c, d) {
  const dx = a - c;
  const dy = b - d;
  return Math.hypot(dx, dy);
}

function angleDiff(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

function setScreen(nextMode) {
  state.mode = nextMode;
  menu.classList.toggle("is-active", nextMode === "menu");
  hud.classList.toggle("is-active", nextMode === "playing");
  pauseScreen.classList.toggle("is-active", nextMode === "paused");
  shopScreen.classList.toggle("is-active", nextMode === "shop");
  rankScreen.classList.toggle("is-active", nextMode === "rank");
  resultScreen.classList.toggle("is-active", nextMode === "result");
}

function currentLevel() {
  return levelConfigs[state.levelIndex];
}

function currentNet() {
  return netById[state.equippedNetId] || netConfigs[0];
}

function saveNetState() {
  localStorage.setItem("fishMasterOwnedNets", JSON.stringify([...ownedNetIds]));
  localStorage.setItem("fishMasterEquippedNet", state.equippedNetId);
}

function updateNetLabels() {
  const net = currentNet();
  equippedNetText.textContent = `${net.name} ${net.maxDurability}%`;
  shopCoinText.textContent = `${state.coins} · 通关 ${state.clearCount}`;
}

function renderShop() {
  updateNetLabels();
  netList.innerHTML = netConfigs
    .map((net) => {
      const owned = ownedNetIds.has(net.id);
      const equipped = state.equippedNetId === net.id;
      const unlockClears = net.unlockClears || 0;
      const unlocked = state.clearCount >= unlockClears;
      const affordable = state.coins >= net.price;
      const label = equipped
        ? "已装备"
        : owned
          ? "装备"
          : !unlocked
            ? `通关 ${unlockClears} 次解锁`
            : affordable
              ? `${net.price} 金币购买`
              : `金币不足 ${net.price}`;
      const disabled = equipped || (!owned && (!unlocked || !affordable)) ? "disabled" : "";
      return `
        <article class="net-card${equipped ? " is-equipped" : ""}">
          <div class="net-preview" aria-hidden="true">
            <svg viewBox="0 0 100 78">
              <line x1="63" y1="51" x2="94" y2="74" stroke="${net.frame}" stroke-width="9" stroke-linecap="round" />
              <ellipse cx="42" cy="31" rx="36" ry="25" fill="rgba(${net.paper},0.42)" stroke="${net.rim}" stroke-width="6" />
              <path d="M18 24 L66 39 M23 39 L62 19 M12 31 H72 M42 8 V54" stroke="rgba(255,255,255,0.38)" stroke-width="2" />
              <ellipse cx="42" cy="31" rx="19" ry="13" fill="none" stroke="${net.accent}" stroke-width="3" />
            </svg>
          </div>
          <div class="net-info">
            <h3>${net.name}</h3>
            <p>耐久 ${net.maxDurability}% · 价格 ${net.price} · ${net.desc}<br>${net.attr}</p>
            <button class="net-action" type="button" data-net-id="${net.id}" ${disabled}>${label}</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function handleNetAction(netId) {
  const net = netById[netId];
  if (!net) return;

  if (!ownedNetIds.has(netId)) {
    if (state.clearCount < (net.unlockClears || 0)) {
      showToast(`通关 ${net.unlockClears} 次解锁`);
      return;
    }
    if (state.coins < net.price) {
      showToast("金币不足");
      return;
    }
    state.coins -= net.price;
    ownedNetIds.add(netId);
    localStorage.setItem("fishMasterCoins", String(state.coins));
    showToast(`获得${net.name}`);
  }

  state.equippedNetId = netId;
  saveNetState();
  coinTotal.textContent = String(state.coins);
  renderShop();
}

function resetAllProgress() {
  const confirmed = window.confirm("重新游戏会清空关卡进度、金币和已购买纸网，确定继续？");
  if (!confirmed) return;

  state.levelIndex = 0;
  state.clearCount = 0;
  state.coins = 0;
  state.equippedNetId = "paper";
  ownedNetIds.clear();
  ownedNetIds.add("paper");

  localStorage.setItem("fishMasterLevel", "0");
  localStorage.setItem("fishMasterClears", "0");
  localStorage.setItem("fishMasterCoins", "0");
  localStorage.setItem("fishMasterEconomyVersion", ECONOMY_VERSION);
  saveRankProgress();
  saveNetState();

  coinTotal.textContent = "0";
  updateNetLabels();
  updateMenuLevelText();
  showToast("已重新开始");
}

function ensurePlayerName() {
  if (playerName) return true;
  const input = window.prompt("请输入排行榜名称", "捞鱼新人");
  const name = (input || "").trim().slice(0, 10);
  if (!name) return false;
  playerName = name;
  localStorage.setItem("fishMasterPlayerName", playerName);
  return true;
}

function getOrCreatePlayerId() {
  const storageKey = "fishMasterPlayerId";
  const saved = localStorage.getItem(storageKey);
  if (saved) return saved;
  const id = globalThis.crypto?.randomUUID ? crypto.randomUUID() : `player-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(storageKey, id);
  return id;
}

function isOnlineRankEnabled() {
  return leaderboardConfig.provider === "supabase" && leaderboardConfig.supabaseUrl && leaderboardConfig.supabaseAnonKey;
}

function localRankEntry() {
  try {
    return JSON.parse(localStorage.getItem("fishMasterRankEntry") || "null");
  } catch {
    return null;
  }
}

function currentRankEntry() {
  return {
    playerId,
    name: playerName || "未命名",
    clears: state.clearCount,
    levelIndex: state.levelIndex,
    score: Math.round(state.score || 0),
  };
}

function saveLocalRankEntry(entry) {
  localStorage.setItem("fishMasterRankEntry", JSON.stringify(entry));
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: leaderboardConfig.supabaseAnonKey,
    Authorization: `Bearer ${leaderboardConfig.supabaseAnonKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function supabaseUrl(path) {
  return `${leaderboardConfig.supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`;
}

async function syncOnlineRank(entry) {
  if (!isOnlineRankEnabled()) return false;
  const payload = {
    player_id: entry.playerId,
    name: entry.name,
    clears: entry.clears,
    level_index: entry.levelIndex,
    score: entry.score,
    updated_at: new Date().toISOString(),
  };
  const response = await fetch(supabaseUrl("fish_master_leaderboard?on_conflict=player_id"), {
    method: "POST",
    headers: supabaseHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`leaderboard sync failed: ${response.status}`);
  return true;
}

async function fetchOnlineRank() {
  if (!isOnlineRankEnabled()) return null;
  const query = "fish_master_leaderboard?select=player_id,name,clears,level_index,score,updated_at&order=clears.desc,score.desc,updated_at.asc&limit=20";
  const response = await fetch(supabaseUrl(query), {
    method: "GET",
    headers: supabaseHeaders(),
  });
  if (!response.ok) throw new Error(`leaderboard fetch failed: ${response.status}`);
  return response.json();
}

function normalizeRankEntry(entry) {
  return {
    playerId: entry.player_id || entry.playerId || entry.name || "",
    name: String(entry.name || "未命名").slice(0, 10),
    clears: clamp(Number(entry.clears) || 0, 0, levelConfigs.length),
    levelIndex: clamp(Number(entry.level_index ?? entry.levelIndex ?? 0) || 0, 0, levelConfigs.length - 1),
    score: Math.max(0, Number(entry.score) || 0),
    isPlayer: (entry.player_id || entry.playerId) === playerId || entry.name === playerName,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setRankStatus(text) {
  rankStatusText.textContent = text;
}

function saveRankProgress() {
  if (!playerName) return;
  const entry = currentRankEntry();
  saveLocalRankEntry(entry);
  syncOnlineRank(entry).catch(() => {
    if (state.mode === "rank") setRankStatus("在线排行榜同步失败，当前显示本机记录");
  });
}

async function renderRank() {
  playerNameText.textContent = playerName || "未命名";
  const playerEntry = currentRankEntry();
  saveLocalRankEntry(playerEntry);

  let statusText = "本机排行榜";
  let rawEntries = [localRankEntry() || playerEntry];
  if (isOnlineRankEnabled()) {
    setRankStatus("正在同步在线排行榜...");
    try {
      await syncOnlineRank(playerEntry);
      rawEntries = await fetchOnlineRank();
      statusText = "在线排行榜";
    } catch {
      statusText = "在线排行榜连接失败，当前显示本机记录";
    }
  } else {
    statusText = "未配置在线排行榜，当前只能显示本机记录";
  }

  const entries = [...rawEntries, playerEntry]
    .filter(Boolean)
    .map(normalizeRankEntry)
    .filter((entry, index, list) => list.findIndex((item) => item.playerId === entry.playerId && item.name === entry.name) === index)
    .sort((a, b) => b.clears - a.clears)
    .slice(0, 20);

  setRankStatus(statusText);

  rankList.innerHTML = entries
    .map((entry, index) => `
      <div class="rank-row${entry.isPlayer ? " is-player" : ""}">
        <span class="rank-no">${index + 1}</span>
        <span class="rank-name">${escapeHtml(entry.name)}</span>
        <span class="rank-progress">通关 ${entry.clears}</span>
      </div>
    `)
    .join("");
}

async function openRank() {
  if (!ensurePlayerName()) return;
  setScreen("rank");
  setRankStatus("正在读取排行榜...");
  saveRankProgress();
  await renderRank();
}

function resetTaskProgress() {
  state.taskProgress = {};
  for (const fishId of Object.keys(currentLevel().task)) {
    state.taskProgress[fishId] = 0;
  }
  state.perfectCatches = 0;
  state.taskCompleted = false;
  state.resultPassed = false;
}

function areTasksComplete() {
  const level = currentLevel();
  const task = level.task;
  const fishComplete = Object.keys(task).every((fishId) => (state.taskProgress[fishId] || 0) >= task[fishId]);
  const perfectComplete = !level.mechanic.perfectGoal || state.perfectCatches >= level.mechanic.perfectGoal;
  const comboComplete = !level.mechanic.comboGoal || state.maxCombo >= level.mechanic.comboGoal;
  return fishComplete && perfectComplete && comboComplete;
}

function taskSummaryText() {
  const level = currentLevel();
  const task = level.task;
  const fishText = Object.keys(task)
    .map((fishId) => {
      const type = fishTypeById[fishId];
      return `${type.name} ${Math.min(state.taskProgress[fishId] || 0, task[fishId])}/${task[fishId]}`;
    })
    .join("  ");
  const extras = [];
  if (level.mechanic.perfectGoal) extras.push(`Perfect ${Math.min(state.perfectCatches, level.mechanic.perfectGoal)}/${level.mechanic.perfectGoal}`);
  if (level.mechanic.comboGoal) extras.push(`连击 ${Math.min(state.maxCombo, level.mechanic.comboGoal)}/${level.mechanic.comboGoal}`);
  return [fishText, ...extras].filter(Boolean).join("  ");
}

function updateMenuLevelText() {
  const level = currentLevel();
  menuLevelText.textContent = `${level.id} ${level.name}：${taskSummaryText()}`;
}

function chooseLevelFishType() {
  const level = currentLevel();
  const activeTypes = level.activeFishIds.map((fishId) => fishTypeById[fishId]).filter(Boolean);
  const weightedTypes = activeTypes
    .map((type) => {
      const baseWeight = level.fishWeights[type.id] ?? type.weight;
      const target = level.task[type.id] || 0;
      const progress = state.taskProgress[type.id] || 0;
      const taskBoost = target > progress ? 18 + (level.mechanic.difficultyTier || 0) * 2 : 0;
      return { ...type, weight: baseWeight + taskBoost };
    })
    .filter((type) => type.weight > 0);
  return chooseWeighted(weightedTypes.length > 0 ? weightedTypes : activeTypes);
}

function spawnFish(typeOverride = null) {
  const type = typeOverride || chooseLevelFishType();
  const margin = 130;
  const fish = {
    type,
    x: rand(margin, W - margin),
    y: rand(250, H - 260),
    vx: 0,
    vy: 0,
    angle: rand(-Math.PI, Math.PI),
    mode: "cruise",
    escapeTimer: 0,
    pathMode: Math.floor(rand(0, 3)),
    targetX: 0,
    targetY: 0,
    phase: rand(0, Math.PI * 2),
    dashTimer: 0,
    dashCooldown: type.dashInterval ? rand(type.dashInterval * 0.6, type.dashInterval * 1.4) : 0,
    caught: false,
    catchT: 0,
    fromX: 0,
    fromY: 0,
    perfect: false,
  };
  setFishTarget(fish, 240);
  return fish;
}

function setFishTarget(fish, minDistance = 180) {
  for (let i = 0; i < 10; i += 1) {
    const targetX = rand(100, W - 100);
    const targetY = rand(275, H - 285);
    if (dist(fish.x, fish.y, targetX, targetY) >= minDistance) {
      fish.targetX = targetX;
      fish.targetY = targetY;
      return;
    }
  }
  fish.targetX = clamp(fish.x + rand(-360, 360), 100, W - 100);
  fish.targetY = clamp(fish.y + rand(-460, 460), 275, H - 285);
}

function createInitialFishes(level) {
  const fishes = [];
  const taskEntries = Object.entries(level.task);

  for (const [fishId, count] of taskEntries) {
    const type = fishTypeById[fishId];
    if (!type) continue;
    for (let i = 0; i < count; i += 1) {
      fishes.push(spawnFish(type));
    }
  }

  while (fishes.length < level.initialFish) {
    fishes.push(spawnFish());
  }

  return fishes;
}

function spawnCrab() {
  const fromLeft = Math.random() > 0.5;
  return {
    x: fromLeft ? -80 : W + 80,
    y: rand(430, H - 360),
    vx: fromLeft ? rand(70, 115) : -rand(70, 115),
    claw: rand(0, Math.PI * 2),
  };
}

function spawnWeeds(level) {
  return Array.from({ length: level.mechanic.weedCount || 0 }, () => ({
    x: rand(150, W - 150),
    y: rand(420, H - 360),
    r: rand(70, 105),
    sway: rand(0, Math.PI * 2),
  }));
}

function spawnShells(level) {
  return Array.from({ length: level.mechanic.shellCount || 0 }, () => ({
    x: rand(150, W - 150),
    y: rand(380, H - 320),
    r: 34,
    collected: false,
    phase: rand(0, Math.PI * 2),
  }));
}

function createFishSchool() {
  const candidates = state.fishes.filter((fish) => !fish.caught && !fish.remove && !fish.schoolLeader && fish.mode === "cruise");
  if (candidates.length < 4) return false;
  const leader = candidates[Math.floor(rand(0, candidates.length))];
  const followers = candidates
    .filter((fish) => fish !== leader)
    .sort((a, b) => dist(a.x, a.y, leader.x, leader.y) - dist(b.x, b.y, leader.x, leader.y))
    .slice(0, Math.min(5, candidates.length - 1));
  if (followers.length < 3) return false;

  const duration = rand(4.5, 7.5);
  leader.schoolTimer = duration;
  leader.schoolRole = "leader";
  setFishTarget(leader, 360);

  followers.forEach((fish, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const row = Math.floor(index / 2) + 1;
    fish.schoolLeader = leader;
    fish.schoolTimer = duration;
    fish.schoolOffsetX = -row * 72;
    fish.schoolOffsetY = side * row * 34;
    fish.schoolRole = "follower";
  });

  state.popups.push({ text: "鱼群出现", x: W * 0.5, y: 320, life: 1, color: "#80ffdb", size: 34 });
  return true;
}

function startGame() {
  const level = currentLevel();
  const net = currentNet();
  state.score = 0;
  state.bonusCoins = 0;
  state.caught = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.comboTimer = 0;
  state.maxDurability = net.maxDurability;
  state.durability = net.maxDurability;
  state.timeLeft = level.duration;
  resetTaskProgress();
  state.fishes = createInitialFishes(level);
  state.crabs = [];
  state.weeds = spawnWeeds(level);
  state.shells = spawnShells(level);
  state.schoolTimer = rand(4, Math.max(5.5, 8 - (level.mechanic.difficultyTier || 0) * 0.35));
  state.ripples = [];
  state.popups = [];
  state.splashes = [];
  state.net.x = W * 0.5;
  state.net.y = H * 0.68;
  state.net.prevX = state.net.x;
  state.net.prevY = state.net.y;
  state.net.active = false;
  state.net.visible = false;
  setScreen("playing");
  showToast(`${level.mechanic.name}：${level.mechanic.desc}`);
  updateHud();
}

function finishGame(reason) {
  if (state.mode !== "playing") return;
  const level = currentLevel();
  const passed = reason === "clear" || areTasksComplete();
  const clearedLevelNumber = levelConfigs.indexOf(level) + 1;
  state.resultPassed = passed;
  const scoreCoins = Math.round(state.score * SCORE_COIN_RATE);
  const clearBonus = passed ? CLEAR_COIN_BASE + clearedLevelNumber * CLEAR_COIN_STEP : 0;
  const coins = Math.max(0, scoreCoins + clearBonus + state.bonusCoins);
  state.coins += coins;
  localStorage.setItem("fishMasterCoins", String(state.coins));
  if (passed && state.clearCount < clearedLevelNumber) {
    state.clearCount = clearedLevelNumber;
    localStorage.setItem("fishMasterClears", String(state.clearCount));
    saveRankProgress();
  }
  if (passed && state.levelIndex < levelConfigs.length - 1) {
    state.levelIndex += 1;
    localStorage.setItem("fishMasterLevel", String(state.levelIndex));
  }
  resultTitle.textContent = passed ? "通关成功" : reason === "broken" ? "纸网破了" : "任务失败";
  finalLevel.textContent = `${level.id} ${level.name}`;
  finalTask.textContent = passed ? "完成" : taskSummaryText();
  finalScore.textContent = String(Math.round(state.score));
  finalCount.textContent = `${state.caught} 条`;
  finalCombo.textContent = String(state.maxCombo);
  finalCoins.textContent = String(coins);
  coinTotal.textContent = String(state.coins);
  updateNetLabels();
  nextLevelBtn.style.display = passed && state.levelIndex < levelConfigs.length ? "block" : "none";
  nextLevelBtn.textContent = state.levelIndex >= levelConfigs.length - 1 && passed ? "继续挑战" : "下一关";
  document.getElementById("restartBtn").style.display = passed ? "none" : "block";
  updateMenuLevelText();
  setScreen("result");
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("is-active");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-active"), 900);
}

function damageDurability(amount, x, y, label) {
  if (amount <= 0) return;
  state.durability -= amount;

  const strongFeedback = Boolean(label) || amount >= 1;
  if (strongFeedback) {
    state.damageFlash = Math.min(0.85, state.damageFlash + clamp(amount / 30, 0.12, 0.45));
    state.damagePulseTimer = 0.28;

    durabilityWrap.classList.remove("is-hit");
    void durabilityWrap.offsetWidth;
    durabilityWrap.classList.add("is-hit");
    clearTimeout(damageDurability.hitTimer);
    damageDurability.hitTimer = setTimeout(() => durabilityWrap.classList.remove("is-hit"), 240);
  }

  if (label) {
    state.popups.push({
      text: label,
      x,
      y,
      life: amount >= 15 ? 0.95 : 0.72,
      color: amount >= 20 ? "#ff4d6d" : "#ffe66d",
      size: amount >= 20 ? 42 : 32,
    });
  }
}

function repairDurability(amount, x, y, label = `耐久 +${amount}%`) {
  if (amount <= 0 || state.durability >= state.maxDurability) return;
  const restored = Math.min(amount, state.maxDurability - state.durability);
  state.durability += restored;
  state.popups.push({
    text: label,
    x,
    y,
    life: 0.8,
    color: "#55d991",
    size: 32,
  });
}

function collectShell(shell) {
  shell.collected = true;
  if (Math.random() < 0.5) {
    const coins = 8;
    state.bonusCoins += coins;
    state.popups.push({ text: `贝壳 +${coins}金币`, x: shell.x, y: shell.y - 60, life: 0.9, color: "#ffe66d", size: 30 });
  } else {
    repairDurability(8, shell.x, shell.y - 60, "贝壳 +8%");
  }
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const source = event.touches ? event.touches[0] || event.changedTouches[0] : event;
  return {
    x: ((source.clientX - rect.left) / rect.width) * W,
    y: ((source.clientY - rect.top) / rect.height) * H,
  };
}

function pointerDown(event) {
  if (state.mode !== "playing") return;
  event.preventDefault();
  const p = canvasPoint(event);
  state.net.active = true;
  state.net.visible = true;
  state.net.x = p.x;
  state.net.y = p.y;
  state.net.prevX = p.x;
  state.net.prevY = p.y;
  state.net.speed = 0;
  state.ripples.push({ x: p.x, y: p.y, r: 20, life: 0.45, max: 0.45 });
}

function pointerMove(event) {
  if (state.mode !== "playing" || !state.net.active) return;
  event.preventDefault();
  const p = canvasPoint(event);
  state.net.x = clamp(p.x, NET_RADIUS, W - NET_RADIUS);
  state.net.y = clamp(p.y, 230, H - 160);
}

function pointerUp(event) {
  if (state.mode !== "playing" || !state.net.active) return;
  event.preventDefault();
  state.net.active = false;
  resolveCatch();
}

function resolveCatch() {
  const net = state.net;
  const mechanic = currentLevel().mechanic;
  const equippedNet = currentNet();
  const crabsInside = state.crabs.some((crab) => dist(net.x, net.y, crab.x, crab.y) < NET_RADIUS + 45);
  if (crabsInside) {
    damageDurability(100, W * 0.5, 190, "耐久 -100%");
    state.net.shake = 1;
    showToast("夹破了！");
    state.popups.push({ text: "网破！", x: net.x, y: net.y - 80, life: 1.1, color: "#ff4d6d", size: 54 });
    setTimeout(() => finishGame("broken"), 650);
    return;
  }

  const caughtShells = state.shells.filter((shell) => !shell.collected && dist(net.x, net.y, shell.x, shell.y) < NET_RADIUS);
  const caught = state.fishes.filter((fish) => !fish.caught && dist(net.x, net.y, fish.x, fish.y) < NET_RADIUS);
  if (caught.length === 0 && caughtShells.length === 0) {
    damageDurability(2, W * 0.5, 190, "耐久 -2%");
    state.combo = 0;
    state.comboTimer = 0;
    state.net.shake = 0.55;
    showToast("空捞");
    if (state.durability <= 0) finishGame("broken");
    return;
  }

  for (const shell of caughtShells) collectShell(shell);
  if (caught.length === 0) {
    state.splashes.push({ x: net.x, y: net.y, life: 0.45, max: 0.45 });
    showToast("贝壳奖励");
    return;
  }

  let baseScore = 0;
  let durabilityCost = 0;
  let perfectCount = 0;
  const pendingRepairs = [];

  for (const fish of caught) {
    const d = dist(net.x, net.y, fish.x, fish.y);
    const perfect = d <= PERFECT_RADIUS;
    const positionFactor = perfect ? 0.8 : 1;
    const scoreFactor = perfect ? 1.5 : 1;
    const scaredPenalty = fish.mode === "escape" ? 10 : 0;

    fish.caught = true;
    fish.catchT = 0;
    fish.fromX = fish.x;
    fish.fromY = fish.y;
    fish.perfect = perfect;

    if (perfect) perfectCount += 1;
    baseScore += fish.type.score * scoreFactor * (fish.type.scoreMultiplier || 1);
    durabilityCost += fish.type.durabilityCost * (fish.type.costMultiplier || 1) * positionFactor + scaredPenalty;
    if (fish.type.bonusCoinAmount) {
      state.bonusCoins += fish.type.bonusCoinAmount;
      state.popups.push({ text: `金币 +${fish.type.bonusCoinAmount}`, x: fish.x, y: fish.y - 135, life: 0.85, color: "#ffe66d", size: 28 });
    }
    if (fish.type.repairAmount) {
      pendingRepairs.push({ amount: fish.type.repairAmount, x: fish.x, y: fish.y - 135, label: `耐久 +${fish.type.repairAmount}%` });
    }
    if (equippedNet.bonusCoinChance && Math.random() < equippedNet.bonusCoinChance) {
      state.bonusCoins += equippedNet.bonusCoinAmount;
      state.popups.push({ text: `${equippedNet.name} +${equippedNet.bonusCoinAmount}金币`, x: fish.x, y: fish.y - 132, life: 0.9, color: "#ffe66d", size: 26 });
    }
    if (equippedNet.repairChance && Math.random() < equippedNet.repairChance) {
      pendingRepairs.push({ amount: equippedNet.repairAmount, x: fish.x, y: fish.y - 158, label: `${equippedNet.name} +${equippedNet.repairAmount}%` });
    }
    if (Object.prototype.hasOwnProperty.call(currentLevel().task, fish.type.id)) {
      state.taskProgress[fish.type.id] = (state.taskProgress[fish.type.id] || 0) + 1;
    }

    state.popups.push({
      text: perfect ? "Perfect!" : `+${fish.type.score}`,
      x: fish.x,
      y: fish.y - 92,
      life: 0.8,
      color: perfect ? "#ffe66d" : "#ffffff",
      size: perfect ? 38 : 30,
    });
  }

  const multiDiscount = caught.length >= 4 ? 0.85 : caught.length === 3 ? 0.9 : caught.length === 2 ? 0.95 : 1;
  const multiMultiplier = caught.length >= 4 ? 2 : caught.length === 3 ? 1.6 : caught.length === 2 ? 1.3 : 1;

  state.combo += 1;
  state.comboTimer = 2;
  state.maxCombo = Math.max(state.maxCombo, state.combo);
  const comboMultiplier = state.combo >= 10 ? 2 : state.combo >= 8 ? 1.7 : state.combo >= 5 ? 1.4 : state.combo >= 3 ? 1.2 : state.combo >= 2 ? 1.1 : 1;

  const finalDurabilityCost = durabilityCost * multiDiscount;
  damageDurability(
    finalDurabilityCost * (mechanic.catchCostMultiplier || mechanic.durabilityMultiplier || 1),
    W * 0.5,
    190,
    `耐久 -${Math.ceil(finalDurabilityCost * (mechanic.catchCostMultiplier || mechanic.durabilityMultiplier || 1))}%`
  );
  for (const repair of pendingRepairs) {
    repairDurability(repair.amount, repair.x, repair.y, repair.label);
  }
  state.score += baseScore * multiMultiplier * comboMultiplier * (mechanic.scoreMultiplier || 1);
  state.caught += caught.length;
  state.perfectCatches += perfectCount;
  state.splashes.push({ x: net.x, y: net.y, life: 0.45, max: 0.45 });

  if (caught.length >= 4) showToast("Incredible!");
  else if (caught.length === 3) showToast("Triple!");
  else if (caught.length === 2) showToast("Double!");
  else if (perfectCount) showToast("Perfect!");

  while (state.fishes.filter((fish) => !fish.caught).length < currentLevel().minFish) {
    state.fishes.push(spawnFish());
  }

  if (areTasksComplete() && !state.taskCompleted) {
    state.taskCompleted = true;
    showToast("目标完成！");
    setTimeout(() => finishGame("clear"), 650);
    updateHud();
    return;
  }

  if (state.durability <= 0) {
    state.durability = 0;
    state.net.shake = 1;
    setTimeout(() => finishGame("broken"), 500);
  }
}

function updateHud() {
  const level = currentLevel();
  scoreText.textContent = String(Math.round(state.score));
  timeText.textContent = String(Math.ceil(state.timeLeft));
  bucketText.textContent = String(state.caught);
  levelText.textContent = `${level.id} ${level.name}`;
  taskStateText.textContent = areTasksComplete() ? "完成" : "目标";
  const fishTasks = Object.keys(level.task)
    .map((fishId) => {
      const type = fishTypeById[fishId];
      const target = level.task[fishId];
      const progress = Math.min(state.taskProgress[fishId] || 0, target);
      const ratio = `${Math.round((progress / target) * 100)}%`;
      const done = progress >= target ? " is-done" : "";
      return `
        <div class="task-item${done}">
          <span class="task-icon" style="--task-color: ${type.color}"></span>
          <span>${type.name}</span>
          <span class="task-progress" style="--task-ratio: ${ratio}"><span></span></span>
          <span class="task-count">${progress}/${target}</span>
        </div>
      `;
    });
  const extraTasks = [];
  if (level.mechanic.perfectGoal) {
    const progress = Math.min(state.perfectCatches, level.mechanic.perfectGoal);
    const ratio = `${Math.round((progress / level.mechanic.perfectGoal) * 100)}%`;
    extraTasks.push(`
      <div class="task-item${progress >= level.mechanic.perfectGoal ? " is-done" : ""}">
        <span class="task-icon" style="--task-color: #ffe66d"></span>
        <span>Perfect</span>
        <span class="task-progress" style="--task-ratio: ${ratio}"><span></span></span>
        <span class="task-count">${progress}/${level.mechanic.perfectGoal}</span>
      </div>
    `);
  }
  if (level.mechanic.comboGoal) {
    const progress = Math.min(state.maxCombo, level.mechanic.comboGoal);
    const ratio = `${Math.round((progress / level.mechanic.comboGoal) * 100)}%`;
    extraTasks.push(`
      <div class="task-item${progress >= level.mechanic.comboGoal ? " is-done" : ""}">
        <span class="task-icon" style="--task-color: #80ffdb"></span>
        <span>连击</span>
        <span class="task-progress" style="--task-ratio: ${ratio}"><span></span></span>
        <span class="task-count">${progress}/${level.mechanic.comboGoal}</span>
      </div>
    `);
  }
  taskList.innerHTML = [...fishTasks, ...extraTasks].join("");
  const durability = clamp(state.durability, 0, state.maxDurability);
  const durabilityRatio = state.maxDurability > 0 ? durability / state.maxDurability : 0;
  const durabilityPercent = durabilityRatio * 100;
  durabilityBar.style.transform = `scaleX(${durabilityRatio})`;
  durabilityText.textContent = `${Math.ceil(durability)}%`;
  durabilityWrap.classList.toggle("stage-high", durabilityPercent > 60);
  durabilityWrap.classList.toggle("stage-mid", durabilityPercent <= 60 && durabilityPercent > 30);
  durabilityWrap.classList.toggle("stage-low", durabilityPercent <= 30);
  hud.classList.toggle("danger", durabilityPercent <= 30 && state.mode === "playing");
  comboText.textContent = state.combo > 1 ? `combo ×${state.combo}` : "";
}

function update(dt) {
  if (state.mode !== "playing") return;

  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    finishGame("time");
    return;
  }

  const level = currentLevel();
  if (level.maxCrabs > 0 && state.timeLeft < level.duration - 10 && state.crabs.length === 0) state.crabs.push(spawnCrab());
  if (level.maxCrabs > 1 && state.timeLeft < level.duration - 25 && state.crabs.length < level.maxCrabs && Math.random() < dt * 0.18) {
    state.crabs.push(spawnCrab());
  }
  state.schoolTimer -= dt;
  if (state.schoolTimer <= 0) {
    if (Math.random() < 0.65 + Math.min(0.18, (level.mechanic.difficultyTier || 0) * 0.035)) createFishSchool();
    state.schoolTimer = rand(7, Math.max(9, 14 - (level.mechanic.difficultyTier || 0) * 0.6));
  }

  const net = state.net;
  net.speed = Math.hypot(net.x - net.prevX, net.y - net.prevY) / Math.max(dt, 0.001);
  if (net.active && level.mechanic.currentX) {
    net.x = clamp(net.x + level.mechanic.currentX * dt, NET_RADIUS, W - NET_RADIUS);
  }
  if (net.active) {
    const drain = (net.speed > 760 ? 1 : 0.2) * (level.mechanic.durabilityMultiplier || 1) * (currentNet().dragCostMultiplier || 1);
    damageDurability(drain * dt, net.x, net.y - 90, "");
    state.dragDrainFeedbackTimer -= dt;
    if (net.speed > 760 && state.dragDrainFeedbackTimer <= 0) {
      state.dragDrainFeedbackTimer = 0.55;
      state.popups.push({ text: "拖太快", x: net.x, y: net.y - 92, life: 0.55, color: "#ffe66d", size: 28 });
    }
    if (net.speed > 160 && Math.random() < dt * 7) {
      state.ripples.push({ x: net.x + rand(-26, 26), y: net.y + rand(-20, 20), r: 14, life: 0.42, max: 0.42 });
    }
  }
  net.prevX = net.x;
  net.prevY = net.y;
  net.shake = Math.max(0, net.shake - dt * 2.4);
  state.weedFeedbackTimer = Math.max(0, state.weedFeedbackTimer - dt);

  if (net.active) {
    for (const weed of state.weeds) {
      if (dist(net.x, net.y, weed.x, weed.y) < weed.r + NET_RADIUS * 0.35) {
        damageDurability(3.2 * dt, W * 0.5, 190, "");
        if (state.weedFeedbackTimer <= 0) {
          state.weedFeedbackTimer = 0.75;
          state.popups.push({ text: "水草缠网", x: net.x, y: net.y - 120, life: 0.65, color: "#95d5b2", size: 28 });
        }
      }
    }
  }

  state.damageFlash = Math.max(0, state.damageFlash - dt * 1.8);
  state.damagePulseTimer = Math.max(0, state.damagePulseTimer - dt);

  if (state.durability <= 0) {
    state.durability = 0;
    finishGame("broken");
    return;
  }

  for (const fish of state.fishes) updateFish(fish, dt);
  for (const crab of state.crabs) {
    crab.x += crab.vx * dt;
    crab.claw += dt * 5;
  }
  state.crabs = state.crabs.filter((crab) => crab.x > -150 && crab.x < W + 150);

  state.comboTimer -= dt;
  if (state.comboTimer <= 0) {
    state.combo = 0;
    state.comboTimer = 0;
  }

  state.ripples = state.ripples.filter((ripple) => {
    ripple.life -= dt;
    ripple.r += dt * 210;
    return ripple.life > 0;
  });
  state.popups = state.popups.filter((popup) => {
    popup.life -= dt;
    popup.y -= dt * 80;
    return popup.life > 0;
  });
  state.splashes = state.splashes.filter((splash) => {
    splash.life -= dt;
    return splash.life > 0;
  });

  updateHud();
}

function updateFish(fish, dt) {
  if (fish.caught) {
    fish.catchT += dt / 0.55;
    const t = clamp(fish.catchT, 0, 1);
    const bucketX = 160;
    const bucketY = H - 80;
    const arc = Math.sin(t * Math.PI) * 190;
    fish.x = fish.fromX + (bucketX - fish.fromX) * t;
    fish.y = fish.fromY + (bucketY - fish.fromY) * t - arc;
    if (t >= 1) fish.remove = true;
    return;
  }

  if (fish.schoolTimer > 0) {
    fish.schoolTimer -= dt;
    if (fish.schoolTimer <= 0) {
      fish.schoolLeader = null;
      fish.schoolRole = null;
      fish.schoolTimer = 0;
      setFishTarget(fish, 240);
    }
  }

  const net = state.net;
  const mechanic = currentLevel().mechanic;
  if (net.active && fish.mode !== "escape" && net.speed > NET_ESCAPE_IDLE_SPEED) {
    const dx = net.x - fish.x;
    const dy = net.y - fish.y;
    const distance = Math.hypot(dx, dy);
    const toNetAngle = Math.atan2(dy, dx);
    const facingDelta = Math.abs(angleDiff(toNetAngle, fish.angle));
    const frontSensitivity = (Math.cos(facingDelta) + 1) * 0.5;
    const speedFactor = clamp(
      (net.speed - NET_ESCAPE_SNEAK_SPEED) / (NET_ESCAPE_FAST_SPEED - NET_ESCAPE_SNEAK_SPEED),
      0,
      1
    );
    const directionSensitivity = 0.18 + frontSensitivity * 0.82;
    const speedSensitivity = 0.25 + speedFactor * 0.75;
    const alertRadius = fish.type.alertRadius * directionSensitivity * speedSensitivity * (mechanic.escapeMultiplier || 1) * (fish.type.escapeSensitivity || 1);
    const requiredSpeed = NET_ESCAPE_TAIL_SPEED - frontSensitivity * 90;
    if (distance < alertRadius && net.speed > requiredSpeed) {
      fish.mode = "escape";
      fish.schoolLeader = null;
      fish.schoolRole = null;
      fish.schoolTimer = 0;
      fish.escapeTimer = 0.8;
      const away = Math.atan2(fish.y - net.y, fish.x - net.x) + rand(-0.52, 0.52);
      fish.vx = Math.cos(away) * fish.type.escapeSpeed;
      fish.vy = Math.sin(away) * fish.type.escapeSpeed;
    }
  }

  if (fish.schoolLeader && fish.schoolLeader.caught) {
    fish.schoolLeader = null;
    fish.schoolRole = null;
    setFishTarget(fish, 240);
  }

  if (fish.mode === "escape") {
    fish.escapeTimer -= dt;
    fish.x += fish.vx * dt;
    fish.y += fish.vy * dt;
    fish.angle = Math.atan2(fish.vy, fish.vx);
    if (fish.escapeTimer <= 0) fish.mode = "cruise";
  } else if (fish.schoolLeader && fish.schoolTimer > 0) {
    updateSchoolFollower(fish, dt);
  } else {
    updateCruise(fish, dt);
  }

  if (!fish.caught && mechanic.currentX) {
    fish.x += mechanic.currentX * dt * 0.45;
  }

  const beforeClampX = fish.x;
  const beforeClampY = fish.y;
  fish.x = clamp(fish.x, 70, W - 70);
  fish.y = clamp(fish.y, 245, H - 235);
  if (fish.x !== beforeClampX || fish.y !== beforeClampY) {
    setFishTarget(fish, 260);
    fish.vx *= -0.35;
    fish.vy *= -0.35;
  }
}

function updateCruise(fish, dt) {
  if (fish.type.dashInterval) {
    fish.dashCooldown -= dt;
    if (fish.dashCooldown <= 0 && fish.dashTimer <= 0) {
      fish.dashTimer = fish.type.dashDuration;
      fish.dashCooldown = fish.type.dashInterval + rand(-0.4, 0.7);
    }
  }
  const dashMultiplier = fish.dashTimer > 0 ? fish.type.dashMultiplier || 1.4 : 1;
  fish.dashTimer = Math.max(0, fish.dashTimer - dt);
  const speed = fish.type.cruiseSpeed * (currentLevel().mechanic.fishSpeedMultiplier || 1) * dashMultiplier;
  let dx = fish.targetX - fish.x;
  let dy = fish.targetY - fish.y;
  if (Math.hypot(dx, dy) < 45) {
    setFishTarget(fish, 240);
    dx = fish.targetX - fish.x;
    dy = fish.targetY - fish.y;
  }
  const targetAngle = Math.atan2(dy, dx);

  if (fish.pathMode === 0) {
    fish.vx = Math.cos(targetAngle) * speed;
    fish.vy = Math.sin(targetAngle) * speed;
  } else if (fish.pathMode === 1) {
    fish.phase += dt * 2.2;
    const sway = Math.sin(fish.phase) * 0.28;
    const angle = targetAngle + sway;
    fish.vx = Math.cos(angle) * speed;
    fish.vy = Math.sin(angle) * speed;
  } else {
    if (Math.random() < dt * 0.75) {
      setFishTarget(fish, 220);
    }
    fish.vx += (Math.cos(targetAngle) * speed - fish.vx) * dt * 1.8;
    fish.vy += (Math.sin(targetAngle) * speed - fish.vy) * dt * 1.8;
  }
  fish.x += fish.vx * dt;
  fish.y += fish.vy * dt;
  if (Math.hypot(fish.vx, fish.vy) > 8) {
    const velocityAngle = Math.atan2(fish.vy, fish.vx);
    fish.angle += angleDiff(velocityAngle, fish.angle) * clamp(dt * 6, 0, 1);
  }
}

function updateSchoolFollower(fish, dt) {
  const leader = fish.schoolLeader;
  const followAngle = leader.angle + Math.PI;
  const sideAngle = leader.angle + Math.PI / 2;
  const targetX = leader.x + Math.cos(followAngle) * Math.abs(fish.schoolOffsetX) + Math.cos(sideAngle) * fish.schoolOffsetY;
  const targetY = leader.y + Math.sin(followAngle) * Math.abs(fish.schoolOffsetX) + Math.sin(sideAngle) * fish.schoolOffsetY;
  const dx = targetX - fish.x;
  const dy = targetY - fish.y;
  const distanceToSlot = Math.hypot(dx, dy);
  const speed = fish.type.cruiseSpeed * 1.25;
  if (distanceToSlot > 6) {
    const angle = Math.atan2(dy, dx);
    fish.vx += (Math.cos(angle) * speed - fish.vx) * dt * 3;
    fish.vy += (Math.sin(angle) * speed - fish.vy) * dt * 3;
    fish.x += fish.vx * dt;
    fish.y += fish.vy * dt;
    fish.angle += angleDiff(leader.angle, fish.angle) * clamp(dt * 5, 0, 1);
  }
}

function draw() {
  drawWater();
  drawRipples();
  drawWeeds();
  drawShells();
  if (state.net.visible) drawNet();
  for (const fish of state.fishes) if (!fish.remove) drawFish(fish);
  state.fishes = state.fishes.filter((fish) => !fish.remove);
  for (const crab of state.crabs) drawCrab(crab);
  drawSplashes();
  drawMechanicOverlay();
  drawDamageOverlay();
  drawPopups();
}

function drawWeeds() {
  const t = performance.now() * 0.001;
  for (const weed of state.weeds) {
    ctx.save();
    ctx.translate(weed.x, weed.y);
    ctx.strokeStyle = "rgba(45, 106, 79, 0.72)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    for (let i = -2; i <= 2; i += 1) {
      const sway = Math.sin(t * 2 + weed.sway + i) * 14;
      ctx.beginPath();
      ctx.moveTo(i * 22, weed.r * 0.55);
      ctx.quadraticCurveTo(i * 18 + sway, 0, i * 12 + sway * 0.5, -weed.r * 0.55);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(149, 213, 178, 0.16)";
    ctx.beginPath();
    ctx.ellipse(0, 0, weed.r, weed.r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawShells() {
  const t = performance.now() * 0.001;
  for (const shell of state.shells) {
    if (shell.collected) continue;
    ctx.save();
    ctx.translate(shell.x, shell.y + Math.sin(t * 2.4 + shell.phase) * 4);
    ctx.fillStyle = "#ffd6a5";
    ctx.strokeStyle = "#f77f00";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, shell.r, Math.PI, Math.PI * 2);
    ctx.lineTo(shell.r, shell.r * 0.55);
    ctx.lineTo(-shell.r, shell.r * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(i * 10, shell.r * 0.48);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawMechanicOverlay() {
  const mechanic = currentLevel().mechanic;
  if (mechanic.darkness) {
    ctx.fillStyle = `rgba(0, 18, 32, ${mechanic.darkness})`;
    ctx.fillRect(0, 0, W, H);
  }
  if (mechanic.currentX) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 5;
    const t = performance.now() * 0.001;
    for (let y = 360; y < H - 220; y += 180) {
      ctx.beginPath();
      for (let x = -80; x < W + 100; x += 50) {
        const waveY = y + Math.sin(x * 0.018 + t * 4) * 18;
        if (x === -80) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawDamageOverlay() {
  const durabilityPercent = state.maxDurability > 0 ? (state.durability / state.maxDurability) * 100 : 0;
  if (state.damageFlash <= 0 && durabilityPercent > 30) return;
  const lowAlpha = durabilityPercent <= 30 ? 0.12 + Math.sin(performance.now() * 0.012) * 0.035 : 0;
  const hitAlpha = state.damageFlash * 0.34;
  const alpha = clamp(lowAlpha + hitAlpha, 0, 0.42);
  if (alpha <= 0) return;

  const gradient = ctx.createRadialGradient(W * 0.5, H * 0.52, H * 0.2, W * 0.5, H * 0.52, H * 0.74);
  gradient.addColorStop(0, "rgba(244,67,54,0)");
  gradient.addColorStop(1, `rgba(244,67,54,${alpha})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}

function drawWater() {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#16889b");
  gradient.addColorStop(0.48, "#0f6f84");
  gradient.addColorStop(1, "#0b5367");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 3;
  const t = performance.now() * 0.001;
  for (let y = 230; y < H; y += 110) {
    ctx.beginPath();
    for (let x = -30; x <= W + 30; x += 30) {
      const waveY = y + Math.sin(x * 0.012 + t * 1.8 + y * 0.01) * 13;
      if (x === -30) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.055)";
  for (let i = 0; i < 20; i += 1) {
    const x = (i * 137 + (t * 26) % 137) % W;
    const y = 300 + ((i * 173 + (t * 18) % 173) % (H - 620));
    ctx.beginPath();
    ctx.ellipse(x, y, 34, 5, -0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRipples() {
  ctx.lineWidth = 4;
  for (const ripple of state.ripples) {
    const alpha = ripple.life / ripple.max;
    ctx.strokeStyle = `rgba(221, 255, 255, ${alpha * 0.38})`;
    ctx.beginPath();
    ctx.ellipse(ripple.x, ripple.y, ripple.r * 1.3, ripple.r * 0.72, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawFish(fish) {
  ctx.save();
  ctx.translate(fish.x, fish.y);
  ctx.rotate(fish.angle);
  const size = fish.type.size;

  if (fish.mode === "escape") {
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(-size * (0.7 + i * 0.32), rand(-8, 8), 5 + i * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (fish.dashTimer > 0) {
    ctx.fillStyle = "rgba(255,255,255,0.24)";
    for (let i = 1; i <= 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(-size * (0.7 + i * 0.28), 0, size * 0.18, size * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const id = fish.type.id;
  const shape = fish.type.shape || "long";
  const bodyLength = shape === "large" ? size * 0.78 : shape === "eel" ? size * 0.95 : shape === "thin" ? size * 0.66 : shape === "tall" ? size * 0.52 : shape === "fan" ? size * 0.56 : size * 0.58;
  const bodyHeight = shape === "large" ? size * 0.3 : shape === "round" ? size * 0.36 : shape === "tall" ? size * 0.46 : shape === "eel" ? size * 0.18 : size * 0.32;
  const tailLength = shape === "fan" ? size * 0.62 : shape === "round" ? size * 0.54 : shape === "large" ? size * 0.38 : size * 0.45;
  const eyeSize = id === "bigkoi" ? 6.5 : id === "goldfish" ? 4.5 : 5;

  ctx.shadowColor = "rgba(0, 26, 34, 0.18)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 5;

  ctx.fillStyle = fish.type.accent;
  ctx.beginPath();
  ctx.moveTo(-bodyLength * 0.82, 0);
  ctx.lineTo(-bodyLength - tailLength, -bodyHeight * 0.9);
  ctx.lineTo(-bodyLength - tailLength * 0.72, 0);
  ctx.lineTo(-bodyLength - tailLength, bodyHeight * 0.9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = fish.type.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, bodyLength, bodyHeight, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "transparent";

  if (shape === "tall") {
    ctx.fillStyle = fish.type.accent;
    ctx.beginPath();
    ctx.moveTo(-size * 0.04, -bodyHeight * 0.8);
    ctx.lineTo(size * 0.2, -bodyHeight * 1.55);
    ctx.lineTo(size * 0.18, -bodyHeight * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-size * 0.06, bodyHeight * 0.72);
    ctx.lineTo(size * 0.22, bodyHeight * 1.42);
    ctx.lineTo(size * 0.14, bodyHeight * 0.14);
    ctx.closePath();
    ctx.fill();
  }

  if (id === "goldfish") {
    ctx.fillStyle = "rgba(255, 247, 171, 0.75)";
    ctx.beginPath();
    ctx.ellipse(-size * 0.12, 0, size * 0.18, bodyHeight * 0.78, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff7b54";
    ctx.beginPath();
    ctx.arc(size * 0.08, -bodyHeight * 0.2, size * 0.08, 0, Math.PI * 2);
    ctx.arc(-size * 0.2, bodyHeight * 0.18, size * 0.07, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "koi") {
    ctx.fillStyle = "#e85d04";
    ctx.beginPath();
    ctx.ellipse(-size * 0.18, -bodyHeight * 0.08, size * 0.2, bodyHeight * 0.68, -0.45, 0, Math.PI * 2);
    ctx.ellipse(size * 0.22, bodyHeight * 0.08, size * 0.16, bodyHeight * 0.56, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "tropical") {
    ctx.fillStyle = "#ffe66d";
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.ellipse(i * size * 0.18, 0, size * 0.04, bodyHeight * 0.95, 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#4361ee";
    ctx.beginPath();
    ctx.moveTo(-size * 0.08, -bodyHeight * 0.88);
    ctx.lineTo(size * 0.24, -bodyHeight * 1.36);
    ctx.lineTo(size * 0.02, -bodyHeight * 0.25);
    ctx.closePath();
    ctx.fill();
  } else if (id === "bigkoi") {
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, bodyLength, bodyHeight, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#d00000";
    ctx.beginPath();
    ctx.ellipse(-size * 0.26, -bodyHeight * 0.05, size * 0.22, bodyHeight * 0.78, -0.35, 0, Math.PI * 2);
    ctx.ellipse(size * 0.1, bodyHeight * 0.08, size * 0.18, bodyHeight * 0.6, 0.25, 0, Math.PI * 2);
    ctx.ellipse(size * 0.36, -bodyHeight * 0.12, size * 0.13, bodyHeight * 0.45, -0.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    drawFishPattern(fish, size, bodyLength, bodyHeight);
  }

  ctx.fillStyle = fish.type.accent;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(-size * 0.05, bodyHeight * 0.82, size * 0.16, bodyHeight * 0.5, 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(bodyLength * 0.58, -bodyHeight * 0.28, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(bodyLength * 0.6, -bodyHeight * 0.34, eyeSize * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFishPattern(fish, size, bodyLength, bodyHeight) {
  const pattern = fish.type.pattern;
  ctx.fillStyle = fish.type.accent;
  ctx.strokeStyle = fish.type.accent;
  if (pattern === "stripes" || pattern === "bands") {
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.ellipse(i * size * 0.13, 0, size * 0.035, bodyHeight * 0.96, 0.18, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === "spots") {
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(-size * 0.22 + i * size * 0.16, i % 2 === 0 ? -bodyHeight * 0.18 : bodyHeight * 0.18, size * 0.055, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === "shine" || pattern === "glow") {
    ctx.globalAlpha = pattern === "glow" ? 0.85 : 0.55;
    ctx.beginPath();
    ctx.ellipse(size * 0.02, -bodyHeight * 0.2, bodyLength * 0.52, bodyHeight * 0.28, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (pattern === "whisker") {
    ctx.lineWidth = 3;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(bodyLength * 0.62, side * bodyHeight * 0.18);
      ctx.lineTo(bodyLength * 0.98, side * bodyHeight * 0.52);
      ctx.stroke();
    }
  } else if (pattern === "tail" || pattern === "fins") {
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.ellipse(-bodyLength * 0.65, 0, size * 0.24, bodyHeight * 1.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (pattern === "gill") {
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(bodyLength * 0.28, 0, bodyHeight * 0.82, -0.8, 0.8);
    ctx.stroke();
  } else {
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.ellipse(-size * 0.08, 0, size * 0.17, bodyHeight * 0.72, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawCrab(crab) {
  ctx.save();
  ctx.translate(crab.x, crab.y);
  ctx.fillStyle = "#e63946";
  ctx.beginPath();
  ctx.ellipse(0, 0, 48, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffb3ba";
  ctx.lineWidth = 9;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 34, -5);
    ctx.lineTo(side * 70, -24 + Math.sin(crab.claw) * 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(side * 82, -26 + Math.sin(crab.claw) * 5, 17, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-15, -15, 7, 0, Math.PI * 2);
  ctx.arc(15, -15, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(-15, -15, 3, 0, Math.PI * 2);
  ctx.arc(15, -15, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNet() {
  const net = state.net;
  const equippedNet = currentNet();
  const health = state.maxDurability > 0 ? clamp(state.durability / state.maxDurability, 0, 1) * 100 : 0;
  const lowHealthShake = health < 25 ? Math.sin(performance.now() * 0.08) * 2.4 : 0;
  const shake = (net.shake > 0 ? rand(-8, 8) * net.shake : 0) + lowHealthShake;
  ctx.save();
  ctx.translate(net.x + shake, net.y + shake);
  ctx.rotate((net.x - net.prevX) * 0.002);

  ctx.strokeStyle = equippedNet.frame;
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(55, 70);
  ctx.lineTo(170, 180);
  ctx.stroke();

  const paperAlpha = health > 60 ? 0.44 : health > 35 ? 0.34 : health > 20 ? 0.24 : 0.16;
  const paperTone = health > 60 ? equippedNet.paper : health > 35 ? "255, 242, 205" : "255, 218, 165";
  ctx.fillStyle = `rgba(${paperTone}, ${paperAlpha})`;
  ctx.strokeStyle = health > 60 ? equippedNet.rim : health > 35 ? "rgba(255, 230, 170, 0.92)" : "rgba(255, 176, 120, 0.96)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(0, 0, NET_RADIUS, NET_RADIUS * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(80, 96, 104, 0.38)";
  ctx.lineWidth = 2;
  for (let x = -75; x <= 75; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, -72);
    ctx.lineTo(x, 72);
    ctx.stroke();
  }
  for (let y = -54; y <= 54; y += 27) {
    ctx.beginPath();
    ctx.moveTo(-95, y);
    ctx.lineTo(95, y);
    ctx.stroke();
  }

  if (health < 70) {
    ctx.save();
    ctx.rotate(-0.08);
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(9, 75, 92, 0.9)";
    ctx.lineWidth = health < 25 ? 18 : 12;
    ctx.beginPath();
    ctx.ellipse(0, 0, NET_RADIUS + 1, NET_RADIUS * 0.78 + 1, 0, 4.78, 5.24);
    ctx.stroke();
    if (health < 35) {
      ctx.beginPath();
      ctx.ellipse(0, 0, NET_RADIUS + 1, NET_RADIUS * 0.78 + 1, 0, 1.18, 1.62);
      ctx.stroke();
    }
    ctx.restore();
  }

  for (const hole of NET_DAMAGE_HOLES) {
    if (health >= hole.stage) continue;
    ctx.fillStyle = "rgba(9, 79, 97, 0.88)";
    ctx.strokeStyle = "rgba(88, 54, 42, 0.76)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y, hole.rx, hole.ry, 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.strokeStyle = health > 40 ? "rgba(60, 42, 38, 0.72)" : "rgba(76, 38, 30, 0.95)";
  ctx.lineWidth = health > 40 ? 4 : 5.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const crack of NET_DAMAGE_CRACKS) {
    if (health >= crack.stage) continue;
    ctx.beginPath();
    crack.points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  ctx.strokeStyle = equippedNet.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, PERFECT_RADIUS, PERFECT_RADIUS * 0.78, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSplashes() {
  ctx.strokeStyle = "rgba(255,255,255,0.72)";
  ctx.lineWidth = 4;
  for (const splash of state.splashes) {
    const t = 1 - splash.life / splash.max;
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2;
      const r = t * 80;
      ctx.beginPath();
      ctx.moveTo(splash.x + Math.cos(a) * r * 0.5, splash.y + Math.sin(a) * r * 0.35);
      ctx.lineTo(splash.x + Math.cos(a) * r, splash.y + Math.sin(a) * r * 0.7);
      ctx.stroke();
    }
  }
}

function drawPopups() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 32px Microsoft YaHei, sans-serif";
  for (const popup of state.popups) {
    ctx.globalAlpha = clamp(popup.life, 0, 1);
    ctx.font = `900 ${popup.size}px Microsoft YaHei, sans-serif`;
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.fillStyle = popup.color;
    ctx.strokeText(popup.text, popup.x, popup.y);
    ctx.fillText(popup.text, popup.x, popup.y);
  }
  ctx.restore();
}

function loop(now) {
  const dt = Math.min(0.033, (now - state.lastTime) / 1000);
  state.lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function pauseGame() {
  if (state.mode !== "playing") return;
  setScreen("paused");
}

function resumeGame() {
  state.lastTime = performance.now();
  setScreen("playing");
}

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetGameBtn").addEventListener("click", resetAllProgress);
document.getElementById("rankBtn").addEventListener("click", openRank);
document.getElementById("shopBtn").addEventListener("click", () => {
  renderShop();
  setScreen("shop");
});
document.getElementById("closeRankBtn").addEventListener("click", () => setScreen("menu"));
document.getElementById("closeShopBtn").addEventListener("click", () => {
  updateNetLabels();
  setScreen("menu");
});
netList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-net-id]");
  if (!button) return;
  handleNetAction(button.dataset.netId);
});
document.getElementById("pauseBtn").addEventListener("click", pauseGame);
document.getElementById("resumeBtn").addEventListener("click", resumeGame);
nextLevelBtn.addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", startGame);
document.getElementById("restartFromPauseBtn").addEventListener("click", startGame);
document.getElementById("menuBtn").addEventListener("click", () => setScreen("menu"));
document.getElementById("menuFromPauseBtn").addEventListener("click", () => setScreen("menu"));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (state.mode === "playing") pauseGame();
    else if (state.mode === "paused") resumeGame();
  }
});

canvas.addEventListener("mousedown", pointerDown);
canvas.addEventListener("mousemove", pointerMove);
window.addEventListener("mouseup", pointerUp);
canvas.addEventListener("touchstart", pointerDown, { passive: false });
canvas.addEventListener("touchmove", pointerMove, { passive: false });
canvas.addEventListener("touchend", pointerUp, { passive: false });
canvas.addEventListener("touchcancel", pointerUp, { passive: false });

coinTotal.textContent = String(state.coins);
updateNetLabels();
updateMenuLevelText();
requestAnimationFrame(loop);
