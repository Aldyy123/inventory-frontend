"use client";
import Layouts from "../../components/layouts";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {Messaege} from "../../helper/Message";
import {products} from "../../stores/thunk/index";
import Link from "next/link";

const Page = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const getAllProducts = async () => {
        try {

            if (search) {
                const result = await dispatch(products.getAllProducts({name: search}))
                if (result.payload?.data?.data) {
                    dataProductOrderByLocation(result.payload.data.data)
                    return
                }

                throw {message: 'Not found'}
            }

            const result = await dispatch(products.getAllProducts())
            if (result.payload?.data?.data) {
                dataProductOrderByLocation(result.payload.data.data)
                return
            }
            throw {message: 'Not found'}
        } catch (e) {
            Messaege("Error", e.message, "error");
        }
    }


    const dataProductOrderByLocation = (products) => {
        const productsArray = []

        products.map((product) => {
            const {Locations, ...restData} = product
            product.Locations.map((location) => {
                productsArray.push({
                    locationName: location.name, qty: location.qty, ...restData
                })
            });
        })

        setData(productsArray)
    }

    useEffect(() => {
        getAllProducts();
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            getAllProducts();
        }
    };

    const onClickOrder = (item) => {
        router.push(`/items/orders/${item.id}`)
    }

    return (<Layouts>
        <div className="container">
            <div>
                <h1>Stock</h1>

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
                            <th>Name of Product</th>
                            <th>Category</th>
                            <th>QTY</th>
                            <th>Location</th>
                            <th>UOM</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.map((item, index) => (<tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.qty}</td>
                            <td>{item.locationName}</td>
                            <td>{item.uom}</td>
                            <td>
                      <span
                          className={`badge ${item.qty > 0 ? "badge-success" : "badge-error"}`}
                      >
                        {item.qty > 0 ? "Available" : "out of stock"}
                      </span>
                            </td>
                            {localStorage.getItem("role") === "admin" ? (<td>
                                <Link className={'btn btn-primary'} href={`/items/stock/edit/${item.id}`}>
                                    Edit Stock
                                </Link>
                            </td>) : (<td>
                                <button disabled={item.qty < 1} className={'btn btn-primary'}
                                        onClick={() => onClickOrder(item)}>
                                    Order Item
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

export default Page;
