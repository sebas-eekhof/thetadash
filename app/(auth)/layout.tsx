import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";
import { locales } from "@/i18n";
import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider, useMessages } from "next-intl";
import pick from 'lodash/pick';
import SessionProvider from "@/providers/SessionProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children, params: { locale } }: Readonly<{ children: React.ReactNode, params: { locale: string } }>) {
	unstable_setRequestLocale(locale);

	const messages = useMessages();

	return (
		<html lang={locale}>
			<body className={cn(montserrat.className, 'flex items-center justify-center bg-grid-element-dark')}>
				<NextIntlClientProvider
					locale={locale}
					messages={pick(messages, 'auth')}
				>
					<SessionProvider>
						<div className={`absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]`} />
						<div className={`relative w-[500px]`}>
							<div className={`absolute inset-0 h-full w-full bg-gradient-to-r transform opacity-40 scale-x-[1.2] rounded-full blur-3xl from-blue-500 to-teal-500`} />
							<div className={`bg-element-dark p-8 rounded-3xl border-border relative overflow-hidden h-full text-sm`}>
								{children}
							</div>
						</div>
					</SessionProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}

export function generateStaticParams() {
	return Object.keys(locales).map(locale => ({ locale }))
}