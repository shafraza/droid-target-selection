// This script runs the test cases against the radar API and logs the results to the console.
require('dotenv').config();
const axios = require('axios');
const testCases = require('./test-cases');

// Grab values from env or use sensible defaults
const protocol = process.env.RADAR_API_PROTOCOL || 'https';
const host = process.env.RADAR_API_HOST || 'localhost';
const port = process.env.RADAR_API_PORT || '3000';

const radarApiUrl = `${protocol}://${host}:${port}/radar`;

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    try {
      console.log(`Running test: ${test.name}`);
      const response = await axios.post(radarApiUrl, test.input);

      const result = JSON.stringify(response.data) === JSON.stringify(test.expected);

      if (result) {
        console.log(`✅ PASSED: ${test.name}`);
        console.log(` Expected: ${JSON.stringify(test.expected)}`);
        console.log(` Received: ${JSON.stringify(response.data)}`);
        passed++;
      } else {
        console.log(`❌ FAILED: ${test.name}`);
        console.log(` Expected: ${JSON.stringify(test.expected)}`);
        console.log(` Received: ${JSON.stringify(response.data)}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${test.name}`);
      console.log(error.message || error);
      failed++;
    }
    console.log('---');
  }

  console.log(`Test Summary: ${passed} passed, ${failed} failed`);
}

runTests();
