const mongoose = require("mongoose");
require("dotenv").config();
const connect = require("../connect");
const neo = require("../neo");
const Console = require("../Schema/consoles");
const Studio = require("../Schema/studios");
const Game = require("../Schema/games");
const User = require("../Schema/users");

beforeEach(async () => {
  await Promise.all([
    Console.deleteMany(),
    Game.deleteMany(),
    Studio.deleteMany(),
    User.deleteMany(),
  ]);
  const session = neo.session();
  await session.run(neo.dropAll);
  await session.close();
});