const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Ensure correct import paths and use of mock
jest.mock('../models/Ticket');
const Ticket = require('../models/Ticket');

// Define routes directly for demonstration
app.get('/getTicketAll', (req, res) => {
    Ticket.find({}, (err, items) => {
        if (err) {
            console.log("El error es: " + err);
            return res.status(500).json({ error: err.toString() });
        }
        res.json(items);
    });
});

app.post('/addTickets', upload.array('img'), (req, res) => {
    const obj = {
        name: req.body.name,
        img: req.files[0] ? req.files[0].filename : null,
        content: req.body.content
    };
    Ticket.create(obj).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

app.post('/addMessages', (req, res) => {
    const { id, messages } = req.body;
    Ticket.updateOne(
        { _id: ObjectId(id) },
        { $push: { messages: { text: messages, date: new Date() } } },
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, result: result });
        }
    );
});


// PUT /changeStatus
app.put('/changeStatus', (req, res) => {
    const { id, status } = req.body;
    Ticket.findByIdAndUpdate(
        ObjectId(id),
        { $set: { status: status } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, result: result });
        }
    );
});

// POST /filterStatus
app.post('/filterStatus', (req, res) => {
    const { status } = req.body;
    Ticket.find({ status: status }, (err, tickets) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ tickets });
    });
});

// Tests
describe('Ticket routes', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        Ticket.find.mockClear();
        Ticket.create.mockClear();
        Ticket.findByIdAndUpdate.mockClear();
        Ticket.update.mockClear();
    });

    describe('GET /getTicketAll', () => {
        it('should fetch all tickets successfully', async () => {
            const mockItems = [{ name: 'Ticket1' }, { name: 'Ticket2' }];
            Ticket.find.mockImplementation((query, callback) => callback(null, mockItems));

            const response = await request(app).get('/getTicketAll');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockItems);
        });

        it('should handle database errors', async () => {
            Ticket.find.mockImplementation((query, callback) => callback(new Error("Database query failed"), null));

            const response = await request(app).get('/getTicketAll');
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain("Database query failed");
        });
    });

    // Additional test for POST /addTickets, including handling of file uploads
    describe('POST /addTickets', () => {
        it('should add a new ticket', async () => {
            const mockTicket = { name: 'New Event', img: 'path/to/img.jpg', content: 'Description' };
            Ticket.create.mockResolvedValue(mockTicket);

            const response = await request(app).post('/addTickets')
                .field('name', 'New Event')
                .field('content', 'Description')
                .attach('img', Buffer.from('fake img data', 'utf-8'), 'image.jpg');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockTicket);
            expect(Ticket.create).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Event',
                content: 'Description'
            }));
        });

        it('should handle errors when adding a new ticket', async () => {
            Ticket.create.mockRejectedValue(new Error('Failed to create ticket'));

            const response = await request(app).post('/addTickets')
                .field('name', 'New Event')
                .field('content', 'Failed event')
                .attach('img', Buffer.from('fake img data', 'utf-8'), 'image.jpg');

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain('Failed to create ticket');
        });
    });

    // Implement similar tests for POST /addMessages and PUT /changeStatus
    // following the pattern used in GET /getTicketAll and POST /addTickets
});

// Test for POST /filterStatus
describe('POST /filterStatus', () => {
    it('should filter tickets by status', async () => {
        const mockReqBody = { status: 'Open' };
        const mockTickets = [{ _id: '507f1f77bcf86cd799439011', status: 'Open' }];
        Ticket.find.mockImplementation((query, callback) => callback(null, mockTickets));

        const response = await request(app)
            .post('/filterStatus')
            .send(mockReqBody);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ tickets: mockTickets });
    });

    it('should handle database errors during filtering', async () => {
        Ticket.find.mockImplementation((query, callback) => callback(new Error("Failed to fetch tickets"), null));

        const response = await request(app)
            .post('/filterStatus')
            .send({ status: 'Open' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toContain("Failed to fetch tickets");
    });
});


module.exports = app;
