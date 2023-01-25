import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateId } from '../helpers/tokens.js';
import { registerEmail } from '../helpers/emails.js';

const loginForm = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
    });
}

const registerForm = (req, res) => {
    res.render('auth/register', {
        pageTitle: 'Crear cuenta',
        csrfToken: req.csrfToken(),
    });
}

const passwordRecoveryForm = (req, res) => {
    res.render('auth/password-recovery', {
        pageTitle: 'Recuperar contraseña',
        csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
            data: { name, email },
            errors: result.array(),
        });
    }
  
    const userAlreadyExist = await User.findOne( { where: { email } });

    if (userAlreadyExist) {
        return res.render('auth/register', {
            pageTitle: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            data: { name, email },
            errors: [ { msg: "Correo ya encuentra en uso" }],
        });
    }

    // create User
    const newUser = await User.create({
        name,
        email,
        password,
        token: generateId()
    });

    if(newUser) {
        await registerEmail({
            name: newUser.name,
            email: newUser.email,
            token: newUser.token
        });
    }

    // show message
    return res.render('templates/message',{
        pageTitle: 'Cuenta creada correctamente',
        message: 'Hemos enviado un email de confirmación haga click en el enlace'
    });
}

const confirmAccount = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ where: { token }});

    if(!user) {
        return res.render('auth/confirm-account',{
            pageTitle: 'Error al confirmar cuenta',
            message: 'Hubo un error al confirmar tu cuenta, inténtalo nuevamente',
            error: true
        });
    }

    //confirm account
    user.token = null;
    user.confirmed = true;
    await user.save();

    res.render('auth/confirm-account',{
        pageTitle: 'Cuenta confirmada',
        message: 'La cuenta se confirmó correctamente'
    });
}

export {
    loginForm,
    registerForm,
    passwordRecoveryForm,
    registerUser,
    confirmAccount,
}