import request from 'supertest'; //calling the function from the test
import {app} from '../../src/index'; //importing the application and shutdown function from the app.ts file
import { after } from 'node:test';
import {myDS} from '../../src/data-source';
import { Http2SecureServer } from 'node:http2';

let server;
beforeAll(async () => {
    // Initialize the database connection
    await myDS.initialize();
    server = app.listen(3000);
});

afterAll(async () => {
    server.close();
    await myDS.destroy();
});

describe ('Application server', () => {
    it('should return 200 for the root route', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    }, 10000);

    it('should handle non-existing routes', async () => {
        const response = await request(app).get('/non-existing-route');
        expect(response.statusCode).toBe(404);
    }, 10000);

});