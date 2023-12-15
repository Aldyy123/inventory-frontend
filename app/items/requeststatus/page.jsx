"use client";
import Layouts from "../../components/layouts";
import { useEffect, useState } from "react";
import moment from "moment";
import {Messaege} from "../../helper/Message";
import {useDispatch} from "react-redux";
import {requests} from "../../stores/thunk";

const Requestsnpm = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [dataRequest, setDataRequest] = useState([])

  const getRequestByUser = async () => {
    try {



      const result = await dispatch(requests.getRequestByUser(localStorage.getItem('iduser')))
        if(result.payload?.data?.data){
          setDataRequest(result.payload.data.data)
            return
        }
    } catch (e) {
      Messaege("Error", e.message, "error");
    }
  }
  useEffect(() => {
    getRequestByUser();
  }, []);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Call the function to perform the search here
      getRequestByUser();
    }
  };
  return (
    <Layouts>
      <div className="container">
        <div>
          <h1>Requested Items Status</h1>
          <div className="card">
            <h5>List of Requested Items</h5>

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

            <table>
              <thead>
                <tr>
                  <th>Name Of The Product</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Request Date</th>
                  {localStorage.getItem("role") !== "admin" && (
                    <th>Status</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {dataRequest?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.Product.name}</td>
                    <td>{item?.Product?.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.uom}</td>

                    <td>{moment(item.createdAt).format("MMMM Do YYYY")}</td>
                    {localStorage.getItem("role") !== "admin" && (
                        <td>
                            <span
                                className={`${
                                    item.status === "pending"
                                        ? "badge badge-error"
                                        : "badge badge-success"
                                }`}
                            >
                              {item.status}
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

export default Requestsnpm;
