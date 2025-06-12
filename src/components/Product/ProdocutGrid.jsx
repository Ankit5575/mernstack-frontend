import React from "react";
import { Link } from "react-router-dom";
import {motion} from 'framer-motion'

function ProductGrid({ products, loading, error }) {
  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }
  if (error) {
    return <p className="text-center text-lg text-red-500">ProductGrid Error: {error}</p>;
  }

  // Ensure products exist before mapping
  if (!Array.isArray(products) || products.length === 0) {
    return <p className="text-center text-lg">No products available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="block"
          aria-label={`View details for ${product.name}`}
        >
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-full aspect-[4/5] mb-4">
              <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
                src={product?.images?.length > 0 ? product.images[0] : "/placeholder.jpg"} // ✅ Fixed image access
                alt={product?.name || "Product Image"}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductGrid;
