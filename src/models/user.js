'use strict';
const {
  Model
} = require('sequelize');
const {ServerConfig}=require('../config')
const bcrypt=require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: 'User_Roles',
        as: 'roles',
        foreignKey: 'userId',
        otherKey: 'roleId', 
      });
    }

  }
  User.init({
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      unique:true,
      validate:{
        isEmail:true
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(async function encrypt(user){
    const hashedPassword=await bcrypt.hashSync(user.password,+ServerConfig.SALT_ROUNDS)
    user.password=hashedPassword
  })
  return User;
};