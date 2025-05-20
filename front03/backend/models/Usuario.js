const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    tipo: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING },
    rg: { type: DataTypes.STRING },
    dataCadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

module.exports = Usuario;
