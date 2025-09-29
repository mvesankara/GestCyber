const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const process = require('process');

// Database connection configuration
const dbConfig = {
    user: process.env.DB_USER || 'gestcyber_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'gestcyber',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = async (req, res) => {
    const { nom, prenom, email, password, role, equipe } = req.body;

    if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ msg: 'Please provide all required fields: nom, prenom, email, password' });
    }

    const client = new Client(dbConfig);

    try {
        await client.connect();

        // 1. Check if user already exists
        const userExistsResult = await client.query('SELECT id FROM utilisateurs WHERE email = $1', [email]);
        if (userExistsResult.rows.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert new user into the database
        const newUserResult = await client.query(
            'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, equipe) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role',
            [nom, prenom, email, hashedPassword, role || 'consultant', equipe || 'metiers'] // Default role/equipe
        );

        const newUser = newUserResult.rows[0];

        // 4. Create and return JWT token
        const payload = {
            user: {
                id: newUser.id,
                email: email,
                role: newUser.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );

    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).send('Server error during registration');
    } finally {
        if (client) await client.end();
    }
};


// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
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
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        // Compare password with hashed password from DB
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
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
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
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

// @route   GET api/auth/me
// @desc    Get current user's data
// @access  Private
exports.getMe = async (req, res) => {
    // req.user is available due to authMiddleware
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