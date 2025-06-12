import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
 import Hero from "../components/Layout/Hero";
 import GenderSection from "../components/Product/GenderSection"
 import NewArrival from "../components/Product/NewArival"
 import ProductDetail from "../components/Product/ProdcutDetail";
 import ProductGrid from "../components/Product/ProdocutGrid";
import FeatureCollection from "../components/Product/FeatureCollection";
import FeatureSection from "../components/Product/FeatureSection";
 import { fetchProductsByFilters } from "../redux/slices/productsSilce";

function Home() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const [bestSellerProduct, setBestSellerProduct] = useState(null);
    const [isLoadingBestSeller, setIsLoadingBestSeller] = useState(true);

    useEffect(() => {
        // Fetch products for a specific category
        dispatch(
            fetchProductsByFilters({
                gender: "Men",
                // category: "Top Wear",
                limit: 8,
            },)
        );

        // Fetch best seller product
        const fetchBestSeller = async () => {
            setIsLoadingBestSeller(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
                );
                setBestSellerProduct(response.data);
            } catch (error) {
                console.error("Error fetching best seller product:", error);
            } finally {
                setIsLoadingBestSeller(false);
            }
        };
        fetchBestSeller();
    }, [dispatch]);

    return (
        <div>
            <Hero />
            <GenderSection />
            <NewArrival />

            {/* BEST SELLER SECTION */}
            <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
            {isLoadingBestSeller ? (
                <p className="text-center">Loading best seller product...</p>
            ) : bestSellerProduct ? (
                <ProductDetail productId={bestSellerProduct._id} />
            ) : (
                <p className="text-center">No best seller product available.</p>
            )}
            
            <div className="container mx-auto">
                <h2 className="text-3xl text-center font-bold mb-4">Top Wear for Women</h2>
            </div>
            
            <ProductGrid products={products} loading={loading} error={error} />

            <FeatureCollection />
            <FeatureSection />
        </div>
    );
}

export default Home;