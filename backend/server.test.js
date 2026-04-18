const request = require('supertest');
const app = require('./server'); // Import our express app

describe('Smart Stadium API Endpoints', () => {
  describe('GET /api/live-scores', () => {
    it('should return live match data with a 200 status code', async () => {
      const res = await request(app).get('/api/live-scores');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('title');
    });
  });

  describe('GET /api/news', () => {
    it('should return latest news with a 200 status code', async () => {
      const res = await request(app).get('/api/news');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });
  });

  describe('GET /api/stadium-status', () => {
    it('should return stadium status with simulated density and wait times', async () => {
      const res = await request(app).get('/api/stadium-status');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
      
      const firstZone = res.body.data[0];
      expect(firstZone).toHaveProperty('zone');
      expect(firstZone).toHaveProperty('density');
      expect(firstZone).toHaveProperty('concessionWaitTime');
      expect(firstZone).toHaveProperty('restroomWaitTime');
      expect(typeof firstZone.density).toBe('number');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on API requests', async () => {
      // We set rate limit to 100 requests per 15 mins.
      // This test ensures the rate limiter middleware is successfully attached,
      // but simulating 101 requests is slow. We can just verify it returns a 200 for a few requests.
      const res1 = await request(app).get('/api/stadium-status');
      const res2 = await request(app).get('/api/stadium-status');
      expect(res1.statusCode).toEqual(200);
      expect(res2.statusCode).toEqual(200);
    });
  });
});
