import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';
import { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const publicPages = ['/', '/auth'];

const intlMiddleware = createMiddleware({
    locales: Object.keys(locales),
    localePrefix: 'always',
    defaultLocale: 'en'
});

const authMiddleware = withAuth(
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        secret: process.env.APPLICATION_KEY,
        callbacks: {
            authorized: ({ token }) => token != null
        },
        pages: {
            signIn: '/auth',
            error: '/auth/error',
            newUser: '/auth/signup',
            signOut: '/auth/signout',
            verifyRequest: '/auth/verify'
        }
    }
);

export default function middleware(req: NextRequest) {
    const publicPathnameRegex = RegExp(
        `^(/(${Object.keys(locales).join('|')}))?(${publicPages
            .flatMap((p) => (p === '/' ? ['', '/'] : p))
            .join('|')})/?$`,
        'i'
    );

    if(publicPathnameRegex.test(req.nextUrl.pathname))
        return intlMiddleware(req);
    else
        return (authMiddleware as any)(req);
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};