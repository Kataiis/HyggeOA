"use client"
import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import axios from "axios";
// import { usePatientStore } from "../store";
import dayjs from 'dayjs';
import th from "dayjs/locale/th";
import { CirclesWithBar } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";


function Laboratory({ params }: { params: { cid: string, lineid: string } }) {
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

            const data = await axios.post(`${pathUrl}/health/hie/lab`, { cid: params.cid })
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
            <Navbar/> {loading && (
                <div className="flex flex-row justify-center items-center w-full mt-10">
                    <CirclesWithBar
                        height="100"
                        width="100"
                        color="#6BB1E1"
                        outerCircleColor="#6BB1E1"
                        innerCircleColor="#6BB1E1"
                        barColor="#6BB1E1"
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
                                <p className='bg-[#6BB1E1] text-center text-lg text-[#ffffff] align-middle p-2'>ผลทางห้องปฏิบัติการ</p></div><div className="mx-5 ">

                                <Accordion type="single" collapsible className="w-full">
                                    {data.map((item: any) => (
                                        <AccordionItem value={item.lab_order_number} key={item.lab_order_number}>
                                            <AccordionTrigger className="p-3 bg-[#C8E0F1] shadow-md shadow-black">

                                                <div className="grid grid-cols-2 gap-10">
                                                    <div className="flex justify-start w-64 ">{item.name}</div>
                                                    <div className="flex justify-center ">
                                                        {dayjs(item.received_date).locale(th).add(543, "year").format("DD MMM YYYY")}
                                                    </div>

                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent className="p-3 bg-[#C3C3C3]">
                                                <div className="grid grid-cols-3 flex justify-center ">
                                                    <div className=" flex justify-center">รายการตรวจ</div>
                                                    <div className=" flex justify-center">ค่าปกติ</div>
                                                    <div className=" flex justify-center">ผล</div>
                                                </div>
                                            </AccordionContent>

                                            {item.datalab.map((vv: any) => {
                                                return (
                                                    <AccordionContent className="p-3 " key={item.id}>
                                                        <div className="grid grid-cols-3 flex justify-center">
                                                            <div className="flex justify-start w-30">
                                                                <p className="break-all ">{vv.lab_items_name}</p></div>
                                                            <div className=" flex justify-center ">
                                                                <p className="break-all w-30">{vv.lab_items_normal_value} {(vv.lab_items_unit === "N/A" || vv.lab_items_unit === "0") ? null : vv.lab_items_unit}</p></div>
                                                            <div className="flex justify-center text-[#4D57D3] ">

                                                                <p className="break-all  w-30">{vv.lab_order_result}</p></div>
                                                        </div>
                                                        <hr />

                                                    </AccordionContent>
                                                );
                                            })}
                                            <div className="mt-2"></div>
                                        </AccordionItem>
                                    ))}
                                </Accordion>




                            </div></>
                    ) : (
                        <div className=" h-56 grid content-center font-semibold text-[#707070] text-center text-lg p-5">

                            ยังไม่มีการรายงาน <br />
                            ผลทางห้องปฏิบัติการ
                        </div>
                    )
            )}
        </div>
    )
}

export default Laboratory