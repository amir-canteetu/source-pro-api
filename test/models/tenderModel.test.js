import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../app.js';

const request = supertest(app);

describe('Tender Model - getAllTenders', () => {
  it('should return all tenders from the database', async () => {
    const response = await request.get('/api/tenders');

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    // ToDo: Add more assertions
  });
});

describe('Tender Model - getTenderById', () => {
  it('should return a specific tender by ID', async () => {
    const tenderId = 1; // Example tender ID
    const response = await request.get(`/api/tenders/${tenderId}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body.id).to.equal(tenderId); //ToDo: Adjust based on response structure
  });
});

describe('Tender Model - createTender', () => {
  it('should create a new tender in the database', async () => {
    const newTender = {
      title: 'New Tender',
      short_description: 'This is a new tender',
      procuring_company_id: 1,
      tender_author_id: 1
      //ToDo: Add more fields
    };

    const response = await request.post('/api/tenders').send(newTender);

    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('tenderId');
    //ToDo: Add more assertions to verify the created tender
  });
});

describe('Tender Model - updateTender', () => {
  it('should update an existing tender in the database', async () => {
    const tenderId = 1; // Example tender ID
    const updatedTender = {
      title: 'Recently Updated Tender',
      short_description: 'This is a recently updated tender',
      //ToDo: Add more fields to update
    };

    const response = await request.put(`/api/tenders/${tenderId}`).send(updatedTender);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('rowsAffected');
    expect(response.body.rowsAffected).to.equal(1); // Assuming one row was updated
    //ToDo: Add more assertions to verify the updated tender
  });
});

describe('Tender Model - deleteTender', () => {
  it('should delete an existing tender from the database', async () => {
    
    const tenderId = 1; // Example tender ID
    const response = await request.delete(`/api/tenders/${tenderId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('rowsAffected');
    //ToDo: Add more assertions to verify the deletion
  });
});
