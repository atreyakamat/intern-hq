/**
 * controllers/roleController.js
 */
const roleService = require('../services/roleService');

exports.getRoles = async (req, res) => {
  try {
    const roles = await roleService.listRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await roleService.deleteRole(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({
      message: 'Role archived successfully',
      role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
