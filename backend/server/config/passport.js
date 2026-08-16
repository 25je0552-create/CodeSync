import dotenv from "dotenv";

dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

// console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("PASSPORT CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("PASSPORT SECRET:", process.env.GOOGLE_CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        // Remove spaces from Google display name
        let username = profile.displayName.replace(/\s+/g, "");

        // Make username unique
        let temp = username;

        let count = 1;

        while (await User.findOne({ username: temp })) {
          temp = username + count;
          count++;
        }

        user = await User.create({
          username: temp,
          email,
          password: "GOOGLE_ACCOUNT",
        });

        done(null, user);

      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  done(null, user);
});

export default passport;