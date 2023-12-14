"use client";
import {useEffect, useState} from "react";
import Layouts from "../components/layouts";
import moment from "moment";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {orders, products, requests} from "../stores/thunk";
import Link from "next/link";

const Page = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [dataRequest, setDataRequest] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [roleUser, setRoleUser] = useState(null)

    const getOrders = async () => {
        if (localStorage.getItem('role') === 'admin') {
            const orderAdmin = await dispatch(orders.getAllOrders());
            setData(orderAdmin.payload.data.data);
        } else {
            const orderUser = await dispatch(orders.getOrdersByUser(localStorage.getItem('iduser')));
            setData(orderUser.payload.data.data);
        }
    }

    const getProducts = async () => {
        const productsResult = await dispatch(products.getAllProducts({
            filter: 'zero'
        }))
        if (productsResult?.payload?.data) {
            tidyDataProduct(productsResult.payload.data.data)
        }
    }

    const tidyDataProduct = (products) => {
        const productsArray = []
        products.forEach((product) => {
            product.Locations.forEach((location) => {
                const productCopy = {
                    productId: product.id,
                    name: product.name,
                    category: product.category,
                    uom: product.uom,
                    location: location.name,
                    qty: location.qty
                }
                productsArray.push(productCopy)
            })
        })

        setDataProducts(productsArray)
    }

    const getRequestProduct = async () => {
        if (localStorage.getItem('role') === 'admin') {
            const productsResult = await dispatch(requests.getAllRequests())
            setDataRequest(productsResult.payload?.data?.data)
        } else {
            const productsResult = await dispatch(requests.getRequestByUser(localStorage.getItem('iduser')))
            setDataRequest(productsResult.payload?.data?.data)
        }
    }

    useEffect(() => {
        (async () => {
            await getOrders();
            await getProducts();
            await getRequestProduct();
        })()
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('role')
        setRoleUser(role)

    }, []);

    const toEditPage = () => {
        router.push(`/items/stock`);
    };
    const toEditPage2 = () => {
        router.push(`/items/orders`);
    };
    return (<Layouts>
        <div className="container">
            <div>
                <h1>Welcome, {localStorage.getItem("nama")}</h1>

                <div className="card">
                    <h2>Multi Makmur Lemindo Tbk Management System </h2>
                    <p>
                        This website is used to help manage the inventory of PT Multi
                        Makmur Lemindo Tbk
                    </p>
                </div>
            </div>

            <div className="mt-5">
                {roleUser == "admin" && (<>
                    <h1 style={{marginTop: "70px"}}>Out Of Items</h1>

                    <div
                        className="card"
                        style={{marginTop: "10px", marginBottom: "70px"}}
                    >
                        <table>
                            <thead>
                            <tr>
                                <th>Name Of The Product</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dataProducts?.map((item, index) => (<tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.location}</td>
                                <td>
                          <span
                              className="badge badge-primary"
                              style={{color: "white", cursor: "pointer"}}
                              onClick={toEditPage}
                          >
                            Edit Stock
                          </span>
                                </td>
                            </tr>))}
                            </tbody>
                        </table>
                    </div>
                </>)}

                {roleUser === 'admin' ? (<h1>Ordered Items</h1>) : (<h1>My Order Items</h1>)}

                <div className="card">
                    <table>
                        <thead>
                        <tr>
                            <th>Aplication Staff</th>
                            <th>Requested Date</th>
                            <th>Location</th>
                            <th>Confirmed Date</th>
                            {localStorage.getItem("role") == "admin" ? (<></>) : (<th>Status</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {data?.map((item, index) => (<tr key={index}>
                            <td>{item.applicantStaff}</td>
                            <td>{moment(item.requestDate).format("MMMM Do YYYY")}</td>
                            <td>{...item.Carts.map((cart) => (cart.Location?.name)).join(', ')}</td>
                            <td>{item.orderStatus == "pending" ? "-" : moment(item.confirmTime).format("MMMM DD YYYY")}</td>
                            {roleUser !== "admin" && (<td>
                                    <span
                                        className={`${item.orderStatus == "pending" ? "badge badge-error" : "badge badge-success"}`}
                                    >
                                        {item.orderStatus}
                                </span>
                                </td>
                            )}
                            <td>
                                {roleUser === 'admin' && (
                                    <Link href={`/items/orders/detail/${item.id}`}
                                          className="badge badge-primary"
                                          style={{color: "white", cursor: "pointer"}}
                                          onClick={toEditPage2}
                                    >
                                        More info
                                    </Link>
                                )}
                            </td>
                        </tr>))}
                        </tbody>
                    </table>
                </div>

                {roleUser === 'admin' ? (<h1 style={{marginTop: "70px"}}>Requested Items</h1>) : (
                    <h1 style={{marginTop: "70px"}}>My Request Items</h1>)}

                <div
                    className="card"
                    style={{marginTop: "10px", marginBottom: "70px"}}
                >
                    <table>
                        <thead>
                        <tr>
                            <th>Name Of The Product</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>UOM</th>
                            <th>Request Date</th>
                            {localStorage.getItem("role") == "admin" ? (<></>) : (<th>Status</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {dataRequest?.map((item, index) => (<tr key={index}>
                            <td>{item?.Product?.name}</td>
                            <td>{item?.Product?.category}</td>
                            <td>{item.quantity}</td>
                            <td>{item.uom}</td>
                            <td>{moment(item.createdAt).format("MMMM Do YYYY")}</td>
                            {localStorage.getItem("role") === "admin" ? (<></>) : (<td>
                                <span
                                    className={`${item.status === "out_stock" ? "badge badge-success" : "badge badge-error"}`}
                                >
                          {item.status}
                        </span>
                            </td>)}
                        </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </Layouts>);
};

export default Page;
