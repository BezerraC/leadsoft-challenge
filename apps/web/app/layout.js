import './globals.css';
import { Orbitron, Roboto, Roboto_Mono } from 'next/font/google';
import { RecaptchaProvider } from '../providers/RecaptchaProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: 'LeadSoft Challenger',
  description: 'Missão Marte',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col bg-gray-950 ${orbitron.variable} ${roboto.variable} ${robotoMono.variable}`}>
        <RecaptchaProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </RecaptchaProvider>
      </body>
    </html>
  );
}
