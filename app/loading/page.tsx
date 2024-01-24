"use client"
import React, { useState, useEffect, ChangeEvent } from "react";

import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import liff from "@line/liff"
import GetOS from "@line/liff/get-os";
import { CirclesWithBar } from "react-loader-spinner";


function Loadingpage() {

    const router = useRouter();
    const pathUrl: any = process.env.pathUrl;
    const hyggeOAliff: any = process.env.HyggeOAliff;
    const [os, setOs] = useState<string>();

    const [lineId, setLineId] = useState("");
    const [profile, setProfile] = useState<any>({});
    const [loading, setLoading] = useState(true);

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
                    // console.info(checkLineId.data);
                    // console.log("res2", checkLineId.data)
                    if (checkLineId.data.ok) {
                        if (checkLineId.data.message.length > 0) {
                            const stafftype = checkLineId.data.message[0].staff_type;
                            if (stafftype === 1 || stafftype === 0) {
                                router.push("/hospitalbook");
                            } else {
                                Swal.fire({
                                    title: "ไม่มีสิทธ์เข้าใช้งาน",
                                    icon: "error",
                                    html: "สำหรับแพทย์เท่านั้น",
                                    showCloseButton: true,
                                    showConfirmButton: false,
                                }).then(() => {
                                    //ไปไหนต่อ
                                    router.push("/login");
                                });
                            }
                        } else {
                            router.push("/login");
                        }


                    } else {
                        setLoading(false);
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

        </div>

    )

}


export default Loadingpage