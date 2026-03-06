const db = require('../models/roleModel'); // Adjust path if needed
require('dotenv').config();

/**
 * Get all roles
 */
async function getAllRoles(req, res) {
    try {
        const roles = await db.secrole.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'roleName', 'description', 'createdAt', 'updatedAt']
        });
        return res.json({ success: true, roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch roles.' });
    }
}

/**
 * Get a role by ID
 */

/**
 * Create a new role
 */
async function createRole(req, res) {
    try {
        const { roleName, description } = req.body;

        if (!roleName) {
            return res.status(400).json({ success: false, message: 'Role name is required.' });
        }

        // Check if role exists
        const existingRole = await db.secrole.findOne({ where: { roleName } });
        if (existingRole) {
            return res.status(409).json({ success: false, message: 'Role name already exists.' });
        }

        const newRole = await db.secrole.create({ roleName, description });

        return res.status(201).json({ success: true, message: 'Role created successfully.', role: newRole });
    } catch (error) {
        console.error('Error creating role:', error);
        return res.status(500).json({ success: false, message: 'Failed to create role.' });
    }
}

/**
 * Update a role
 */
async function updateRole(req, res) {
    try {
        const { id } = req.params;
        const { roleName, description } = req.body;

        const role = await db.secrole.findByPk(id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found.' });
        }

        await role.update({ roleName, description });

        return res.json({ success: true, message: 'Role updated successfully.', role });
    } catch (error) {
        console.error('Error updating role:', error);
        return res.status(500).json({ success: false, message: 'Failed to update role.' });
    }
}

/**
 * Delete a role
 */
async function deleteRole(req, res) {
    try {
        const { id } = req.params;

        const role = await db.secrole.findByPk(id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found.' });
        }

        await role.destroy();

        return res.json({ success: true, message: 'Role deleted successfully.' });
    } catch (error) {
        console.error('Error deleting role:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete role.' });
    }
}

/**
 * Get permissions for a role
 */
async function getRolePermissions(req, res) {
    try {
        const { id } = req.params;

        const permissions = await db.roles_permissions.findAll({
            where: { RoleId: id }
        });

        return res.json({ success: true, permissions });
    } catch (error) {
        console.error('Error fetching role permissions:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch role permissions.' });
    }
}

/**
 * Assign permissions to a role
 */
async function assignRolePermissions(req, res) {
    try {
        const { id } = req.params; // RoleId
        const { permissions } = req.body; // Array of { Endpoint, HttpMethod }

        if (!Array.isArray(permissions)) {
            return res.status(400).json({ success: false, message: 'Permissions must be an array.' });
        }

        // Delete existing permissions
        await db.roles_permissions.destroy({ where: { RoleId: id } });

        // Insert new permissions
        const newPermissions = permissions.map(p => ({
            RoleId: id,
            Endpoint: p.Endpoint,
            HttpMethod: p.HttpMethod
        }));

        await db.roles_permissions.bulkCreate(newPermissions);

        return res.json({ success: true, message: 'Permissions assigned successfully.' });
    } catch (error) {
        console.error('Error assigning permissions:', error);
        return res.status(500).json({ success: false, message: 'Failed to assign permissions.' });
    }
}

module.exports = {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    getRolePermissions,
    assignRolePermissions
};
