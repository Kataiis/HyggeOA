  "use client";

import type { Metadata } from 'next'
import './globals.css'
import { Kanit } from "next/font/google";
import Navbar from './components/Navbar';
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';

const inter: any = Kanit({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: true,
});



// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Health ATM',
//   description: 'Generated by create next app',
// }

export default function RootLayout(
  {
  
  children,
}: {
  children: React.ReactNode
}) {
  const [isShown, setIsShown] = useState(false);
  const currentPage = usePathname();

  useEffect(() => {
    document.title = "Virtual Hospital";
    console.log("currentPage : ", currentPage);
    if (currentPage !== '/login' && currentPage !== '/loading' && currentPage !== '/register' && currentPage !== '/agreement'  && currentPage !== '/profile') {
      setIsShown(true);
    } else {
      setIsShown(false);
    }
  }, [
    currentPage
  ]);

  return (
    <html lang="en">
      <body className={`${inter.className}`} >
        <div>
          {isShown && <Navbar />}
        
          {children}
        </div>

      </body>
    </html>
  )
}
