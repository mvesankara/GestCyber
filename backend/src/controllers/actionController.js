// backend/src/controllers/actionController.js
const { Client } = require('pg');
const process = require('process');

const dbConfig = {
    user: process.env.DB_USER || 'gestcyber_user',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DB_NAME || 'gestcyber',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};

// @desc    Create a new action for an incident
// @route   POST /api/actions
// @access  Private
// @body    Requires incident_id, titre, phase, priorite, type_action, statut. Optional: description, assignee_id, equipe_responsable, date_echeance
exports.createAction = async (req, res) => {
    const { incident_id, titre, phase, priorite, type_action, statut } = req.body;
    if (!incident_id || !titre || !phase || !priorite || !type_action || !statut) {
        return res.status(400).json({ msg: 'Please provide incident_id, titre, phase, priorite, type_action, and statut' });
    }
    if (isNaN(parseInt(incident_id))) {
        return res.status(400).json({ msg: 'Invalid incident_id format.' });
    }

    const { description, assignee_id, equipe_responsable, date_echeance } = req.body;
     if (assignee_id && isNaN(parseInt(assignee_id))) {
         return res.status(400).json({ msg: 'Invalid assignee_id format.' });
     }

    const client = new Client(dbConfig);
    try {
        await client.connect();
        // Check if incident exists
        const incidentCheck = await client.query('SELECT id FROM incidents WHERE id = $1', [incident_id]);
        if (incidentCheck.rows.length === 0) {
            return res.status(404).json({ msg: `Incident with id ${incident_id} not found.` });
        }

        // If assignee_id is provided, check if user exists (optional)
        if (assignee_id) {
            const userCheck = await client.query('SELECT id FROM utilisateurs WHERE id = $1', [assignee_id]);
            if (userCheck.rows.length === 0) {
                return res.status(404).json({ msg: `Assignee user with id ${assignee_id} not found.` });
            }
        }

        const query = `
            INSERT INTO actions (incident_id, titre, description, phase, priorite, type_action, assignee_id, equipe_responsable, statut, date_echeance)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const values = [incident_id, titre, description, phase, priorite, type_action, assignee_id, equipe_responsable, statut, date_echeance];
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create Action error:', err.message, err.code, err.detail);
        if (err.code === '23503') { // Foreign key violation
             if (err.constraint && err.constraint.includes('actions_incident_id_fkey')) {
                 return res.status(400).json({ msg: `Incident with id ${incident_id} not found or error with incident_id.` });
             }
             if (err.constraint && err.constraint.includes('actions_assignee_id_fkey')) {
                 return res.status(400).json({ msg: `Assignee user with id ${assignee_id} not found or error with assignee_id.` });
             }
        }
        if (err.code === '23514') { // Check constraint violation
             return res.status(400).json({ msg: `Invalid value for enum fields (phase, priorite, etc.). Error: ${err.detail || err.message}` });
        }
        res.status(500).send('Server error creating action');
    } finally {
        if (client) await client.end();
    }
};

// @desc    Get all actions, optionally filtered by incident_id
// @route   GET /api/actions
// @route   GET /api/actions?incidentId=:incidentId
// @access  Private
exports.getAllActions = async (req, res) => {
    const { incidentId } = req.query;
    let query = 'SELECT * FROM actions';
    const values = [];

    if (incidentId) {
        if (isNaN(parseInt(incidentId))) {
            return res.status(400).json({ msg: 'Invalid incidentId format for filtering.' });
        }
        query += ' WHERE incident_id = $1';
        values.push(incidentId);
    }
    query += ' ORDER BY created_at DESC;';

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Get All Actions error:', err.message);
        res.status(500).send('Server error fetching actions');
    } finally {
        if (client) await client.end();
    }
};

// @desc    Get a single action by ID
// @route   GET /api/actions/:id
// @access  Private
exports.getActionById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
         return res.status(400).json({ msg: 'Invalid action ID format.' });
    }
    const client = new Client(dbConfig);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM actions WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Action not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Get Action By ID error:', err.message);
        res.status(500).send('Server error fetching action');
    } finally {
        if (client) await client.end();
    }
};

// Placeholder for updateAction
exports.updateAction = async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
         return res.status(400).json({ msg: 'Invalid action ID format.' });
    }
    res.status(501).json({ msg: `Update action ${id} - Not Implemented Yet` });
};

// Placeholder for deleteAction
exports.deleteAction = async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
         return res.status(400).json({ msg: 'Invalid action ID format.' });
    }
    res.status(501).json({ msg: `Delete action ${id} - Not Implemented Yet` });
};
