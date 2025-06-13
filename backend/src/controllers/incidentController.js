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

// @desc    Update an incident
// @route   PUT /api/incidents/:id
// @access  Private
exports.updateIncident = async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ msg: 'Invalid incident ID format.' });
    }

    // Extract fields to update from req.body
    // Only update fields that are provided in the request body.
    const { titre, description, type_incident, niveau_critique, phase_actuelle, statut, perimetre_impact, dirigeant_crise_id, date_fin } = req.body;

    // Basic validation: At least one field to update must be provided
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ msg: 'No fields provided for update.' });
    }
    if (dirigeant_crise_id && isNaN(parseInt(dirigeant_crise_id))) {
      return res.status(400).json({ msg: 'Invalid dirigeant_crise_id format.' });
    }
    if (date_fin && isNaN(new Date(date_fin).getTime())) {
      return res.status(400).json({ msg: 'Invalid date_fin format.' });
    }


    const client = new Client(dbConfig);
    try {
        await client.connect();

        // Check if incident exists
        const currentIncidentResult = await client.query('SELECT * FROM incidents WHERE id = $1', [id]);
        if (currentIncidentResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Incident not found.' });
        }

        // If dirigeant_crise_id is being updated and is not null, check if user exists
        if (dirigeant_crise_id !== undefined) {
            if (dirigeant_crise_id === null) {
                // Allowed, setting FK to null
            } else {
                const userCheck = await client.query('SELECT id FROM utilisateurs WHERE id = $1', [dirigeant_crise_id]);
                if (userCheck.rows.length === 0) {
                    return res.status(400).json({ msg: `User with id ${dirigeant_crise_id} for dirigeant_crise_id not found.` });
                }
            }
        }

        // Construct the SET clause dynamically based on provided fields
        const setClauses = [];
        const values = [];
        let valueCount = 1;

        if (titre !== undefined) { setClauses.push(`titre = $${valueCount++}`); values.push(titre); }
        if (description !== undefined) { setClauses.push(`description = $${valueCount++}`); values.push(description); }
        if (type_incident !== undefined) { setClauses.push(`type_incident = $${valueCount++}`); values.push(type_incident); }
        if (niveau_critique !== undefined) { setClauses.push(`niveau_critique = $${valueCount++}`); values.push(niveau_critique); }
        if (phase_actuelle !== undefined) { setClauses.push(`phase_actuelle = $${valueCount++}`); values.push(phase_actuelle); }
        if (statut !== undefined) { setClauses.push(`statut = $${valueCount++}`); values.push(statut); }
        if (perimetre_impact !== undefined) { setClauses.push(`perimetre_impact = $${valueCount++}`); values.push(perimetre_impact); }
        if (dirigeant_crise_id !== undefined) { setClauses.push(`dirigeant_crise_id = $${valueCount++}`); values.push(dirigeant_crise_id); }
        if (date_fin !== undefined) { setClauses.push(`date_fin = $${valueCount++}`); values.push(date_fin === null ? null : new Date(date_fin)); }

        setClauses.push(`updated_at = CURRENT_TIMESTAMP`); // Always update updated_at

        if (setClauses.length === 1) { // Only updated_at was added, means no actual data fields to update
            return res.status(400).json({ msg: 'No updatable fields provided or only updated_at was specified.'});
        }


        const updateQuery = `UPDATE incidents SET ${setClauses.join(', ')} WHERE id = $${valueCount} RETURNING *;`;
        values.push(id);

        const result = await client.query(updateQuery, values);
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Update Incident error:', err.message, err.code, err.detail);
        if (err.code === '23503' && err.constraint && err.constraint.includes('incidents_dirigeant_crise_id_fkey')) { // Foreign key violation for dirigeant_crise_id
             return res.status(400).json({ msg: `User with id ${dirigeant_crise_id} for dirigeant_crise_id not found.` });
        }
        if (err.code === '23514') { // Check constraint violation
            return res.status(400).json({ msg: `Invalid value for enum fields (type_incident, niveau_critique, etc.). Error: ${err.detail || err.message}` });
        }
        if (err.code === '22007') { // Invalid datetime format for date_fin
            return res.status(400).json({ msg: 'Invalid date format for date_fin.' });
        }
        res.status(500).send('Server error updating incident');
    } finally {
        if (client) await client.end();
    }
};

// @desc    Delete an incident
// @route   DELETE /api/incidents/:id
// @access  Private
exports.deleteIncident = async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ msg: 'Invalid incident ID format.' });
    }

    const client = new Client(dbConfig);
    try {
        await client.connect();

        // The RETURNING * clause will return the deleted row, or empty if not found
        const result = await client.query('DELETE FROM incidents WHERE id = $1 RETURNING *;', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Incident not found for deletion.' });
        }

        // Related actions are deleted by CASCADE constraint in DB schema
        res.status(200).json({ msg: 'Incident and related actions deleted successfully.', deletedIncident: result.rows[0] });

    } catch (err) {
        console.error('Delete Incident error:', err.message);
        res.status(500).send('Server error deleting incident');
    } finally {
        if (client) await client.end();
    }
};
