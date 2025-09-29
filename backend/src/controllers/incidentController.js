const { Client } = require('pg');

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

exports.createIncident = async (req, res) => {
    const { titre, description } = req.body;
    if (!titre) {
        return res.status(400).json({ msg: 'Le titre est obligatoire.' });
    }

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const query = 'INSERT INTO incidents (titre, description) VALUES ($1, $2) RETURNING *';
        const result = await client.query(query, [titre, description]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la création de l\'incident:', err.message);
        res.status(500).send('Erreur du serveur.');
    } finally {
        if (client) await client.end();
    }
};

exports.getAllIncidents = async (req, res) => {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM incidents ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des incidents:', err.message);
        res.status(500).send('Erreur du serveur.');
    } finally {
        if (client) await client.end();
    }
};