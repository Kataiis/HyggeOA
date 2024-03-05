'use client';

import Image from "next/image";
import { Button } from "@/components/ui/buttonv2";
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import DetailSugar from "./component/DetailSugar";
import { th } from "date-fns/locale";
import { format } from "date-fns";
import { useHealthStore } from "../healthbookStorage";
import { useState } from "react";


interface Props {
  title: any;
  description: any;
  type: any;
  data: HealthProps[];
  cid: any;
  lineid:any

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

export default function Component_result( { title, description, type, data, cid, lineid }: Props) {
  const { HealthStore, setHealthStore, removeHealthStore } = useHealthStore();


  const handleSetHealthStore = (index: number, add: boolean) => {
    if (data.length == 0) {
      setHealthStore({
        bmi: 0,
        cid: cid,
        create_date: new Date(),
        dbp: 0,
        dbp_night: 0,
        glucose_afternoon: 0,
        glucose_evening: 0,
        glucose_morning: 0,
        glucose_night: 0,
        height: 0,
        id: 0,
        pulse: 0,
        pulse_night: 0,
        sbp: 0,
        sbp_night: 0,
        weight: 0,
      });
    } else {
      setHealthStore({
        bmi: data[index].bmi,
        cid: data[index].cid,
        create_date: add ? new Date() : data[index].create_date,
        dbp: data[index].dbp,
        dbp_night: data[index].dbp_night,
        glucose_afternoon: data[index].glucose_afternoon,
        glucose_evening: data[index].glucose_evening,
        glucose_morning: data[index].glucose_morning,
        glucose_night: data[index].glucose_night,
        height: data[index].height,
        id: add ? null : data[index].id,
        pulse: data[index].pulse,
        pulse_night: data[index].pulse_night,
        sbp: data[index].sbp,
        sbp_night: data[index].sbp_night,
        weight: data[index].weight,
      });
    }

  };

  return (
    <div className='bg-white flex flex-col'>
      <div className=" fixed w-full mt-[170px]">
        <div className="flex flex-col items-center justify-center text-white text-xl font-bold bg-[#39CC88] h-[60px] ">
          {title}
          {description == "" ? "" : <div className="text-base font-normal">{description}</div>}
        </div>

        <div className="w-full h-12 grid grid-cols-8 gap-1 items-center justify-center px-4 bg-white">
          <div className="w-full flex items-center justify-center">
            <Link href={`../../${cid}/${lineid}/healthbook/add`} onClick={() => handleSetHealthStore(0, true)}>
              <Button className="flex items-center justify-center p-0 w-[30px] h-[30px] bg-[#49DABD] hover:bg-[#9fdfd2] shadow-lg">
                <Image src={"/hygge_healthbook/icon_add.svg"} priority alt="Image" width={20} height={20} className="flex flex-row item-center justify-self-center" />
              </Button>
            </Link>
          </div>
          <div className="w-full col-span-7 grid grid-cols-7 text-[#2C97A3] text-xl font-bold text-center">
            <div className="w-full items-center justify-center col-span-3">วันที่</div>
            {type == 'pressure' || type == 'pulse' ?
              <div className="col-span-4 grid grid-cols-2 items-center justify-center">
                <div className="w-full">เช้า</div>
                <div className="w-full">ก่อนนอน</div>
              </div>
              : <div className="w-full col-span-4 grid grid-cols-4">
                <div className="col-span-3">ผลบันทึก</div>
                <div></div>
              </div>
            }
            <div></div>
          </div>
        </div>
      </div>

      <div className="w-full mt-[280px]">
        {data.length > 0 ?
          <div>
            {data.map((item, index) => (
              <div key={index} className="w-full grid grid-cols-8 gap-1 items-center justify-center my-2 px-4">
                <div className="w-full flex justify-center  ">
                  <Link href={`../../${cid}/${lineid}/healthbook/add`} onClick={() => handleSetHealthStore(index, false)}>
                    <Button className="flex items-center justify-center p-0 w-[30px] h-[30px] bg-[#F98F86] hover:bg-[#fac0bb] shadow-lg">
                      <Image src={"/hygge_healthbook/icon_edit.svg"} priority alt="Image" width={20} height={20} className="flex flex-row item-center justify-self-center" />
                    </Button>
                  </Link>
                </div>
                <div className="w-full col-span-3 text-lg text-center p-2">
                  {format(item.create_date, "P", { locale: th })}
                </div>

                {type == 'weight' ?
                  <div className="w-full col-span-3 text-lg text-center p-2">{item.weight}</div>
                  : type == 'height' ?
                    <div className="w-full col-span-3 text-lg text-center p-2">{item.height}</div>
                    : type == 'pressure' ?
                      <div className="col-span-4 grid grid-cols-2">
                        {item.sbp == 0 && item.dbp == 0 ?
                          <div className="w-full text-lg text-center p-2">-</div>
                          : item.sbp == null && item.dbp == null ?
                            <div className="w-full text-lg text-center p-2">-</div>
                            : <div className="w-full text-lg text-center p-2">{item.sbp}/{item.dbp}</div>
                        }
                        {item.sbp_night == 0 && item.dbp_night == 0 ?
                          <div className="w-full text-lg text-center p-2">-</div>
                          : item.sbp_night == null && item.dbp_night == null ?
                            <div className="w-full text-lg text-center p-2">-</div>
                            : <div className="w-full text-lg text-center p-2">{item.sbp_night}/{item.dbp_night}</div>
                        }
                      </div> : type == 'pulse' ?
                        <div className="col-span-4 grid grid-cols-2">
                          {item.pulse == null || item.pulse == 0 ?
                            <div className="w-full text-lg text-center p-2">-</div>
                            : <div className="w-full text-lg text-center p-2">{item.pulse}</div>
                          }
                          {item.pulse_night == null || item.pulse_night == 0 ?
                            <div className="w-full text-lg text-center p-2">-</div>
                            : <div className="w-full text-lg text-center p-2">{item.pulse_night}</div>
                          }
                        </div> : type == 'bloodsugar' ?
                          <div className="w-full col-span-3 text-lg text-center p-2">
                            {item.glucose_night !== null && item.glucose_night !== 0 ? item.glucose_night
                              : item.glucose_evening !== null && item.glucose_evening !== 0 ? item.glucose_evening
                                : item.glucose_afternoon !== null && item.glucose_afternoon !== 0 ? item.glucose_afternoon
                                  : item.glucose_morning !== null && item.glucose_morning !== 0 ? item.glucose_morning
                                    : '-'}
                          </div>
                          : type == 'bmi' ?
                            <div className="w-full col-span-3 text-lg text-center p-2">{Number(item.bmi).toFixed(2)}</div>
                            : <div></div>
                }

                {type == 'bloodsugar' ?
                  <div className="w-full flex justify-center ">
                    <DetailSugar date={item.create_date} morning={item.glucose_morning} afternoon={item.glucose_afternoon} evening={item.glucose_evening} night={item.glucose_night} />
                  </div>
                  : type == 'pressure' || type == 'pulse' ?
                    ""
                    : <div></div>
                }
                <div className="col-span-8">
                  <Separator className="bg-black" />
                </div>
              </div>
            ))}
          </div>
          :
          <div className="w-full text-center my-10 text-3xl text-gray-400">ไม่พบข้อมูล</div>}

      </div>

    </div>
  );
}