import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // Required for NextAuth v5 beta on Vercel & other cloud hosts.
  // Tells NextAuth to trust the x-forwarded-host header from the proxy.
  trustHost: true,

  // Explicitly pass secret so it works regardless of env variable naming
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Force re-consent to avoid stale token issues
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      id: "otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials: any) {
        if (!credentials?.phone || !credentials?.otp) return null;

        // Demo: accept any 6-digit OTP
        if (String(credentials.otp).length === 6) {
          return {
            id: credentials.phone,
            name: `User ${String(credentials.phone).slice(-4)}`,
            email: `${credentials.phone}@houseofturtles.in`,
            image: null,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account }: { token: any; account?: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",   // Redirect auth errors back to login with ?error=
  },
});
