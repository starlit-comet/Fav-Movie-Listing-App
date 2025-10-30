import sequelize from '../config/database';
import User from './User';
import Favorite from './Favorite';

// Associations
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Favorite };
