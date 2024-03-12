"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
// import { usePatientStore } from "../../../../store";
import Image from 'next/image'
import comment from '@/public/comment-text.png'
import drug from '@/public/drug.png'
import drugallergy from '@/public/drugallergy.png'
import lab from '@/public/Lab.png'
import xray from '@/public/xray.png'
import back from '@/public/back.png'
import axios from 'axios';
import Navbar from '../components/Navbar';
import { CirclesWithBar } from 'react-loader-spinner';


function Patient({ params }: { params: { cid: string, lineid: string } }) {
    const pathUrl: any = process.env.pathUrl;
    const router = useRouter();
    const [loading, setloading] = useState(true);
    const [patient, setPatient] = useState<any>([]);


    // const Patient: any = usePatientStore((state: any) => state.patient);
    const backPage = () => {
        router.replace("../../" + params.cid + "/" + params.lineid);
    };

    const check = async () => {
        setloading(true);
        console.log("dataSend", params.cid)
        console.log("dataSend", params.lineid)

        const checkdata = await axios.post(`${pathUrl}/health/hyggelineservice/checkCitizen`, { cid: params.cid, lineid: params.lineid })
        console.log("checkdata : ", checkdata.data)
        if (checkdata.data.ok) {
            console.log("length", checkdata.data.message)
            if (checkdata.data.message > 0) {
                setloading(false)
            }
            else {
                router.replace("/noentry")
            }
        }
        else {

            throw new Error(checkdata.data.error);
        }

    };
    useEffect(() => {
        check();
        const getPatient = async () => {
            const res: any = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: params.cid }).then((v: any) => setPatient(v.data.message[0]));


        }
        getPatient();
    }, [])

    return (
        <><div>   <Navbar /></div><div>
            <div className="absolute left-8 top-5 h-16 w-16 z-0 ">
                <Image
                    priority
                    src={back}
                    alt="scan"
                    height={25}
                    onClick={backPage} />
            </div>
            {loading && (
                <div className="flex flex-row justify-center items-center w-full mt-10">
                    <CirclesWithBar
                        height="100"
                        width="100"
                        color="#00AE91"
                        outerCircleColor="#00AE91"
                        innerCircleColor="#00AE91"
                        barColor="#00AE91"
                        ariaLabel="circles-with-bar-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />

                </div>
            )}
            {!loading && (
                <div>
                    <div className=" text-2xl bg-[#E1E1E1] text-center p-4 text-[#666666] font-medium">
                        <p>
                            {patient.pname} {patient.fname} {patient.lname}
                            {/* {Patient?.pname + " " + Patient?.fname + " " + Patient?.lname} */}
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
        </div>
        <span>หมู่เลือด : </span>
        <span>{Patient.bloodgroup}</span>

        <div>
            <span>สิทธิการรักษา : </span>
            <div>{Patient.pttype_name}</div>
        </div>
   
        <div className='bg-[#49DABD] mx-4'>
            <p className='text-center text-lg text-[#ffffff] align-middle p-2'>สมุดโรงพยาบาล</p>
        </div> */}


                    <hr />



                    <div className='grid justify-items-center m-6  gap-6'>

                        <Button
                            className="bg-[#4D57D3] text-[#ffffff] h-20 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace("./appointment")}
                        >
                            <div className="flex ">
                                <div className="flex-initial w-30">
                                    <Image
                                        priority
                                        src={comment}
                                        alt="comment"
                                        width={40}
                                        height={40} />
                                </div>
                                <div className="flex-initial w-60">
                                    <p className="text-2xl ">ข้อมูลการนัดหมาย</p>
                                </div>
                            </div>
                        </Button>



                        <Button className="bg-[#76DA49] text-[#ffffff] h-20 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace("./drug")}
                        >
                            <div className="flex ">
                                <div className="flex-initial w-30 ">
                                    <Image
                                        priority
                                        src={drug}
                                        alt="drug"
                                        width={55}
                                        height={55} />
                                </div>
                                <div className="flex-initial w-60">
                                    <p className="text-2xl "> ข้อมูลการรับยา</p>
                                </div>
                            </div>
                        </Button>


                        <Button className="bg-[#E17104] text-[#ffffff] text-lg h-20 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace("./drugallergy")}
                        >  <div className="flex ">
                                <div className="flex-initial w-30 ">
                                    <Image
                                        priority
                                        src={drugallergy}
                                        alt="drugallergy"
                                        width={55}
                                        height={55} />
                                </div>
                                <div className="flex-initial w-60">
                                    <p className="text-2xl "> ข้อมูลการแพ้ยา</p>
                                </div></div></Button>

                        <Button className="bg-[#6BB1E1] text-[#ffffff] text-lg h-20 w-full rounded-xl shadow-md shadow-gray-500/100 "
                            type="button"
                            onClick={() => router.replace('./laboratory')}

                        >  <div className="flex ">
                                <div className="flex-initial w-30 ">
                                    <Image
                                        priority
                                        src={lab}
                                        alt="lab"
                                        width={45}
                                        height={45} />
                                </div>
                                <div className="flex-initial w-60">
                                    <p className="text-2xl ">ผลทางห้องปฏิบัติการ</p>
                                </div>
                            </div></Button>

                        <Button className="bg-[#B96BE1] text-[#ffffff] text-lg h-20 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace('./xray')}>
                            <div className="flex ">
                                <div className="flex-initial w-30 ">
                                    <Image
                                        priority
                                        src={xray}
                                        alt="xray"
                                        width={45}
                                        height={45} />
                                </div>
                                <div className="flex-initial w-60">
                                    <p className="text-2xl ">ผลอ่านทางรังสีวิทยา</p>
                                </div></div>
                        </Button>


                    </div>

                </div>)}



        </div></>
            )
}

            export default Patient