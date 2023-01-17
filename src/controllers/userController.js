import { check, validationResult } from 'express-validator';
import User from '../models/User.js';

const loginForm = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Iniciar Sesión'
    });
}

const registerForm = (req, res) => {
    res.render('auth/register', {
        pageTitle: 'Crear cuenta'
    });
}

const passwordRecoveryForm = (req, res) => {
    res.render('auth/password-recovery', {
        pageTitle: 'Recuperar contraseña'
    });
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const passwordConfirm = req.body.password_confirm;

    // validación
    await check('name').notEmpty().withMessage('El Nombre es requerido').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    await check('password_confirm').equals(req.body.password).withMessage('Los passwords no son iguales').run(req);

    let result = validationResult(req);

    if (!result.isEmpty()){
        return res.render('auth/register', {
            pageTitle: 'Crear cuenta',
            data: { name, email },
            errors: result.array(),
        });
    }
  
    const userAlreadyExist = await User.findOne( { where: { email } });

    if (userAlreadyExist) {
        return res.render('auth/register', {
            pageTitle: 'Crear cuenta',
            data: { name, email },
            errors: [ { msg: "Correo ya encuentra en uso" }],
        });
    }

    const user = await User.create({ name, email, password });
    res.json(user);
}

// export default solo uno puedes tener uno solo por archivo
export {
    loginForm,
    registerForm,
    passwordRecoveryForm,
    registerUser,
}