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

  if (!username || !email || !password || !roleId) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const exists = await db.secuser.findOne({ where: { username } });
  if (exists) {
    return res.status(409).json({ message: 'Username exists' });
  }

  const hash = await bcrypt.hash(password, 10);

  await db.secuser.create({
    username,
    email,
    password: hash,
    roleId
  });

  res.status(201).json({ success: true });
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

module.exports = { getAllUser, registerUser, postlogin };
