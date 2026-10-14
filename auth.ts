import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!adminEmail || (!adminPassword && !adminPasswordHash)) {
          throw new Error("Admin credentials are not configured.");
        }

        if (email !== adminEmail.toLowerCase()) {
          return null;
        }

        if (adminPasswordHash) {
          const ok = await bcrypt.compare(password, adminPasswordHash);
          if (!ok) return null;
        } else {
          if (password !== adminPassword) return null;
        }

        return {
          id: "admin-user",
          email: adminEmail,
          name: "Admin",
          role: "admin",
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as { role?: string }).role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = String((token as { role?: string }).role ?? "");
      }
      return session;
    },
  },
};

export function getAdminSession() {
  return getServerSession(authOptions);
}
