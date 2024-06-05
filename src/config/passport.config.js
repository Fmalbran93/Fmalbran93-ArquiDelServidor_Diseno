import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../Usuarios/user.model.js";
import { createHash, isValidPassword } from "../Core/hash.js";
import "dotenv/config";
import CartManager from "../Carritos/cartController.js";

const cm = new CartManager();
const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use("register", new localStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, userName, password, done) => {
    const { name, surName, email, age } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (user) return done(null, false);
      const cart = await cm.addCart();
      let newUser = { name, surName, email, age, cart, password: createHash(password) };
      let result = await userModel.create(newUser);
      return done(null, result);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use("login", new localStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        console.log("EL usuario no existe");
        return done(null, false);
      }
      if (!isValidPassword(password, user)) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use("github", new GitHubStrategy({
    clientID: "Iv23li8xI9MAQeTs42TA",
      clientSecret: "ba77c1767357f7bb1a85161d638387d5f9990893",
      callbackURL: "http://localhost:8080/api/session/githubcallback"
  }, async (accessToken, refreshToken, profile, done) => {
    console.log("Profile", profile);
    try {
      let user = await userModel.findOne({ email: profile._json.email });
      const cart = await cm.addCart();
      if (!user) {
        let newUser = { name: profile._json.name, surName: "", age: 36, email: profile._json.email, password: "", cart };
        let result = await userModel.create(newUser);
        done(null, result);
      } else {
        done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    try {
      done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  passport.deserializeUser((user, done) => {
    try {
      done(null, user);
    } catch (err) {
      return done(err);
    }
  });
};

export default initializePassport;