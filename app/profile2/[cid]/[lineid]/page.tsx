"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
import Image from "next/image";
import Barcode from "react-barcode";
import liff from "@line/liff"

import Avatar from '@mui/material/Avatar';
import QRCode from "react-qr-code";

import logo from "@/public/hg.png"
import axios from "axios";

const hyggeOAliff: any = process.env.HyggeOAliff;

const ProfilePage = ({ params }: { params: { cid: string, lineid: string } }) => {
    const router = useRouter();
    const pathUrl: any = process.env.pathUrl;

    const [profile, setProfile] = useState<any>({});
    const [patient, setPatient] = useState<any>([]);

    const [lineId, setLineId] = useState("");
    const [loading, setloading] = useState(false);
    const [image, setimage] = useState("");

    const imgPath = 'https://www.virtualhos.net/api4000/apihygge/getImageProfile/' + params.cid;

    useEffect(() => {

        const getPatient = async () => {
            const res: any = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: params.cid }).then((v: any) => setPatient(v.data.message[0]));


        }
        getPatient();

        try {

            setimage("https://www.virtualhos.net/api4000/apihygge/getImageProfile/" + params.cid)
        } catch (e: any) {
            console.error('liff init error', e.message)
        }

    }, [])



    return (

        <div>
          
            <div className='bg-[#F15D4F] flex justify-center p-3 '>
                <Image
                    priority
                    src={logo}
                    alt="logo"
                    width={55}
                    height={50} />
                <p className='text-center text-2xl text-[#ffffff] p-3'>ฮุกกะ เมดิคอล เซอร์วิส</p>
            </div>


            {/* <div className="h-[70px] text-center flex flex-row justify-center items-center mt-5 "> */}
            {/* <Barcode value={Patient?.cid} displayValue={false} height={60} width={2} /> */}
            {/* <QRCode
                    size={100}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={Patient?.cid}
                    viewBox={`0 0 256 256`}
                /> */}

            {/* </div> */}


            {/* <div className="mt-5 grid justify-items-center">
                <Avatar src={imgPath} sx={{ width: 140, height: 140 }} /> */}

            {/* <Image className="mx-auto  rounded-full border-2 border-white shadow-lg shadow-black-500/100"
                    priority
                    src={profile.pictureUrl}
                    // src = {image}
                    alt="profile"
                    width={140}
                    height={100} /> */}

            {/* </div> */}


            <div className="grid grid-cols-2 justify-items-center m-5 ">
                <div className=" p-5 ">
                    <Avatar src={imgPath} sx={{ width: 140, height: 140 }} />
                </div>

                <div className=" p-5">
                    <QRCode
                        size={145}
                        // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={`${params?.cid}`}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </div>

            <div className='m-5 text-2xl'>
                <p className='text-center text-[#2C97A3]'>
                    {patient?.pname} {patient?.fname} {patient?.lname}
                </p>
            </div>
            <div className='bg-[#39CC88]  mt-3'>
                <p className='text-center text-xl text-[#ffffff] align-middle p-2'>สิทธิ :  {patient?.pttype_name} </p>

            </div>
            <div className='grid justify-items-center m-8  gap-6'>

                <Button className="bg-[#2C97A3] text-[#ffffff] text-xl h-14 w-full rounded-xl shadow-md shadow-gray-500/100 "
                    type="button"
                    onClick={() => router.replace("../" + params.cid + "/" + params.lineid + "/comingsoon")}
                >สมุดสุขภาพ
                </Button>
                <div className="-mt-3"> สมุดบันทึกข้อมูล <span className="text-lg italic ">ด้วยตัวคุณเอง</span></div>



                <Button className="bg-[#49DABD] text-[#ffffff] text-xl h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                    type="button"
                    // onClick={() => updatedata()}
                    onClick={() => router.replace("../" + params.cid + "/" + params.lineid + "/patient")}

                >สมุดโรงพยาบาล</Button>

                <div className="-mt-3">ข้อมูลสุขภาพ <span className="text-lg italic ">จากโรงพยาบาล </span></div>


            </div>


        </div>
    )
}

export default ProfilePage