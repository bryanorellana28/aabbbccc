import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/authOptions";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Appointment System',
  description: 'Book appointments with doctors or travel agents',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Appointment System</Link>
            <div className="space-x-4">
              {session ? (
                <>
                  <Link href="/dashboard">Dashboard</Link>
                  {session.user.role === 'DOCTOR' && (
                    <Link href="/doctor">Doctor Dashboard</Link>
                  )}
                  <Link href="/api/auth/signout">Logout</Link>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}