import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        await dbConnect();

        if (!credentials?.email) {
          throw new Error("Email is required");
        }

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Role enforcement is critical for Separate Admin Login
        if (credentials?.requiredRole && user.role !== credentials.requiredRole) {
          throw new Error(`Only ${credentials.requiredRole} can login`);
        }

        // OTP Login Flow
        if (credentials.otp) {
          if (user.otp !== credentials.otp) {
            throw new Error("Invalid OTP");
          }

          if (user.otpExpires && new Date() > user.otpExpires) {
            throw new Error("OTP expired");
          }

          // Clear OTP after successful login
          user.otp = undefined;
          user.otpExpires = undefined;
          await user.save();

          return user as unknown as NextAuthUser;
        }

        // Password Login Flow
        if (!credentials.password) {
          throw new Error("Password is required");
        }

        if (!user.password) {
          throw new Error("Please login with OTP or Google");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return user as unknown as NextAuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token._id = user._id;
        token.role = user.role;
        token.fullName = user.fullName;
        token.email = user.email;
        token.username = user.username;
        token.mobile = user.mobile;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user._id = token._id;
        session.user.role = token.role;
        session.user.fullName = token.fullName;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.mobile = token.mobile;
      }
      return session;
    },
  },
  pages: {
    signIn: "/user/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };