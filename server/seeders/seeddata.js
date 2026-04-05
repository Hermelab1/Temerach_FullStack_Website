const bcrypt = require("bcrypt");
const db = require("../models");

const SYSTEM_ADMIN_ROLE_NAME = "SystemAdmin";

module.exports = async function seedAll() {
  try {
    /* ---------------------------
       1. Create SystemAdmin Role
    ----------------------------*/
    let role = await db.secrole.findOne({
      where: { roleName: SYSTEM_ADMIN_ROLE_NAME },
    });

    if (!role) {
      role = await db.secrole.create({
        roleName: SYSTEM_ADMIN_ROLE_NAME,
        description: "System administrator with full access",
      });
      console.log("✅ SystemAdmin role created");
    }

    /* ---------------------------
       2. Create SystemAdmin User
    ----------------------------*/
    let user = await db.secuser.findOne({
      where: { username: "systemadmin" },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      user = await db.secuser.create({
        username: "systemadmin",
        email: "admin@system.local",
        password: hashedPassword,
        isActive: true,
      });

      console.log("✅ SystemAdmin user created");
    }

    /* ---------------------------
       3. Link User to Role
    ----------------------------*/
    const userRole = await db.usermember.findOne({
      where: {
        RoleId: role.id,
        UserId: user.id,
      },
    });

    if (!userRole) {
      await db.usermember.create({
        RoleId: role.id,
        UserId: user.id,
      });
      console.log("✅ SystemAdmin role assigned to user");
    }

    /* ---------------------------
       7. Seed RolePermissions (SystemAdmin gets all)
    ----------------------------*/
    const modulePermissions = await db.modulepermission.findAll();

    for (const mp of modulePermissions) {
      const exists = await db.rolespermissions.findOne({
        where: {
          RoleId: role.id,
          PermissionId: mp.id,
        },
      });
      if (!exists) {
        await db.rolespermissions.create({
          RoleId: role.id,
          PermissionId: mp.id,
        });
      }
    }

    console.log("✅ SystemAdmin role permissions seeded");

  } catch (err) {
    console.error("❌ Seeder error:", err);
  }
};