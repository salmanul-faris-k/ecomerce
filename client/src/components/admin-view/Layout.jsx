import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import AdminslidBar from './AdminslidBar'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  const [isSilderopen,setisSilderopen]=useState(false)
  const toggleSilder=()=>{
    setisSilderopen(!isSilderopen)
  }
  return (
    <>
      <div className='min-h-screen  flex flex-col md:flex-row relative'>
        {/* mobiletogglebutton */}
<div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
  <button onClick={toggleSilder}>
    <FaBars size={24}/>
  </button>
      <h1 className='ml-4 text-xl font-medium '> Admin Dashbord</h1>

</div>
{/* overlay silder */}
{isSilderopen&&(
  <div className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden " onClick={toggleSilder}></div>
)}
{/* sildebar */}
<div className={`bg-gray-900 w-64 text-white min-h-screen absolute md:relative transform ${isSilderopen?"translate-x-0":"-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
  <AdminslidBar/>
</div>
<div className="flex-grow p-6 overflow-auto">
  <Outlet/>
</div>
      </div>
    </>
  )
}

export default AdminLayout
