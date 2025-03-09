import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAdminProducts,
  updateProduct,
} from "../../redux/slices/adminProductSlice";
import axios from "axios";

function EditProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collection: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminProducts(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        sizes: selectedProduct.sizes || [],
        colors: selectedProduct.colors || [],
        images: selectedProduct.images || [],
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

   
    
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
  
    if (!file) {
      alert("Please select an image file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file); // ✅ Matches backend field name
  
    console.log("Uploading Image:", formData.get("file")); // 🔥 Debugging
  
    try {
      setUploading(true);
  
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`, // ✅ Make sure this URL is correct
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      console.log("Full Response:", response); // 🔥 Debugging
      console.log("Response Data:", response.data); // 🔥 Log actual response
  
      if (response.data?.imageUrl) {
        setProductData((prevData) => ({
          ...prevData,
          images: [...prevData.images,  response.data.imageUrl ], //bus iseme change karna tha {} ye hatna tha 
        }));
      } else {
        console.error("Unexpected Response Format:", response.data);
        throw new Error("Image upload failed. No URL returned from server.");
      }
    } catch (error) {
      console.error("Image Upload Error:", error.response?.data || error.message);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setUploading(false);
    }
  };
   
// 
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/product");
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        
        {/* FOR COLORS  */}
        <div className="mb-6">
  <label className="block font-semibold mb-2">Colors (comma-separated)</label>
  <input
    type="text"
    name="colors"
    value={productData.colors.join(", ")}
    onChange={(e) =>
      setProductData({
        ...productData,
        colors: e.target.value.split(",").map((color) => color.trim()),
      })
    }
    className="w-full border border-gray-300 rounded-md p-2"
    required
  />
</div>


        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 w-fit"
          />
{
  uploading && <p>Uploading image....</p>
}
          <div className="flex gap-4 mt-4">
            {productData.images?.map((image, index) => (
              <div key={index}>
                 <img
      src={image}  // ✅ Directly use the image URL
      alt="Product Image"
      className="w-20 h-20 object-cover rounded-md shadow-md"
      onError={(e) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = "path/to/default/image.png"; // Provide a default image
      }}
    />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProduct;