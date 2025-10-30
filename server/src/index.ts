import { sequelize } from './models';
import app from './app';

async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('Database synced');

  const PORT = Number(process.env.PORT) || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
