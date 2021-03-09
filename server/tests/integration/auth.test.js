const request = require('supertest');
const { User } = require('../../models/user');

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        server.close();
    });

    let token;
    const user = new User({
        name: 'Frank',
        email: 'frank@gmail.com',
        password: 'Frank6969',
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
