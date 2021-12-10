const logger = require("tracer").console();
const Game = require("../Schema/games");
const Console = require("../Schema/consoles");

module.exports = {
  create: (req, res, next) => {
    logger.log("create game was called");
    // Do something with mongoose
    const game = new Game(req.body);
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

  update: (req, res, next) => {
    logger.log("Update game was called");
    // Do something with mongoose
    const gameId = req.params._id;
    const game = req.body;
    Game.findByIdAndUpdate(gameId, game)
      .then((updated) => {
        res.status(200).json(updated);
      })
      .catch((err) => {
        next({ message: err.message, errorCode: 500 });
      });
  },

  delete: (req, res, next) => {
    logger.log("Delete game was called");

    const gameId = req.params._id;
    Game.findByIdAndDelete(gameId)
      .then((deleted) => {
        res.status(200).json(deleted);
      })
      .catch((err) => {
        next({ message: err.message, errorCode: 500 });
      });
  },
};
