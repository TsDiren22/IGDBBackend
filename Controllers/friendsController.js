//const User = require("../Schema/users");
const neo = require("../neo");

module.exports = {
  create: async (req, res, next) => {
    const { friendId } = req.body;
    const userId = req.id;
    const session = neo.session();

    const result = await session.run(neo.makeFriends, {
      userId: userId,
      friendId: friendId,
    });
    if (result) {
      res.status(200).json({
        status: "successful",
        message: "friend was added!",
      });
    } else {
      next({
        message: "Something went wrong when executing the query",
        errorCode: 500,
      });
    }
  },

  read: async (req, res, next) => {
    const userId = req.id;
    const session = neo.session();
    const result = await session.run(neo.getAllFriends, {
      userId: userId,
    });
    if (result) {
      const records = result.records;
      let friends = [];
      records.forEach((record) => {
        friends.push(record._fields[0].properties);
      });
      res.status(200).json(friends);
    } else {
      next({
        message: "Something went wrong when executing the query",
        errorCode: 400,
      });
    }
  },
};