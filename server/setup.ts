import { Sequelize } from "sequelize";
require("dotenv").config();

export const sequelize = new Sequelize(
  "berlin-2",
  process.env.DB_USER!,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully.');

    await sequelize.sync(); // Synchronize models with the database
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
