"use client"
import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import axios from "axios";
import { usePatientStore } from "../store"
import dayjs from 'dayjs';
import th from "dayjs/locale/th";
import { CirclesWithBar } from "react-loader-spinner";
import { useRouter } from "next/navigation";

function Xray() {
    const pathUrl: any = process.env.pathUrl;
    const Patient: any = usePatientStore((state: any) => state.patient);
    const router = useRouter();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {

            const data = await axios.post(`${pathUrl}/health/hie/xray`, { cid: Patient.cid })
            console.log("data", data.data);
            setData(data.data.message);
        } catch (error: any) {
            console.error(error.message);
        }
        setLoading(false);
    };
    useEffect(() => {
        console.log("Patient : ", Patient);
        if (!Patient) {
            router.push("/hospitalbook");
        } else {
            fetchData();
        }
    }, [Patient]);
    return (
        <div>
               <div className=" text-2xl bg-[#E1E1E1] text-center p-4 text-[#666666] font-medium">
                <p>
                    {Patient?.pname + " " + Patient?.fname + " " + Patient?.lname}
                </p>
            </div>
            <div className='bg-[#B96BE1] mx-5 m-3'>
                <p className='text-center text-lg text-[#ffffff] align-middle p-2'>ผลอ่านทางรังสีวิทยา</p>
            </div>
            {loading && (
                <div className="flex flex-row justify-center items-center w-full mt-10">
                    <CirclesWithBar
                        height="100"
                        width="100"
                        color="#B96BE1"
                        outerCircleColor="#B96BE1"
                        innerCircleColor="#B96BE1"
                        barColor="#B96BE1"
                        ariaLabel="circles-with-bar-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />

                </div>
            )}
            {!loading && (
                (data.length > 0) ?
                    (
                        <div className="mx-5 ">

                            <Accordion type="single" collapsible className="w-full" >
                                {data.map((item: any) => (
                                    <AccordionItem value={item.id} key={item.id}>
                                        <AccordionTrigger className="p-3 bg-[#E1BDF3] shadow-md shadow-black">
                                            <div className="grid grid-cols-2 gap-10">
                                                <div className="flex justify-start w-64 ">{item.name}</div>
                                                <div className="flex justify-center ">    {dayjs(item.date_request).locale(th).add(543, "year").format("DD MMM YYYY")}</div>
                                            </div>

                                        </AccordionTrigger>
                                        <AccordionContent className="p-3 bg-[#C3C3C3]">
                                            <div className="flex justify-center">ผลอ่านทางรังสีวิทยา</div>
                                        </AccordionContent>

                                        <AccordionContent className="p-3">
                                            <div className="whitespace-pre-line text-balance">
                                                {item.xray_result}


                                            </div>




                                        </AccordionContent>
                                        <div className="mt-2"></div>
                                    </AccordionItem>
                                ))}

                            </Accordion>



                        </div>
                    ) : (
                        <div className=" h-56 grid content-center font-semibold text-[#707070] text-center text-lg p-5">

                            ยังไม่มีการรายงาน <br />
                            ผลอ่านทางรังสีวิทยา
                        </div>
                    )
            )}
        </div>
    )
}

export default Xray