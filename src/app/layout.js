'use client';
import './globals.css';
import Navbar from './components/Navbar';
import { initializeMockData } from '../data/mockData';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}