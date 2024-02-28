"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import checkmark from '@/public/checkmark.png'
import vector from '@/public/Vector.png'
import axios from "axios";
// import { usePatientStore } from "../store";
import dayjs from 'dayjs';
import th from "dayjs/locale/th";
import { CirclesWithBar } from "react-loader-spinner";


function Drugallergy({ params }: { params: { cid: string, lineid: string } }) {
    const pathUrl: any = process.env.pathUrl;
    // const Patient: any = usePatientStore((state: any) => state.patient);
    const [data, setData] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await axios.post(`${pathUrl}/health/hie/drugallergy`, { cid: params.cid })
            console.log("data", data.data);
            setData(data.data.message);
        } catch (error: any) {
            console.error(error.message);
        }
        setLoading(false);
    };


    useEffect(() => {
        console.log("Patient : ", params);
        if (!params) {
            router.push("/hospitalbook");
        } else {
            fetchData();
        }

    }, [params]);



    return (
        <div>
            <div className=" text-2xl bg-[#E1E1E1] text-center p-4 text-[#666666] font-medium sticky top-16">
                <p>
                    {params.cid}
                    {/* {Patient?.pname + " " + Patient?.fname + " " + Patient?.lname} */}
                </p>
            </div>
         
            <div className="bg-[#ffffff] p-4 sticky top-32">
                <p className='bg-[#E17104] text-center text-lg text-[#ffffff] align-middle p-2'>ข้อมูลการแพ้ยา {data.length} รายการ</p> </div>
            {loading && (
                <div className="flex flex-row justify-center items-center w-full mt-10">
                    <CirclesWithBar
                        height="100"
                        width="100"
                        color="#E17104"
                        outerCircleColor="#E17104"
                        innerCircleColor="#E17104"
                        barColor="#E17104"
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
                        <div>
                            {data.map((item: any) => (
                                <div className='bg-[#F3EEDC] m-5 p-2' key={item.id}>

                                    <div className="flex flex-row">

                                        <div className="grid justify-items-center basis-1/4">
                                            <Image
                                                priority
                                                src={checkmark}
                                                alt="checkmark"
                                                width={65}
                                                height={65} />
                                        </div>


                                        <div className="basis-1/2  ml-2">
                                            <p className="text-[#FF1717] text-lg">ชื่อยาที่แพ้ :</p>
                                            <p className="text-[#FF1717] text-lg "> {item.allergy_item}</p>

                                            <p className="mt-4">อาการแพ้ : </p>
                                            <p className="text-lg "> {item.allergy_symtom}</p>

                                        </div>
                                        <div className="grid justify-items-end pr-2 basis-1/4">
                                            <Image
                                                priority
                                                src={vector}
                                                alt="vector"
                                                width={30}
                                                height={30} />
                                        </div>
                                    </div><div className='grid grid-cols-2 text-sm text-[#707070] p-2'>
                                        <span>โดย {item.name}</span>
                                        <span className="flex justify-end">
                                            {dayjs(item.report_date).locale(th).add(543, "year").format("DD MMM YYYY")}
                                        </span>
                                    </div>

                                </div>))}







                        </div>) : (
                        <div className=" h-56 grid content-center font-semibold text-[#707070] text-center text-lg p-5">
                        
                                ยังไม่มีการรายงาน <br />
                                ข้อมูลการแพ้ยา
                        </div>
                    )

            )}
        </div>
    )
}

export default Drugallergy