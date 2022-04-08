const logger = require('tracer').console()
const Studio = require("../Schema/studios");

module.exports = {

    create: (req, res, next) => {
        logger.log("create studio was called");
        // Do something with mongoose
        
        const studio = new Studio(req.body);
        const userId = req.id;
        studio.user = userId;
        studio.save()
          .then(() => {
            res.status(200).json(studio);
          })
          .catch((err) => {
            next({ message: err.message, errorCode: 500 });
          });
    },

    getOne: (req, res, next) => {
        logger.log("getOne studio was called");
        const studioId = req.params._id;
        Studio.findById(studioId)
        .then((studio) => { 
            res.status(200).json(studio);
        })
        .catch((err) => {
            next({message: err.message, errorCode: 500});
        });
    },

    getAll: (req, res, next) => {
        logger.log("getAll studios was called");
        Studio.find({})
        .then((studio) => { 
            res.status(200).json(studio);
        })
        .catch((err) => {
            next({message: err.message, errorCode: 500});
        });
    },

    update: async (req, res, next) => {
        logger.log("Update studio was called");
        // Do something with mongoose
        const studioId = req.params._id;
        const studio = req.body;
        const userId = req.id;

        try {
            logger.log(studioId);
            const oldStudio = await Studio.findById(studioId);
            if (userId.toString() == oldStudio.user.toString()) {
              await Studio.findByIdAndUpdate(studioId, studio);
              res.status(200).json(studio);
            } else{
              next({message: "Only the one who created the studio can also update it.", errorCode: 401})
            }
          } catch (err) {
            next({ message: err.message, errorCode: 500 });
          }
    },

    delete: async (req, res, next) => {

        logger.log("Delete studio was called");
        const studioId = req.params._id;
        const userId = req.id;

        try {
            const studio = await Studio.findById(studioId);
            if (userId.toString() == studio.user.toString()) {
                await Studio.findByIdAndDelete(studioId);
                res.status(200).json(studio);
            } else {
                next({
                message: "Only the one who created the studio can also delete it.",
                errorCode: 401,
                });
            }
        } catch (err) {
            next({ message: err.message, errorCode: 500 });
        }
    }
};