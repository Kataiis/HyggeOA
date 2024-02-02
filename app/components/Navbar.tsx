"use client"
import { useRouter } from "next/navigation";
import React from 'react'
import back from '@/public/back.png'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";



function Navbar() {
    const [isShown, setIsShown] = useState(false);
    const currentPage = usePathname();
    const router = useRouter();
   

    const backPage = () => {
        router.replace('/hospitalbook')
    };

    useEffect(() => {
        document.title = "Health ATM";
        console.log("currentPage : ", currentPage);
        if (currentPage !== '/idcard' && currentPage !== '/hospitalbook' && currentPage !== '/checkno' && currentPage !== '/loading') {
            setIsShown(true);
        } else {
            setIsShown(false);
        }
    }, [currentPage]);

    return (
        <div className='bg-[#3D8070] h-16'>
            <p className='text-center text-2xl text-[#ffffff] align-middle p-4'
           
            >Health ATM</p>
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

export default Navbar