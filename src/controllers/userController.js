

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


// export default solo uno puedes tener uno solo por archivo
export {
    loginForm,
    registerForm,
    passwordRecoveryForm,
}