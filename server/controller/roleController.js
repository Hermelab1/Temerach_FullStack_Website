const db = require('../models');
require('dotenv').config();

/**
 * GET ALL ROLES
 */
async function getAllRoles(req, res) {
    try {
        const roles = await db.secrole.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, roles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch roles.' });
    }
}

/**
 * CREATE ROLE
 */
async function createRole(req, res) {
    try {
        const { roleName, description } = req.body;
        const existing = await db.secrole.findOne({ where: { roleName } });

        if (existing) {
            return res.status(409).json({ success: false, message: 'Role already exists' });
        }

        const role = await db.secrole.create({ roleName, description });
        res.status(201).json({ success: true, role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create role' });
    }
}

/**
 * UPDATE ROLE
 */
async function updateRole(req, res) {
    try {
        const { id } = req.params;
        const { roleName, description } = req.body;
        
        const role = await db.secrole.findByPk(id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        
        // Check if new roleName conflicts with existing (excluding current role)
        const existing = await db.secrole.findOne({ 
            where: { 
                roleName,
                id: { [db.Sequelize.Op.ne]: id }
            } 
        });
        
        if (existing) {
            return res.status(409).json({ success: false, message: 'Role name already exists' });
        }
        
        await role.update({ roleName, description });
        res.json({ success: true, role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update role' });
    }
}

/**
 * DELETE ROLE
 */
async function deleteRole(req, res) {
    try {
        const { id } = req.params;
        
        // Check if role has users assigned
        const userCount = await db.usermember.count({ where: { RoleId: id } });
        if (userCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot delete role with ${userCount} user(s) assigned. Reassign users first.` 
            });
        }
        
        const role = await db.secrole.findByPk(id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        
        // Delete role permissions first
        await db.rolespermissions.destroy({ where: { RoleId: id } });
        
        // Delete the role
        await role.destroy();
        
        res.json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete role' });
    }
}

/**
 * GET ALL AVAILABLE PERMISSIONS (Needed for the UI)
 * Fetches the list of modules and their associated actions
 */
async function getAllAvailablePermissions(req, res) {
    try {
        // This joins Modules -> ModulePermissions -> PermissionActions
        const permissions = await db.modulepermission.findAll({
            include: [
                { 
                    model: db.modules, 
                    as: 'module',
                    attributes: ['id', 'moduleName', 'submoduleName', 'moduleDescription']
                },
                { 
                    model: db.permissionaction, 
                    as: 'action',
                    attributes: ['id', 'action']
                }
            ],
            order: [
                [{ model: db.modules, as: 'module' }, 'moduleName', 'ASC'],
                [{ model: db.permissionaction, as: 'action' }, 'action', 'ASC']
            ]
        });
        
        res.json({ success: true, permissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching permission list' });
    }
}

/**
 * GET ROLE PERMISSIONS
 */
async function getRolePermissions(req, res) {
    try {
        const { id } = req.params;
        
        const permissions = await db.rolespermissions.findAll({
            where: { RoleId: id },
            attributes: ['PermissionId']
        });
        
        const permissionIds = permissions.map(p => p.PermissionId);
        
        res.json({ success: true, permissionIds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch permissions' });
    }
}

/**
 * ASSIGN ROLE PERMISSIONS
 */
async function assignRolePermissions(req, res) {
    try {
        const { id } = req.params;

        // CRITICAL FIX: Check if 'id' is a number. 
        // If the frontend calls /api/roles/user/permissions, 'id' becomes 'user'
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "Invalid Role ID" });
        }

        const { permissionIds } = req.body;

        await db.rolespermissions.destroy({ where: { RoleId: id } });

        if (permissionIds && permissionIds.length > 0) {
            const newMappings = permissionIds.map(pId => ({
                RoleId: parseInt(id),
                PermissionId: pId
            }));
            await db.rolespermissions.bulkCreate(newMappings);
        }

        res.json({ success: true, message: 'Permissions updated.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to assign permissions.' });
    }
};

/**
 * GET CURRENT USER'S ROLE AND PERMISSIONS
 */
async function getCurrentUserPermissions(req, res) {
    try {
        // Assuming you have user info from authentication middleware
        const userId = req.user?.id || req.body.userId;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        
        // Get user with role
        const user = await db.usermember.findByPk(userId, {
            include: [{
                model: db.secrole,
                as: 'role',
                attributes: ['id', 'roleName', 'description']
            }]
        });
        
        if (!user || !user.RoleId) {
            return res.json({ success: true, role: null, permissions: [] });
        }
        
        // Get role permissions
        const rolePermissions = await db.rolespermissions.findAll({
            where: { RoleId: user.RoleId },
            include: [{
                model: db.modulepermission,
                as: 'permission',
                include: [
                    { model: db.modules, as: 'module' },
                    { model: db.permissionaction, as: 'action' }
                ]
            }]
        });
        
        const permissions = rolePermissions.map(rp => ({
            permissionId: rp.PermissionId,
            module: rp.permission?.module?.moduleName,
            submodule: rp.permission?.module?.submoduleName,
            action: rp.permission?.action?.action
        }));
        
        res.json({ 
            success: true, 
            role: user.role,
            permissions 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch user permissions' });
    }
}

module.exports = {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    getRolePermissions,
    assignRolePermissions,
    getAllAvailablePermissions,
    getCurrentUserPermissions
};