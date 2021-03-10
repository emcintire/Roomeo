const request = require('supertest');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/users', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        server.close();
        await User.remove({});
    });

    describe('GET /:id', () => {
        it('should return a user if valid id is passed', async () => {
            const user = new User({
                name: 'user1',
                email: 'user1@gmail.com',
                password: 'User12345',
            });
            await user.save();

            const res = await request(server).get('/api/users/' + user._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', user.name);
        });

        it('should return a 404 if invalid id', async () => {
            const res = await request(server).get('/api/users/1');

            expect(res.status).toBe(404);
        });

        it('should return a 401 if no genre with the id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/users/' + id);

            expect(res.status).toBe(404);
        });
    }); 

    describe('POST /', () => {
        let user;

        const exec = async () => {
            //happy path
            return await request(server)
                .post('/api/users')
                .send({ user });
        };

        beforeEach(() => {
            user = {
                name: 'user1', 
                email: 'user1@gmail.com',
                password: 'User12345'
            };
        });

        it('should return a 400 if user is already registered', async () => {
            await exec();
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return a 400 if invalid email', async () => {
            user.email = 'user1';
            const res = await exec();

            expect(res.status).toBe(400);
        });
        
        it('should return a 400 if invalid password', async () => {
            user.password = 'user';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();
            const genre = await User.find({ email: 'user1@gmail.com' });

            expect(genre).not.toBeNull();
        }); 
    });

    describe('PUT /updateEmail/:id', () => {
        let user;
        let token;

        beforeEach(() => {
            user = {
                name: 'user1', 
                email: 'user1@gmail.com',
                password: 'User12345'
            };
        });
        afterEach(async () => {
            await User.remove({});
        });    

        it('should return 404 if the user with given id isnt found', async () => {
            token = new User(user).generateAuthToken();

            res = await request(server)
                .put('/api/users/updateEmail/' + mongoose.Types.ObjectId())
                .set('x-auth-token', token)
                .send(user.email);
            
            expect(res.status).toBe(404);
        });
    });
});
