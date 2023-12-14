"use client";
import Layouts from "../../components/layouts";
import {getAllOrders} from "../../api";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {addToOrder} from "../../stores/action/addCart";
import moment from "moment";
import {Messaege} from "../../helper/Message";
import {orders} from "../../stores/thunk";
import Link from "next/link";

const Page = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    const getAllOrders = async () => {
        try {

            if(search){
                const result = await dispatch(orders.getAllOrders(search))
                if (result.payload?.data) {
                    // setData(result.payload.data.data)
                    tidyFieldOrders(result.payload.data.data)

                    return
                }
                throw {message: result.payload?.response?.data?.message}
            }

            const result = await dispatch(orders.getAllOrders())
            if (result.payload?.data) {
                setData(result.payload.data.data)
                // tidyFieldOrders(result.payload.data.data)
                return
            }
            throw {message: result.payload?.response?.data?.message}
        } catch (error) {
            Messaege("error", error.message, 'error');
        }
    }

    const tidyFieldOrders = (orders) => {
        const ordersArray = []

        orders.forEach((order) => {
            order.Carts.map((cart) => {
                const cartObject = {
                    id: order.id,
                    applicantStaff: order.applicantStaff,
                    requestDate: order.createdAt,
                    orderStatus: order.orderStatus,
                    quantity: cart.quantity,
                    location: cart?.Location?.name
                }
                ordersArray.push(cartObject)
            })
        })

        console.log(ordersArray)
        setData(ordersArray)
    }

    useEffect(() => {
        getAllOrders();
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            // Call the function to perform the search here
            getAllOrders();
        }
    };
    return (<Layouts>
        <div className="container">
            <div>
                <h1>Ordered Items</h1>

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
                />{" "}
              </span>
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
                        {data?.map((item, index) => (<tr key={index}>
                            <td>{item.applicantStaff}</td>
                            <td>{moment(item.requestDate).format("MMM Do YYYY")}</td>
                            <td>
                                {...item.Carts.map((cart) => (cart.Location?.name)).join(', ')}
                            </td>
                            <td>
                                 <span className={`badge ${item.orderStatus === 'pending' ? 'badge-error text-white' : 'badge-success text-black'}`}>
                                    {item.orderStatus}
                                </span>
                            </td>
                            <td>
                                <Link href={`/items/orders/detail/${item.id}`}>
                                         <span
                                             className="badge badge-primary"
                                             style={{color: "white", cursor: "pointer"}}
                                         >
                          More Info
                        </span>
                                </Link>
                            </td>
                        </tr>))}
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
    </Layouts>);
};

export default Page;
