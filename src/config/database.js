import Sequelize from 'sequelize';

const database = new Sequelize(
    process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOSTNAME,
        port: 3306,
        dialect: 'mysql',
        define: {
            timestamps: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        operatorAliases: false
    }
);

export default database;