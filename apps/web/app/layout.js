import { Inter } from 'next/font/google';
import './globals.css';
import { RecaptchaProvider } from '../providers/RecaptchaProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LeadSoft Challenger',
  description: 'Missão Marte',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecaptchaProvider>
          {children}
        </RecaptchaProvider>
      </body>
    </html>
  );
}
