"use client"
import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import axios from "axios";
// import { usePatientStore } from "../store"
import dayjs from 'dayjs';
import th from "dayjs/locale/th";
import { CirclesWithBar } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

function Xray({ params }: { params: { cid: string, lineid: string } }) {
    const pathUrl: any = process.env.pathUrl;
    // const Patient: any = usePatientStore((state: any) => state.patient);
    const router = useRouter();
    const [patient, setPatient] = useState<any>([]);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const check = async () => {
        setLoading(true);
        console.log("dataSend", params.cid)
        console.log("dataSend", params.lineid)

        const checkdata = await axios.post(`${pathUrl}/health/hyggelineservice/checkCitizen`, { cid: params.cid, lineid: params.lineid })
        console.log("checkdata : ", checkdata.data)
        if (checkdata.data.ok) {
            console.log("length", checkdata.data.message)
            if (checkdata.data.message > 0) {
                setLoading(false)
                fetchData();
            }
            else {
                router.replace("/noentry")
            }
        }
        else {

            throw new Error(checkdata.data.error);
        }

    };

    const fetchData = async () => {
        setLoading(true);
        try {

            const data = await axios.post(`${pathUrl}/health/hie/xray`, { cid: params.cid })
            console.log("data", data.data);
            setData(data.data.message);
        } catch (error: any) {
            console.error(error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        check();
        const getPatient = async () => {
            const res: any = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: params.cid }).then((v: any) => setPatient(v.data.message[0]));


        }
        getPatient();

        // console.log("Patient : ", params);
        // if (!params) {
        //     router.push("/hospitalbook");
        // } else {
        //     fetchData();
        // }
    }, []);



    return (
        <div>
            <Navbar/>
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
                        <><div className=" text-2xl bg-[#E1E1E1] text-center p-4 text-[#666666] font-medium sticky top-16">
                            <p>
                                {/* {params.cid} */}
                                {patient.pname} {patient.fname} {patient.lname}
                            </p>
                        </div><div className="bg-[#ffffff] p-4 sticky top-32">
                                <p className='bg-[#B96BE1] text-center text-lg text-[#ffffff] align-middle p-2'>ผลอ่านทางรังสีวิทยา</p></div><div className="mx-5 ">

                                <Accordion type="single" collapsible className="w-full">
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



                            </div></>
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