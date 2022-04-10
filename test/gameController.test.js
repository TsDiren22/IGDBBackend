const jwt = require("jsonwebtoken")
const chai = require('chai')
chai.should();
const requester = require('../requester.spec')
const expect = chai.expect
const logger = require('tracer').console()

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const Console = require("../Schema/consoles")
const User = require("../Schema/users");
const Studio = require("../Schema/studios");
const Game = require("../Schema/games");


let user = {
  firstName: 'Test',
  lastName: 'Test',
  email: 'Test@test.nl',
  password: 'Test'
}

let user2 = {
  firstName: 'Test',
  lastName: 'Test',
  email: 'Test@test2.nl',
  password: 'Test'
}

let studio = {
  name: 'Test Studio',
  address: 'Teststraat 12',
  founder: 'Tester',
  dateFounded: new Date(2021,8,4),
  website: 'www.test.nl',
  amountOfEmployees: 7357
}

let console = {
  name: 'testboy',
  amountOfUser: 7357,
  dateOfRelease: new Date(2021,8,4),
  website: 'www.test.nl'
}

describe('Make Game', function() {

    it("Should create game", async () => {
        const testGame = {
          title: "Test Game",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: studio,
          console: [console],
        };

        const testUser = await User.create(user);
        logger.log("user id is:" + testUser._id);
        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        testGame.studio = testStudio._id;
        testGame.console = [testConsole._id];

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .post("/api/games")
          .set({ Authorization: `Bearer ${token}` })
          .send(testGame);
        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "title",
            "description",
            "releaseDate",
            "studio",
            "genre",
            "console",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on create", async () => {
        const testGame = {
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: studio,
          console: [console],
        };

        const testUser = await User.create(user);
        logger.log("user id is:" + testUser._id);
        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        testGame.studio = testStudio._id;
        testGame.console = [testConsole._id];

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .post("/api/games")
          .set({ Authorization: `Bearer ${token}` })
          .send(testGame);
        res.should.have.status(500);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "error",
            "message"
          );
      });

      it("Should update game", async () => {

        const testUser = await User.create(user);
        logger.log("user id is:" + testUser._id);
        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        const testGame = await Game.create({
          title: "Test Game",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
          user:testUser._id
        });

        const updatedGame = {
          title: "Test Game Updated",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
        };

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .put(`/api/games/${testGame._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(updatedGame);

        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "title",
            "description",
            "releaseDate",
            "studio",
            "genre",
            "console"
          );
      });

      it("Should fail to update game", async () => {

        const testUser = await User.create(user);
        const testUser2 = await User.create(user2);


        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        const testGame = await Game.create({
          title: "Test Game",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
          user:testUser._id
        });

        const updatedGame = {
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
        };

        const token = jwt.sign({ id: testUser2._id }, "secret");

        const res = await requester
          .put(`/api/games/${testGame._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(updatedGame);

        res.should.have.status(401);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "error",
            "message",
          );
      });

      it("Should readAll game", async () => {

        const testUser = await User.create(user);
        logger.log("user id is:" + testUser._id);
        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        await Game.create({
          title: "Test Game",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
          user:testUser._id
        });

        const res = await requester.get(`/api/games/`)

        res.should.have.status(200);
        res.body.should.be
          .a("array")
        res.body.length.should.equal(1);
      });

      it("Should getOne game", async () => {

        const testUser = await User.create(user);
        logger.log("user id is:" + testUser._id);
        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        let testGame = await Game.create({
          title: "Test Game",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
          user:testUser._id
        });

        const res = await requester.get(`/api/games/${testGame._id}`)

        res.should.have.status(200);
        res.body.should.be
          .an("object").that.has.all.keys(
            "title",
            "description",
            "releaseDate",
            "studio",
            "genre",
            "console",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on getOne game", async () => {

        const testUser = await User.create(user);
        logger.log("user id is:" + testUser._id);
        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        let testGame = await Game.create({
          title: "Test Game",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
          user:testUser._id
        });

        const res = await requester.get(`/api/games/${testGame._id}false`)

        res.should.have.status(500);
        res.body.should.be
          .an("object").that.has.all.keys(
            "error",
            "message",
          );
      });


      it("Should delete game", async () => {

        const testUser = await User.create(user);
        logger.log("user id is:" + testUser._id);
        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        let testGame = await Game.create({
          title: "Test Game",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
          user:testUser._id
        });

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .delete(`/api/games/${testGame._id}`)
          .set({ Authorization: `Bearer ${token}` })

        res.should.have.status(200);
        res.body.should.be
          .an("object").that.has.all.keys(
            "title",
            "description",
            "releaseDate",
            "studio",
            "genre",
            "console",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on delete game with unauthorised account", async () => {

        const testUser = await User.create(user);
        const testUser2 = await User.create(user2);
        logger.log("user id is:" + testUser._id);
        studio.user = testUser._id;
        const testStudio = await Studio.create(studio);
        console.user = testUser._id;
        const testConsole = await Console.create(console);

        let testGame = await Game.create({
          title: "Test Game",
          description: "Testing the untested test",
          releaseDate: new Date(),
          genre: "Test",
          studio: testStudio,
          console: [testConsole],
          user:testUser._id
        });

        const token = jwt.sign({ id: testUser2._id }, "secret");

        const res = await requester
          .delete(`/api/games/${testGame._id}`)
          .set({ Authorization: `Bearer ${token}` })

        res.should.have.status(401);
        res.body.should.be
          .an("object").that.has.all.keys(
            "error",
            "message",
          );
      });
})