require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secu';
mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const testUsers = [
    {
        username: 'admin',
        password: 'adminpass',
        email: 'admin@test.com'
    },
    {
        username: 'user1',
        password: 'password123',
        email: 'user1@test.com'
    },
    {
        username: 'test',
        password: 'testpass',
        email: 'test@test.com'
    }
];

async function initializeDatabase() {
    try {
        console.log('Connexion à MongoDB...');
        
        await mongoose.connection.asPromise();
        console.log('Connecté à MongoDB');
        
        console.log('Initialisation des utilisateurs...');
        
        let createdCount = 0;
        let skippedCount = 0;
        
        for (const userData of testUsers) {
            try {
                const existingUser = await User.findOne({ username: userData.username });
                
                if (existingUser) {
                    console.log(`L'utilisateur "${userData.username}" existe déjà - ignoré`);
                    skippedCount++;
                } else {
                    const newUser = new User(userData);
                    await newUser.save();
                    console.log(`L'utilisateur "${userData.username}" a étécréé avec succès`);
                    createdCount++;
                }
            } catch (error) {
                if (error.code === 11000) {
                    console.log(`L'Utilisateur "${userData.username}" existe déjà.`);
                    skippedCount++;
                } else {
                    console.error(`Erreur lors de la création de "${userData.username}":`, error.message);
                }
            }
        }
        
        console.log('\nRésumé :');
        console.log(`   - Utilisateurs créés : ${createdCount}`);
        console.log(`   - Utilisateurs ignorés : ${skippedCount}`);
        console.log(`   - Total traité : ${testUsers.length}`);
        
        console.log('\nUtilisateurs dans la base :');
        const allUsers = await User.find({}, 'username email createdAt');
        allUsers.forEach(user => {
            console.log(`   - ${user.username} (${user.email}) - Créé le ${user.createdAt.toLocaleDateString('fr-FR')}`);
        });
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation :', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
        process.exit(0);
    }
}

process.on('unhandledRejection', (error) => {
    console.error('Erreur non gérée :', error);
    process.exit(1);
});

console.log('Démarrage de l\'initialisation de la base de données...\n');
initializeDatabase(); 