 import React from 'react'
import { FaBoxOpen, FaClipboardList, FaSignHanging, FaStore, FaUser } from 'react-icons/fa6';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';

 function AdminSidebar() {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogOut = ()=>{
        dispatch(logout())
        dispatch(clearCart())
        navigate("/")
        

    }
    
  return (
    <div className='p-6 '>
        <div className='mb-6'>
            <Link to="/admin" className="text-2xl font-medium">
            Rabbit
            </Link>


        </div>
        <h2 className='text-xl font-medium mb-6 text-center'>Admin dashboard</h2>
        <nav>
            <NavLink to="/admin/users" className={({isActive})=>
            isActive ?
            "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 ":
            "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            

            }>
                <FaUser/>
                <span>Users</span>
            </NavLink>
            <NavLink to="/admin/product" className={({isActive})=>
            isActive ?
            "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 ":
            "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            

            }>
                <FaBoxOpen/>
                <span>Product</span>
            </NavLink>
            <NavLink to="/admin/order" className={({isActive})=>
            isActive ?
            "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 ":
            "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            

            }>
                <FaClipboardList/>
                 <span>Order</span>
            </NavLink>
            <NavLink to="/" className={({isActive})=>
            isActive ?
            "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 ":
            "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
            

            }>
                <FaStore/>
                  <span>Shop</span>
            </NavLink>
             
        </nav>
        <div className='mt-6 '>
            <button onClick={handleLogOut} className='w-full bg-red-500  hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2'>
            <FaSignOutAlt />
            <span>
                Logout
             </span>

             </button>
            
        </div>
      
    </div>
  )
}

export default AdminSidebar
