const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
// const { verifyToken, hasPermission } = require('../middleware/auth'); 

// Apply your middlewares here if active
router.get('/roles', roleController.getAllRoles);
router.post('/roles', roleController.createRole);
router.put('/roles/:id', roleController.updateRole);
router.delete('/roles/:id', roleController.deleteRole);
router.get('/roles/:id', roleController.getCurrentUserPermissions);
router.get('/roles/permissions/list', roleController.getAllAvailablePermissions);
router.get('/roles/:id/permissions', roleController.getRolePermissions);
router.post('/roles/:id/permissions', roleController.assignRolePermissions);

module.exports = router;