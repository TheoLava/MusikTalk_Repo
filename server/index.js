const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const { escape } = require('validator');
const winston = require('winston');

const app = express();

// Configuration de winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});


// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/crud', {
}).then(() => {
console.log('Connected to MongoDB');
}).catch((err) => {
console.error('Error connecting to MongoDB:', err);
});

// Définition du schéma et du modèle
const UsersSchema = new mongoose.Schema({
    password:String,
    user_id:String,
    username: String    
});

const UserModel = mongoose.model("users", UsersSchema)

//Middleware
app.use(cors());
app.use(express.json()); // Middleware pour parser le JSON

// Route pour obtenir les utilisateurs
app.post("/signup",async (req,res) => {
    console.log('Received POST request on /addUsers');
    try {
        const username = escape(req.body.username); // Supposons que la liste d'utilisateurs est envoyée dans le corps de la requête
        const password = escape(req.body.password);
        const result = await UserModel.insertone({username:username, password:password});
        res.status(201).json(result);
    } catch (err) {
        console.error('Error fetching users:',err);
        res.status(500).send('Internal Server Error');
    }
});

//app.get('/',(req,res) => {
//    res.send('Like and subscribe :)')
//})

// Démarrage du server
app.listen(8080,()=>{
    console.log('server listening on port 8080');
});