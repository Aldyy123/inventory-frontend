"use client";
import Layouts from "../../components/layouts";
import { getAllStocks } from "../../api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {addToCart} from "../../stores/action/addCart";
import {Messaege} from "../../helper/Message";
import {products} from "../../stores/thunk/index";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const getAllProducts = async () => {
    try {

      if(search){
        const result = await dispatch(products.getAllProducts({name: search}))
        if(result.payload?.data?.data){
            setData(result.payload.data.data)
          return
        }

        throw {message: 'Not found'}
      }

      const result = await dispatch(products.getAllProducts())
        if(result.payload?.data?.data){
            setData(result.payload.data.data)
            return
        }
        throw {message: 'Not found'}
    } catch (e) {
      Messaege("Error", e.message, "error");
    }
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getAllProducts();
    }
  };
  return (
    <Layouts>
      <div className="container">
        <div>
          <h1>Stock</h1>

          <div className="card">
            <h5>List of items</h5>

            <div className="filter-table">
              <span>
                <label htmlFor="" className="mr-3">
                  Show
                </label>
                <select name="show" id="" className="mr-3">
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
                entries
              </span>
              <span>
                <label htmlFor="" className="mr-3">
                  Search
                </label>
                <input
                  type="text"
                  className="search"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </span>
            </div>

            <table className="mt-4">
              <thead>
                <tr>
                  <th>Name of Product</th>
                  <th>Category</th>
                  <th>QTY</th>
                  <th>UOM</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.stock}</td>
                    <td>{item.uom}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.stock > 0 ? "badge-success" : "badge-error"
                        }`}
                      >
                        {item.stock > 0 ? "Available" : "out of stock"}
                      </span>
                    </td>
                    {localStorage.getItem("role") === "admin" ? (
                      <td onClick={() => toEditPage(item.id)}>
                        <span
                          className="badge badge-primary"
                          style={{ color: "white", cursor: "pointer" }}
                        >
                          Edit Stock
                        </span>
                      </td>
                    ) : (
                      <td
                        onClick={() => {
                          if(item.qty == 0){
                            return
                          }
                          distpatchCart(item.id),
                            dispatch(
                              addToCart({
                                name: item.name,
                                category: item.category,
                                qty: item.qty,
                                uom: item.uom,
                                status: item.status,
                                location: item.location,
                              })
                            );
                        }}
                      >
                        <span
                          className={`badge ${item.qty === 0 ? 'badge-disabled' : 'badge-primary'}`}
                          style={{ color: "white", cursor: "pointer" }}
                        >
                          Order Item
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2 pagination">
              <span>Showing 1 to 2 out of 2 entries</span>
              <span>
                <button type="button">Previous</button>
                <button type="button">Next</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Page;
