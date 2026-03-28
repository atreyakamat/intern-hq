/**
 * services/roleService.js
 * -------------------------------------------------
 * Business logic for roles / job descriptions.
 * -------------------------------------------------
 */
const Role = require('../models/Role');
const { embedRole } = require('../ai/embedding');
const logger = require('../utils/logger');
const { normalizeRolePayload } = require('../utils/rolePayload');

function buildRoleText(role) {
  return [
    `Job Title: ${role.title}`,
    `Description: ${role.description || ''}`,
    `Required Skills: ${(role.requiredSkills || []).join(', ')}`,
    `Preferred Skills: ${(role.preferredSkills || []).join(', ')}`,
    `Experience Level: ${role.experienceLevel}`,
    `Company Culture: ${role.cultureDescription || ''}`,
  ].join('\n');
}

/**
 * Create a role and embed its description into the vector store.
 */
async function createRole(data) {
  const role = new Role(normalizeRolePayload(data));
  await role.save();

  try {
    await embedRole(role._id, buildRoleText(role));
    role.embeddingGenerated = true;
    await role.save();
    logger.info('RoleService', `Role embedded: ${role.title}`);
  } catch (err) {
    logger.warn('RoleService', `Embedding failed for role ${role.title}`, {
      error: err.message,
    });
  }

  return role;
}

/**
 * List all roles, optionally only active.
 */
async function listRoles(activeOnly = true) {
  const filter = activeOnly ? { isActive: true } : {};
  return Role.find(filter).sort({ createdAt: -1 });
}

/**
 * Get a single role by ID.
 */
async function getRoleById(id) {
  return Role.findById(id);
}

/**
 * Update a role.
 */
async function updateRole(id, data) {
  const role = await Role.findById(id);
  if (!role) return null;

  const normalized = normalizeRolePayload(data, {
    partial: true,
    baseWeightConfig: role.weightConfig?.toObject?.() || role.weightConfig,
  });

  Object.assign(role, normalized);
  role.embeddingGenerated = false;
  await role.save();

  try {
    await embedRole(role._id, buildRoleText(role));
    role.embeddingGenerated = true;
    await role.save();
  } catch (err) {
    logger.warn('RoleService', `Embedding refresh failed for role ${role.title}`, {
      error: err.message,
    });
  }

  return role;
}

async function deleteRole(id) {
  return Role.findByIdAndUpdate(id, { isActive: false }, { new: true });
}

module.exports = { createRole, listRoles, getRoleById, updateRole, deleteRole };
