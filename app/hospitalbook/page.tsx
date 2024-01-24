"use client"
import axios from "axios";
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
import { usePatientStore } from "../store";
import Swal from "sweetalert2";
import liff from "@line/liff"
import GetOS from "@line/liff/get-os";

const Hospitalbook = () => {
    const router = useRouter();
    const pathUrl: any = process.env.pathUrl;
    const hyggeOAliff: any = process.env.HyggeOAliff;
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);


    const Patient: any = usePatientStore((state: any) => state.patient);




    const updatePatient: any = usePatientStore((state: any) => state.updatePatient);
    const [os, setOs] = useState<string>();
    const [lineId, setLineId] = useState("");
    const [profile, setProfile] = useState<any>({});

    const updatedata = async () => {

        const dataIns = {
            req_cid: Patient.cid,
            req_hospcode: Patient.favhos1,
            line_id: `${profile.userId}`,
        };

        const resIns: any = await axios.post(
            pathUrl + "/health/hiereq/store_reqerefer",
            dataIns
        );
        if (resIns.data.ok) {
            console.log("insert hie_request success");
            const res: any = await axios.post(pathUrl + "/health/hiereq/checkin", {
                cid: Patient.cid,
            });
            if (res.data.ok) {
                if (res.data.message <= 1) {
                    //ไม่เคยมีการ request วันนี้
                    const timer = setTimeout(() => {
                      // ทำ sweetaler แจ้งเตือน ว่าทำสำเร็จแล้ว
                      }, 12000);

                } else {

                    console.log("have  log in hie_request");
                }
            }
        }
    };


    useEffect(() => {

        const initLiff = async () => {

            liff.use(new GetOS());
            setOs(liff.getOS());
            await liff.init({ liffId: hyggeOAliff }).then(async () => {

                if (!liff.isLoggedIn()) {

                    liff.login();

                } else {

                    const profile = await liff.getProfile()

                    // console.log(profile);
                    // console.log("profile?.userId", profile?.userId);
                    setProfile(profile)
                    setLineId(profile?.userId);

                    console.warn(lineId);

                    const dataSend = {
                        token_line: `${profile.userId}`

                    }

                    const checkLineId = await axios.post(`${pathUrl}/health/hygge_citizen/checkbytoken`, dataSend)
                    console.info(checkLineId.data);
                    console.log("checkLineId", checkLineId.data)

                    if (checkLineId.data.ok) {
                        if (checkLineId.data.message.length > 0) {
                            console.log("cid : ", checkLineId.data.message[0].cid);

                            const value = checkLineId.data.message[0].cid;
                            // ดึงข้อมูลจาก API
                            const res2 = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: value })
                            // console.log("res2.data : ", res2.data);
                            if (res2.data.ok) {

                                if (res2.data.message.length != 0) {
                                    updatePatient(res2.data.message[0])
                                    setloading(false);

                                    router.replace("/hospitalbook");
                                } else {
                                    throw new Error(res2.data.error);
                                }
                            } else {
                                throw new Error(res2.data.error);
                            }


                        } else {
                            router.replace("/login");
                        }


                    } else {

                        throw new Error(checkLineId.data.error);
                    }
                }

            });
            await liff.ready
        }

        try {
            initLiff()
        } catch (e: any) {
            console.error('liff init error', e.message)
        }

    }, [lineId]);

    return (

        <div>
            {loading && (
                <div className="flex justify-center items-center w-full mt-20">


                    <div className="border border-blue-300 shadow rounded-md p-10 max-w-sm w-full m-7">

                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-slate-200 h-10 w-10 justify-center"></div>
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 bg-slate-200 rounded"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded">


                                    </div>
                                </div>
                                <h1>Loading ... </h1>
                            </div>
                        </div>
                    </div>


                </div>

            )}

            {!loading && (
                <><div className='m-5 text-lg'>
                    <p>
                        {Patient.pname + Patient.fname + " " + Patient.lname}
                    </p>
                    <div className='grid grid-cols-2'>
                        <div>
                            <span>เพศ :</span>
                            <span> {(Patient.gender === "1") ? "ชาย" : (Patient.gender === "2") ? "หญิง" : null}</span>



                        </div>

                        <div>
                            <span>อายุ : </span>
                            <span>{Patient.age_y} </span>
                            <span>ปี</span>
                        </div>
                    </div>
                    <span>หมู่เลือด : </span>
                    <span>{Patient.bloodgroup}</span>

                    <div>
                        <span>สิทธิการรักษา : </span>
                        <div>{Patient.pttype_name}</div>
                    </div>
                </div>
                    {/* <div className='bg-[#49DABD] mx-4'>
                        <p className='text-center text-lg text-[#ffffff] align-middle p-2'>สมุดโรงพยาบาล</p>
                    </div> */}
                    <div className="flex justify-end ">

                        <Button
                            onClick={() => updatedata()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            update ข้อมูล</Button></div>
                    <hr />



                    <div className='grid justify-items-center m-8 grid gap-6'>

                        <Button className="bg-[#4D57D3] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace('/appointment')}
                        >ข้อมูลการนัดหมาย</Button>



                        <Button className="bg-[#76DA49] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace('/drug')}
                        >ข้อมูลการรับยา</Button>


                        <Button className="bg-[#E17104] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace('/drugallergy')}
                        >ข้อมูลการแพ้ยา</Button>

                        <Button className="bg-[#6BB1E1] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace('/laboratory')}

                        > ผลทางห้องปฏิบัติการ</Button>

                        <Button className="bg-[#B96BE1] text-[#ffffff] text-lg h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            onClick={() => router.replace('/xray')}> ผลอ่านทางรังสีวิทยา</Button>


                    </div>


                </>

            )}
        </div>


    )
}

export default Hospitalbook;

