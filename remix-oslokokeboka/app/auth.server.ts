import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { GoogleStrategy } from "remix-auth-google";

export type User = {
  name: string;
  email: string;
};

export let authenticator = new Authenticator<User | undefined>(sessionStorage);

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:3000/_internal/auth/google/callback",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    //   return User.findOrCreate({ email: profile.emails[0].value });

    const email = profile.emails[0].value;

    // save admins in db?
    const admins = process.env.ADMINS!.split(",");

    if (!admins.includes(email)) {
      console.log("Not admin user tried to log in");
      return undefined;
    }

    return {
      name: profile.displayName,
      email: profile.emails[0].value,
    };
  }
);

authenticator.use(googleStrategy);
