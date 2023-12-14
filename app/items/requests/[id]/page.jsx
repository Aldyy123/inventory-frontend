"use client";
import Layouts from "../../../components/layouts";
import {useRouter} from "next/navigation";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Messaege} from "../../../helper/Message";
import {useDispatch} from "react-redux";
import {locations, requests} from "../../../stores/thunk";

const Page = () => {
    const router = useRouter();
    const {id} = useParams();

    const dispatch = useDispatch();

    const [detailRequest, setDetailRequest] = useState(null)
    const [qty, setQty] = useState(0);
    const [selectedOption, setSelectedOption] = useState("Mitra Utama");
    const handleSelectChange = (event) => {
        // Get the selected value from the event
        const selectedValue = event.target.value;

        // Update the state with the selected value
        setSelectedOption(selectedValue);

        // You can perform any additional actions based on the selected value here
        console.log("Selected option:", selectedValue);
    };

    const getRequestById = async () => {
        try {
            const result = await dispatch(requests.getRequestById(id));
            if (result?.payload?.data) {
                setDetailRequest(result?.payload?.data?.data)
                return
            }

            throw {message: "failed get data"}

        } catch (error) {
            Messaege("Failed", `failed submiited`, "error");
        }
    }

    useEffect(() => {
        getRequestById();
    }, []);

    const updateStockItems = async () => {
        try {
            const resultProduct = await dispatch(locations.updateLocation({
                id: detailRequest?.LocationId,
                data: {
                    qty: parseInt(detailRequest?.Location?.qty) + parseInt(qty),
                },
            }))

            const resultRequest = await dispatch(requests.updateRequest({
                data: {
                    status: "Available",
                    confirmTime: new Date(),
                },
                id: detailRequest?.id
            }))

            console.log(resultProduct, resultRequest)

            if (!resultProduct?.payload?.data?.data || !resultRequest?.payload?.data?.data) {
                throw {message: "failed submit"}
            }

            Messaege("Succes", "Success submitted", "success");
            setTimeout(() => {
                router.push("/items/stock");
            }, 2000);
        } catch (error) {
            console.log(error);
            Messaege("Failed", `failed submiited`, "error");
        }
    };
    return (
        <Layouts>
            <div className="container">
                <div>
                    <div className="card">
                        <h2 className="mt-5 text-center">Add Stock</h2>

                        <input
                            type="text"
                            onChange={(e) => setQty(e.target.value)}
                            className="input-stock"
                        />

                        <button
                            type="button"
                            onClick={updateStockItems}
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
