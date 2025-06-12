import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

function Header() {
  return (
    <header className='border border-gray-200'>
      {/* TopBar */}
      <Topbar/>
      {/* navbar */}
      
      <Navbar/>
      {/* Cart Drawet */}
    </header>
  )
}

export default Header
