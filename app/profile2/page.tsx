import React from 'react'
import Image from 'next/image'
import logout from "@/public/logout.gif"

export default function page() {
  return (
    <div>
      <div className='mt-40 ml-8 flex justify-center'>
        <Image
          priority
          src={logout}
          alt="logout"
          height={150}
          width={150}

        />
      </div>
      <div className='flex justify-center'>
        <p className='text-2xl font-semibold'>ท่านออกจากระบบแล้ว </p>
      </div>

    </div>

  )
}
