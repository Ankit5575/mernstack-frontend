import { IoMdCloseCircle } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CartDrawer({ drawerOpen, toggleCart }) {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCart(false);
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-2/4 h-full bg-white shadow-lg transform transition-transform duration-100 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCart}>
          <IoMdCloseCircle className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Cart Content with Scrollable Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {cart && cart.products?.length > 0 ? (
          <CartContent cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p>Your Cart is empty.</p>
        )}
      </div>

      {/* Checkout Button Fixed at the Bottom */}
      <div className="p-4 bg-white sticky bottom-0">
        {cart && cart.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
