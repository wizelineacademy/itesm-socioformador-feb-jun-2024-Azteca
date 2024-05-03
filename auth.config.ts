import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  // Remove the trustHostedDomain property
  // trustHostedDomain: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      // TODO: this logic conflicts with nextAuth callbackURL, it would be nice to fix it
      const isLoggedIn = !!auth?.user;

      if (isLoggedIn) {
        if (
          nextUrl.pathname.startsWith("/login") ||
          nextUrl.pathname.startsWith("/register")
        ) {
          return Response.redirect(
            new URL(`/profile/${auth.user?.id}`, nextUrl),
          );
        } else if (nextUrl.pathname.startsWith("/admin")) {
          // TODO: fix fetch node-gyp error from middleware
          const res = await fetch(
            new URL(`/api/get-role?userId=${auth.user?.id}`, nextUrl),
          );
          const { role } = await res.json();

          if (role == "ADMIN") {
            return true;
          } else {
            return Response.redirect(new URL("/forbbiden", nextUrl));
          }
        } else if (nextUrl.pathname === "/profile" || nextUrl.pathname == "/") {
          return Response.redirect(
            new URL(`/profile/${auth.user?.id}`, nextUrl),
          );
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
    async jwt({ token, user: jwtUser, account, profile, trigger }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (trigger === "signIn") {
        token.id = jwtUser.id;
      }

      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
