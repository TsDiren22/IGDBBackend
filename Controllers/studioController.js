const logger = require('tracer').console()
const Studio = require("../Schema/studios");

module.exports = {

    create: (req, res, next) => {
        logger.log("create studio was called");
        // Do something with mongoose
        const studio = new Studio(req.body);
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

    update: (req, res, next) => {
        logger.log("Update studio was called");
        // Do something with mongoose
        const studioId = req.params._id;
        const studio = req.body;
        Studio.findByIdAndUpdate(studioId, studio)
        .then((updated) => {
            res.status(200).json(updated);
          })
          .catch((err) => {
            next({ message: err.message, errorCode: 500 });
          });
    },

    delete: (req, res, next) => {
        logger.log("Delete studio was called");

        const studioId = req.params._id;
        Studio.findByIdAndDelete(studioId)
        .then((deleted) => { 
            res.status(200).json(deleted);
        })
        .catch((err) => {
            next({message: err.message, errorCode: 500});
        });
    },
};