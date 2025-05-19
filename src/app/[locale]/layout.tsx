import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SpeedInsights } from "@vercel/speed-insights/next";

const spaceGroteskSans = Space_Grotesk({
    variable: "--font-space-sans",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Audioguessr",
    description: "Guess which city the audio is from?",
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    let messages;
    try {
        messages = (await import(`../../../messages/${locale}.json`)).default;
    } catch (error) {
        console.error(`Could not load messages for locale: ${locale}`, error);
        notFound();
    }
    return (
        <html lang={locale}>
            <body className={`${spaceGroteskSans.variable} antialiased`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
                <SpeedInsights />
                <div className="z-[1000]">
                    <LanguageSwitcher />
                </div>
            </body>
        </html>
    );
}
