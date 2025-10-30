import { DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
//   passwordSalt: string;
//   role: 'user' | 'admin';
//   isVerified: boolean;
  createdAt?: Date;
//   updatedAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' >;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare name: string;
  declare passwordHash: string;
//   declare passwordSalt: string;
//   declare role: 'user' | 'admin';
//   declare isVerified: boolean;
  declare readonly createdAt?: Date;
//   declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    // passwordSalt: {
    //   type: DataTypes.STRING(64),
    //   allowNull: false,
    // },
    // role: {
    //   type: DataTypes.ENUM('user', 'admin'),
    //   defaultValue: 'user',
    //   allowNull: false,
    // },
    // isVerified: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    //   allowNull: false,
    // },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
    // updatedAt: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [{ unique: true, fields: ['email'] }],
  }
);

export default User;
