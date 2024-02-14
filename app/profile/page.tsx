"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
import Image from "next/image";
import Barcode from "react-barcode";
import { usePatientStore } from '../store';
import liff from "@line/liff"
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Avatar from '@mui/material/Avatar';


const hyggeOAliff: any = process.env.HyggeOAliff;
const pathUrl: any = process.env.pathUrl;
function Profile() {
    const router = useRouter();
    const Patient: any = usePatientStore((state: any) => state.patient);
    const [profile, setProfile] = useState<any>({});

    const [lineId, setLineId] = useState("");
    const [loading, setloading] = useState(false);
    const [image, setimage] = useState("");

    const imgPath = 'https://www.virtualhos.net/api4000/apihygge/getImageProfile/' + Patient?.cid;
    useEffect(() => {

        const initLiff = async () => {
            setloading(false);
            await liff.init({ liffId: hyggeOAliff }).then(async () => {
                if (!liff.isLoggedIn()) {
                    liff.login();
                } else {
                    const profile = await liff.getProfile()
                    console.log(profile);
                    setProfile(profile)
                    setLineId(profile?.userId);

                    console.warn(lineId);
                }


            });
            await liff.ready
        }

        try {
            initLiff()
            setimage("https://www.virtualhos.net/api4000/apihygge/getImageProfile/" + Patient.cid)
        } catch (e: any) {
            console.error('liff init error', e.message)
        }

    }, [lineId, Patient])



    return (

        <div>

            <div className='bg-[#F15D4F] '>
                <p className='text-center text-2xl text-[#ffffff] align-middle p-5'>อุกกะ เมดิคอล เซอร์วิส</p>

            </div>
            <div className="h-[70px] text-center flex flex-row justify-center items-center mt-5 ">
                <Barcode value={Patient?.cid} displayValue={false} height={60} width={2} />

            </div>

            <div className="mt-5 grid justify-items-center">
                <Avatar src={imgPath} sx={{ width: 140, height: 140 }} />

                {/* <Image className="mx-auto  rounded-full border-2 border-white shadow-lg shadow-black-500/100"
                    priority
                    src={profile.pictureUrl}
                    // src = {image}
                    alt="profile"
                    width={140}
                    height={100} /> */}

            </div>

            <div className='m-5 text-2xl'>
                <p className='text-center text-[#2C97A3]'>
                    {Patient?.pname + " " + Patient?.fname + " " + Patient?.lname}
                </p>
            </div>
            <div className='bg-[#39CC88]  mt-3'>
                <p className='text-center text-lg text-[#ffffff] align-middle p-2'>สิทธิ : {Patient?.pttype_name} </p>

            </div>
            <div className='grid justify-items-center m-8 grid gap-6'>

                <Button className="bg-[#2C97A3] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100 "
                    type="button"
                    onClick={() => router.replace('/comingsoon')}
                >สมุดสุขภาพ
                </Button>
                <div className="-mt-3"> สมุดบันทึกข้อมูล <span className="text-lg italic ">ด้วยตัวคุณเอง</span></div>



                <Button className="bg-[#49DABD] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                    type="button"
                    // onClick={() => updatedata()}
                    onClick={() => router.replace('/patient')}

                >สมุดโรงพยาบาล</Button>

                <div className="-mt-3">ข้อมูลสุขภาพ <span className="text-lg italic ">จากโรงพยาบาล </span></div>


            </div>


        </div>
    )
}

export default Profile

