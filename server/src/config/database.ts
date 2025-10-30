import { Sequelize } from 'sequelize';

const {
  DB_DIALECT = 'sqlite',
  MYSQL_HOST = 'localhost',
  MYSQL_PORT = '3306',
  MYSQL_DATABASE = 'fav_movies',
  MYSQL_USER = 'root',
  MYSQL_PASSWORD = 'password',
  SQLITE_STORAGE = 'database.sqlite',
  NODE_ENV = 'development',
} = process.env as Record<string, string>;

export const sequelize = (() => {
  const dialect = DB_DIALECT as 'mysql' | 'sqlite';

  if (dialect === 'mysql') {
    return new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
      host: MYSQL_HOST,
      port: parseInt(MYSQL_PORT, 10),
      dialect : 'mysql',
      logging: NODE_ENV === 'development' ? console.log : false,
    });
  }

  // default sqlite
  return new Sequelize({
    dialect: 'sqlite',
    storage: SQLITE_STORAGE,
    logging: NODE_ENV === 'development' ? console.log : false,
  });
})();

export default sequelize;
