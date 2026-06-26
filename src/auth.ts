import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // trustHost is required for deployments on Vercel/Render/Railway etc.
  // Without this, NextAuth v5 beta throws "Server configuration" error
  // when AUTH_URL doesn't exactly match the request host.
  trustHost: true,

  secret: process.env.AUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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

        // Simulated OTP Verification (in production, verify with Twilio/Firebase)
        // Accepts any 6 digit OTP for the demonstration
        if (credentials.otp.length === 6) {
          return {
            id: credentials.phone,
            name: `User ${credentials.phone.slice(-4)}`,
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
  },
  pages: {
    signIn: "/login",
  },
});
