const jwt = require("jsonwebtoken")
const chai = require('chai')
chai.should();
const requester = require('../requester.spec')

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const User = require("../Schema/users");
const Studio = require("../Schema/studios");
const Console = require("../Schema/consoles")


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

describe('Console test', function() {

    it("Should create console", async () => {

        const testConsole = {
            name: 'testboy',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl'
        }

        const testUser = await User.create(user);

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .post("/api/consoles")
          .set({ Authorization: `Bearer ${token}` })
          .send(testConsole);
        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "name",
            "amountOfUser",
            "dateOfRelease",
            "website",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on create", async () => {
        const testConsole = {
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl'
        }

        const testUser = await User.create(user);

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .post("/api/consoles")
          .set({ Authorization: `Bearer ${token}` })
          .send(testConsole);
        res.should.have.status(500);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "error",
            "message"
          );
      });

      it("Should update consoles", async () => {

        const testUser = await User.create(user);

        const testConsole = await Console.create({
            name: 'testboy',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl',
            user:testUser._id
        })

        const updatedConsole = {
            name: 'testboy updated',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl'
        }

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .put(`/api/consoles/${testConsole._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(updatedConsole);

        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "name",
            "amountOfUser",
            "dateOfRelease",
            "website",
          );
      });

      it("Should fail to update console", async () => {

        const testUser = await User.create(user);
        const testUser2 = await User.create(user2);

        const testConsole = await Console.create({
            name: 'testboy',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl',
            user:testUser._id
        })

        const updatedConsole = {
            name: 'testboy updated',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl'
        }

        const token = jwt.sign({ id: testUser2._id }, "secret");

        const res = await requester
          .put(`/api/consoles/${testConsole._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(updatedConsole);

        res.should.have.status(401);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "error",
            "message",
          );
      });

      it("Should readAll console", async () => {

        const testUser = await User.create(user);

        const testConsole = await Console.create({
            name: 'testboy',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl',
            user:testUser._id
        })

        const res = await requester.get(`/api/consoles/`)

        res.should.have.status(200);
        res.body.should.be
          .a("array")
        res.body.length.should.equal(1);
      });

      it("Should getOne console", async () => {

        const testUser = await User.create(user);

        const testConsole = await Console.create({
            name: 'testboy',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl',
            user:testUser._id
        })

        const res = await requester.get(`/api/consoles/${testConsole._id}`)

        res.should.have.status(200);
        res.body.should.be
          .an("object").that.has.all.keys(
            "name",
            "amountOfUser",
            "dateOfRelease",
            "website",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on getOne consoles", async () => {

        const testUser = await User.create(user);

        const testConsole = await Console.create({
            name: 'testboy',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl',
            user:testUser._id
        })

        const res = await requester.get(`/api/consoles/${testConsole._id}false`)

        res.should.have.status(500);
        res.body.should.be
          .an("object").that.has.all.keys(
            "error",
            "message",
          );
      });


      it("Should delete console", async () => {

        const testUser = await User.create(user);

        const testConsole = await Console.create({
            name: 'testboy',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl',
            user:testUser._id
        })

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .delete(`/api/consoles/${testConsole._id}`)
          .set({ Authorization: `Bearer ${token}` })

        res.should.have.status(200);
        res.body.should.be
          .an("object").that.has.all.keys(
            "name",
            "amountOfUser",
            "dateOfRelease",
            "website",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on delete console with unauthorised account", async () => {

        const testUser = await User.create(user);
        const testUser2 = await User.create(user2);

        const testConsole = await Console.create({
            name: 'testboy',
            amountOfUser: 7357,
            dateOfRelease: new Date(2021,8,4),
            website: 'www.test.nl',
            user:testUser._id
        })

        const token = jwt.sign({ id: testUser2._id }, "secret");

        const res = await requester
          .delete(`/api/consoles/${testConsole._id}`)
          .set({ Authorization: `Bearer ${token}` })

        res.should.have.status(401);
        res.body.should.be
          .an("object").that.has.all.keys(
            "error",
            "message",
          );
      });
})