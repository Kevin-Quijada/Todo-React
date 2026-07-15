import React from 'react'
import {supabase} from '../supabaseClient'

const Status = ({ status }) => {


  return (
    <>
    <h3>
        <strong className='text-red-600'>status</strong> : {todoStatus}
    </h3>
    </>
  )
}

export default Status