import React from "react";
import { Link } from "react-router-dom";
import { FaMeta } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";



function Footer() {
  return (
    <footer className="border-t py-12 ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0 ">
        <div>
          <h3 className="text-lg text-gray-800 mb-4  ">News letter</h3>
          <p className="text-gray-500 mb-4 ">
            Be the first to hear about new product , exclusive events , and
            online offer and online offers,
          </p>
          <p className="font-medium text-sm text-gray-800  mb-6 ">
            Sign Up and get 10% off your first order.
          </p>
          {/* NEWS LETTER FORM  */}
          <form className="flex ">
            <input
              type="email"
              placeholder="Enter your Email"
              required
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md
    focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all "
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800
 transition-all 
 "
            >
              Subcribe
            </button>
          </form>
        </div>
        {/* SHOP LINK HERE  */}
        <div className="">
          <h3 className="text-lg text-gray-800 mb-4 ">Shop</h3>
          <ul className="space-y-2 text-gray-600 ">
            <li>
              <Link to="/collections/all?category=Top+Wear&gender=Men&size=&material=&brand=&maxPrice=100" className="hover:text-gray-500 transition-colors">
                Mens Top Wear
              </Link>
            </li>
            <li>
              <Link to="/collections/all?category=Top+Wear&gender=Women&size=&material=&brand=&maxPrice=100" className="hover:text-gray-500 transition-colors">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link to="/collections/all?category=Bottom+Wear&gender=Men&size=&material=&brand=&maxPrice=100" className="hover:text-gray-500 transition-colors">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="/collections/all?category=Bottom+Wear&gender=Women&size=&material=&brand=&maxPrice=100" className="hover:text-gray-500 transition-colors">
              Women's Bottom Wear
               </Link>
            </li>
          </ul>
        </div>
        {/* SUPPORT LINK  */}
        <div className="">
          <h3 className="text-lg text-gray-800 mb-4 ">Support </h3>
          <ul className="space-y-2 text-gray-600 ">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                About us 
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                 FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
              Feature
                </Link>
            </li>
          </ul>
        </div>
{/* FOLLWER SECTION  */}
<div>
    <h3 className="text-lg text-gray-800 mb-4 ">
         Follow Us 
    </h3>
    <div className="flex items-center space-x-4 mb-6 ">
        <a href="#" target="_blank" rel="noopener noreferrer"
        className="hover:text-gray-300 "
        > <FaMeta className="h-5 w-5 " />
</a>
        <a href="#" target="_blank" rel="noopener noreferrer"
        className="hover:text-gray-300 "
        >  <FaInstagram  className="h-5 w-5"/>

</a>
        <a href="#" target="_blank" rel="noopener noreferrer"
        className="hover:text-gray-300 "
        >  <FaXTwitter  className="h-4 w-4" />

</a>

    </div>
    <p className=" text-gray-500 ">Call us </p>
    <p className=" text-gray-500 "><FaPhoneAlt className="inline-block mr-2 "/>
91 + 8804076376

    </p>
</div>
      </div>
      {/* Footer Bottom  */}
      <div className="container mx-auto mt-12 lg:px-0 border-t border-grey-200 pt-6 ">
        <p className="text-gray-500 text-sm tracking-tighter text-center">@ 2025 , Compile , All Right Reserved.</p> 
      </div>
    </footer>
  );
}

export default Footer;
