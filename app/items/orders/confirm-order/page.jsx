"use client";
import {Messaege} from "../../../helper/Message";
import Layouts from "../../../components/layouts";
import {postOrder} from "../../../api";
import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {clearOrder} from "../../../stores/reducer/addOrderSlice";
import {carts, orders} from "../../../stores/thunk";
import {clearCart} from "../../../stores/reducer/addCartSlice";

const Orders = () => {
    const {orderData, cartData} = useSelector((state) => ({
        orderData: state.addOrder,
        cartData: state.addCart,
    }));


    const dispatch = useDispatch();
    const query = useSearchParams()
    const router = useRouter()

    const [machine, setMachine] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOption2, setSelectedOption2] = useState("");
    const [name, setName] = useState("");

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };
    const handleOptionChange2 = (value) => {
        setSelectedOption2(value);
    };

    const updateOrderIdCart = async (dataCart) => {
        try {
            const data = {
                id: localStorage.getItem('iduser'),
                data: {
                    order: orderData?.orders?.map((item) => ({
                        productId: item?.id,
                        quantity: item?.quantity,
                        location: item?.location,
                        uom: item?.uom,
                    })),
                },
            }
            const result = await dispatch(carts.updateCart(data))
            if (result.payload?.data?.data) {
                Messaege("Success", "Order Created", "success");
                router.push("/items/orders");
            }
        } catch (e) {
            Messaege("Error", e.message, "error");
        }
    }


    const createCart = async (orders, itemProduct) => {
        try {
            const data = {
                user_id: localStorage.getItem('iduser'),
                data: {
                    ProductId: itemProduct.id,
                    quantity: itemProduct.quantity,
                    LocationId: itemProduct.locationId,
                    uom: itemProduct.uom,
                    OrderId: orders?.data?.id,
                    UserId: localStorage.getItem('iduser'),
                },
            }

            console.log(data)

            const result = await dispatch(carts.createCart(data))

            if (result.payload?.data?.data) {
                Messaege("Success", "Order Created", "success");
                router.push("/items/orders");
            }

        } catch (e) {
            Messaege("Error", e.message, "error");
        }
    }

    const handleSubmit = async () => {
        try {
            const dataOrder = {
                user_id: localStorage.getItem('iduser'),
                data: {
                    applicantStaff: name,
                    activity: selectedOption,
                    division: selectedOption2,
                    machine: machine,
                }
            }


            const resultCreateOrder = await dispatch(orders.createOrderByUser(dataOrder))
            if (resultCreateOrder.payload?.data) {
                if (query.get('type') === 'cart') {
                    cartData?.carts.forEach(async (item) => {
                        await createCart(resultCreateOrder.payload.data, item)
                    })

                } else {
                    orderData?.orders.forEach(async (item) => {
                        await createCart(resultCreateOrder.payload.data, item)
                    })
                }
            }

            dispatch(clearOrder());
            dispatch(clearCart());
        } catch (e) {
            Messaege("Error", e.message, "error");
        }
    }

    return (
        <Layouts>
            <div className="container">
                <div>
                    <div className="card">
                        <h5>Request Form</h5>

                        <table className="mt-3">
                            <tr className="mt-5">
                                <td width="100">Applicant Staff</td>
                                <td width="15">:</td>
                                <td>
                                    {" "}
                                    <input
                                        type="text"
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-order"
                                    />
                                </td>
                            </tr>
                            <tr className="mt-5">
                                <td>Activity</td>
                                <td>:</td>
                                <td>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div style={{marginRight: "20px"}}>
                                            <input
                                                type="radio"
                                                id="corrective"
                                                name="options"
                                                value="corrective"
                                                checked={selectedOption === "corrective"}
                                                onChange={() => handleOptionChange("corrective")}
                                            />
                                            <label htmlFor="corrective">Corrective</label>
                                        </div>

                                        <div style={{marginRight: "20px"}}>
                                            <input
                                                type="radio"
                                                id="preventive"
                                                name="options"
                                                value="preventive"
                                                checked={selectedOption === "preventive"}
                                                onChange={() => handleOptionChange("preventive")}
                                            />
                                            <label htmlFor="preventive">Preventive</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="other"
                                                name="options"
                                                value="other"
                                                checked={selectedOption === "other"}
                                                onChange={() => handleOptionChange("other")}
                                            />
                                            <label htmlFor="other">other</label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr className="mt-5">
                                <td>Division</td>
                                <td>:</td>
                                <td>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div style={{marginRight: "20px"}}>
                                            <input
                                                type="radio"
                                                id="Pl-EXTRUTIO"
                                                name="options2"
                                                value="Pl-EXTRUTION"
                                                checked={selectedOption2 === "Pl-EXTRUTION"}
                                                onChange={() => handleOptionChange2("Pl-EXTRUTION")}
                                            />
                                            <label htmlFor="Pl-EXTRUTIO">Pl-EXTRUTION</label>
                                        </div>

                                        <div style={{marginRight: "20px"}}>
                                            <input
                                                type="radio"
                                                id="PL-INJECTION"
                                                name="options2"
                                                value="PL-INJECTION"
                                                checked={selectedOption2 === "PL-INJECTION"}
                                                onChange={() => handleOptionChange2("PL-INJECTION")}
                                            />
                                            <label htmlFor="PL-INJECTION">PL-INJECTION</label>
                                        </div>
                                        <div style={{marginRight: "20px"}}>
                                            <input
                                                type="radio"
                                                id="PL-LEM"
                                                name="options2"
                                                value="PL-LEM"
                                                checked={selectedOption2 === "PL-LEM"}
                                                onChange={() => handleOptionChange2("PL-LEM")}
                                            />
                                            <label htmlFor="PL-LEM">PL-LEM</label>
                                        </div>
                                        <div style={{marginRight: "20px"}}>
                                            <input
                                                type="radio"
                                                id="GUDANG LOG"
                                                name="options2"
                                                value="GUDANG LOG"
                                                checked={selectedOption2 === "GUDANG LOG"}
                                                onChange={() => handleOptionChange2("GUDANG LOG")}
                                            />
                                            <label htmlFor="GUDANG LOG">GUDANG LOG</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="other"
                                                name="options2"
                                                value="other"
                                                checked={selectedOption2 === "OTHER"}
                                                onChange={() => handleOptionChange2("OTHER")}
                                            />
                                            <label htmlFor="other">OTHER</label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr className="mt-5">
                                <td>Machine</td>
                                <td>:</td>
                                <td>
                                    <input
                                        type="text"
                                        // placeholder="Enter Product Quantity"
                                        onChange={(e) => setMachine(e.target.value)}
                                        className="input-order"
                                    />
                                </td>
                            </tr>
                        </table>

                        <table className="mt-5">
                            <thead>
                            <tr>
                                <th>Name of the product</th>
                                <th>QTY</th>
                                <th>Location</th>
                                <th>UOM</th>
                            </tr>
                            </thead>
                            <tbody>
                            {query.get('type') === 'order' && orderData?.orders?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.name}</td>
                                    <td>{item?.quantity}</td>
                                    <td>{item?.location}</td>
                                    <td>{item?.uom}</td>
                                </tr>
                            ))}

                            {query.get('type') === 'cart' && cartData?.carts?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.name}</td>
                                    <td>{item?.quantity}</td>
                                    <td>{item?.location}</td>
                                    <td>{item?.uom}</td>
                                </tr>
                            ))}

                            </tbody>
                        </table>

                        <div style={{width: "400", margin: "auto"}}>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="mt-5 input-stock-btn"
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layouts>
    );
};

export default Orders;
