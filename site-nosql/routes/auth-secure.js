const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.render('login', { error: 'Format de données invalide' });
        }
            
        if (username.length < 3 || username.length > 50) {
            return res.render('login', { error: 'Nom d\'utilisateur invalide' });
        }
        
        if (password.length < 6) {
            return res.render('login', { error: 'Mot de passe trop court' });
        }
        
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();
        
        const user = await User.findOne({ 
            username: cleanUsername, 
            password: cleanPassword 
        });
        
        if (user) {
            await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
            res.render('dashboard', { user: user, message: 'Connexion réussie !' });
        } else {
            res.render('login', { error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.render('login', { error: 'Erreur lors de la connexion' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.render('register', { error: 'Format de données invalide' });
        }
        
        if (username.length < 3 || username.length > 50) {
            return res.render('register', { error: 'Nom d\'utilisateur doit contenir entre 3 et 50 caractères' });
        }
        
        if (password.length < 6) {
            return res.render('register', { error: 'Mot de passe doit contenir au moins 6 caractères' });
        }
        
        if (email && typeof email === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.render('register', { error: 'Format d\'email invalide' });
            }
        }
        
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();
        const cleanEmail = email ? email.trim().toLowerCase() : null;
        
        const existingUser = await User.findOne({ username: cleanUsername });
        if (existingUser) {
            return res.render('register', { error: 'Ce nom d\'utilisateur existe déjà' });
        }
        
        const newUser = new User({ 
            username: cleanUsername, 
            password: cleanPassword, 
            email: cleanEmail 
        });
        await newUser.save();
        
        res.render('login', { success: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' });
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        if (error.code === 11000) {
            res.render('register', { error: 'Ce nom d\'utilisateur ou cet email existe déjà' });
        } else {
            res.render('register', { error: 'Erreur lors de la création du compte' });
        }
    }
});

router.get('/logout', (req, res) => {
    res.redirect('/auth/login');
});

module.exports = router; 