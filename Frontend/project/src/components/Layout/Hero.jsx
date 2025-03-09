import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Import your images
import image1 from "../../assets/baby3.jpg";
import image2 from "../../assets/baby5.jpg";
import image3 from "../../assets/bb.webp";

function Hero() {
  // Array of images to cycle through
  const images = [image1, image2, image3];

  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to change the image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500); // Change image every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);

  // Determine text color based on the current image
  const textColor = currentImageIndex === 2 ? "text-black" : "text-white";

  return (
    <section className="relative h-[400px] md:h-[600px] lg:h-[750px] overflow-hidden">
      {/* AnimatePresence for smooth transitions between images */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt="Hero Image"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={`text-4xl md:text-8xl font-bold tracking-tighter uppercase mb-4 ${textColor}`}
          >
            SABHAYATA
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={`text-4xl md:text-8xl font-bold tracking-tighter uppercase mb-4 ${textColor}`}
          >
            SANSKRITI
          </motion.h1>
          <p className={`text-sm tracking-tighter md:text-lg mb-6 ${textColor}`}>
            "Adorable Styles for Little Smiles! 👶👕✨"
          </p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            // transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Link
              to="/collections/all?gender=Men"
              className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;