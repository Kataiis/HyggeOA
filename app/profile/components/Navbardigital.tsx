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


    const backPage = () => {
        router.replace('/profile/patient')
    };

    useEffect(() => {
        document.title = "Virtual Hospital";
        console.log("currentPage : ", currentPage);
        if (currentPage !== '/hospitalbook' && currentPage !== '/checkno' && currentPage !== '/loading' && currentPage !== '/patient' && currentPage !== '/comingsoon') {
            setIsShown(true);
        } else {
            setIsShown(false);
        }
    }, [currentPage]);


    return (
        <div className='bg-[#787874] h-16 sticky top-0'>

            <p className='text-center text-2xl text-[#ffffff] align-middle p-4' >ดิจิทัล เซอร์วิส</p>
            {isShown &&
                <div className="absolute left-8 top-5 h-16 w-16 z-0 ">
                    <Image
                        priority
                        src={back}
                        alt="scan"
                        height={25}
                        onClick={backPage}
                    />
                </div>}

        </div>

    )
}

export default Navbardigital