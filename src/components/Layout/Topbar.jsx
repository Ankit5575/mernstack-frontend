import React, { useState, useEffect } from "react";
import { TbBrandMeta } from "react-icons/tb";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Topbar() {
  // Array of text messages to cycle through
  const messages = [
    "Cutest Fashion for Little Stars! ⭐👶🎀",
    "Adorable Styles for Tiny Trendsetters! 👕✨",
    "Where Cuteness Meets Comfort! 🧸👗",
    "Dress Your Little Ones in Style! 👶👑",
    "Fashion That Makes Them Shine! 🌟👚",
  ];

  // State to track the current message index
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Effect to change the message every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="bg-black text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-3">
        {/* Social Media Icons */}
        <div className="md:flex items-center space-x-4 hidden">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaXTwitter className="h-4 w-5" />
          </a>
        </div>

        {/* Text Message */}
        <div className="text-sm text-center flex-grow">
          <span className="transition-opacity duration-500 ease-in-out">
            {messages[currentMessageIndex]}
          </span>
        </div>

        {/* Phone Number */}
        <div className="text-sm hidden md:block">
          <a href="tel:+91939399393" className="hover:text-gray-300">
            +91 8804076376
          </a>
        </div>
      </div>
    </div>
  );
}

export default Topbar;