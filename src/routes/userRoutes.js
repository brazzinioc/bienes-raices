import express from 'express';
import { loginForm, registerForm, passwordRecoveryForm } from '../controllers/userController.js';

const router = express.Router();

router.get('/login', loginForm);
router.get('/register', registerForm);
router.get('/password-recovery', passwordRecoveryForm);

export default router;