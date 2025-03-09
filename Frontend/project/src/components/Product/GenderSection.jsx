import React from 'react'
import mensCollection from '../../assets/boy.jpg'
import woemnCollection from '../../assets/girl.jpg'
import { Link } from 'react-router-dom'
function GenderSection() {
  return (
    <section className='py-16 px-4 lg:px-0 '>
        <div className='container mx-auto flex flex-col md:flex-row gap-8 '>
            {/* WOMEN COLLECTON  */}
            <div className='relative flex-1 '>
                <img  src={woemnCollection}  alt= "women-Collection"className='w-full h-[700px] object-cover'/>
<div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4 '>
    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
        Women's collection

    </h2>
    <Link to="/collections/all?gender=Women" className='text-gray-900 underline'>
Shop Now
    </Link>

</div>
            </div>
{/* MENS COLLECTON  */}
<div className='relative flex-1 '>
                <img  src={mensCollection} alt='men-collection' className='w-full h-[700px] object-cover'/>
<div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4 '>
    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
        Men's collection

    </h2>
    <Link to="/collections/all?gender=Men" className='text-gray-900 underline'>
Shop Now
    </Link>

</div>
            </div>
 

        </div>

    </section>
  )
}

export default GenderSection
