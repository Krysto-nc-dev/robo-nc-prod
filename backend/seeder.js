import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
//  ============= MODELS =============
import User from "./models/userModel.js";
import Agent from "./models/agentModel.js";
import Zone from "./models/zoneModel.js";
import Inventory from "./models/inventoryModel.js";
import Article from "./models/articleModel.js";

import Filiale from "./models/filialeModel.js";
import AccessApp from "./models/AccessApp.js";

//  ============= DATA =============
import users from "./_data/users.js";
import agents from "./_data/agents.js";
import zones from "./_data/zones.js";
import inventories from "./_data/inventories.js";
import filiales from "./_data/filiales.js";




dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Suppression des données existantes
    await User.deleteMany();
    // await Agent.deleteMany();
    // await Zone.deleteMany();
    // await Inventory.deleteMany();
    // await Filiale.deleteMany();

     await Article.deleteMany();


    // Insertion des utilisateurs
    await User.insertMany(users);



    // await Agent.insertMany(agents);
    // await Zone.insertMany(zones);
    // await Inventory.insertMany(inventories);
    // await Filiale.insertMany(filiales);


    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
  
    await User.deleteMany();
    await Agent.deleteMany();
    await Filiale.deleteMany();
    await Zone.deleteMany();
    await Inventory.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
