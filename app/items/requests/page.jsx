"use client";
import {getAllStocks} from "../../api";
import Layouts from "../../components/layouts";
import {useEffect, useState} from "react";
import moment from "moment";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {Messaege} from "../../helper/Message";
import {requests} from "../../stores/thunk";

const Requestsnpm = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [dataRequest, setDataRequest] = useState([])

    const getAllRequest = async () => {
        try {
            if (search) {
                const resultRequets = await dispatch(requests.getAllRequests(search))
                if (resultRequets.payload?.data) {
                    setDataRequest(resultRequets.payload.data.data)
                    return
                }
                throw {message: "No data found"}
            }

            const resultRequets = await dispatch(requests.getAllRequests())
            if (resultRequets.payload?.data?.data) {
                setDataRequest(resultRequets.payload.data.data)
            }
        } catch (error) {
            console.log(error)
            Messaege('Data Not found', error.message, 'error')
        }
    }

    useEffect(() => {
        getAllRequest();
    }, []);
    const postRequest = async () => {
        router.push("/items/requests/addrequest");
    };
    const toEditPage = (id) => {
        router.push(`/items/requests/${id}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            // Call the function to perform the search here
            getAllRequest();
        }
    }

    return (<Layouts>
        <div className="container">
            <div>
                <h1>Requested Items</h1>
                {localStorage.getItem("role") == "admin" ? (<></>) : (<div style={{width: "500px"}}>
                    <button
                        type="button"
                        onClick={postRequest}
                        className="mb-3 mt-2 input-stock-btn"
                    >
                        Add Request
                    </button>
                </div>)}
                <div className="card">
                    <h5>List of Requested Items</h5>

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

                    <table>
                        <thead>
                        <tr>
                            <th>Name Of The Product</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>UOM</th>
                            <th>Location</th>
                            {localStorage.getItem('role') !== 'admin' && <th>Requested Date</th>}
                            {localStorage.getItem("role") === "admin" ? (<th>action</th>) : (<th>Status</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {dataRequest?.map((item, index) => (<tr key={index}>
                            <td>{item?.Product?.name}</td>
                            <td>{item?.Product?.category}</td>
                            <td>{item.quantity}</td>
                            <td>{item.uom}</td>
                            <td>{item?.Location?.name}</td>
                            {localStorage.getItem('role') !== 'admin' &&
                                <td>{moment(item?.createdAt).format('MMMM YYYY DD')}</td>}

                            {localStorage.getItem("role") !== "admin" && (
                                <td>
                                    <span
                                        className={`${item.status === "pending" ? "badge badge-error" : "badge badge-success"}`}
                                    >
                                      {item.status}
                                    </span>
                                </td>
                            )}

                            {localStorage.getItem("role") === "admin" && (<td onClick={() => toEditPage(item.id)}>
                                <button
                                    className="btn btn-primary"
                                    disabled={item.status !== "pending"}
                                    style={{color: "white", cursor: "pointer"}}
                                >
                                    Add Stock
                                </button>
                            </td>)}
                        </tr>))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    </Layouts>);
};

export default Requestsnpm;
