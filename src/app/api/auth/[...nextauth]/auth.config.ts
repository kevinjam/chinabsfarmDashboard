import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';

// Extend the Session and User types to include role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      role?: string | null;
    };
  }

  interface User {
    role?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string | null;
  }
}

// Validate environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not set. Please set it in your environment variables.');
  throw new Error('NEXTAUTH_SECRET is not set');
}

console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set');

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error('Credentials are missing.');
          return null;
        }
        try {
          const { db } = await dbConnect();
          const user = await db.collection('users').findOne({ username: credentials.username });
          if (!user) {
            console.error('User not found:', credentials.username);
            return null;
          }
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            console.error('Invalid password for user:', credentials.username);
            return null;
          }
        //   console.log('User authenticated:', { id: user._id.toString(), name: user.username, role: user.role });
          return { id: user._id.toString(), name: user.username, role: user.role || 'customer' };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'customer'; // Ensure role is always set
      }
    //   console.log('JWT Callback:', token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role || 'customer'; // Pass role to session
      }
    //   console.log('Session Callback:', session);
      return session;
    },
  },
  pages: { signIn: '/dashboard/login' },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
};