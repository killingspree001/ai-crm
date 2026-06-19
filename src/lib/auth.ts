import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { dbConfigured } from "@/lib/queries";

export const authOptions: NextAuthOptions = {
  adapter: dbConfigured() ? (PrismaAdapter(prisma) as never) : undefined,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Demo mode (no database): accept the demo account so the live site is usable.
        if (!dbConfigured()) {
          if (credentials.password === "demo") {
            return {
              id: "u1",
              name: "Avery Chen",
              email: credentials.email,
              role: "ADMIN",
            } as never;
          }
          throw new Error("Demo mode — use password: demo");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) throw new Error("Invalid credentials");

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) throw new Error("Invalid credentials");

        return user as never;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: "ADMIN" | "SALES_REP" | "VIEWER" }).role ?? "SALES_REP";
      }
      if (dbConfigured() && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    },
  },
};
