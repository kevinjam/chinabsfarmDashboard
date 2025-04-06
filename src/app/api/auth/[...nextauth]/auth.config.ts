// src/app/api/auth/[...nextauth]/auth.config.ts
import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { JWT } from 'next-auth/jwt';

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

// Debug log for environment variable
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);

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
                    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                        console.error('Invalid credentials provided.');
                        return null;
                    }
                    return { id: user._id.toString(), name: user.username, role: user.role };
                } catch (error) {
                    console.error('Error during authorization:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user && token.role) {
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user?.role) {
                token.role = user.role;
            }
            return token;
        },
    },
    pages: { signIn: '/dashboard/login' },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
};