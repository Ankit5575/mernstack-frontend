import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import feature from '../../assets/img3.jpg';
import { motion } from 'framer-motion';

function FeatureCollection() {
  // Array of text messages to cycle through
  const messages = [
    "Cozy & Cute!",
    "Soft & Snuggly!",
    "Playful & Stylish!",
    "Comfy & Adorable!",
    "Trendy & Fun!",
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
    <section className="py-16 px-6 lg:px-12">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl shadow-lg overflow-hidden">
        {/* LEFT CONTENT */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center text-center lg:text-left">
          <h3 className="text-lg font-semibold text-green-700 uppercase tracking-wider mb-4 transition-opacity duration-500 ease-in-out">
            {messages[currentMessageIndex]}
          </h3>
          <h2 className="text-4xl font-bold text-gray-800 leading-snug">
            Clothing for your little one's daily adventures!
          </h2>
          <p className="text-lg text-gray-600 mt-4 mb-8">
            Explore high-quality, comfy clothing designed just for kids! 🎀✨ Stylish, playful, and perfect for every little adventure. 👶👕💕
          </p>
          <div className="flex justify-center lg:justify-start">
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Link
                to="/collections/all?gender=Women"
                className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:w-1/2">
          <img
            src={feature}
            alt="Featured Kids Clothing"
            className="w-full h-auto object-cover lg:rounded-tr-3xl lg:rounded-br-3xl transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

export default FeatureCollection;