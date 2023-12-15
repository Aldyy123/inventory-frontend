"use client";
import Layouts from "../../components/layouts";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Messaege } from "../../helper/Message";
import { orders } from "../../stores/thunk";
import Link from "next/link";

const Page = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const getAllOrders = async () => {
    try {
      if (search) {
        const result = await dispatch(orders.getAllOrders(search));
        if (result.payload?.data) {
          setData(result.payload.data.data)
          return;
        }
        throw { message: result.payload?.response?.data?.message };
      }

      const result = await dispatch(orders.getAllOrders());
      if (result.payload?.data) {
        setData(result.payload.data.data);
        return;
      }
      throw { message: result.payload?.response?.data?.message };
    } catch (error) {
      Messaege("error", error.message, "error");
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getAllOrders();
    }
  };
  return (
    <Layouts>
      <div className="container">
        <div>
          <h1>Ordered Items</h1>

          <div className="card">

            <div className="filter-table">
              <label htmlFor="" className="mr-3">
                Search
              </label>
              <input
                  type="text"
                  className="search"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
              />
            </div>

            <table className="mt-4">
              <thead>
              <tr>
                <th>Employee</th>
                <th>Requested Date</th>
                <th>Location</th>
                <th>status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              {data?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.applicantStaff}</td>
                    <td>{moment(item.requestDate).format("MMM Do YYYY")}</td>
                    <td>
                      {...item.Carts?.map((cart) => cart.Location?.name).join(
                          ", "
                      ) || ''}
                    </td>
                    <td>
                      <span
                          className={`badge ${
                              item.orderStatus === "pending"
                                  ? "badge-error text-white"
                                  : "badge-success text-black"
                          }`}
                      >
                        {item.orderStatus}
                      </span>
                    </td>
                    <td>
                      <Link href={`/items/orders/detail/${item.id}`}>
                        <span
                            className="btn btn-primary"
                            style={{color: "white", cursor: "pointer"}}
                        >
                          More Info
                        </span>
                      </Link>
                    </td>
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
