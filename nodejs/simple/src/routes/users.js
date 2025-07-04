const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Validation rules
const userValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Por favor ingresa un email válido')
    .normalizeEmail(),
  body('age')
    .optional()
    .isInt({ min: 18, max: 120 })
    .withMessage('La edad debe estar entre 18 y 120 años'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser un valor booleano')
];

// GET /api/users - Get all users (with pagination)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ isActive: true });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST /api/users - Create new user
router.post('/', auth, userValidation, validate, async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    // Check if email already exists
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }

    const user = new User({ name, email, password, age });
    await user.save();

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', auth, userValidation, validate, async (req, res) => {
  try {
    const { name, email, age, isActive } = req.body;

    // Check if email already exists (if updating email)
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE /api/users/:id - Soft delete user
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario eliminado exitosamente',
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router; 