#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'gestcyber',
        user: process.env.DB_USER || 'gestcyber_user',
        password: process.env.DB_PASSWORD
    });

    try {
        await client.connect();
        console.log('✓ Connexion à la base de données établie');

        // Lire et exécuter le schéma principal
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            await client.query(schema);
            console.log('✓ Schéma de base de données créé');
        }

        console.log('🎉 Migrations terminées avec succès');
    } catch (error) {
        console.error('❌ Erreur lors des migrations:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

if (require.main === module) {
    runMigrations();
}

module.exports = runMigrations;