// This is a Jest test suite for the YVH Droid Target Selection feature.
// It uses the test cases defined in a separate file and sends requests to the radar endpoint.
const axios = require('axios');
const testCases = require('./test-cases');

describe('YVH Droid Target Selection', () => {
  testCases.forEach(test => {
    it(`should handle ${test.name}`, async () => {
      let response;
      try {
        response = await axios.post('http://localhost:3000/radar', test.input);
        expect(response.data).toEqual(test.expected);
      } catch (error) {
        // If we expect null (no valid targets), we should get a 404
        if (test.expected === null) {
          expect(error.response.status).toBe(404);
        } else {
          throw error;
        }
      }
    });
  });
});