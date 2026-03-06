const bcrypt = require('bcrypt');
const db = require('../models');

const SYSTEM_ADMIN_ROLE_NAME = 'SystemAdmin';

module.exports = async function seedAdmin() {
  try {
    /* ---------------------------
       1. Create SystemAdmin Role
    ----------------------------*/
    let role = await db.secrole.findOne({
      where: { roleName: SYSTEM_ADMIN_ROLE_NAME }
    });

    if (!role) {
      role = await db.secrole.create({
        roleName: SYSTEM_ADMIN_ROLE_NAME,
        description: 'System administrator with full access'
      });
      console.log('✅ SystemAdmin role created');
    }

    /* ---------------------------
       2. Create SystemAdmin User
    ----------------------------*/
    let user = await db.secuser.findOne({
      where: { username: 'systemadmin' }
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      await db.secuser.create({
        username: 'systemadmin',
        email: 'admin@system.local',
        password: hashedPassword,
        roleId: role.id,
        isActive: true
      });

      console.log('✅ SystemAdmin user created');
    }

    /* ---------------------------
       3. Seed ALL Permissions
    ----------------------------*/
    const permissions = [
      { Endpoint: '/.*', HttpMethod: 'GET' },
      { Endpoint: '/.*', HttpMethod: 'POST' },
      { Endpoint: '/.*', HttpMethod: 'PUT' },
      { Endpoint: '/.*', HttpMethod: 'DELETE' }
    ];

    for (const perm of permissions) {
      const exists = await db.roles_permissions.findOne({
        where: {
          RoleId: role.id,
          Endpoint: perm.Endpoint,
          HttpMethod: perm.HttpMethod
        }
      });

      if (!exists) {
        await db.roles_permissions.create({
          RoleId: role.id,
          Endpoint: perm.Endpoint,
          HttpMethod: perm.HttpMethod
        });
      }
    }

    console.log('✅ SystemAdmin permissions seeded');

  } catch (err) {
    console.error('❌ Seed error:', err);
  }
};
