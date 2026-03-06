const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const { verifyToken, hasPermission } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// CRUD Routes for Roles
router.get('/', hasPermission, roleController.getAllRoles);          // Get all roles    // Get role by ID
router.post('/', hasPermission, roleController.createRole);         // Create new role
router.put('/:id', hasPermission, roleController.updateRole);       // Update role
router.delete('/:id', hasPermission, roleController.deleteRole);    // Delete role

// Role Permissions
router.get('/:id/permissions', hasPermission, roleController.getRolePermissions);       // Get permissions
router.post('/:id/permissions', hasPermission, roleController.assignRolePermissions);   // Assign permissions

module.exports = router;
