"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

import Currentdate from "./component/currentpage";
import Partdate from './component/partpage';
import { usePatientStore } from "../store";


function Appointment() {
    const router = useRouter();
    const Patient: any = usePatientStore((state: any) => state.patient);

    const [isShown, setIsShown] = useState(true);

    const Clickcurrentdate = (e: any) => {
        setIsShown(true);
    };
    const Clickpartdate = (e: any) => {
        setIsShown(false);
    };

    return (
        <div>
            <div className=" text-2xl bg-[#E1E1E1] text-center p-4 text-[#666666] font-medium">
                <p>
                    {Patient?.pname + " " + Patient?.fname + " " + Patient?.lname}
                </p>
            </div>
            <div className='bg-[#4D57D3] mx-5 m-3'>
                <p className='text-center text-lg text-[#ffffff] align-middle p-2'>รายการนัด</p>
            </div>

            <div className='grid justify-items-center m-5 grid grid-cols-2'>
                <Button className="bg-[#4D57D3] text-[#ffffff] text-md rounded-xl shadow-md shadow-gray-500/100"
                    type="button" name="buttoncurrent"
                    onClick={Clickcurrentdate} > รายการปัจจุบัน</Button>

                <Button className="bg-[#999999] text-[#ffffff] text-md rounded-xl shadow-md shadow-gray-500/100"
                    type="button" name="button part"
                    onClick={Clickpartdate}> รายการย้อนหลัง</Button>
            </div>
            <div>
                {!isShown && <Partdate />}
                {isShown && <Currentdate />}
            </div>

        </div>

    )
}

export default Appointment