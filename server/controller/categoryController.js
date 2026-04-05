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
        const { categoryName, categoryDescription, subCategory, isActive } = req.body;

        const newCategory = await db.Category.create({
            categoryName,
            categoryDescription,
            subCategory,
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
        const { categoryName, categoryDescription, subCategory, isActive } = req.body;

        const category = await db.Category.findByPk(id);
        if (!category) return res.status(404).json({ message: "Not found" });

        await category.update({
            categoryName: categoryName || category.categoryName,
            categoryDescription: categoryDescription || category.categoryDescription,
            subCategory: subCategory || category.subCategory,
            isActive: isActive !== undefined ? isActive : category.isActive
        });

        res.json({ message: "Updated", category });
    } catch (error) {
        console.error("DETAILED UPDATE ERROR:", error);
        res.status(500).json({ message: "Update failed" });
    }
}

async function getActiveCategory(req, res) {
    try {
        const activeCategories = await db.Category.findAll({
            where: { isActive: true },
            order: [["createdAt", "DESC"]],
        });
        res.json(activeCategories);
    } catch (error) {
        console.error("DETAILED ACTIVE FETCH ERROR:", error);
        res.status(500).json({ message: "Failed to fetch active categories", error: error.message });
    }
}

module.exports = { getAllCategory, addCategory, updateCategory, getActiveCategory };
