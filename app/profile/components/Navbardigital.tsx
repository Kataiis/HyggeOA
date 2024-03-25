"use client"
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from 'react';
import back from '@/public/back.png'
import Image from 'next/image'
import { usePathname } from "next/navigation";



function Navbardigital() {
    const [isShown, setIsShown] = useState(false);
    const currentPage = usePathname();
    const router = useRouter();



    useEffect(() => {
        document.title = "Virtual Hospital";

    }, []);


    return (
        <div className='bg-[#787874] h-16 sticky top-0'>
            <p className='text-center text-2xl text-[#ffffff] align-middle p-4' >ดิจิทัล เซอร์วิส</p>
        </div>

    )
}

export default Navbardigital