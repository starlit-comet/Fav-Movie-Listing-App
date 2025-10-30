import { DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

export type MediaType = 'movie' | 'tv';

export interface FavoriteAttributes {
  id: number;
  userId: number;
  title: string;
  type: MediaType;
  director?: string | null;
  budget?: number | null;
  location?: string | null;
  durationMinutes?: number | null;
  year?: number | null;
  description?: string | null;
  rating?: number | null; // 0-10
  createdAt?: Date;
  updatedAt?: Date;
}

export type FavoriteCreationAttributes = Optional<FavoriteAttributes, 'id' | 'director' | 'budget' | 'location' | 'durationMinutes' | 'year' | 'description' | 'rating' | 'createdAt' | 'updatedAt'>;

export class Favorite extends Model<InferAttributes<Favorite>, InferCreationAttributes<Favorite>> implements FavoriteAttributes {
  declare id: number;
  declare userId: number;
  declare title: string;
  declare type: MediaType;
  declare director: string | null;
  declare budget: number | null;
  declare location: string | null;
  declare durationMinutes: number | null;
  declare year: number | null;
  declare description: string | null;
  declare rating: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('movie', 'tv'),
      allowNull: false,
    },
    director: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    budget: {
      // store as DECIMAL(15,2) for MySQL; SQLite stores as TEXT/NUMERIC internally
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    durationMinutes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      validate: { min: 0 },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1888, max: 3000 },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: 0, max: 10 },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'favorites',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['type'] },
      { fields: ['year'] },
    ],
  }
);

// Associations will be set in models/index
export default Favorite;
