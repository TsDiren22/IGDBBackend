const Console = require("../Schema/consoles");

const logger = require('tracer').console()

module.exports = {

    create: (req, res, next) => {
        logger.log("create console was called");
        // Do something with mongoose
        const console = new Console(req.body);
        const userId = req.id;
        console.user = userId;
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

    update: async (req, res, next) => {
        logger.log("Update console was called");
        // Do something with mongoose
        const consoleId = req.params._id;
        const console = req.body;
        const userId = req.id;
        
        try {
            const oldConsole = await Console.findById(consoleId);
            if (userId.toString() == oldConsole.user.toString()) {
              await Console.findByIdAndUpdate(consoleId, console);
              res.status(200).json(console);
            } else{
              next({message: "Only the one who created the console can also update it.", errorCode: 401})
            }
          } catch (err) {
            next({ message: err.message, errorCode: 500 });
          }
    },

    delete: async (req, res, next) => {
        logger.log("Delete console was called");

        const consoleId = req.params._id;
        const userId = req.id;

        try {
            const console = await Console.findById(consoleId);
            if (userId.toString() == console.user.toString()) {
                await Console.findByIdAndDelete(consoleId);
                res.status(200).json(console);
            } else {
                next({
                    message: "Only the one who created the console can also delete it.",
                    errorCode: 401,
                });
            }
        } catch (err) {
            next({ message: err.message, errorCode: 500 });
        }
    },
};