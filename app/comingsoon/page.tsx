"use client"

import React from 'react'
import back from '@/public/back.png'
import Image from 'next/image'
import { useRouter, } from "next/navigation";
import { Watch } from "react-loader-spinner";

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
            </div><div className="flex flex-row justify-center items-center w-full mt-10">
            <Watch
                    visible={true}
                    height="80"
                    width="80"
                    radius="48"
                    color="#4fa94d"
                    ariaLabel="watch-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />

                </div>
            <div className="mt-10 content-center font-semibold text-[#707070] text-center text-4xl p-5">

               <p className='font-mono italic font-bold uppercase '>Coming Soon..</p> 
     
            </div>

            
        </div>

    )
}

export default Coming