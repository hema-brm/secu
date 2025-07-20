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
        
        const user = await User.findOne({ username: username, password: password });
        
        if (user) {
            await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
            
            req.session.user = {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: new Date()
            };
            
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    } catch (error) {
        res.render('login', { error: 'Erreur lors de la connexion' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.render('register', { error: 'Ce nom d\'utilisateur existe déjà' });
        }
        
        const newUser = new User({ username, password, email });
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
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router; 