import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Role = sequelize.define(
    "role", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
    }, {
        timestamps: true
    }
);
export default Role;