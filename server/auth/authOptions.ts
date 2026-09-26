import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/server/db/prisma";

export const authOptions: NextAuthOptions = {
  // Verwaltet User/Account-Datensätze in Prisma (z.B. falls später OAuth-Provider wie GitHub dazukommen).
  adapter: PrismaAdapter(prisma),
  // Pflicht bei Credentials-Login: NextAuth v4 unterstützt dafür keine DB-Sessions, nur JWT.
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
