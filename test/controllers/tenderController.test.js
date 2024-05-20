import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {
  getAllTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender
} from '../../controllers/tenderController';
import Tender from '../../models/tenderModel';

// Mock the Tender model methods
jest.mock('../../models/tenderModel');

const app = express();
app.use(bodyParser.json());
app.get('/tenders', getAllTenders);
app.get('/tenders/:tenderId', getTenderById);
app.post('/tenders', createTender);
app.patch('/tenders/:tenderId', updateTender);
app.delete('/tenders/:tenderId', deleteTender);

describe('Tender Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /tenders should return all tenders', async () => {
    const mockTenders = [{ id: 1, title: 'Test Tender' }];
    Tender.getAllTenders.mockResolvedValue(mockTenders);

    const response = await request(app).get('/tenders');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTenders);
  });

  test('GET /tenders/:tenderId should return a tender by id', async () => {
    const mockTender = { id: 1, title: 'Test Tender' };
    Tender.getTenderById.mockResolvedValue(mockTender);

    const response = await request(app).get('/tenders/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTender);
  });

  test('POST /tenders should create a new tender', async () => {
    const mockTender = { title: 'New Tender', short_description: 'A short description' };
    Tender.createTender.mockResolvedValue(1); // Mock insertId

    const response = await request(app).post('/tenders').send(mockTender);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Tender created successfully', tenderId: 1 });
  });

  test('PATCH /tenders/:tenderId should update a tender', async () => {
    const mockTender = { title: 'Updated Tender', short_description: 'Updated description' };
    Tender.updateTender.mockResolvedValue(1); // Mock rowsAffected

    const response = await request(app).patch('/tenders/1').send(mockTender);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Tender updated successfully', rowsAffected: 1 });
  });

  test('DELETE /tenders/:tenderId should delete a tender', async () => {
    Tender.deleteTender.mockResolvedValue(1); // Mock rowsAffected

    const response = await request(app).delete('/tenders/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Tender deleted successfully', rowsAffected: 1 });
  });
});
