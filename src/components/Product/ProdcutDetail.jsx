import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import ProductGrid from "../Product/ProductGrid"; // Fixed typo in import
import ProductGrid from "./ProdocutGrid";
// import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { fetchProductDetails , fetchSimilarProducts } from "../../redux/slices/productsSilce";
import { addToCart } from "../../redux/slices/cartSlice";

function ProductDetail({ productId }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error, similarProducts, similarLoading, similarError } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;
 
  useEffect(() => {
    if (productFetchId) {  // ✅ Only call API if productFetchId is valid
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
    }
  }, [dispatch, productFetchId]); 
  
 
  useEffect(() => {
    console.log("selectedProduct:", selectedProduct); // ✅ Debugging
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);
  

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart", { duration: 1000 });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product Added to the Cart!", { duration: 1000 });
      })
      .catch(() => {
        toast.error("Failed to add product to cart. Please try again.", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };
//auto select the main image 
// const [mainImage, setMainImage] = useState("");

  // Set mainImage to the first image on mount or when selectedProduct changes
  useEffect(() => {
    if (selectedProduct?.images?.length) {
      const firstImage = typeof selectedProduct.images[0] === "string" 
        ? selectedProduct.images[0] 
        : selectedProduct.images[0].url;
      setMainImage(firstImage);
    }
  }, [selectedProduct]);

  
  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error loading product: {error}</p>;

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail Images */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
        {selectedProduct?.images?.map((image, index) => {
          const imageUrl = typeof image === "string" ? image : image.url;
          return (
            <img
              key={index}
              src={imageUrl || "/placeholder-image.jpg"}
              alt={image.altText || `Thumbnail ${index}`}
              className={`w-20 h-20 rounded-lg cursor-pointer object-cover border ${
                mainImage === imageUrl ? "border-black" : "border-gray-300"
              }`}
              onClick={() => setMainImage(imageUrl)}
            />
          );
        })}
      </div>

      {/* Main Image */}
      <div className="md:w-1/2">
        <img
          src={mainImage || "/placeholder-image.jpg"}
          alt="Main product"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>

      
            {/* Product Details */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
              <p className="text-lg text-gray-600 mb-1 line-through">${selectedProduct.originalPrice}</p>
              <p className="text-gray-500 text-xl mb-2">${selectedProduct.price}</p>
              <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

              {/* Color Selection */}
              <div className="mb-4">
                <p className="text-gray-700">Colors:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color ? "border-4 border-black" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></button>
                  ))}
                </div>
              </div>

            
              <div className="mb-4">
  <p className="text-gray-700">Size:</p>
  <div className="flex gap-2 mt-2">
    {selectedProduct?.sizes?.map((size, index) => (
      <button
        key={index}
        onClick={() => setSelectedSize(size)}
        className={`px-4 py-2 rounded-lg border ${
          selectedSize === size ? "border-2 border-black bg-gray-200" : "border-gray-300"
        }`}
      >
        {size}
      </button>
    ))}
  </div>
</div>

{/* Thumbnail Images Section (Fixed) */}
<div className="hidden md:flex  space-x-4 mr-6">
  {selectedProduct?.images?.map((image, index) => (
    <img
      key={index}
      src={image || "/placeholder-image.jpg"} // ✅ Correctly uses image URL
      alt={`Thumbnail ${index}`}
      className={`w-20 h-20 rounded-lg cursor-pointer object-cover border ${
        mainImage === image ? "border-black" : "border-gray-300"
      }`}
      onClick={() => setMainImage(image)}
    />
  ))}
</div>


              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 mt-10 ${
                  isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
            {similarLoading ? (
              <p>Loading similar products...</p>
            ) : similarError ? (
              <p>Error loading similar products: {similarError}</p>
            ) : (
              <ProductGrid products={similarProducts} loading={similarLoading} error={similarError} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;