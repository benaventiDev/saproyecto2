const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/User');

const app = express();
app.use(bodyParser.json());
app.use(require('../routes/Users'));

describe('User Authentication Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should register a new user if email not found', async () => {
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockImplementation((password, saltRounds, callback) => callback(null, 'hashedPassword'));
            User.create.mockResolvedValue({ email: 'test@example.com' });

            const response = await request(app).post('/register').send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'test@example.com',
                password: '123456'
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ status: 'test@example.comRegistered!' });
            expect(User.create).toHaveBeenCalledWith(expect.anything());
        });

        it('should return error if user exists', async () => {
            User.findOne.mockResolvedValue(true);

            const response = await request(app).post('/register').send({
                email: 'existing@example.com'
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ error: 'User already exists' });
        });
    });

    describe('POST /login', () => {
        it('should return token on successful login', async () => {
            User.findOne.mockResolvedValue({
                _id: '123',
                password: 'hashedPassword'
            });
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('fakeToken');

            const response = await request(app).post('/login').send({
                email: 'test@example.com',
                password: '123456'
            });

            expect(response.statusCode).toBe(200);
            expect(response.text).toBe('fakeToken');
        });

        it('should reject login with incorrect password', async () => {
            User.findOne.mockResolvedValue({
                email: 'test@example.com',
                password: 'hashedPassword'
            });
            bcrypt.compareSync.mockReturnValue(false);

            const response = await request(app).post('/login').send({
                email: 'test@example.com',
                password: 'wrongPassword'
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ error: 'User does not exist' });
        });
    });

    describe('GET /profile', () => {
        it('should return user profile if valid token provided', async () => {
            jwt.verify.mockImplementation(() => ({ _id: '123' }));
            User.findOne.mockResolvedValue({ name: 'John Doe' });

            const response = await request(app)
                .get('/profile')
                .set('Authorization', 'Bearer fakeToken');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ name: 'John Doe' });
        });

        it('should return error if user not found', async () => {
            jwt.verify.mockImplementation(() => ({ _id: '123' }));
            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get('/profile')
                .set('Authorization', 'Bearer fakeToken');

            expect(response.statusCode).toBe(200);
            expect(response.text).toBe('User does not exist');
        });
    });
});
