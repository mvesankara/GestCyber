const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

// --- DÉBOGAGE : Imprimer la configuration de la base de données ---
console.log("Configuration de la base de données utilisée par authController:", dbConfig);

exports.register = async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ msg: 'Veuillez fournir tous les champs obligatoires.' });
    }

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const userExists = await client.query('SELECT id FROM utilisateurs WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'Un utilisateur avec cet email existe déjà.' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserResult = await client.query(
            'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING id',
            [nom, prenom, email, hashedPassword]
        );
        const newUser = newUserResult.rows[0];

        const payload = { user: { id: newUser.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error('Erreur d\'inscription:', err.message);
        res.status(500).send('Erreur du serveur.');
    } finally {
        if (client) await client.end();
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Veuillez fournir un email et un mot de passe.' });
    }

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const userResult = await client.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ msg: 'Identifiants invalides.' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Identifiants invalides.' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

        res.json({ token });
    } catch (err) {
        console.error('Erreur de connexion:', err.message);
        res.status(500).send('Erreur du serveur.');
    } finally {
        if (client) await client.end();
    }
};