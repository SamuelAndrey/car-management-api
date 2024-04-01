const supertest = require("supertest");
const web = require("../src/application/web.js");
const {logger} = require("../src/application/logging.js");
const {createTestUser, createTestUserSuperAdmin, getTestUser, removeTestUser} = require("./test-utils.js");
const bcrypt = require("bcrypt");

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
});

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

describe('PATCH /api/v1/users/current', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update user', async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "test")
            .send({
                name: "Samuel",
                password: "secret2",
                email: "samuel@localhost.com"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("Samuel");
        expect(result.body.data.email).toBe("samuel@localhost.com");

        const user = await getTestUser();
        expect(await bcrypt.compare("secret2", user.password)).toBe(true);
    });

    it('should can update user name', async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "test")
            .send({
                name: "Samuel",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("Samuel");
    });

    it('should can update user password', async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "test")
            .send({
                password: "secret2"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");

        const user = await getTestUser();
        expect(await bcrypt.compare("secret2", user.password)).toBe(true);
    });

    it('should can update user email', async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "test")
            .send({
                email: "samuel@localhost.com"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.email).toBe("samuel@localhost.com");
    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "wrong")
            .send({});

        expect(result.status).toBe(401);
    });
});

describe('DELETE /api/v1/users/logout', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can logout', async () => {
        const result = await supertest(web)
            .delete("/api/v1/users/logout")
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        const user = await getTestUser();
        expect(user.token).toBeNull();
    });
});

describe('POST /api/v1/users/admin', function () {

    beforeEach(async () => {
        await createTestUser();
        await createTestUserSuperAdmin();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can create new admin', async () => {
        const result = await supertest(web)
            .post('/api/v1/users/admin')
            .set('Authorization', 'super-admin-token')
            .send({
                username: "admin",
                password: "secret",
                name: "admin",
                email: "admin@localhost.com"
            });

        expect(result.status).toBe(201);
        expect(result.body.data.username).toBe("admin");
        expect(result.body.data.name).toBe("admin");
        expect(result.body.data.role).toBe("admin");
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if role not super admin', async () => {
        const result = await supertest(web)
            .post('/api/v1/users/admin')
            .set('Authorization', 'test')
            .send({
                username: "admin",
                password: "secret",
                name: "admin",
                email: "admin@localhost.com"
            });

        expect(result.status).toBe(401);
    });

    it('should reject if request invalid', async () => {
        const result = await supertest(web)
            .post('/api/v1/users/admin')
            .set('Authorization', 'super-admin-token')
            .send({
                username: "",
                password: "",
                name: "test"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let result = await supertest(web)
            .post('/api/v1/users/admin')
            .set('Authorization', 'super-admin-token')
            .send({
                username: "admin",
                password: "secret",
                name: "admin",
                email: "admin@localhost.com"
            });

        expect(result.status).toBe(201);
        expect(result.body.data.username).toBe("admin");
        expect(result.body.data.name).toBe("admin");
        expect(result.body.data.role).toBe("admin");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/v1/users/admin')
            .set('Authorization', 'super-admin-token')
            .send({
                username: "admin",
                password: "secret",
                name: "admin",
                email: "admin@localhost.com"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});