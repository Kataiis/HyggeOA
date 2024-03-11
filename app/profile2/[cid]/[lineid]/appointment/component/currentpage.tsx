"use client";
import { Athiti } from "next/font/google";
import { Button } from "@/components/ui/button"
import axios from "axios";
import { useEffect, useState } from "react";
import { usePatientStore } from "@/app/store"
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';
import th from "dayjs/locale/th";
import { CirclesWithBar } from "react-loader-spinner";


const inter: any = Athiti({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    adjustFontFallback: true,
});


const Currentdate = ({ params }: { params: { cid: string, lineid: string } }, dataIn: any) => {
    const dataOverview = dataIn.data;
    const pathUrl: any = process.env.pathUrl;
    // const Patient: any = usePatientStore((state: any) => state.patient);
    const router = useRouter();
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

            const data = await axios.post(`${pathUrl}/health/hie/appointment`, { cid: params.cid })
            console.log("data", data.data);
            setData(data.data.message);


        } catch (error: any) {
            console.error(error.message);

        }
        setLoading(false);
    };

   

    useEffect(() => {
        check();
            fetchData();
        // console.log("Patient : ", params.cid);
        // if (!params.cid) {
        //     router.push("/hospitalbook");
        // } else {
        //     check();
        //     fetchData();
        // }
    }, []);

    return (
        <div>

            {loading && (
                <div className="flex flex-row justify-center items-center w-full mt-10">
                    <CirclesWithBar
                        height="100"
                        width="100"
                        color="#4D57D3"
                        outerCircleColor="#4D57D3"
                        innerCircleColor="#4D57D3"
                        barColor="#4D57D3"
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

                        <div className='mx-5 grid grid gap-3'>
                            {data.map((item: any) => (

                                <div className='bg-[#4D57D3] p-4 text-[#ffffff] ' key={item.id}>

                                    <div className='grid grid-cols-2'>
                                        <span>
                                            {dayjs(item.app_date).locale(th).add(543, "year").format("DD MMM YYYY")} </span>


                                        <span className='flex justify-end'>
                                            {item.app_time}

                                        </span>
                                    </div><hr className="mb-2" /><div className='grid grid-rows-2 grid-flow-col '>
                                        <p className="col-span-2">{item.app_clinic_name}</p>
                                        <p className="col-span-2">{item.app_doctor_name}</p>

                                        {/* <div className="flex justify-center mt-3 row-span-2">
<Button className='border-2 border-[#fffff] bg-[#4D57D3] shadow-md shadow-black'>รายละเอียด</Button></div> */}
                                    </div>
                                </div>))}
                        </div>
                    ) : (
                        <div className=" h-56 grid content-center font-semibold text-[#707070] text-center text-lg p-5">

                            ยังไม่มีรายการนัดในตอนนี้
                        </div>
                    )



            )}
        </div>

    );
};

export default Currentdate;
