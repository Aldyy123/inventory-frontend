"use client";
import Layouts from "../../../components/layouts";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Page = () => {
  const router = useRouter();
  const cartRedux = useSelector((state) => state.addCart);
  console.log(cartRedux, "test");
  const updateStockItems = async () => {
    router.push("/items/orders/confirm-order?type=cart");
  };
  return (
    <Layouts>
      <div className="container">
        <div>
          {/* <h1>Order Item</h1> */}
          <div className="card">
            <h2 className="mt-5 text-center">Cart</h2>
            <h5 className="mt-5 text-left">List of item ordered</h5>
            <table className="mt-4">
              <thead>
                <tr>
                  <th>Name of Product</th>
                  <th>Category</th>
                  <th>QTY</th>
                  <th>UOM</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {cartRedux?.carts.map((cart) => {
                  console.log("item", cart);
                  return (
                    <tr key={cart.id}>
                      <td>{cart.name}</td>
                      <td>{cart.category}</td>
                      <td>{cart.quantity}</td>
                      <td>{cart.uom}</td>
                      <td>{cart.location}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ width: "400", margin: "auto" }}>
              <button
                type="button"
                onClick={updateStockItems}
                className="mt-5 input-stock-btn"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Page;
