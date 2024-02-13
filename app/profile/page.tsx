"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
import Image from "next/image";
import Barcode from "react-barcode";
import { usePatientStore } from '../store';
import liff from "@line/liff"



const hyggeOAliff: any = process.env.HyggeOAliff;
const pathUrl: any = process.env.pathUrl;
function Profile() {
    const router = useRouter();
    const Patient: any = usePatientStore((state: any) => state.patient);
    const [profile, setProfile] = useState<any>({});

    const [lineId, setLineId] = useState("");
    const [loading, setloading] = useState(false);
    const [checkuser, setCheckuser] = useState(false);
    const [user, setUser] = useState<any>([]);
    const [value, setValue] = useState("");

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
        } catch (e: any) {
            console.error('liff init error', e.message)
        }

    }, [lineId])


    return (
        <div>
            <div className='bg-[#2C97A3]  mt-3'>
                <p className='text-center text-lg text-[#ffffff] align-middle p-2'>อุกกะ เมดิคอลเซอร์วิส</p>

            </div>
            <div className="h-[70px] text-center flex flex-row justify-center items-center mt-5 ">
                {/* <Barcode value={ res2 } displayValue={false} height={100} width={1.5} /> */}

            </div>
            <div className="mt-4">

                <Image className="mx-auto  rounded-full border-2 border-white"
                    priority
                    src={profile.pictureUrl}
                    alt="profile"
                    width={140}
                    height={100} />

            </div>

            <div className='m-5 text-2xl'>
                <p className='text-center'>
                    {Patient?.pname + " " + Patient?.fname + " " + Patient?.lname}
                </p>
            </div>
            <div className='bg-[#39CC88]  mt-3'>
                <p className='text-center text-lg text-[#ffffff] align-middle p-2'>สิทธิ : {Patient?.pttype_name} </p>

            </div>
            <div className='grid justify-items-center m-8 grid gap-6'>

                <Button className="bg-[#2C97A3] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                    type="button"
                    onClick={() => router.replace('/appointment')}
                >สมุดสุขภาพ</Button>



                <Button className="bg-[#49DABD] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                    type="button"
                    onClick={() => router.replace('/drug')}
                >สมุดโรงพยาบาล</Button>




            </div>


        </div>
    )
}

export default Profile

