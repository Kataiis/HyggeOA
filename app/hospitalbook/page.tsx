"use client"
import axios from "axios";
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
import { usePatientStore } from "../store";
import Swal from "sweetalert2";
import liff from "@line/liff"
import GetOS from "@line/liff/get-os";
import dayjs from "dayjs";

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
        Swal.fire({
            html:
              '<div class="my-3 flex justify-center">' +
              '<div class="justify-items-center">' +
              '<svg class="animate-spin w-32 h-32 text-[#0C66BB]" fill="currentColor" ' +
              'stroke="currentColor" stroke-width="0" viewBox="0 0 16 16">' +
              '<path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 4c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 ' +
              '1.791-4 4-4zM12.773 12.773c-1.275 1.275-2.97 1.977-4.773 1.977s-3.498-0.702-4.773-1.977-1.977-2.97-1.977-4.773c0-1.803 0.702-3.498 1.977-4.773l1.061 1.061c0 0 0 0 0 0-2.047 2.047-2.047 5.378 0 7.425 0.992 0.992 2.31 1.538 3.712 1.538s2.721-0.546 3.712-1.538c2.047-2.047 2.047-5.378 0-7.425l1.061-1.061c1.275 1.275 1.977 2.97 1.977 4.773s-0.702 3.498-1.977 4.773z"></path>' +
              "</svg>" +
              "</div>" +
              "</div>" +
              '<p style="font-size: 35px; margin-top: 40px">กำลังโหลดข้อมูล</p>',
            allowOutsideClick: false,
            showConfirmButton: false,
          });

        const mytimestamp: any = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const dataIns = {
            req_cid: Patient.cid,
            favhos1: Patient.favhos1,
            line_id: `${profile.userId}`,
        };
        console.log("dataIns", dataIns)
        const resIns: any = await axios.post(
            pathUrl + "/health/hiereq/store_hyggeoa",
            dataIns
        );
        console.log("resIns", resIns.data)
        if (resIns.data.ok) {
            console.log("insert hie_request success");
            const res: any = await axios.post(pathUrl + "/health/hiereq/checkin", {
                cid: Patient.cid,
            });
            if (res.data.ok) {
                if (res.data.message <= 1) {
                    const text = "REQUEST|"+Patient.favhos1+"|"+Patient.cid+"|"+mytimestamp
                    console.log("text",text)
                    // //ไม่เคยมีการ request วันนี้

                    const sentmqtt = await axios.post(`https://hyggemedicalservice.com/apirbh/connectmqtt/hyggeoa`,{messagemqtt:text})

                    const timer = setTimeout(() => {
                        // ทำ sweetaler แจ้งเตือน ว่าทำสำเร็จแล้ว
                        Swal.fire({
                            title: "อัพเดทข้อมูลสำเร็จ",
                            icon: "success",
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            timer: 1500
                          });
                    }, 12000);
                    return () => clearTimeout(timer);
                } else {
                    console.log("have  log in hie_request");
                    Swal.fire({
                        title: "ข้อมูลเป็นปัจจุบันแล้ว",
                        icon: "success",
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        timer: 2000
                      });
                 
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
                            console.log("res2.data : ", res2.data);
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
                            click เพื่อ update ข้อมูล</Button></div>
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

