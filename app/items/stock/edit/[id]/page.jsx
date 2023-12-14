"use client";
import Layouts from "../../../../components/layouts";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {Messaege} from '../../../../helper/Message'
import {locations, products} from '../../../../stores/thunk'

const Page = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const params = useParams();

    const [data, setData] = useState([]);
    const [editDatas, setEditDatas] = useState([]);

    const getProductById = async () => {
        try {
            const resultProduct = await dispatch(products.getProducyById(params.id));
            if (resultProduct.payload?.data) {
                setData(resultProduct.payload.data.data);
            }
        } catch (e) {
            Messaege("Error", e.message, "error");
        }
    };

    const updateData = async () => {
        const result = editDatas.map(async (element) => {
            return await dispatch(
                locations.updateLocation({
                    id: element.locationId,
                    data: {
                        ProductId: data.id,
                        qty: element.qty,
                    },
                })
            );
        });
        Promise.all(result).then(() => {
            Messaege("Succes", "Success submitted", "success");
            setTimeout(() => {
                router.push("/items/stock");
            }, 2000);
        });
    };

    useEffect(() => {
        getProductById();
    }, []);

    return (
        <Layouts>
            <div className="container">
                <div>
                    <h1>{data?.name}</h1>
                    <div className="card">
                        <h2 className="mt-5 text-center">Edit Stock</h2>

                        <table>
                            <thead>
                            <tr>
                                <th>Location</th>
                                <th>Qty</th>
                                <th>Uom</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* saya ingin map editDatas disini */}
                            {editDatas.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td width={150}>{data?.locationName}</td>
                                        <td width={150}>
                                            <input
                                                type="number"
                                                placeholder={"Masukan jumlah stock"}
                                                value={data?.qty || 0}
                                                onChange={(event) => {
                                                    const newValue = event.target.value;
                                                    setEditDatas((prevEditDatas) => {
                                                        const newEditDatas = [...prevEditDatas];
                                                        newEditDatas[index] = {
                                                            ...newEditDatas[index],
                                                            qty: newValue,
                                                        };
                                                        return newEditDatas;
                                                    });
                                                }}
                                                style={{
                                                    outline: "none",
                                                    border: "none",
                                                    backgroundColor: "transparent",
                                                    outlineColor: "transparent",
                                                    borderColor: "transparent",
                                                }}
                                            />
                                        </td>
                                        <td width={150}>pcs</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        <div>
                            <label htmlFor="" className="mr-3" style={{ display: "block" }}>
                                Location
                            </label>
                            <select
                                name="show"
                                id=""
                                className="mr-3"
                                style={{ width: "200px", padding: "5px" }}
                                onChange={(value) => {
                                    const selectedLocationId = value.target.value;
                                    const selectedLocation = data.Locations?.find(
                                        (item) => String(item.id) === selectedLocationId
                                    );
                                    setEditDatas((prev) => [
                                        ...prev,
                                        {
                                            productId: data.id,
                                            productName: data.name,
                                            locationName: selectedLocation?.name,
                                            qty: selectedLocation?.qty,
                                            locationId: value.target.value,
                                        },
                                    ]);
                                }}
                            >
                                <option value="" selected>
                                    Select Locations
                                </option>
                                {data.Locations?.map((item, index) => (
                                    <option value={item.id} key={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                updateData();
                            }}
                            type="button"
                            className="mt-5 input-stock-btn"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </Layouts>
    );
};

export default Page;