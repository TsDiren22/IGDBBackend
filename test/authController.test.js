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

let userExists = {
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

let login = {
    email: 'Test@test.nl',
    password: 'Test'
}

let wrongLogin = {
    email: 'wrong@test.nl',
    password: 'Test'
}

describe('Auth test', function() {

    it("Should create account", async () => {

        const res = await requester
          .post("/api/register")
          .send(user);
        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "token",
            "user",
            "message",
          );
      });

      
    it("Should fail existing email", async () => {

        await User.create(userExists)

        const res = await requester
          .post("/api/register")
          .send(user);
        res.should.have.status(500);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "datetime",
            "error",
          );
      });

      it("Should log in", async () => {

        await User.create(userExists)

        const res = await requester
          .post("/api/login")
          .send(login);
        res.should.have.status(200);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "token",
            "user",
            "message",
          );
      });

      it("Should fail log in on wrong password", async () => {

        await User.create(userExists)

        const res = await requester
          .post("/api/login")
          .send(wrongLogin);
        res.should.have.status(400);
        res.body.should.be
          .an("object")
          .that.has.all.keys(
            "message",
            "error",
          );
      });
      
})