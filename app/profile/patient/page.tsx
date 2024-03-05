"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
import Image from 'next/image'
import comment from '@/public/comment-text.png'
import drug from '@/public/drug.png'
import drugallergy from '@/public/drugallergy.png'
import lab from '@/public/Lab.png'
import xray from '@/public/xray.png'
import back from '@/public/back.png'
import { usePatientStore } from '@/app/store';


function Patient() {
    const router = useRouter();
    const [loading, setloading] = useState(true);


    const Patient: any = usePatientStore((state: any) => state.patient);
    const backPage = () => {
        router.replace('/profile')
    };

    return (
        <div> {loading && (
            <><div>
                <div className="absolute left-8 top-5 h-16 w-16 z-0 ">
                    <Image
                        priority
                        src={back}
                        alt="scan"
                        height={25}
                        onClick={backPage}
                    />
                </div>
                <div className=" text-2xl bg-[#E1E1E1] text-center p-4 text-[#666666] font-medium">
                    <p>
                        {Patient?.pname + " " + Patient?.fname + " " + Patient?.lname}
                    </p>
                </div>
                {/* <div className='grid grid-cols-2'>
                <div>
                    <span>เพศ :</span>
                    <span> {(Patient.gender === "1") ? "ชาย" : (Patient.gender === "2") ? "หญิง" : null}</span>



                </div>

                <div>
                    <span>อายุ : </span>
                    <span>{Patient.age_y} </span>
                    <span>ปี</span>
                </div>
            </div> */}
                {/* <span>หมู่เลือด : </span>
            <span>{Patient.bloodgroup}</span>

            <div>
                <span>สิทธิการรักษา : </span>
                <div>{Patient.pttype_name}</div>
            </div> */}
            </div>
                {/* <div className='bg-[#49DABD] mx-4'>
                <p className='text-center text-lg text-[#ffffff] align-middle p-2'>สมุดโรงพยาบาล</p>
            </div> */}

                <hr />



                <div className='grid justify-items-center m-6 grid gap-6'>

                    <Button
                        className="bg-[#4D57D3] text-[#ffffff] h-20 w-full rounded-xl shadow-md shadow-gray-500/100"
                        type="button"
                        onClick={() => router.replace('/appointment')}
                    >
                        <div className="flex ">
                            <div className="flex-initial w-30">
                                <Image
                                    priority
                                    src={comment}
                                    alt="comment"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <div className="flex-initial w-60">
                                <p className="text-2xl " >ข้อมูลการนัดหมาย</p>
                            </div>
                        </div>
                    </Button>



                    <Button className="bg-[#76DA49] text-[#ffffff] h-20 w-full rounded-xl shadow-md shadow-gray-500/100"
                        type="button"
                        onClick={() => router.replace('/drug')}
                    >
                        <div className="flex ">
                            <div className="flex-initial w-30 ">
                                <Image
                                    priority
                                    src={drug}
                                    alt="drug"
                                    width={55}
                                    height={55}
                                />
                            </div>
                            <div className="flex-initial w-60">
                                <p className="text-2xl " > ข้อมูลการรับยา</p>
                            </div>
                        </div>
                    </Button>


                    <Button className="bg-[#E17104] text-[#ffffff] text-lg h-20 w-full rounded-xl shadow-md shadow-gray-500/100"
                        type="button"
                        onClick={() => router.replace('/drugallergy')}
                    >  <div className="flex ">
                            <div className="flex-initial w-30 ">
                                <Image
                                    priority
                                    src={drugallergy}
                                    alt="drugallergy"
                                    width={55}
                                    height={55}
                                />
                            </div>
                            <div className="flex-initial w-60">
                                <p className="text-2xl " > ข้อมูลการแพ้ยา</p>
                            </div></div></Button>

                    <Button className="bg-[#6BB1E1] text-[#ffffff] text-lg h-20 w-full rounded-xl shadow-md shadow-gray-500/100 "
                        type="button"
                        onClick={() => router.replace('/laboratory')}

                    >  <div className="flex ">
                            <div className="flex-initial w-30 ">
                                <Image
                                    priority
                                    src={lab}
                                    alt="lab"
                                    width={45}
                                    height={45}
                                />
                            </div>
                            <div className="flex-initial w-60">
                                <p className="text-2xl " >ผลทางห้องปฏิบัติการ</p>
                            </div>
                        </div></Button>

                    <Button className="bg-[#B96BE1] text-[#ffffff] text-lg h-20 w-full rounded-xl shadow-md shadow-gray-500/100"
                        type="button"
                        onClick={() => router.replace('/xray')}>
                        <div className="flex ">
                            <div className="flex-initial w-30 ">
                                <Image
                                    priority
                                    src={xray}
                                    alt="xray"
                                    width={45}
                                    height={45}
                                />
                            </div>
                            <div className="flex-initial w-60">
                                <p className="text-2xl " >ผลอ่านทางรังสีวิทยา</p>
                            </div></div>
                    </Button>


                </div>

                {/* <div className="flex justify-end">

                <div className="text-sm	p-3" >

                    หากพบว่าข้อมูลไม่เป็นปัจจุบันกรุณาคลิกที่นี้  {'>'}
                </div>
                <div
                    onClick={() => updatedata()}>
                    <Image
                        priority
                        src={refresh}
                        alt="refresh"
                        width={50}
                        height={50} />
                </div>
            </div> */}

            </>

        )}</div>
    )
}

export default Patient