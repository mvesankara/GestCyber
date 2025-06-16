// backend/src/controllers/filEvenementsController.js
const { Client } = require('pg');
const process = require('process');

const dbConfig = {
    user: process.env.DB_USER || 'gestcyber_user',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DB_NAME || 'gestcyber',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};

// @desc    Create a new entry in "Fil des Événements" (main_courante)
// @route   POST /api/fil-evenements
// @access  Private
// @body    incident_id (required), contenu (required), type_entree, destinataires, criticite (optional)
exports.createEntreeFil = async (req, res) => {
    const { incident_id, contenu, type_entree, destinataires, criticite } = req.body;
    const auteur_id = req.user.id; // From authMiddleware

    if (!incident_id || !contenu) {
        return res.status(400).json({ msg: 'Veuillez fournir incident_id et contenu.' });
    }
    if (isNaN(parseInt(incident_id))) {
        return res.status(400).json({ msg: 'Format invalide pour incident_id.' });
    }

    const client = new Client(dbConfig);
    try {
        await client.connect();

        // Check if incident exists
        const incidentCheck = await client.query('SELECT id FROM incidents WHERE id = $1', [incident_id]);
        if (incidentCheck.rows.length === 0) {
            return res.status(404).json({ msg: `Incident avec ID ${incident_id} non trouvé.` });
        }

        const query = `
            INSERT INTO main_courante (incident_id, auteur_id, contenu, type_entree, destinataires, criticite)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [incident_id, auteur_id, contenu, type_entree, destinataires, criticite];
        const result = await client.query(query, values);

        // For consistency or immediate display, fetch the newly created entry with author details
        const newEntryResult = await client.query(
            `SELECT mc.*, u.nom AS auteur_nom, u.prenom AS auteur_prenom, u.email AS auteur_email
             FROM main_courante mc
             LEFT JOIN utilisateurs u ON mc.auteur_id = u.id
             WHERE mc.id = $1`,
            [result.rows[0].id]
        );

        res.status(201).json(newEntryResult.rows[0]);

    } catch (err) {
        console.error('Create EntreeFil error:', err.message, err.code, err.detail);
        if (err.code === '23503') { // Foreign key violation
            if (err.constraint && err.constraint.includes('main_courante_incident_id_fkey')) {
                return res.status(400).json({ msg: `Incident avec ID ${incident_id} non trouvé.` });
            }
             if (err.constraint && err.constraint.includes('main_courante_auteur_id_fkey')) {
                return res.status(400).json({ msg: `Utilisateur auteur avec ID ${auteur_id} non trouvé (problème système).` });
            }
        }
        if (err.code === '23514') { // Check constraint violation
            return res.status(400).json({ msg: `Valeur invalide pour les champs énumérés (type_entree, criticite). Erreur: ${err.detail || err.message}` });
        }
        res.status(500).send('Erreur serveur lors de la création de l\'entrée.');
    } finally {
        if (client) await client.end();
    }
};

// @desc    Get all "Fil des Événements" entries for a specific incident
// @route   GET /api/fil-evenements?incidentId=:incidentId
// @access  Private
exports.getEntreesFilPourIncident = async (req, res) => {
    const { incidentId } = req.query;

    if (!incidentId) {
        return res.status(400).json({ msg: 'Le paramètre incidentId est requis.' });
    }
    if (isNaN(parseInt(incidentId))) {
        return res.status(400).json({ msg: 'Format invalide pour incidentId.' });
    }

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const query = `
            SELECT mc.id, mc.incident_id, mc.auteur_id, mc.type_entree, mc.contenu,
                   mc.destinataires, mc.criticite, mc.timestamp_creation, mc.lu_par,
                   u.nom AS auteur_nom, u.prenom AS auteur_prenom, u.email AS auteur_email
            FROM main_courante mc
            LEFT JOIN utilisateurs u ON mc.auteur_id = u.id
            WHERE mc.incident_id = $1
            ORDER BY mc.timestamp_creation DESC;
        `;
        const result = await client.query(query, [incidentId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Get EntreesFilPourIncident error:', err.message);
        res.status(500).send('Erreur serveur lors de la récupération des entrées.');
    } finally {
        if (client) await client.end();
    }
};
