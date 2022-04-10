const jwt = require("jsonwebtoken")

const chai = require('chai')
chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const User = require('../Schema/users');
const requester = require('../requester.spec')
const neo = require('../neo')

let user = {
    userId: 1,
    email: 'Test@test.nl',
  }
  
  let friend = {
    userId: 2,
    email: 'Test@test2.nl',
  }

  let friend2 = {
    userId: 3,
    email: 'Test@test3.nl',
  }

  let friend3 = {
    userId: 4,
    email: 'Test@test4.nl',
  }

describe("Friendscontroller", () => {
    it("should create friends", async () => {

        const session = neo.session();
        await session.run(neo.register, user);
        await session.run(neo.register, friend);

        const token = jwt.sign({ id: user.userId }, "secret");

        const res = await requester
          .post("/api/friends")
          .set({ Authorization: `Bearer ${token}` })
          .send({
            friendId: friend.userId 
        });

        res.should.have.status(200);
        res.body.should.be.an("object").that.has.all.keys("status", "message");
        let { message } = res.body;
        message.should.be.a("string").that.equals("friend was added!");
      });

      it("should give error on create friends without authorization", async () => {

        const session = neo.session();
        await session.run(neo.register, user);
        await session.run(neo.register, friend);

        const res = await requester
          .post("/api/friends")
          .send({
            friendId: friend.userId
        });

        res.should.have.status(401);
        res.body.should.be.an("object").that.has.all.keys("datetime", "error");
      });

      it("should fail on return friendlist without authorization", async () => {
        const session = neo.session();
        await session.run(neo.register, user);
        await session.run(neo.register, friend);
        await session.run(neo.register, friend2);
        await session.run(neo.register, friend3);

        await session.run(neo.makeFriends, { userId: user.userId, friendId: friend.userId });
        await session.run(neo.makeFriends, { userId: user.userId, friendId: friend2.userId });
        await session.run(neo.makeFriends, { userId: user.userId, friendId: friend3.userId });

        const res = await requester
          .get("/api/friends")

          res.should.have.status(401);
          res.body.should.be.an("object").that.has.all.keys("datetime", "error");
      });

      it("should return friendlist", async () => {
        const session = neo.session();
        await session.run(neo.register, user);
        await session.run(neo.register, friend);
        await session.run(neo.register, friend2);
        await session.run(neo.register, friend3);

        await session.run(neo.makeFriends, { userId: user.userId, friendId: friend.userId });
        await session.run(neo.makeFriends, { userId: user.userId, friendId: friend2.userId });
        await session.run(neo.makeFriends, { userId: user.userId, friendId: friend3.userId });

        const token = jwt.sign({ id: user.userId }, "secret");
        const res = await requester
          .get("/api/friends")
          .set({ Authorization: `Bearer ${token}` });

        res.should.have.status(200);
        res.body.should.be.an("array");
        res.body.length.should.equal(3);
      });
  });
  

