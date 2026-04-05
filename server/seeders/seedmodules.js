const db = require("../models");

async function seedModulesPermissions() {

  try {

    const modulesData = [
      { moduleName: "Dashboard", submoduleName: "Dashboard", path: "/admin", icon: "fa-solid fa-house" },

      { moduleName: "Product Management", submoduleName: "Items", path: "/admin/additem", icon: "fa-solid fa-boxes-stacked" },
      { moduleName: "Product Management", submoduleName: "Categories", path: "/admin/addcategories", icon: "fa-solid fa-boxes-stacked" },
      { moduleName: "Product Management", submoduleName: "UOM", path: "/admin/adduom", icon: "fa-solid fa-boxes-stacked" },

      { moduleName: "Orders & Payments", submoduleName: "Orders", path: "/admin/orders", icon: "fa-solid fa-cart-shopping" },
      { moduleName: "Orders & Payments", submoduleName: "Payments", path: "/admin/payment", icon: "fa-solid fa-cart-shopping" }
    ];

    const actions = ["ADD", "EDIT", "VIEW", "REMOVE"];

    // Seed PermissionActions
    for (const action of actions) {

      const exists = await db.permissionaction.findOne({ where: { action } });

      if (!exists) {
        await db.permissionaction.create({ action });
      }

    }

    console.log("✅ Permission actions seeded");

    // Seed Modules
    for (const module of modulesData) {

      const exists = await db.modules.findOne({
        where: {
          moduleName: module.moduleName,
          submoduleName: module.submoduleName
        }
      });

      if (!exists) {
        await db.modules.create(module);
      }

    }

    console.log("✅ Modules seeded");

    const modules = await db.modules.findAll();
    const permissions = await db.permissionaction.findAll();

    // Seed ModulePermissions
    for (const mod of modules) {

      for (const perm of permissions) {

        const exists = await db.modulepermission.findOne({
          where: {
            moduleId: mod.id,
            permissionActionId: perm.id
          }
        });

        if (!exists) {

          await db.modulepermission.create({
            moduleId: mod.id,
            permissionActionId: perm.id
          });

        }

      }

    }

    console.log("✅ Module permissions seeded");

  } catch (error) {

    console.error("❌ Seeder error:", error);

  }

}

module.exports = seedModulesPermissions;