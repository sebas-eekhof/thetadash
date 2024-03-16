import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getDatabase } from './ssr/database';
import Crypto from './ssr/classes/Crypto';

export const authOptions: NextAuthOptions = {
    secret: process.env.APPLICATION_KEY,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@company.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, request) {
                if(!credentials?.email || !credentials.password)
                    return null;
                const db = await getDatabase();
                const user = await db.knex('users')
                    .where('users.email', credentials.email)
                    .whereNotNull('users.password')
                    .select([
                        'users.id',
                        'users.email',
                        'users.full_name',
                        'users.password'
                    ])
                    .first();
                await db.end();
                if(!user) {
                    await Crypto.Bcrypt.fakeWait();
                    return null;
                }
                if(!await Crypto.Bcrypt.compare(credentials.password, user.password))
                    return null;
                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.full_name
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: '/auth',
        newUser: '/auth/signup',
        signOut: '/auth/signout',
        error: '/auth/error',
        verifyRequest: '/auth/verify'
    },
    session: {
        strategy: 'jwt'
    },
    adapter: {
        async createUser({ email, emailVerified, name, image }) {
            const db = await getDatabase();
            const account = await db.knex('accounts')
                .insert({
                    name: null
                })
                .returning('id');
            const user = await db.knex('users')
                .insert({
                    account_id: account[0].id,
                    full_name: name || email,
                    email
                })
                .returning('id');
            await db.end();
            return {
                id: user[0].id,
                email,
                name,
                emailVerified,
                image
            }
        },
        async deleteUser(userId) {
            console.log('deleteUser')
            throw new Error('asd');
        },
        async updateUser(user) {
            console.log('updateUser')
            throw new Error('asd');
        },
        async getUser(id) {
            console.log('getUser')
            throw new Error('asd');
        },
        async getUserByAccount({ provider, providerAccountId }) {
            const db = await getDatabase();
            const user = await db.knex('login_providers')
                .where('login_providers.provider', provider)
                .where('login_providers.provider_account_id', providerAccountId)
                .join('users', 'users.id', 'login_providers.user_id')
                .select([
                    'users.id',
                    'users.email',
                    'users.full_name'
                ])
                .first();
            await db.end();
            if(!user)
                return null;
            return {
                id: user.id.toString(),
                email: user.email,
                name: user.full_name,
                emailVerified: new Date()
            }
        },
        async getUserByEmail(email) {
            const db = await getDatabase();
            const user = await db.knex('users')
                .where('users.email', email)
                .select([
                    'users.id',
                    'users.email',
                    'users.full_name'
                ])
                .first();
            await db.end();
            if(!user)
                return null;
            return {
                id: user.id.toString(),
                email: user.email,
                name: user.full_name,
                emailVerified: new Date()
            }
        },
        async createVerificationToken(verificationToken) {
            console.log('createVerificationToken')
            throw new Error('asd');
        },
        async linkAccount(account) {
            const db = await getDatabase();
            const exists = await db.knex('login_providers')
                .where('login_providers.user_id', account.userId)
                .where('login_providers.provider', account.provider)
                .select([
                    'login_providers.id'
                ])
                .first();
            if(exists)
                await db.knex('login_providers')
                    .where('login_providers.id', exists.id)
                    .update({
                        provider_account_id: account.providerAccountId
                    });
            else
                await db.knex('login_providers')
                    .insert({
                        user_id: account.userId,
                        provider: account.provider,
                        provider_account_id: account.providerAccountId
                    });
            await db.end();
        },
        async unlinkAccount(providerAccountId) {
            console.log('unlinkAccount')
            throw new Error('asd');
        },
        async createSession(session) {
            console.log('createSession')
            throw new Error('asd');
        },
        async getSessionAndUser(sessionToken) {
            console.log('getSessionAndUser')
            throw new Error('asd');
        },
        async updateSession(session) {
            console.log('updateSession')
            throw new Error('asd');
        },
        async deleteSession(sessionToken) {
            console.log('deleteSession')
            throw new Error('asd');
        },
        async useVerificationToken(params) {
            console.log('useVerificationToken')
            throw new Error('asd');
        },
    }
};