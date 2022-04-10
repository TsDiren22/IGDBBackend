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

describe('Studio test', function() {

    it("Should create studio", async () => {

        const testStudio = {
            name: 'Test Studio',
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357
        }

        const testUser = await User.create(user);

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .post("/api/studios")
          .set({ Authorization: `Bearer ${token}` })
          .send(testStudio);
        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "name",
            "address",
            "dateFounded",
            "founder",
            "website",
            "amountOfEmployees",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on create", async () => {
        const testStudio = {
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357
        }

        const testUser = await User.create(user);

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .post("/api/studios")
          .set({ Authorization: `Bearer ${token}` })
          .send(testStudio);
        res.should.have.status(500);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "error",
            "message"
          );
      });

      it("Should update studio", async () => {

        const testUser = await User.create(user);

        const testStudio = await Studio.create({
            name: "test",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357,
            user:testUser._id
        })

        const updatedStudio = {
            name: "test updated",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357
        }

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .put(`/api/studios/${testStudio._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(updatedStudio);

        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "name",
            "address",
            "dateFounded",
            "founder",
            "website",
            "amountOfEmployees"
          );
      });

      it("Should fail to update studio", async () => {

        const testUser = await User.create(user);
        const testUser2 = await User.create(user2);

        const testStudio = await Studio.create({
            name: "test",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357,
            user:testUser._id
        })

        const updatedStudio = {
            name: "test updated",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357
        }

        const token = jwt.sign({ id: testUser2._id }, "secret");

        const res = await requester
          .put(`/api/studios/${testStudio._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(updatedStudio);

        res.should.have.status(401);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "error",
            "message",
          );
      });

      it("Should readAll studio", async () => {

        const testUser = await User.create(user);

        const testStudio = await Studio.create({
            name: "test",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357,
            user:testUser._id
        })

        const res = await requester.get(`/api/studios/`)

        res.should.have.status(200);
        res.body.should.be
          .a("array")
        res.body.length.should.equal(1);
      });

      it("Should getOne studio", async () => {

        const testUser = await User.create(user);

        const testStudio = await Studio.create({
            name: "test",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357,
            user:testUser._id
        })

        const res = await requester.get(`/api/studios/${testStudio._id}`)

        res.should.have.status(200);
        res.body.should.be
          .an("object").that.has.all.keys(
            "name",
            "address",
            "dateFounded",
            "founder",
            "website",
            "amountOfEmployees",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on getOne studio", async () => {

        const testUser = await User.create(user);

        const testStudio = await Studio.create({
            name: "test",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357,
            user:testUser._id
        })

        const res = await requester.get(`/api/studios/${testStudio._id}false`)

        res.should.have.status(500);
        res.body.should.be
          .an("object").that.has.all.keys(
            "error",
            "message",
          );
      });


      it("Should delete studio", async () => {

        const testUser = await User.create(user);

        const testStudio = await Studio.create({
            name: "test",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357,
            user:testUser._id
        })

        const token = jwt.sign({ id: testUser._id }, "secret");

        const res = await requester
          .delete(`/api/studios/${testStudio._id}`)
          .set({ Authorization: `Bearer ${token}` })

        res.should.have.status(200);
        res.body.should.be
          .an("object").that.has.all.keys(
            "name",
            "address",
            "dateFounded",
            "founder",
            "website",
            "amountOfEmployees",
            "_id",
            "user",
            "__v"
          );
      });

      it("Should give error on delete studio with unauthorised account", async () => {

        const testUser = await User.create(user);
        const testUser2 = await User.create(user2);

        const testStudio = await Studio.create({
            name: "test",
            address: 'Teststraat 12',
            founder: 'Tester',
            dateFounded: new Date(2021,8,4),
            website: 'www.test.nl',
            amountOfEmployees: 7357,
            user:testUser._id
        })

        const token = jwt.sign({ id: testUser2._id }, "secret");

        const res = await requester
          .delete(`/api/studios/${testStudio._id}`)
          .set({ Authorization: `Bearer ${token}` })

        res.should.have.status(401);
        res.body.should.be
          .an("object").that.has.all.keys(
            "error",
            "message",
          );
      });
})