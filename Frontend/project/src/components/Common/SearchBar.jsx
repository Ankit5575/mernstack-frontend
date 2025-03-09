import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { FaLessThanEqual } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productsSilce';
// import { search } from '../../../../../Backend/routes/cartRoutes';

function SearchBar() {
    const[searchTerm , setSearchTerm] = useState("")
    const [open , setOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSearch = ()=>{
        setOpen(!open)
    }
    const handle = (e)=>{
e.preventDefault();
// console.log('Search Term' , searchTerm);
dispatch(setFilters({search:searchTerm}))
dispatch(fetchProductsByFilters({search:searchTerm}))
navigate(`collections/all?search=${searchTerm}`)
setOpen(false)

    }
  return (
    
    <div className= {`flex items-center justify-center w-full transition-all duration-300 ${open ? "absolute top-0 left-0 w-full bg-white h-24 z-50":"w-auto"}`}>
      {
        open ? (
<form onSubmit={handle} className='relative flex items-center justify-center w-full '>
<div className='relative w-1/2'>
<input type='text ' placeholder='Search' value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
 className='bg-gray-100 px-4 py-2 pl-2 pr-12  rounded-lg focus:outline-none w-full placeholder:text-gray-700'/>
 <div className='overflow-hidden'>

 </div>
{/* Search icons */}
<button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
<FaMagnifyingGlass  className='h-6 w-6  '/>

</button>

</div>
{/* close icon  */}
<button
onClick={handleSearch}
type='button ' className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
<IoMdClose className='h-6 w-6 ' />

</button>
</form>
        ) : (
            <button onClick={handleSearch}>
<FaMagnifyingGlass  className='h-6 w-6 '/>

            </button>
        )
      }
    </div>
  )
}

export default SearchBar
