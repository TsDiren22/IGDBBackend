const logger = require("tracer").console();
const Game = require("../Schema/games");
const Console = require("../Schema/consoles");
const { console } = require("tracer");

module.exports = {
  create: (req, res, next) => {
    logger.log("create game was called");
    // Do something with mongoose
    const game = new Game(req.body);
    game.user = req.id;
    game
      .save()
      .then(() => {
        res.status(200).json(game);
      })
      .catch((err) => {
        next({ message: err.message, errorCode: 500 });
      });
  },

  getOne: (req, res, next) => {
    logger.log("getOne game was called");
    const gameId = req.params._id;
    Game.findById(gameId)
      .populate("console")
      .populate("studio")
      .then((game) => {
        res.status(200).json(game);
      })
      .catch((err) => {
        next({ message: err.message, errorCode: 500 });
      });
  },

  getAll: (req, res, next) => {
    logger.log("getAll games was called");
    Game.find({})
      .then((games) => {
        res.status(200).json(games);
      })
      .catch((err) => {
        next({ message: err.message, errorCode: 500 });
      });
  },

  update: async (req, res, next) => {
    logger.log("Update game was called");
    // Do something with mongoose
    const gameId = req.params._id;
    const newgame = req.body;
    const userId = req.id;

    try {
      logger.log(gameId);
      const oldGame = await Game.findById(gameId);
      if (userId.toString() == oldGame.user.toString()) {
        await Game.findByIdAndUpdate(gameId, newgame);
        res.status(200).json(newgame);
      } else{
        next({message: "Only the one who c reated the game can also update it.",errorCode: 401})
      }
    } catch (err) {
      next({ message: err.message, errorCode: 500 });
    }
  },

  delete: async (req, res, next) => {
    logger.log("Delete game was called");

    const gameId = req.params._id;
    const userId = req.id;

    try {
      const game = await Game.findById(gameId);
      if (userId.toString() == game.user.toString()) {
        await Game.findByIdAndDelete(gameId);
        res.status(200).json(game);
      } else {
        next({
          message: "Only the one who created the game can also delete it.",
          errorCode: 401,
        });
      }
    } catch (err) {
      next({ message: err.message, errorCode: 500 });
    }
  },
};
