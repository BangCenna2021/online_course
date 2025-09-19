import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const res = await fetch("http://localhost/oc/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            google_id: account.providerAccountId,
            name: user.name,
            picture: user.image,
          }),
        });

        const dbUser = await res.json();

        if (!dbUser || !dbUser.email) {
          return false;
        }

        user.role = dbUser.role;
        user.id_user = dbUser.id_user;
        user.picture = dbUser.picture;

        return true;
      } catch (err) {
        console.error("signIn error:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id_user = user.id_user;
        token.picture = user.picture;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id_user = token.id_user;
        session.user.picture = token.picture;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
