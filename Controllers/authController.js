const jwt = require("jsonwebtoken");
const User = require("../Schema/users");
const jwtSecretKey = "secret";

async function login(req, res, next) {
  let result = await User.findOne({ email: req.body.email });

  if (result) {
    if (result.password == req.body.password) {
      const payload = {
        id: result._id,
      };
      res.status(200).json({
        message: "logged in",
        user: result,
        token: jwt.sign(payload, jwtSecretKey, { expiresIn: "2h" }),
      });
    } else {
      next({
        message: "Password is incorrect.",
        errorCode: 400,
      });
    }
  } else {
    next({
      message: "User does not exist.",
      errorCode: 400,
    });
  }
}

async function register(req, res) {
  console.log("register");
  let result = await User.findOne({ email: req.body.email });

  if (result) {
    console.log("A user with email: ", req.body.email, " already exists");
    res.status(500).json({
      error: "email is already taken",
      datetime: new Date().toISOString(),
    });
  } else {
    let created = new User(req.body);
    created.save();

    const payload = {
      id: created._id,
    };

    res.status(200).json({
      message: "user added",
      user: created,
      token: jwt.sign(payload, jwtSecretKey, { expiresIn: "2h" }),
    });
  }
}

async function validateToken(req, res, next) {
  console.log("validateToken called");
  // The headers should contain the authorization-field with value 'Bearer [token]'
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("No auth header!");
    res.status(401).json({
      error: "Authorization header missing!",
      datetime: new Date().toISOString(),
    });
  } else {
    // Strip the word 'Bearer ' from the headervalue
    const token = authHeader.substring(7, authHeader.length);

    jwt.verify(token, "secret", (err, payload) => {
      if (err) {
        console.log("Not authorized");
        res.status(401).json({
          error: "Not authorized",
          datetime: new Date().toISOString(),
        });
      }
      if (payload) {
        console.log("token is valid", payload);
        // User heeft toegang. Voeg UserId uit payload toe aan
        // request, voor ieder volgend endpoint.
        req.id = payload.id;
        next();
      }
    });
  }
}

async function SignToken(req, res) {
  let payload = {
    ID: req.id,
  };
  // Create an object containing the data we want in the payload.
  // Userinfo returned to the caller.
  const userinfo = {
    token: jwt.sign(payload, "secret", {
      expiresIn: "2h",
    }),
    id: req.id,
    email: req.email,
  };
  res.status(200).json(userinfo);
}

module.exports = {
  login,
  register,
  validateToken,
  SignToken,
};
