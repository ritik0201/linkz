import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User as NextAuthUser } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { IUser } from "@/models/User";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials: Record<string, string> | undefined): Promise<NextAuthUser | null> {
        await dbConnect();
        try {
          if (!credentials?.email) {
            throw new Error("Email is required.");
          }

          // Case 1: OTP Login (Admin)
          if (credentials?.otp) {
            const user: IUser | null = await User.findOne({
              email: credentials.email,
            });

            if (!user) {
              throw new Error("No user found with this email.");
            }

            if (credentials.requiredRole && user.role !== credentials.requiredRole) {
              throw new Error(`This login is for ${credentials.requiredRole}s only.`);
            }

            if (!user.otp || !user.otpExpires) {
              throw new Error("No OTP found. Please request a new one.");
            }

            if (user.otp !== credentials.otp) {
              throw new Error("Invalid OTP.");
            }

            if (user.otpExpires < new Date()) {
              throw new Error("OTP has expired. Please request a new one.");
            }

            // OTP verified successfully
            // Clear OTP fields
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            return {
              id: user._id.toString(),
              email: user.email,
              fullName: user.fullName,
              isVerified: user.isVerified,
              mobile: user.mobile,
              role: user.role,
            };
          }

          // Case 2: Password Login
          if (!credentials?.password) {
            throw new Error("Password is required.");
          }

          const user: IUser | null = await User.findOne({
            email: credentials.email,
          });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          // If a requiredRole is passed, check if the user has that role
          if (credentials?.requiredRole && user.role !== credentials.requiredRole) {
            throw new Error(`This login is for ${credentials.requiredRole}s only.`);
          }

          const isValid = await bcrypt.compare(credentials.password, user.password || "");

          if (!isValid) {
            throw new Error("Invalid password.");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
            isVerified: user.isVerified,
            mobile: user.mobile,
            role: user.role,
          };
        } catch (err: any) {
          throw new Error(
            err.message || "An error occurred during authorization."
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user?: NextAuthUser | undefined }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.email = user.email;
        token.fullName = user.fullName;
        token.mobile = user.mobile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as 'user' | 'startup' | 'admin';
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
        session.user.fullName = token.fullName;
        session.user.mobile = token.mobile;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow redirect to the external URL for logout
      if (url === process.env.NEXT_PUBLIC_BASE_URL) {
        return url;
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',// Redirect to home page for sign-in
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
