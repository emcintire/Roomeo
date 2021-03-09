const request = require("supertest");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server;

describe("/api/users", () => {
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        server.close();
        await User.remove({});
    });

    describe("GET /:id", () => {
        it("should return a user if valid id is passed", async () => {
            const user = new User({ name: "user1", email: 'user1@gmail.com', password:  });
            await user.save();

            const res = await request(server).get("/api/users/" + user._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", user.name);
        });

        it("should return a 404 if invalid id", async () => {
            const res = await request(server).get("/api/users/1");

            expect(res.status).toBe(404);
        });

        it("should return a 401 if no genre with the id exists", async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get("/api/users/" + id);

            expect(res.status).toBe(404);
        });
    });

    describe("POST /", () => {
        let token;
        let name;

        const exec = async () => {   //happy path
            return await request(server)
                .post("/api/users")
                .set("x-auth-token", token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = "genre1";
        });

        it("should return a 401 if client isnt logged in", async () => {
            token = "";
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return a 400 if genre is less than 5 chars", async () => {
            name = "1234";
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return a 400 if genre is more than 50 chars", async () => {
            name = new Array(52).join("a");
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should save the genre if it is valid", async () => {
            await exec();
            const genre = await Genre.find({ name: "genre1" });
            
            expect(genre).not.toBeNull();
        });

        it("should return the genre if it is valid", async () => {
            const res = await exec();

            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "genre1");
        });
    });
});
