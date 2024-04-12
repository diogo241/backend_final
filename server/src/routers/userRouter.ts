import { Router } from "express";
import { check } from 'express-validator';
import UserController from "../controllers/UserController.js";
import { checkRoles } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API endpoints for managing users
 */

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/User'
 */
router.get('/users', UserController.getAllUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrive
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: The user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error
 */
router.get('/users/:id', UserController.getUserById);


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post(
    '/register',
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isStrongPassword()
        .withMessage(`minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1`),
        check('role').isIn(['USER', 'ADMIN']).withMessage('Invalid role')
    ],
    UserController.registerUser
);

router.post(
    '/login',
    [
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isLength({ min: 6 })
            .withMessage('Password should be at least 6 chars long')
    ],
    UserController.loginUser
);

router.delete('/users/:id', UserController.deleteUser);

export default router;