"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { useRouter, } from "next/navigation";
import Image from "next/image";
import Barcode from "react-barcode";
import liff from "@line/liff"

import Avatar from '@mui/material/Avatar';
import QRCode from "react-qr-code";

import logo from "@/public/hg.png"
import axios from "axios";
import { CirclesWithBar } from "react-loader-spinner";
import setting from "@/public/setting.png"
import footer from "@/public/footer.png"

const hyggeOAliff: any = process.env.HyggeOAliff;

const ProfilePage = ({ params }: { params: { cid: string, lineid: string } }) => {
    const router = useRouter();
    const pathUrl: any = process.env.pathUrl;

    const [profile, setProfile] = useState<any>({});
    const [patient, setPatient] = useState<any>([]);

    const [lineId, setLineId] = useState("");
    const [loading, setloading] = useState(true);
    const [image, setimage] = useState("");

    const imgPath = 'https://www.virtualhos.net/api4000/apihygge/getImageProfile/' + params.cid;




    const check = async () => {
        setloading(true);
        console.log("dataSend", params.cid)
        console.log("dataSend", params.lineid)

        const checkdata = await axios.post(`${pathUrl}/health/hyggelineservice/checkCitizen`, { cid: params.cid, lineid: params.lineid })
        console.log("checkdata : ", checkdata.data)
        if (checkdata.data.ok) {
            console.log("length", checkdata.data.message)
            if (checkdata.data.message > 0) {
                setloading(false)
            }
            else {
                router.replace("/noentry")
            }
        }
        else {

            throw new Error(checkdata.data.error);
        }

    };

    const clickstart = () => {
        router.replace("../" + params.cid + "/" + params.lineid + "/setting")
    };


    useEffect(() => {
        check();
        const getPatient = async () => {
            const res: any = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: params.cid }).then((v: any) => setPatient(v.data.message[0]));
        }
        getPatient();

        try {

            setimage("https://www.virtualhos.net/api4000/apihygge/getImageProfile/" + params.cid)
        } catch (e: any) {
            console.error('liff init error', e.message)
        }

    }, [])



    return (

        <div>

            <div className='bg-[#F15D4F]  flex justify-between p-3 sticky top-0'>
                <span>
                    <Image
                        priority
                        src={logo}
                        alt="logo"
                        width={55}
                        height={50} />

                </span>
                <span className="text-2xl text-[#ffffff] p-3">ฮุกกะ เมดิคอล เซอร์วิส</span>
                <span >
                    <Image
                        priority
                        src={setting}
                        alt="setting"
                        width={55}
                        height={50}
                        onClick={clickstart} />
                </span>
            </div>


            {/* <div className="h-[70px] text-center flex flex-row justify-center items-center mt-5 "> */}
            {/* <Barcode value={Patient?.cid} displayValue={false} height={60} width={2} /> */}
            {/* <QRCode
                    size={100}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={Patient?.cid}
                    viewBox={`0 0 256 256`}
                /> */}

            {/* </div> */}


            {/* <div className="mt-5 grid justify-items-center">
                <Avatar src={imgPath} sx={{ width: 140, height: 140 }} /> */}

            {/* <Image className="mx-auto  rounded-full border-2 border-white shadow-lg shadow-black-500/100"
                    priority
                    src={profile.pictureUrl}
                    // src = {image}
                    alt="profile"
                    width={140}
                    height={100} /> */}

            {/* </div> */}

            {loading && (
                <div className="flex flex-row justify-center items-center w-full mt-10">
                    <CirclesWithBar
                        height="100"
                        width="100"
                        color="#00AE91"
                        outerCircleColor="#00AE91"
                        innerCircleColor="#00AE91"
                        barColor="#00AE91"
                        ariaLabel="circles-with-bar-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />

                </div>
            )}

            {!loading && (

                <div>
                    <div className="grid grid-cols-2 justify-items-center m-5 ">
                        <div className=" p-5 ">
                            <Avatar src={imgPath} sx={{ width: 140, height: 140 }} />
                        </div>

                        <div className=" p-5">
                            <QRCode
                                size={145}
                                // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={`${params?.cid}`}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>

                    <div className='m-5 text-2xl'>
                        <p className='text-center text-[#2C97A3]'>
                            {patient?.pname} {patient?.fname} {patient?.lname}
                        </p>
                    </div>
                    <div className='bg-[#39CC88]  mt-3'>
                        <p className='text-center text-xl text-[#ffffff] align-middle p-2'>สิทธิ :  {patient?.pttype_name} </p>

                    </div>
                    <div className='grid justify-items-center m-8  gap-6'>

                        <Button className="bg-[#2C97A3] text-[#ffffff] text-2xl h-14 w-full rounded-xl shadow-md shadow-gray-500/100 "
                            type="button"
                            onClick={() => router.replace("../" + params.cid + "/" + params.lineid + "/healthbook")}
                        >สมุดสุขภาพ
                        </Button>
                        <div className="-mt-3"> สมุดบันทึกข้อมูล <span className="text-lg italic ">ด้วยตัวคุณเอง</span></div>



                        <Button className="bg-[#49DABD] text-[#ffffff] text-2xl h-14 w-full rounded-xl shadow-md shadow-gray-500/100"
                            type="button"
                            // onClick={() => updatedata()}
                            onClick={() => router.replace("../" + params.cid + "/" + params.lineid + "/patient")}

                        >สมุดโรงพยาบาล</Button>

                        <div className="-mt-3">ข้อมูลสุขภาพ <span className="text-lg italic ">จากโรงพยาบาล </span></div>


                    </div>
                    <div className="mt-16 flex justify-center">
                        <Image
                            priority
                            src={footer}
                            alt="footer"
                            width={250}
                            height={250}
                        />
                    </div>
                </div>
            )}

        </div>
    )
}

export default ProfilePage