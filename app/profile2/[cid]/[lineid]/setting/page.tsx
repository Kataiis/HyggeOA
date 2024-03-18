"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
import Image from 'next/image'
import back from '@/public/back.png'
import { usePatientStore } from '@/app/store';
import Navbardigital from '@/app/profile/components/Navbardigital';



function Setting({ params }: { params: { cid: string, lineid: string } }) {
    const router = useRouter();
    const [loading, setloading] = useState(true);


    // const Patient: any = usePatientStore((state: any) => state.patient);
    const backPage = () => {
        router.replace("../" + params.lineid)
    };

    return (
        <div> {loading && (
            <>
                <div>
                    <Navbardigital />
                    <div className="absolute left-8 top-5 h-16 w-16 z-0 ">
                        <Image
                            priority
                            src={back}
                            alt="scan"
                            height={25}
                            onClick={backPage}
                        />
                    </div>
                </div>
                <hr />



                <div className='grid justify-items-center m-6  gap-6 mt-20'>

                    <Button
                        className="bg-[#006A38] text-[#ffffff] h-24 w-60 rounded-xl shadow-md shadow-gray-500/100"
                        type="button"
                        onClick={() => router.replace("/profile2/" + params.cid + "/" + params.lineid +"/setting/setpassword")}
                    >
                        <div className="flex ">

                            <div className="flex-initial w-60">
                                <p className="text-2xl">เปลี่ยนรหัสผ่าน</p>
                            </div>
                        </div>
                    </Button>



                    <Button className="bg-[#BA2E21] text-[#ffffff]  h-24 w-60  rounded-xl shadow-md shadow-gray-500/100"
                        type="button"
                        onClick={() => router.replace("/profile2/" + params.cid + "/" + params.lineid +"/setting/lockout")}
                    >
                        <div className="flex ">

                            <div className="flex-initial w-60">
                                <p className="text-2xl " > ออกจากระบบ</p>
                            </div>
                        </div>
                    </Button>




                </div>


            </>

        )}</div>
    )
}

export default Setting