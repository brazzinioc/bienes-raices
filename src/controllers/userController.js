import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateId } from '../helpers/tokens.js';
import { registerEmail } from '../helpers/emails.js';

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

    // create User
    const newUser = await User.create({
        name,
        email,
        password,
        token: generateId()
    });

    console.log(newUser);

    console.log('-------------');
    console.log(newUser.name);
    console.log(newUser.email);
    console.log(newUser.token);

    if(newUser /*!= undefined && newUser.hasOwnProperty('name') && newUser.hasOwnProperty('email') && newUser.hasOwnProperty('token')*/) {
        const emailSent = await registerEmail({
            name: newUser.name,
            email: newUser.email,
            token: newUser.token
        });
        console.log("Email sent output");
        console.log(emailSent);
    }
    // show message
    return res.render('templates/message',{
        pageTitle: 'Cuenta creada correctamente',
        message: 'Hemos enviado un email de confirmación haga click en el enlace'
    });
}

// export default solo uno puedes tener uno solo por archivo
export {
    loginForm,
    registerForm,
    passwordRecoveryForm,
    registerUser,
}