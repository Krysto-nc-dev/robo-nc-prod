import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Choisir l'URI MongoDB en fonction de l'environnement
    const mongoURI = process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_DEV;

    // Vérifie que l'URI existe
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined');
    }

    // Connexion à MongoDB avec des options mises à jour
    const conn = await mongoose.connect(mongoURI, {
    

    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
