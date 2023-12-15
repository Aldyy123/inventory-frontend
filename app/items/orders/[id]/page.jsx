"use client";
import Layouts from "../../../components/layouts";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Messaege } from "../../../helper/Message";
import { products } from "../../../stores/thunk";
import { addOrder } from "../../../stores/reducer/addOrderSlice";
import { addCart } from "../../../stores/reducer/addCartSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();

  const [qty, setQty] = useState("");
  const [selectedOption, setSelectedOption] = useState("Mitra Utama");
  const [data, setData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    const locationFilter = locationData.filter(
      (item) => item.name === selectedValue
    )?.[0];

    const orderItemsList = [...orderItems];
    orderItemsList.push({
      quantity: qty,
      location: locationFilter?.name,
      locationId: locationFilter?.id,
      ...data,
    });

    setOrderItems(orderItemsList);
    setQty("");
  };

  const addTocart = async () => {
    dispatch(addCart(orderItems));
    router.push("/items/orders/cart?type=cart");
  };

  const onAddOrder = () => {
    dispatch(addOrder(orderItems));
    router.push("/items/orders/confirm-order?type=order");
  };

  const getProductById = async () => {
    try {
      const product = await dispatch(products.getProducyById(params.id));
      if (product.payload?.data?.data) {
        setData(product.payload.data.data);
        setLocationData(product.payload.data.data?.Locations);
      }
    } catch (e) {
      Messaege("Error", e.message, "error");
    }
  };

  useEffect(() => {
    getProductById();
  }, []);

  return (
    <Layouts>
      <div className="container">
        <div>
          {/* <h1>Order Item</h1> */}
          <div className="card">
            <h2 className="mt-5 text-center">Order Item</h2>

            <input
              type="number"
              placeholder="Enter Product Quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="input-stock"
            />
            <div>
              <label htmlFor="" className="mr-3" style={{ display: "block" }}>
                Location
              </label>
              <select
                name="show"
                className="mr-3"
                style={{ width: "200px", padding: "5px" }}
                onChange={handleSelectChange}
                value={selectedOption}
                disabled={qty === 0 || qty === ""}
              >
                <option selected>Select Location</option>
                {locationData?.map((item) => (
                  <option value={item.name} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <button
                type="button"
                onClick={addTocart}
                className="mt-5 input-stock-btn"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={onAddOrder}
                className="mt-5 input-stock-btn"
              >
                Order now
              </button>
            </div>

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
                {orderItems?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.uom}</td>
                    <td>{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Page;
