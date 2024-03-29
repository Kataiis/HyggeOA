'use client';

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import LineChart from './component/LineChart'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { th } from "date-fns/locale";
import { format, parse } from "date-fns"


interface Props {
    data: HealthProps[];
    fname: any;
}

interface HealthProps {
    bmi: any;
    cid: any;
    create_date: any;
    dbp: any;
    dbp_night: any;
    glucose_afternoon: any;
    glucose_evening: any;
    glucose_morning: any;
    glucose_night: any;
    height: any;
    id: any;
    pulse: any;
    pulse_night: any;
    sbp: any;
    sbp_night: any;
    weight: any;
}

interface ChartProps {
    data: {
        labels: string[];
        values: number[];
    };
}

interface ChartDataProps {
    label: string;
    date: any;
    data: {
        pulse: number;
        sbp: number;
        dbp: number;
    }

}

interface GlucoseDataProps {
    label: string;
    date: any;
    data: {
        glucose_morning: number;
        glucose_afternoon: number;
        glucose_evening: number;
        glucose_night: number;

    }

}

export default function Component_summary({ data, fname }: Props) {

    const [ChartData, setChartData] = useState<ChartDataProps[]>([]);
    const [GlucoseData, setGlucoseData] = useState<GlucoseDataProps[]>([]);
    const [avgGlucose, setAvgGlucose] = useState<number>();
    const [maxGlucose, setMaxGlucose] = useState<number>();
    const [minGlucose, setMinGlucose] = useState<number>();


    useEffect(() => {
        if (data.length !== 0) {
            const newChartData = [];
            let LabelChart = 1;
            const newGlucoseData = [];
            let LabelGlucose = 1;
            const newAvgGlucose = [];

            for (let i = 0; i < data.length; i++) {

                if (newChartData.length < 5) {
                    if ((data[i].pulse_night !== 0 && data[i].sbp_night !== 0 && data[i].dbp_night !== 0)) {
                        newChartData.push({
                            label: `${LabelChart}`,
                            date: data[i].create_date,
                            data: {
                                pulse: data[i].pulse_night,
                                sbp: data[i].sbp_night,
                                dbp: data[i].dbp_night,
                            }
                        });
                        LabelChart++;
                    }
                }

                if (newChartData.length < 5) {
                    if ((data[i].pulse !== 0 && data[i].sbp !== 0 && data[i].dbp !== 0)) {
                        newChartData.push({
                            label: `${LabelChart}`,
                            date: data[i].create_date,
                            data: {
                                pulse: data[i].pulse,
                                sbp: data[i].sbp,
                                dbp: data[i].dbp,
                            }
                        });
                        LabelChart++;
                    }
                }

                if (newGlucoseData.length < 7) {
                    newGlucoseData.push({
                        label: `${LabelGlucose}`,
                        date: data[i].create_date,
                        data: {
                            glucose_morning: data[i].glucose_morning,
                            glucose_afternoon: data[i].glucose_afternoon,
                            glucose_evening: data[i].glucose_evening,
                            glucose_night: data[i].glucose_night,
                        }
                    });

                    if (data[i].glucose_morning !== 0) {
                        newAvgGlucose.push(data[i].glucose_morning);
                    }
                    if (data[i].glucose_afternoon !== 0) {
                        newAvgGlucose.push(data[i].glucose_afternoon);
                    }
                    if (data[i].glucose_evening !== 0) {
                        newAvgGlucose.push(data[i].glucose_evening);
                    }
                    if (data[i].glucose_night !== 0) {
                        newAvgGlucose.push(data[i].glucose_night);
                    }
                    LabelGlucose++;
                }
            }

            for (let i = 0; i < newChartData.length; i++) {
                newChartData[i].label = `${(newChartData.length + 1) - Number(newChartData[i].label)}`
            }

            for (let i = 0; i < newGlucoseData.length; i++) {
                newGlucoseData[i].label = `${(newGlucoseData.length + 1) - Number(newGlucoseData[i].label)}`
            }


            let sum = 0;
            let max = (-1);
            let min = 999999999;
            for (let i = 0; i < newAvgGlucose.length; i++) {
                sum = sum + newAvgGlucose[i];
                if (max <= newAvgGlucose[i]) {
                    max = newAvgGlucose[i];
                }
                if (min >= newAvgGlucose[i]) {
                    min = newAvgGlucose[i];
                }
            }
            setAvgGlucose(newAvgGlucose.length > 0 ? sum / newAvgGlucose.length : 0);
            setMaxGlucose(max);
            setMinGlucose(min);

            setGlucoseData(newGlucoseData);
            setChartData(newChartData);
            console.log("setChartData", ChartData);

        } else {
            setChartData([]);
        }
    }, [data]);


    const sortedChartASC = useMemo(() => {
        let result = ChartData;
        result = [...ChartData].sort((a, b) => {
            return a.label.localeCompare(b.label);
        });
        console.log("sortedChartASC", result);

        return result;
    }, [ChartData]);

    const sortedGlucoseASC = useMemo(() => {
        let result = GlucoseData;
        result = [...GlucoseData].sort((a, b) => {
            return a.label.localeCompare(b.label);
        });
        console.log("sortedGlucoseASC", result);

        return result;
    }, [GlucoseData]);


    const chartPressure = {
        labels: [sortedChartASC[0] !== undefined ? Number(sortedChartASC[0]?.label) != sortedChartASC.length ? sortedChartASC[0]?.label : "ล่าสุด" : undefined,
        sortedChartASC[1] !== undefined ? Number(sortedChartASC[1]?.label) != sortedChartASC.length ? sortedChartASC[1]?.label : "ล่าสุด" : undefined,
        sortedChartASC[2] !== undefined ? Number(sortedChartASC[2]?.label) != sortedChartASC.length ? sortedChartASC[2]?.label : "ล่าสุด" : undefined,
        sortedChartASC[3] !== undefined ? Number(sortedChartASC[3]?.label) != sortedChartASC.length ? sortedChartASC[3]?.label : "ล่าสุด" : undefined,
        sortedChartASC[4] !== undefined ? Number(sortedChartASC[4]?.label) != sortedChartASC.length ? sortedChartASC[4]?.label : "ล่าสุด" : undefined],
        data: [{
            label: 'บน',
            data: [sortedChartASC[0] !== undefined ? sortedChartASC[0]?.data.sbp : undefined,
            sortedChartASC[1] !== undefined ? sortedChartASC[1]?.data.sbp : undefined,
            sortedChartASC[2] !== undefined ? sortedChartASC[2]?.data.sbp : undefined,
            sortedChartASC[3] !== undefined ? sortedChartASC[3]?.data.sbp : undefined,
            sortedChartASC[4] !== undefined ? sortedChartASC[4]?.data.sbp : undefined],
            fill: false,
            borderColor: 'rgb(0, 163, 255)',
            tension: 0.1
        },
        {
            label: 'ล่าง',
            data: [sortedChartASC[0] !== undefined ? sortedChartASC[0]?.data.dbp : undefined,
            sortedChartASC[1] !== undefined ? sortedChartASC[1]?.data.dbp : undefined,
            sortedChartASC[2] !== undefined ? sortedChartASC[2]?.data.dbp : undefined,
            sortedChartASC[3] !== undefined ? sortedChartASC[3]?.data.dbp : undefined,
            sortedChartASC[4] !== undefined ? sortedChartASC[4]?.data.dbp : undefined],
            fill: false,
            borderColor: 'rgb(156, 42, 210)',
            tension: 0.1
        }]
    };

    const chartHeartrate = {
        labels: [sortedChartASC[0] !== undefined ? Number(sortedChartASC[0]?.label) != sortedChartASC.length ? sortedChartASC[0]?.label : "ล่าสุด" : undefined,
        sortedChartASC[1] !== undefined ? Number(sortedChartASC[1]?.label) != sortedChartASC.length ? sortedChartASC[1]?.label : "ล่าสุด" : undefined,
        sortedChartASC[2] !== undefined ? Number(sortedChartASC[2]?.label) != sortedChartASC.length ? sortedChartASC[2]?.label : "ล่าสุด" : undefined,
        sortedChartASC[3] !== undefined ? Number(sortedChartASC[3]?.label) != sortedChartASC.length ? sortedChartASC[3]?.label : "ล่าสุด" : undefined,
        sortedChartASC[4] !== undefined ? Number(sortedChartASC[4]?.label) != sortedChartASC.length ? sortedChartASC[4]?.label : "ล่าสุด" : undefined],
        data: [{
            label: 'อัตราการเต้น',
            data: [sortedChartASC[0] !== undefined ? sortedChartASC[0]?.data.pulse : undefined,
            sortedChartASC[1] !== undefined ? sortedChartASC[1]?.data.pulse : undefined,
            sortedChartASC[2] !== undefined ? sortedChartASC[2]?.data.pulse : undefined,
            sortedChartASC[3] !== undefined ? sortedChartASC[3]?.data.pulse : undefined,
            sortedChartASC[4] !== undefined ? sortedChartASC[4]?.data.pulse : undefined],
            fill: false,
            borderColor: 'rgb(202, 17, 1)',
            tension: 0.1
        }]
    };



    return (
        <div className='bg-white flex flex-col px-4 mt-[200px]'>


            <div className="grid grid-cols-5 gap-2 items-center justify-center mb-2 py-2">
                <div className="col-span-2 flex items-center justify-center">
                    {data[0]?.bmi >= 18.5 && data[0]?.bmi <= 22.9 ?
                        <div className="flex items-center justify-center w-[100px] h-[90px]">
                            <Image src={"/hygge_healthbook/BMI_good.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="w-auto h-full" />
                        </div>
                        : (data[0]?.bmi < 18.5 || (data[0]?.bmi >= 23.0 && data[0]?.bmi <= 24.9) ?
                            <div className="flex items-center justify-center w-[100px] h-[90px]">
                                <Image src={"/hygge_healthbook/BMI_normal.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="w-auto h-full" />
                            </div>
                            : (data[0]?.bmi > 25.0 ?
                                <div className="flex items-center justify-center w-[100px] h-[90px]">
                                    <Image src={"/hygge_healthbook/BMI_bad.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="w-auto h-full" />
                                </div>
                                : <div className="text-center text-xl text-gray-400">ไม่พบข้อมูล</div>
                            )
                        )
                    }
                </div>
                {/* {data[0]?.bmi} */}

                <div className="col-span-3">
                    <Card>
                        <CardContent className="grid grid-cols-2 items-center justify-center gap-2 p-4">
                            <div className="">น้ำหนัก</div>
                            <div className="grid grid-cols-2 items-center justify-center">
                                <div className="text-xl font-bold">
                                    {data.length == 0 ?
                                        <div className=" text-gray-400">-</div>
                                        : data[0]?.weight
                                    }
                                </div>
                                <div>กก.</div>
                            </div>

                            <div className="">ส่วนสูง</div>
                            <div className="grid grid-cols-2 items-center justify-center">
                                <div className="text-xl font-bold">
                                    {data.length == 0 ?
                                        <div className=" text-gray-400">-</div>
                                        : data[0]?.height
                                    }
                                </div>
                                <div>ซม.</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mb-3">
                <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-5 flex justify-self-end text-lg text-[#2C97A3] font-bold ">ความดันโลหิต</div>
                    <div className="col-span-2 flex justify-self-center">5 ครั้งล่าสุด</div>
                </div>
                <Card>
                    <CardContent className="grid grid-cols-7 gap-2 p-0">
                        <div className="col-span-5 flex items-center justify-center px-1 py-3 pb-2 ">
                            {sortedChartASC.length == 0 ?
                                <>
                                    <div className="w-full absolute text-center my-10 text-3xl text-gray-400">ไม่พบข้อมูล</div>
                                    <LineChart chartdata={chartPressure} />
                                </>
                                : <LineChart chartdata={chartPressure} />
                            }
                        </div>
                        <div className="col-span-2 bg-[#E1E1E1] rounded-r-lg flex flex-col items-center justify-center px-2 py-3">
                            <div className="text-lg">ครั้งล่าสุด</div>
                            <div className="text-xs my-1">
                                {sortedChartASC[sortedChartASC.length - 1]?.date ? <div>{format(sortedChartASC[sortedChartASC.length - 1]?.date, "P", { locale: th })}</div> : ""}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="flex items-center justify-center w-2 h-[40%] bg-[#00A3FF]"></div>
                                <div className="flex items-center justify-center">บน</div>
                                <div className="flex items-center justify-center text-xl font-bold">
                                    {sortedChartASC.length == 0 ?
                                        <div className=" text-gray-400">-</div>
                                        : sortedChartASC[sortedChartASC.length - 1]?.data.sbp
                                    }
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="flex items-center justify-center w-2 h-[40%] bg-[#9C2AD2]"></div>
                                <div className="flex items-center justify-center">ล่าง</div>
                                <div className="flex items-center justify-center text-xl font-bold">
                                    {sortedChartASC.length == 0 ?
                                        <div className=" text-gray-400">-</div>
                                        : sortedChartASC[sortedChartASC.length - 1]?.data.dbp
                                    }
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-3">
                <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-5 flex justify-self-end text-lg text-[#2C97A3] font-bold ">อัตราการเต้นของหัวใจ</div>
                    <div className="col-span-2 flex justify-self-center">5 ครั้งล่าสุด</div>
                </div>
                <Card>
                    <CardContent className="grid grid-cols-7 gap-2 p-0">
                        <div className="col-span-5 flex items-center justify-center px-1 py-3 pb-2 ">
                            {sortedChartASC.length == 0 ?
                                <>
                                    <div className="w-full absolute text-center my-10 text-3xl text-gray-400">ไม่พบข้อมูล</div>
                                    <LineChart chartdata={chartHeartrate} />
                                </>
                                : <LineChart chartdata={chartHeartrate} />
                            }                        </div>
                        <div className="col-span-2 bg-[#E1E1E1] rounded-r-lg flex flex-col items-center justify-center px-2 py-3">
                            <div className="text-lg">ครั้งล่าสุด</div>
                            <div className="text-xs my-1">
                                {sortedChartASC[sortedChartASC.length - 1]?.date ? <div>{format(sortedChartASC[sortedChartASC.length - 1]?.date, "P", { locale: th })}</div> : ""}
                            </div>
                            {sortedChartASC.length == 0 ?
                                <div className=" text-gray-400">-</div>
                                :
                                <div className="flex items-center justify-center gap-2">
                                    <div className="flex items-center justify-center w-2 h-[40%] bg-[#CA1101]"></div>
                                    <div className="flex items-center justify-center text-xl font-bold">{sortedChartASC[sortedChartASC.length - 1]?.data.pulse}</div>
                                </div>
                            }

                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-4">
                <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-5 flex justify-self-end text-lg text-[#2C97A3] font-bold ">ค่าน้ำตาลในเลือด</div>
                    <div className="col-span-2 flex justify-self-center">7 ครั้งล่าสุด</div>
                </div>
                <Card>
                    <CardContent className="grid grid-cols-7 gap-2 p-0">
                        <div className="col-span-7 grid grid-cols-3 items-center justify-center bg-[#E1E1E1] px-1 py-3 pb-2 ">
                            <div className="flex items-end justify-center gap-2 text-sm">
                                <div className="">ค่าต่ำสุด</div>
                                <div className="text-base text-[#1628C8] font-bold">{minGlucose == 999999999 || minGlucose == undefined ? "-" : minGlucose}</div>
                            </div>
                            <div className="flex items-end justify-center gap-2 text-sm">
                                <div>ค่าสูงสุด</div>
                                <div className="text-base text-[#1628C8] font-bold">{maxGlucose == (-1) || maxGlucose == undefined ? "-" : maxGlucose}</div>
                            </div>
                            <div className="flex items-end justify-center gap-2 text-sm">
                                <div className="">ค่าเฉลี่ย</div>
                                <div className="text-base text-[#AF16C8] font-bold">{avgGlucose == undefined ? "-" : Number(avgGlucose).toFixed(2)}</div>
                            </div>
                        </div>
                        <div className="col-span-7 flex flex-col justify-center text-xs px-1 pb-2">
                            <table className="w-full">
                                <tbody >

                                    <tr className="">
                                        {sortedGlucoseASC.length > 0 ?
                                            <>
                                                {sortedGlucoseASC?.map((item, index) => (
                                                    <td key={index} className="text-center px-1 pt-3 border-b">
                                                        {item.data.glucose_morning == 0 ? "-" : item.data.glucose_morning}
                                                    </td>
                                                ))}
                                                {data.length < 7 ? (
                                                    Array.from({ length: 7 - data.length }, (_, i) => (
                                                        <td key={i} className="text-center px-1 pt-3 border-b min-w-[30px]"></td>
                                                    ))
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                            :
                                            <td colSpan={7} rowSpan={4}>
                                                <div className="text-center text-4xl text-gray-400">ไม่พบข้อมูล</div>
                                            </td>
                                        }
                                        <td className="col-span-3 pl-2 py-2 flex items-center ">
                                            <div className="flex items-center justify-left gap-2">
                                                <div className="w-[25px] h-[25px">
                                                    <Image src={"/hygge_healthbook/icon_morning.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="w-auto h-full" />
                                                </div>
                                                {`เช้า`}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="">
                                        {sortedGlucoseASC.length > 0 ?
                                            <>
                                                {sortedGlucoseASC?.map((item, index) => (
                                                    <td key={index} className="text-center px-1 pt-3 border-b ">
                                                        {item.data.glucose_afternoon == 0 ? "-" : item.data.glucose_afternoon}
                                                    </td>
                                                ))}
                                                {data.length < 7 ? (
                                                    Array.from({ length: 7 - data.length }, (_, i) => (
                                                        <td key={i} className="text-center px-1 pt-3 border-b min-w-[30px]"></td>
                                                    ))
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                            :
                                            ""
                                        }
                                        <td className="col-span-3 pl-2 py-2 flex items-center ">
                                            <div className="flex items-center justify-left gap-2">
                                                <div className="w-[25px] h-[25px">
                                                    <Image src={"/hygge_healthbook/icon_day.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="w-auto h-full" />
                                                </div>
                                                {`กลางวัน`}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="">
                                        {sortedGlucoseASC.length > 0 ?
                                            <>
                                                {sortedGlucoseASC?.map((item, index) => (
                                                    <td key={index} className="text-center px-1 pt-3 border-b min-w-[30px]">
                                                        {item.data.glucose_evening == 0 ? "-" : item.data.glucose_evening}
                                                    </td>
                                                ))}
                                                {data.length < 7 ? (
                                                    Array.from({ length: 7 - data.length }, (_, i) => (
                                                        <td key={i} className="text-center px-1 pt-3 border-b min-w-[30px]"></td>
                                                    ))
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                            :
                                            ""
                                        }
                                        <td className="col-span-3 pl-2 py-2 flex items-center ">
                                            <div className="flex items-center justify-left gap-2">
                                                <div className="w-[25px] h-[25px">
                                                    <Image src={"/hygge_healthbook/icon_evening.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="w-auto h-full" />
                                                </div>
                                                {`เย็น`}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="">
                                        {sortedGlucoseASC.length > 0 ?
                                            <>
                                                {sortedGlucoseASC?.map((item, index) => (
                                                    <td key={index} className="text-center px-1 pt-3 border-b">
                                                        {item.data.glucose_night == 0 ? "-" : item.data.glucose_night}
                                                    </td>
                                                ))}
                                                {data.length < 7 ? (
                                                    Array.from({ length: 7 - data.length }, (_, i) => (
                                                        <td key={i} className="text-center px-1 pt-3 border-b min-w-[30px]"></td>
                                                    ))
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                            :
                                            ""
                                        }
                                        <td className="col-span-3 pl-2 py-2 flex items-center ">
                                            <div className="flex items-center justify-left gap-2">
                                                <div className="w-[28px] h-[28px]">
                                                    <Image src={"/hygge_healthbook/icon_night.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="w-auto h-full" />
                                                </div>
                                                {`ก่อนนอน`}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        {[...Array(7)].map((_, index) => (
                                            <td key={index} className="text-center flex-initial items-end justify-center min-h-12">
                                                {index + 1 < sortedGlucoseASC.length ?
                                                    <div className="flex flex-col items-center justify-center ">
                                                        <div className="w-2 h-2 my-1 mt-3 bg-[#4F4F4F] rounded-full"></div>
                                                        {/* <div>{index + 1}</div> */}
                                                        <div>{sortedGlucoseASC[index].label}</div>

                                                    </div>
                                                    : (
                                                        index + 1 == sortedGlucoseASC.length ?
                                                            <div className="flex flex-col items-center justify-center ">
                                                                <div className="w-2 h-2 my-1 mt-3 bg-[#4F4F4F] rounded-full"></div>
                                                                <div>ล่าสุด</div>

                                                            </div>
                                                            : (
                                                                index + 1 > sortedGlucoseASC.length ?
                                                                    ""
                                                                    : ""
                                                            )
                                                    )
                                                }
                                            </td>
                                        ))}
                                        <td className="text-center flex items-end justify-start min-h-12"  >
                                            <div className="text-xs mb-[2px]">
                                                {sortedGlucoseASC[sortedGlucoseASC.length - 1]?.date ? <div>{`(${format(sortedGlucoseASC[sortedGlucoseASC.length - 1]?.date, "P", { locale: th })})`}</div> : ""}
                                            </div>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </CardContent>
                </Card>
            </div>


        </div>



    );
}