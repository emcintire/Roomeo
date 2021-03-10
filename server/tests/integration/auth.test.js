const request = require('supertest');
const { User } = require('../../models/user');

let server;

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        server.close();
        await User.remove({});
    });

    let token;
    const user = new User({
        name: 'user1',
        email: 'user1@gmail.com',
        password: 'User12345',
    });

    const exec = () => {
        //Happy Path i.e. returns 200 status
        return request(server)
            .delete('/api/users/' + user._id)
            .set('x-auth-token', token)
            .send(user);
    };

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if no token is provided', async () => {
        token = 'a';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(404);
    });
});
