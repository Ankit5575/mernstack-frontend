import React, { useRef, useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";
import FilterSideBar from '../components/Product/FilterSideBar';
import SortOptions from '../components/Product/SortOptions';
// import ProductGrid from '../components/Product/ProductGrid';
import ProductGrid from '../components/Product/ProdocutGrid';
import { useParams, useSearchParams } from 'react-router-dom';
// import { useDispatch, useSelector } from "react-redux";
import { useDispatch , useSelector } from 'react-redux';
// import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import { fetchProductsByFilters } from '../redux/slices/productsSilce';

function CollectionPage() {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const { products, loading, error } = useSelector((state) => state.products);

    const queryParams = Object.fromEntries([...searchParams]);

    useEffect(() => {
        dispatch(fetchProductsByFilters({ collection, ...queryParams }));
    }, [dispatch, collection, searchParams]);

    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='flex flex-col lg:flex-row'>
            {/* Mobile filter button */}
            <button
                onClick={toggleSidebar}
                className='lg:hidden border p-2 flex justify-center items-center'
            >
                <FaFilter />
                Filter
            </button>

            {/* FILTER SIDEBAR */}
            <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`
            }>
                <FilterSideBar />
            </div>

            <div className='flex-grow p-4'>
                <h2 className='text-2xl uppercase mb-4'>All Collection</h2>

                {/* SORT OPTION */}
                <SortOptions />

                {/* PRODUCT GRID */}
                <ProductGrid products={products} loading={loading} error={error} />
            </div>
        </div>
    );
}

export default CollectionPage;
