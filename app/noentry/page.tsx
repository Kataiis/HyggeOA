"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image'
import warning from '@/public/warning.png'





const Noentry = () => {


    return (
        <div className="mb-5"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#EDCF42",

            }}
        >
            <span style={{ fontSize: "9em", marginRight: "10px" }}>
                <Image
                    priority
                    src={warning}
                    alt="warning"
                    width={180}
                />
            </span>
            <p className="mt-5 text-black text-2xl">คุณไม่สามารถเข้าใช้งานได้</p>

            <br>
            </br>



        </div>
    );
};
export default Noentry;
