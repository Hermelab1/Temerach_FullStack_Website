const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models'); // ✅ CORRECT
const { Op } = require('sequelize');
require('dotenv').config();

async function getAllUser(req, res) {
  const users = await db.secuser.findAll({
    attributes: { exclude: ['password'] }
  });
  res.json({ success: true, users });
}

async function registerUser(req, res) {
  const { username, email, password, roleId } = req.body;

  // 1. Validation
  if (!username || !email || !password || !roleId) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Start a transaction to ensure both inserts succeed or both fail
  const t = await db.sequelize.transaction();

  try {
    // 2. Check if user already exists
    const exists = await db.secuser.findOne({ 
      where: { [Op.or]: [{ username }, { email }] } 
    });

    if (exists) {
      await t.rollback();
      return res.status(409).json({ success: false, message: 'Username or Email already exists' });
    }

    // 3. Hash Password
    const hash = await bcrypt.hash(password, 10);

    // 4. Create User in 'secusers' table
    const newUser = await db.secuser.create({
      username,
      email,
      password: hash,
      isActive: true
    }, { transaction: t });

    // 5. Create Entry in 'usermember' table (Linking User to Role)
    await db.usermember.create({
      UserId: newUser.id,
      RoleId: roleId
    }, { transaction: t });

    // Commit the changes
    await t.commit();

    // 6. Fetch the complete user with Role info to send back to Frontend
    const createdUser = await db.secuser.findByPk(newUser.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: db.usermember,
        as: 'roles',
        include: [{ model: db.secrole, as: 'role' }]
      }]
    });

    // Flatten the response so it matches your frontend's "user.Role.roleName" logic
    const userJson = createdUser.toJSON();
    // Providing a fallback for the UI logic: user.Role.roleName
    userJson.Role = userJson.roles[0]?.role || { roleName: "Standard User" };

    res.status(201).json({ 
      success: true, 
      user: userJson,
      message: "User and Role assigned successfully" 
    });

  } catch (err) {
    // Rollback transaction on any error
    await t.rollback();
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function deleteUser(req, res) {
  await db.secuser.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
}

async function updateUser(req, res) {
  const { username, email, password, roleId } = req.body;
  const updateData = { username, email, roleId };
  if (password) updateData.password = await bcrypt.hash(password, 10);

  await db.secuser.update(updateData, { where: { id: req.params.id } });
  const updated = await db.secuser.findByPk(req.params.id, { include: ['Role'] });
  res.json({ success: true, user: updated });
}

async function postlogin(req, res) {
  const { identifier, password } = req.body;

  const user = await db.secuser.findOne({
    where: {
      [Op.or]: [
        { username: identifier },
        { email: identifier }
      ]
    }
  });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign(
    { id: user.id, roleId: user.roleId, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
}

module.exports = { getAllUser, registerUser, postlogin, deleteUser, updateUser };
