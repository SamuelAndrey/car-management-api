import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {createTestUser, removeTestUser} from "./test-utils.js";

describe('POST /api/v1/users', function () {

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/v1/users')
            .send({
                username: "test",
                password: "secret",
                name: "test",
                email: "test@localhost.com"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request invalid', async () => {
        const result = await supertest(web)
            .post('/api/v1/users')
            .send({
                username: "",
                password: "",
                name: "test"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let result = await supertest(web)
            .post('/api/v1/users')
            .send({
                username: "test",
                password: "secret",
                name: "test",
                email: "test@localhost.com"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/v1/users')
            .send({
                username: "test",
                password: "secret",
                name: "test",
                email: "test@localhost.com"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/v1/users/login', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can be login', async () => {
        const result = await supertest(web)
            .post('/api/v1/users/login')
            .send({
                username: "test",
                password: "secret"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe("test");
    });

    it('should reject login if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/v1/users/login')
            .send({
                username: "",
                password: ""
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(web)
            .post('/api/v1/users/login')
            .send({
                username: "test",
                password: "wrong"
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if username is wrong', async () => {
        const result = await supertest(web)
            .post('/api/v1/users/login')
            .send({
                username: "wrong",
                password: "wrong"
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})

describe('GET /api/v1/user/current', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get current user', async () => {
        const result = await supertest(web)
            .get('/api/v1/users/current')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test')
        expect(result.body.data.name).toBe("test")
        expect(result.body.data.email).toBe("test@localhost.com")
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .get('/api/v1/users/current')
            .set('Authorization', 'wrong');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});