import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // TODO: this logic conflicts with nextAuth callbackURL, it would be nice to fix it
      const isLoggedIn = !!auth?.user;
      if (isLoggedIn) {
        if (
          nextUrl.pathname.startsWith("/login") ||
          nextUrl.pathname.startsWith("/register")
        ) {
          return Response.redirect(new URL("/profile", nextUrl));
        } else {
          return true;
        }
      } else {
        if (
          nextUrl.pathname.startsWith("/login") ||
          nextUrl.pathname.startsWith("/register")
        ) {
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      }
    },
  },
} satisfies NextAuthConfig;
