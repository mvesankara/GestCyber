// backend/src/controllers/incidentController.js
const { Client } = require('pg');
const process = require('process');

const dbConfig = {
    user: process.env.DB_USER || 'gestcyber_user',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DB_NAME || 'gestcyber',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};

// @desc    Create a new incident
// @route   POST /api/incidents
// @access  Private
exports.createIncident = async (req, res) => {
    // Validation: Ensure required fields are present
    const { titre, description, type_incident, niveau_critique, phase_actuelle, statut } = req.body;
    if (!titre || !type_incident || !niveau_critique || !phase_actuelle || !statut) {
        return res.status(400).json({ msg: 'Please provide titre, type_incident, niveau_critique, phase_actuelle, and statut' });
    }

    // Optional fields
    const { perimetre_impact, dirigeant_crise_id } = req.body;

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const query = `
            INSERT INTO incidents (titre, description, type_incident, niveau_critique, phase_actuelle, statut, perimetre_impact, dirigeant_crise_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [titre, description, type_incident, niveau_critique, phase_actuelle, statut, perimetre_impact, dirigeant_crise_id];
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create Incident error:', err.message);
        // Consider more specific error codes based on err.code (e.g., foreign key violation)
        if (err.code === '23503') { // Foreign key violation for dirigeant_crise_id
             return res.status(400).json({ msg: 'Invalid dirigeant_crise_id. User does not exist.' });
        }
         if (err.code === '23514') { // Check constraint violation
             return res.status(400).json({ msg: `Invalid value for enum fields (type_incident, niveau_critique, etc.). Error: ${err.detail || err.message}` });
         }
        res.status(500).send('Server error creating incident');
    } finally {
        if (client) await client.end();
    }
};

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private
exports.getAllIncidents = async (req, res) => {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        // Order by creation date, newest first
        const result = await client.query('SELECT * FROM incidents ORDER BY created_at DESC;');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Get All Incidents error:', err.message);
        res.status(500).send('Server error fetching incidents');
    } finally {
        if (client) await client.end();
    }
};

// @desc    Get a single incident by ID
// @route   GET /api/incidents/:id
// @access  Private
exports.getIncidentById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
         return res.status(400).json({ msg: 'Invalid incident ID format.' });
    }

    const client = new Client(dbConfig);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM incidents WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Incident not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Get Incident By ID error:', err.message);
        res.status(500).send('Server error fetching incident');
    } finally {
        if (client) await client.end();
    }
};

 // Placeholder for updateIncident
 // @desc    Update an incident
 // @route   PUT /api/incidents/:id
 // @access  Private
 exports.updateIncident = async (req, res) => {
     const { id } = req.params;
     if (isNaN(parseInt(id))) {
         return res.status(400).json({ msg: 'Invalid incident ID format.' });
     }
     // Logic for updating an incident would go here
     // Similar to createIncident, but using an UPDATE SQL query
     // Ensure to handle which fields can be updated
     res.status(501).json({ msg: `Update incident ${id} - Not Implemented Yet` });
 };

 // Placeholder for deleteIncident
 // @desc    Delete an incident
 // @route   DELETE /api/incidents/:id
 // @access  Private
 exports.deleteIncident = async (req, res) => {
     const { id } = req.params;
      if (isNaN(parseInt(id))) {
         return res.status(400).json({ msg: 'Invalid incident ID format.' });
     }
     // Logic for deleting an incident
     // const client = new Client(dbConfig);
     // try {
     //    await client.connect();
     //    const result = await client.query('DELETE FROM incidents WHERE id = $1 RETURNING *;', [id]);
     //    if (result.rowCount === 0) {
     //        return res.status(404).json({ msg: 'Incident not found for deletion' });
     //    }
     //    res.status(200).json({ msg: 'Incident deleted successfully', incident: result.rows[0] });
     // } catch (err) {
     //    console.error('Delete Incident error:', err.message);
     //    res.status(500).send('Server error deleting incident');
     // } finally {
     //    if (client) await client.end();
     // }
     res.status(501).json({ msg: `Delete incident ${id} - Not Implemented Yet` });
 };
