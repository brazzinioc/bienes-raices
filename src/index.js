//const express = require('express'); // common js
import express from 'express'; 
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import database from './config/database.js';

// crear la app
const app = express();

// Habilita lectura de datos de formularios
app.use(express.urlencoded({extended:true}));

// Habilita cookier parser
app.use(cookieParser());

// Habilita CSRF
app.use(csrf({ cookie: true}));

// conexión a la bd
try {
    await database.authenticate();
    database.sync();
    console.log('Conexión exitosa a la base de datos');
} catch (e) {
    console.error(e);
}

// Habilitar pug (template engine)
app.set('view engine', 'pug');
app.set('views', './src/views');

// carpeta pública
app.use(express.static('src/public'));

// Routing
app.use('/auth', userRoutes); // get busca la ruta exacta, en cambio use escanea todas las rutas

// definir un puerto y arrancar el proyecto
const port = process.env.PROJECT_PORT || 3000;
app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});

console.log(process.env.DB_NAME);
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOSTNAME);