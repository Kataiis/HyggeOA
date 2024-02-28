import React from 'react'

const PatientPage = ({ params }: { params: { cid: string, lineid: string } }) => {
  return (
    <div>PatientPage {params.cid} {params.lineid}</div>
  )
}

export default PatientPage