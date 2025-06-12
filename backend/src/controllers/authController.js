// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const process = require('process');

// Database connection configuration
// Ensure JWT_SECRET is set in your .env file
const dbConfig = {
    user: process.env.DB_USER || 'gestcyber_user',
    host: process.env.DB_HOST || 'postgres', // Use service name from docker-compose
    database: process.env.DB_NAME || 'gestcyber',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    const client = new Client(dbConfig);

    try {
        await client.connect();
        const userResult = await client.query('SELECT id, email, mot_de_passe, role FROM utilisateurs WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
        }

        const user = userResult.rows[0];

        // Compare password with hashed password from DB
        // Assuming 'mot_de_passe' stores the bcrypt hash
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials (password mismatch)' });
        }

        // User matched, create JWT payload
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }, // Use env var for expiration
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server error during login');
    } finally {
        if (client) await client.end();
    }
};

// Example protected route controller (can be in another controller file)
// For now, just to demonstrate middleware usage if we add a test route.
exports.getMe = async (req, res) => {
    // req.user is available due to authMiddleware
    // This would typically fetch user details from DB based on req.user.id
    // but without sensitive info like password.
    try {
        const client = new Client(dbConfig);
        await client.connect();
        const userResult = await client.query('SELECT id, nom, prenom, email, role, equipe FROM utilisateurs WHERE id = $1', [req.user.id]);
        await client.end();

        if (userResult.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(userResult.rows[0]);
    } catch (err) {
        console.error('GetMe error:', err.message);
        res.status(500).send('Server error');
    }
};
