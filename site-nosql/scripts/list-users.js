const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/secu', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

async function listUsers() {
    try {
        console.log('Connexion à MongoDB...');
        
        await mongoose.connection.asPromise();
        console.log('Connecté à MongoDB');
        
        console.log('Récupération des utilisateurs...\n');
        
        const users = await User.find({}, 'username email createdAt lastLogin');
        
        if (users.length === 0) {
            console.log('Aucun utilisateur trouvé dans la base de données.');
            console.log('Utilisez le script init-db.js pour créer des utilisateurs de test.');
        } else {
            console.log(`${users.length} utilisateur(s) trouvé(s) :\n`);
            
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.username}`);
                console.log(`   Email: ${user.email || 'Non renseigné'}`);
                console.log(`   Créé le: ${user.createdAt.toLocaleString('fr-FR')}`);
                
                if (user.lastLogin) {
                    console.log(`   Dernière connexion: ${user.lastLogin.toLocaleString('fr-FR')}`);
                } else {
                    console.log(`   Dernière connexion: Jamais connecté`);
                }
                console.log('');
            });
        }
        
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Connexion fermée');
        process.exit(0);
    }
}

process.on('unhandledRejection', (error) => {
    console.error('Erreur non gérée :', error);
    process.exit(1);
});

console.log('Récupération de la liste des utilisateurs...\n');
listUsers(); 