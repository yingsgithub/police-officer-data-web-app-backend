"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest")); //calling the function from the test
const index_1 = require("../../src/index"); //importing the application and shutdown function from the app.ts file
const data_source_1 = require("../../src/data-source");
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize the database connection
    yield data_source_1.myDS.initialize();
    server = index_1.app.listen(3000);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.myDS.destroy();
    if (server) {
        yield server.close();
    }
    console.log('Server has been shut down');
}));
describe('Application server', () => {
    it('should return 200 for the root route', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).get('/');
        expect(response.statusCode).toBe(200);
    }), 10000);
    it('should handle non-existing routes', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).get('/non-existing-route');
        expect(response.statusCode).toBe(404);
    }), 10000);
});
//# sourceMappingURL=index.test.js.map