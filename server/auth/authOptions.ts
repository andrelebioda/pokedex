import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/server/db/prisma";

export const authOptions: NextAuthOptions = {
  // Verwaltet User/Account/VerificationToken-Datensätze für alle Provider (OAuth + Email) in Prisma.
  adapter: PrismaAdapter(prisma),
  // Pflicht wegen Credentials-Provider: NextAuth v4 unterstützt dafür keine DB-Sessions, nur JWT.
  // GitHub/Google/Email liefen zwar auch mit DB-Sessions, aber die Strategie gilt global für alle Provider.
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });

        if (!user?.password) {
          return null;
        }

        const passwordValid = await bcrypt.compare(credentials.password, user.password);
        if (!passwordValid) {
          return null;
        }

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    // JWT enthält standardmäßig keine User-ID; hier einmalig beim Sign-in übernehmen.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Aus dem Token in die Session spiegeln, damit z.B. session.user.id im Client verfügbar ist.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
