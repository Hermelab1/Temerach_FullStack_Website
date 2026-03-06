const db = require('../models'); // Ensure this points to your models/index.js

async function getAllCategory(req, res) {
    try {
        const categories = await db.Category.findAll({
            order: [["createdAt", "DESC"]],
        });
        res.json(categories);
    } catch (error) {
        console.error("DETAILED FETCH ERROR:", error);
        res.status(500).json({ message: "Failed to fetch categories", error: error.message });
    }
}

async function addCategory(req, res) {
    try {
        const { categoryName, categoryDescription, isActive } = req.body;

        // Check for duplicates manually (Sequelize will also catch this due to 'unique: true')
        const existing = await db.Category.findOne({ where: { categoryName } });
        if (existing) return res.status(400).json({ message: "Category name already exists" });

        const newCategory = await db.Category.create({
            categoryName,
            categoryDescription,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({ message: "Success", category: newCategory });
    } catch (error) {
        console.error("DETAILED CREATE ERROR:", error);
        res.status(500).json({ message: "Failed to create category", error: error.message });
    }
}

async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { categoryName, categoryDescription, isActive } = req.body;

        const category = await db.Category.findByPk(id);
        if (!category) return res.status(404).json({ message: "Not found" });

        await category.update({
            categoryName: categoryName || category.categoryName,
            categoryDescription: categoryDescription || category.categoryDescription,
            isActive: isActive !== undefined ? isActive : category.isActive
        });

        res.json({ message: "Updated", category });
    } catch (error) {
        console.error("DETAILED UPDATE ERROR:", error);
        res.status(500).json({ message: "Update failed" });
    }
}

module.exports = { getAllCategory, addCategory, updateCategory };
