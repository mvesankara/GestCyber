const { Client } = require('pg');

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

exports.getChecklist = async (req, res) => {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        const query = `
            SELECT
                c.id as category_id, c.nom as category_nom, c.ordre as category_ordre,
                i.id as item_id, i.question, i.type_reponse, i.ordre as item_ordre
            FROM checklist_categories c
            LEFT JOIN checklist_items i ON c.id = i.category_id
            ORDER BY c.ordre, i.ordre;
        `;
        const result = await client.query(query);

        const categories = {};
        result.rows.forEach(row => {
            if (!categories[row.category_id]) {
                categories[row.category_id] = {
                    id: row.category_id,
                    nom: row.category_nom,
                    ordre: row.category_ordre,
                    items: []
                };
            }
            if (row.item_id) {
                categories[row.category_id].items.push({
                    id: row.item_id,
                    question: row.question,
                    type_reponse: row.type_reponse,
                    ordre: row.item_ordre
                });
            }
        });

        res.status(200).json(Object.values(categories));
    } catch (err) {
        console.error('Erreur lors de la récupération de la checklist:', err.message);
        res.status(500).send('Erreur du serveur.');
    } finally {
        if (client) await client.end();
    }
};

exports.getAnswers = async (req, res) => {
    const { incidentId } = req.params;
    const client = new Client(dbConfig);
    try {
        await client.connect();
        const query = 'SELECT * FROM crisis_answers WHERE incident_id = $1';
        const result = await client.query(query, [incidentId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des réponses:', err.message);
        res.status(500).send('Erreur du serveur.');
    } finally {
        if (client) await client.end();
    }
};

exports.submitAnswer = async (req, res) => {
    const { incident_id, item_id, reponse_boolean, reponse_text, reponse_date, commentaires } = req.body;
    if (!incident_id || !item_id) {
        return res.status(400).json({ msg: 'Les champs incident_id et item_id sont obligatoires.' });
    }

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const query = `
            INSERT INTO crisis_answers (incident_id, item_id, reponse_boolean, reponse_text, reponse_date, commentaires)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (incident_id, item_id)
            DO UPDATE SET
                reponse_boolean = EXCLUDED.reponse_boolean,
                reponse_text = EXCLUDED.reponse_text,
                reponse_date = EXCLUDED.reponse_date,
                commentaires = EXCLUDED.commentaires,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;
        const values = [incident_id, item_id, reponse_boolean, reponse_text, reponse_date, commentaires];
        const result = await client.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la soumission de la réponse:', err.message);
        res.status(500).send('Erreur du serveur.');
    } finally {
        if (client) await client.end();
    }
};