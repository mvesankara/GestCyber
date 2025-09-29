const request = require('supertest');
const app = require('../src/app');
const { Client } = require('pg');

describe('Routes d\'Authentification', () => {
    let dbClient;

    beforeAll(() => {
        dbClient = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });
        return dbClient.connect();
    });

    afterAll(() => {
        return dbClient.end();
    });

    it('devrait enregistrer un nouvel utilisateur et retourner un token', async () => {
        const testUser = {
            nom: 'Test',
            prenom: 'Register',
            email: `register.${Date.now()}@example.com`,
            password: 'password123'
        };

        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');

        // Nettoyage
        const decoded = JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64').toString());
        await dbClient.query('DELETE FROM utilisateurs WHERE id = $1', [decoded.user.id]);
    });

    it('devrait connecter un utilisateur existant avec succès', async () => {
        const testUser = {
            nom: 'Test',
            prenom: 'Login',
            email: `login.${Date.now()}@example.com`,
            password: 'password123'
        };
        // 1. Créer l'utilisateur
        const registerRes = await request(app).post('/api/auth/register').send(testUser);
        const decoded = JSON.parse(Buffer.from(registerRes.body.token.split('.')[1], 'base64').toString());

        // 2. Tenter de se connecter
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(loginRes.statusCode).toEqual(200);
        expect(loginRes.body).toHaveProperty('token');

        // Nettoyage
        await dbClient.query('DELETE FROM utilisateurs WHERE id = $1', [decoded.user.id]);
    });

    it('devrait refuser la connexion avec un mot de passe incorrect', async () => {
        const testUser = {
            nom: 'Test',
            prenom: 'WrongPass',
            email: `wrongpass.${Date.now()}@example.com`,
            password: 'password123'
        };
        // 1. Créer l'utilisateur
        const registerRes = await request(app).post('/api/auth/register').send(testUser);
        const decoded = JSON.parse(Buffer.from(registerRes.body.token.split('.')[1], 'base64').toString());

        // 2. Tenter de se connecter avec le mauvais mot de passe
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(loginRes.statusCode).toEqual(401);
        expect(loginRes.body.msg).toBe('Identifiants invalides.');

        // Nettoyage
        await dbClient.query('DELETE FROM utilisateurs WHERE id = $1', [decoded.user.id]);
    });
});