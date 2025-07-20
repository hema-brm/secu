const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/secu', { 
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

async function resetDatabase() {
    try {
        console.log('Connexion à MongoDB...');
        
        await mongoose.connection.asPromise();
        console.log('Connecté à MongoDB');
        
        console.log('Suppression de tous les utilisateurs existants...');
        
        const deleteResult = await User.deleteMany({});
        console.log(`${deleteResult.deletedCount} utilisateur(s) supprimé(s)`);
        
        console.log('Création des nouveaux utilisateurs de test...');
        
        let createdCount = 0;
        
        for (const userData of testUsers) {
            try {
                const newUser = new User(userData);
                await newUser.save();
                console.log(`Utilisateur "${userData.username}" créé avec succès`);
                createdCount++;
            } catch (error) {
                console.error(`Erreur lors de la création de "${userData.username}":`, error.message);
            }
        }
        
        console.log('\nRésumé :');
        console.log(`   - Utilisateurs supprimés : ${deleteResult.deletedCount}`);
        console.log(`   - Nouveaux utilisateurs créés : ${createdCount}`);
        
        console.log('\nUtilisateurs dans la base :');
        const allUsers = await User.find({}, 'username email createdAt');
        allUsers.forEach(user => {
            console.log(`   - ${user.username} (${user.email}) - Créé le ${user.createdAt.toLocaleDateString('fr-FR')}`);
        });
        
    } catch (error) {
        console.error('Erreur lors de la réinitialisation :', error.message);
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

console.log('Démarrage de la réinitialisation de la base de données...\n');
resetDatabase();