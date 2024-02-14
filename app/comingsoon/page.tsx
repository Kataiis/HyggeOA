"use client"

import React from 'react'
import back from '@/public/back.png'
import Image from 'next/image'
import { useRouter, } from "next/navigation";

function Coming() {
    const router = useRouter();

    const backPage = () => {
        router.replace('/profile')
    };

    return (
        <div>
             <div className="absolute left-8 top-5 h-16 w-16 z-0 ">
                    <Image
                        priority
                        src={back}
                        alt="scan"
                        height={25}
                        onClick={backPage}
                    />
                    </div>
            <div className=" h-56 grid content-center font-semibold text-[#707070] text-center text-4xl p-5">
                coming soon
            </div>
        </div>

    )
}

export default Coming