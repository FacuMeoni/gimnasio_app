import Gimnasios from "./Gimnasios.js";
import Usuarios from "./Usuarios.js";
import Membresias from "./Membresias.js";
import Planes from "./Planes.js";
import sequelize from "../config/database.js";

Gimnasios.hasMany(Usuarios);
Usuarios.belongsTo(Gimnasios);

Gimnasios.hasMany(Membresias);
Membresias.belongsTo(Gimnasios);

Gimnasios.hasMany(Planes);
Planes.belongsTo(Gimnasios);


Usuarios.hasMany(Membresias);
Membresias.belongsTo(Usuarios);

Planes.hasMany(Membresias);
Membresias.belongsTo(Planes);


export { sequelize, Gimnasios, Usuarios, Membresias, Planes };