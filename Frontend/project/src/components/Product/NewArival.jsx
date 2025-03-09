import React, { useRef, useState, useEffect } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

function NewArrival() {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [newArrivals, setNewArrivals] = useState([]);

    // Array of messages to cycle through
    const messages = [
        "Discover the cutest and trendiest outfits for little ones, designed for comfort, fun, and everyday adventures! 🌟👶✨",
        "Explore our latest collection of kids' fashion, perfect for any occasion! 🎉👕👗",
        "Stay ahead of the fashion curve with our new arrivals, updated regularly! 🛍️👟👒",
        "From playdates to parties, we've got your little ones covered in style! 🎈👚👖"
    ];

    // State to track the current message
    const [currentMessage, setCurrentMessage] = useState(messages[0]);

    // Fetch new arrivals
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (error) {
                console.error("Error fetching new arrivals:", error.response?.data || error.message);
            }
        };
        fetchNewArrivals();
    }, []);

    // Dragging logic
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    // Scroll functionality
    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    // Update scroll buttons
    const updateScrollButtons = () => {
        const container = scrollRef.current;
        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;

            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }
    };

    // Add scroll event listener
    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons(); // Initial check
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }
    }, [newArrivals]);

    // Change message every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prevMessage) => {
                const currentIndex = messages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [messages]);

    return (
        <section className="py-16 px-4 lg:px-0">
            <div className="container mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Fresh Kids' Fashion!</h2>
                <p className="text-lg text-gray-600 mb-8">
                    {currentMessage}
                </p>
                {/* Scroll Buttons */}
                <div className="absolute right-4 top-[-50px] flex space-x-3">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-full border-2 shadow-lg transition-all ${
                            canScrollLeft
                                ? "bg-white text-black hover:bg-gray-200"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        } focus:ring-2 focus:ring-gray-400`}
                    >
                        <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-2 rounded-full border-2 shadow-lg transition-all ${
                            canScrollRight
                                ? "bg-white text-black hover:bg-gray-200"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        } focus:ring-2 focus:ring-gray-400`}
                    >
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>
            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`container mx-auto overflow-x-auto flex space-x-6 relative ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
            >
                {newArrivals.length > 0 ? (
                    newArrivals.map((product) => (
                        <div key={product._id} className="min-w-[90%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[23%] bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105">
                            <img
                                src={product.images?.[0] || "/placeholder.jpg"} // Correct property
                                alt={product.name || "Product"}
                                draggable="false"
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-4 text-center">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
                                    <p className="mt-1 text-gray-600">${product.price}</p>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center w-full text-gray-500">No new arrivals available.</p>
                )}
            </div>
        </section>
    );
}

export default NewArrival;