//const express = require('express'); // common js
import express from 'express'; 
import userRoutes from './routes/userRoutes.js';

// crear la app
const app = express();

// Habilitar pug (template engine)
app.set('view engine', 'pug');
app.set('views', './src/views');

// carpeta pública
app.use(express.static('src/public'));

// Routing
app.use('/auth', userRoutes); // get busca la ruta exacta, en cambio use escanea todas las rutas

// definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});