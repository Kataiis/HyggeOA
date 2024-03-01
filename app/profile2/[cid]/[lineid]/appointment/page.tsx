"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

import Currentdate from "./component/currentpage";
import Partdate from './component/partpage';
import axios from "axios";
import Navbar from "../components/Navbar";
// import { usePatientStore } from "../store";


function Appointment({ params }: { params: { cid: string, lineid: string } }) {
    const router = useRouter();
    // const Patient: any = usePatientStore((state: any) => state.patient);
    const pathUrl: any = process.env.pathUrl;
    const [patient, setPatient] = useState<any>([]);

    const [isShown, setIsShown] = useState(true);

    const Clickcurrentdate = (e: any) => {
        setIsShown(true);
    };
    const Clickpartdate = (e: any) => {
        setIsShown(false);
    };


    useEffect(() => {
        const getPatient = async () => {
            const res: any = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: params.cid }).then((v: any) => setPatient(v.data.message[0]));


        }
        getPatient();
    }, [])



    return (
        <div>
            <Navbar />
            <div className=" text-2xl bg-[#E1E1E1] text-center p-4 text-[#666666] font-medium sticky top-16">
                <p>
                    {patient.pname} {patient.fname} {patient.lname}
                    {/* {Patient?.pname + " " + Patient?.fname + " " + Patient?.lname} */}
                </p>
            </div>
            <div className="bg-[#ffffff] p-4 sticky top-32">
                <p className='bg-[#4D57D3] text-center text-lg text-[#ffffff] align-middle p-2'>รายการนัด</p>

                <div className='grid grid-cols-2 justify-items-center mt-5'>

                    <Button className="bg-[#4D57D3] text-[#ffffff] text-md rounded-xl shadow-md shadow-gray-500/100"
                        type="button" name="buttoncurrent"
                        onClick={Clickcurrentdate} > รายการปัจจุบัน</Button>

                    <Button className="bg-[#999999] text-[#ffffff] text-md rounded-xl shadow-md shadow-gray-500/100"
                        type="button" name="button part"
                        onClick={Clickpartdate}> รายการย้อนหลัง</Button>
                </div>
            </div>




            <div>
                {!isShown && <Partdate params={{
                    cid: params.cid,
                    lineid: params.lineid
                }} />}
                {isShown && <Currentdate params={{
                    cid: params.cid,
                    lineid: params.lineid
                }} />}
            </div>


        </div>

    )
}

export default Appointment