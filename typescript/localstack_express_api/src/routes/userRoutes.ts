import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', (req, res) => userController.create(req, res));

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', (req, res) => userController.getAll(req, res));

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', (req, res) => userController.getById(req, res));

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Public
 */
router.put('/:id', (req, res) => userController.update(req, res));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Public
 */
router.delete('/:id', (req, res) => userController.delete(req, res));

export default router;

