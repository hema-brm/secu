require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('trust proxy', 1);

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secu';
mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'la-cle-secrete-esgi',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.use('/static', express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    
    res.render('dashboard', { 
        user: req.session.user, 
        message: 'Bienvenue sur le tableau de bord !' 
    });
});

app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Page non trouvée',
        error: { status: 404 }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Erreur interne du serveur',
        error: { status: 500 }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur vulnérable en écoute sur le port ${PORT}`);
    console.log(`Accédez à http://localhost:${PORT} pour tester l'injection NoSQL`);
}); 