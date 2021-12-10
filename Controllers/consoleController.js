const Console = require("../Schema/consoles");

const logger = require('tracer').console()

module.exports = {

    create: (req, res, next) => {
        logger.log("create console was called");
        // Do something with mongoose
        const console = new Console(req.body);
        console.save()
          .then(() => {
            res.status(200).json(console);
          })
          .catch((err) => {
            next({ message: err.message, errorCode: 500 });
          });
    },

    getOne: (req, res, next) => {
        logger.log("getOne console was called");
        const consoleId = req.params._id;
        Console.findById(consoleId)
        .then((console) => { 
            res.status(200).json(console);
        })
        .catch((err) => {
            next({message: err.message, errorCode: 500});
        });
    },

    getAll: (req, res, next) => {
        logger.log("getAll consoles was called");
        Console.find({})
        .then((console) => { 
            res.status(200).json(console);
        })
        .catch((err) => {
            next({message: err.message, errorCode: 500});
        });
    },

    update: (req, res, next) => {
        logger.log("Update console was called");
        // Do something with mongoose
        const consoleId = req.params._id;
        const console = req.body;
        Console.findByIdAndUpdate(consoleId, console)
        .then((updated) => {
            res.status(200).json(updated);
          })
          .catch((err) => {
            next({ message: err.message, errorCode: 500 });
          });
    },

    delete: (req, res, next) => {
        logger.log("Delete console was called");

        const consoleId = req.params._id;
        Console.findByIdAndDelete(consoleId)
        .then((deleted) => { 
            res.status(200).json(deleted);
        })
        .catch((err) => {
            next({message: err.message, errorCode: 500});
        });
    },
};