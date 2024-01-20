"use client"
import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import scan from '@/public/scan.png'
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { usePatientStore } from "../store";
import liff from "@line/liff"
import GetOS from "@line/liff/get-os";
import Loadingpage from "../loading/page";
import Login from "../login/page";


function Idcard() {
    const [value, setValue] = useState<string>("");
    const router = useRouter();
    const pathUrl: any = process.env.pathUrl;
    const hyggeOAliff: any = process.env.hyggeOAliff;
    const updatePatient: any = usePatientStore((state: any) => state.updatePatient);
    const [os, setOs] = useState<string>();
    const [loading, setloading] = useState(true);
    const [lineId, setLineId] = useState("");
    const [profile, setProfile] = useState<any>({});
    const [checkuser, setCheckuser] = useState(false);

    let [user, setUser] = useState<any>([]);

    const confirm = async (value: any) => {

        // ข้อมูลที่ส่งไปให้ API
        const dataSend = { value };
        console.log("dataSend : ", dataSend);

        // ดึงข้อมูลจาก API
        const res = await axios.post(`${pathUrl}/Mon/CheckCid`, { cid: value })

        if (res.data.ok) {
            console.log(res.data)

            if (res.data.message.length != 0) {
                console.log(res.data.ok)
                updatePatient(res.data.message[0])
                router.push("/hospitalbook");

            } else {

                router.push("/checkno");
            }

        } else {
            throw new Error(res.data.error);
        }


    };


    // const scanQR: any = async () => {

    //     liff.scanCodeV2().then((result) => {
    //         result = { value: "" }
    //     })
    //         .catch((error) => {
    //             console.log("error", error);
    //         });


    // }

       const scanQR: any = async () => {

        const data: string = await liff.scanCodeV2().then((result: any) => {
            console.log(result);
            return result.value;
        });
        const res = await axios.post(`${pathUrl}/Mon/CheckCid`, { cid: data })

        if (res.data.ok) {
            console.log(res.data)

            if (res.data.message.length != 0) {
                console.log(res.data.ok)
                updatePatient(res.data.message[0])
                router.push("/hospitalbook");

            } else {

                router.push("/checkno");
            }

        } else {
            throw new Error(res.data.error);
        }


    }



    
    const CitizenAutoFormat = (citizen: string): string => {
        const number = citizen.trim().replace(/[^0-9]/g, "");
        // return number.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5");
        return number.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1$2$3$4$5");
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const targetValue = CitizenAutoFormat(e.target.value);
        setValue(targetValue);
    };


    const clickappointment = (cid:any) => {
        router.push("/appointment");
        console.log("cid", cid);
       
    };
    const clicktreatment = () => {
        router.push("/drug");
    };
    const clicktdrugallergy = () => {
        router.push("/drugallergy");
    };
    const clickradiology = () => {
        router.push("/xray");
    };
    const clicklaboratory = () => {
        router.push("/laboratory");
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

                    const checkLineId = await axios.post(`${pathUrl}/health/hie_staff/checkbytoken`, dataSend)
                    console.info(checkLineId.data);
                    console.log("res2", checkLineId.data)
                    if (checkLineId.data.ok) {
                        if (checkLineId.data.message.length > 0) {
                            const stafftype = checkLineId.data.message[0].staff_type;
                            if (stafftype === 1 || stafftype === 0) {
                                setloading(false);
                                router.push("/idcard");

                            } else {
                                Swal.fire({
                                    title: "ไม่มีสิทธ์เข้าใช้งาน",
                                    icon: "error",
                                    html: "สำหรับแพทย์เท่านั้น",
                                    showCloseButton: true,
                                    showConfirmButton: false,
                                }).then(() => {
                                    //ไปไหนต่อ
                                    // router.push("/login");
                                    <Login />
                                });
                            }
                        } else {
                            router.push("/login");
                            <Login />
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
                    {/* <div>
                        <CirclesWithBar
                            height="100"
                            width="100"
                            color="#3D8070"
                            outerCircleColor="#3D8070"
                            innerCircleColor="#3D8070"
                            barColor="#3D8070"
                            ariaLabel="circles-with-bar-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true} />
                    </div> */}

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
                <><div className='bg-[#D9D9D9] h-50 '>
                    <p className='text-center text-lg p-3'>กรอกเลขบัตรประชาชน</p>
                    <div className='bg-[#EFF1F1] max-w-full h-22 p-1'>
                        <div className="flex items-center space-x-2 m-5">


                            <input className="border-2 border-gray-300/100 rounded-lg p-2  w-full "
                                inputMode="numeric"
                                placeholder="กรุณากรอกเลขบัตรประชาชน"
                                id="citizen"
                                // type="Citizen"
                                value={value}
                                onChange={onChange}
                                maxLength={13} />



                            {/* <Input

                                id="citizen"
                                type="Citizen"
                                value={value}
                                onChange={onChange}
                                maxLength={13}
                                placeholder="กรุณากรอกเลขบัตรประชาชน" /> */}


                            <Button className="bg-[#666666] text-[#ffffff]  sm:ml-3 md:ml-5 shadow-md shadow-gray-500/100 "
                                onClick={(e) => confirm(value)}
                                type="submit">OK</Button>
                        </div>
                    </div>
                    <p className='text-center text-lg p-3'>สแกนคิวอาร์โค้ด</p>
                </div><div className='flex justify-center mt-12'>
                        <Image
                            priority
                            src={scan}
                            alt="scan"
                            width={140} />
                    </div><div className='flex justify-center mt-8'>
                        <Button className="bg-[#52874D] text-[#ffffff] text-2xl  h-[58px] w-[178px] rounded-lg shadow-lg shadow-gray-500/100"
                            type="submit"
                            onClick={scanQR}
                        >SCAN
                        </Button>


                    </div></>

            )}

        </div>
       

    )
}

export default Idcard