"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from 'next/image'
import liff from "@line/liff"
import { usePatientStore } from "@/app/store"
import back from '@/public/back.png'
import vector from "@/public/vector_logout.png"
import Avatar from "@mui/material/Avatar";
import Navbardigital from "@/app/profile/components/Navbardigital";

const hyggeOAliff: any = process.env.HyggeOAliff;

function Logout({ params }: { params: { cid: string, lineid: string } }) {
    const router = useRouter();
    const Patient: any = usePatientStore((state: any) => state.patient);
    const [profile, setProfile] = useState<any>({});
    const [loading, setloading] = useState(false);
    const [lineId, setLineId] = useState("");
    const [image, setimage] = useState("");
    const [patient, setPatient] = useState<any>([]);

    const pathUrl: any = process.env.pathUrl;


    const backPage = () => {
        router.replace('./')
    };

   
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

    
    

    const clicklogout = async (lineid: any) => {
        console.log("lineid :", lineid)
        const isConfirm = await Swal.fire({
            title: "ต้องการออกจากระบบใช่หรือไม่",
            //   text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "ยืนยัน",
            cancelButtonColor: "#d33",
            cancelButtonText: "ยกเลิก",

        }).then((result) => {
            return result.isConfirmed;
        });
        if (!isConfirm) {
            return;
        }

        await axios
            .delete(`${pathUrl}/health/hyggelineservice/destroy/${lineid}`)
            .then(() => {
                Swal.fire({
                    icon: "success",
                  
                });
            });
        router.replace("/profile2");
    };

    return (
        <div>
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

            <div className="m-10">
                <div className="flex justify-center p-6">
                    <Avatar src={imgPath} sx={{ width: 140, height: 140 }} />
                </div>
                <p className="text-2xl text-center text-[#2C97A3] mt-5 mb-3 ">
                    {Patient?.pname}{Patient?.fname} {Patient?.lname}
                </p>

                <div className="flex flex-row  justify-center ">
                    <div className="justify-items-start  basis-1/4">
                        <Image
                            priority
                            src={vector}
                            alt="vector"
                            width={50}
                            height={50} />
                    </div>
                    <div>
                        <p className="text-xl font-bold ">ต้องการ </p><p className="text-xl font-bold italic">ออกจากระบบ</p>
                    </div>
                </div>
                <div className="flex justify-center mt-5">
                    <Button
                        type="submit"
                        variant="outline"
                        className="bg-[#9747FF] text-grey drop-shadow-md text-xl 
                     hover:bg-[#eaefe8] hover:text-grey hover:text-lg text-[#ffffff] h-[54px] w-[150px] "
                     
                        onClick={() => clicklogout(params.lineid)}

                    >
                        ยืนยัน
                    </Button>
                </div></div>
        </div>
    )
}

export default Logout