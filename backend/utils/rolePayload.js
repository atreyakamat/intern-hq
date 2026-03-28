const DEFAULT_WEIGHT_CONFIG = {
  skills: 0.4,
  experience: 0.25,
  projects: 0.2,
  communication: 0.1,
  bonus: 0.05,
};

function normalizeStringList(value) {
  if (!value) return [];

  const items = Array.isArray(value) ? value : String(value).split(',');

  return [...new Set(
    items
      .map((item) => String(item).trim())
      .filter(Boolean)
  )];
}

function normalizeWeightConfig(weightConfig = {}, baseWeightConfig = DEFAULT_WEIGHT_CONFIG) {
  return {
    skills: Number(weightConfig.skills ?? baseWeightConfig.skills ?? DEFAULT_WEIGHT_CONFIG.skills),
    experience: Number(
      weightConfig.experience ?? baseWeightConfig.experience ?? DEFAULT_WEIGHT_CONFIG.experience
    ),
    projects: Number(weightConfig.projects ?? baseWeightConfig.projects ?? DEFAULT_WEIGHT_CONFIG.projects),
    communication: Number(
      weightConfig.communication ??
        baseWeightConfig.communication ??
        DEFAULT_WEIGHT_CONFIG.communication
    ),
    bonus: Number(weightConfig.bonus ?? baseWeightConfig.bonus ?? DEFAULT_WEIGHT_CONFIG.bonus),
  };
}

function validateWeightConfig(weightConfig) {
  const values = Object.values(weightConfig || {});

  if (values.some((value) => Number.isNaN(value) || value < 0 || value > 1)) {
    throw new Error('Each weight must be a number between 0 and 1');
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 0.01) {
    throw new Error(`Weight config must sum to 1.0 (current: ${total.toFixed(2)})`);
  }
}

function normalizeRolePayload(data = {}, options = {}) {
  const { partial = false, baseWeightConfig = DEFAULT_WEIGHT_CONFIG } = options;
  const payload = {};

  if (!partial || data.title !== undefined) {
    payload.title = String(data.title || '').trim();
  }
  if (!partial || data.description !== undefined) {
    payload.description = String(data.description || '').trim();
  }
  if (!partial || data.requiredSkills !== undefined) {
    payload.requiredSkills = normalizeStringList(data.requiredSkills);
  }
  if (!partial || data.preferredSkills !== undefined) {
    payload.preferredSkills = normalizeStringList(data.preferredSkills);
  }
  if (!partial || data.experienceLevel !== undefined) {
    payload.experienceLevel = data.experienceLevel || 'Entry Level';
  }
  if (!partial || data.cultureDescription !== undefined) {
    payload.cultureDescription = String(data.cultureDescription || '').trim();
  }
  if (!partial || data.isActive !== undefined) {
    payload.isActive = data.isActive ?? true;
  }
  if (!partial || data.weightConfig !== undefined) {
    payload.weightConfig = normalizeWeightConfig(data.weightConfig, baseWeightConfig);
    validateWeightConfig(payload.weightConfig);
  }

  return payload;
}

module.exports = {
  DEFAULT_WEIGHT_CONFIG,
  normalizeRolePayload,
  normalizeStringList,
  normalizeWeightConfig,
  validateWeightConfig,
};
