"use client"
import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import axios from "axios";
import { useRouter } from "next/navigation";

// import { usePatientStore } from "../store";
import dayjs from "dayjs";
import th from "dayjs/locale/th";
import { CirclesWithBar } from "react-loader-spinner";
import Navbar from "../components/Navbar";

function Drug({ params }: { params: { cid: string, lineid: string } }) {
    const pathUrl: any = process.env.pathUrl;
    // const Patient: any = usePatientStore((state: any) => state.patient);
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState<any>([]);


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
                router.replace("/login")
            }
        }
        else {

            throw new Error(checkdata.data.error);
        }

    };
    
    const fetchData = async () => {
        setLoading(true);
        try {

            const data = await axios.post(`${pathUrl}/health/hie/drug`, { cid: params.cid })
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


        // console.log("Patient : ", params.cid);
        // if (!params.cid) {
        //     router.push("/hospitalbook");
        // } else {
        //     fetchData();
        // }
    }, []);

    return (
        <div>
            <Navbar />
            {loading && (
                <div className="flex flex-row justify-center items-center w-full mt-10">
                    <CirclesWithBar
                        height="100"
                        width="100"
                        color="#76DA49"
                        outerCircleColor="#76DA49"
                        innerCircleColor="#76DA49"
                        barColor="#76DA49"
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
                                <p className='bg-[#76DA49] text-center text-lg text-[#ffffff] align-middle p-2'>ข้อมูลการรับยา</p></div><div className="mx-5 ">

                                <Accordion type="single" collapsible className="w-full">
                                    {data.map((item: any) => (
                                        <AccordionItem value={item.vn} key={item.vn}>
                                            <AccordionTrigger className="p-3 bg-[#C0E4AF] shadow-md shadow-black">
                                                <div className="grid grid-cols-2 gap-10">
                                                    <div className="flex justify-start w-64 ">{item.name}</div>
                                                    <div className="flex justify-center "> {dayjs(item.vstdate).locale(th).add(543, "year").format("DD MMM YYYY")}
                                                    </div>

                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-3 bg-[#C3C3C3]">
                                                <div className="grid grid-cols-2 ">
                                                    <div className="flex justify-start w-64 ">ชื่อยา</div>
                                                    <div className="flex justify-end ">จำนวน</div>
                                                </div>
                                            </AccordionContent>


                                            {item.datadrug.map((vv: any) => {
                                                return (
                                                    <AccordionContent className="p-3" key={item.index}>
                                                        <div className="grid grid-cols-2 ">
                                                            <div className="flex justify-start w-64">{vv.genericname}</div>
                                                            <div className="flex justify-end">{vv.qty} {"  "}{vv.units}</div>

                                                        </div>
                                                        <hr />
                                                        <div>
                                                            <div className="flex justify-start w-64"><p className=" text-[#4D57D3]">{vv.drugusage}</p></div>


                                                        </div>
                                                    </AccordionContent>);
                                            })}
                                            <div className="mt-2"></div>
                                        </AccordionItem>
                                    ))}

                                </Accordion>

                            </div></>
                    ) : (
                        <div className="flex justify-center"> ไม่พบข้อมูล</div>
                    )
            )}
        </div>
    )
}

export default Drug