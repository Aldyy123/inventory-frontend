"use client";
import { Messaege } from "../../../../helper/Message";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Layouts from "../../../../components/layouts";
import moment from "moment";
import { orders } from "../../../../stores/thunk/index";

const DetailOrder = () => {
  const searchParams = useParams();
  const dispatch = useDispatch();

  const [detailOrder, setDetailOrder] = useState(null);

  useEffect(() => {
    (async () => {
      const orderDetail = await dispatch(
        orders.getOrderByOrderId(searchParams.id)
      );
      if (orderDetail.payload.data) {
        setDetailOrder(orderDetail.payload.data.data);
      }
    })();
  }, [dispatch, searchParams.id]);

  const confirmOrder = async () => {
    try {
      const resultApi = await dispatch(orders.confirmOrder(searchParams.id));
      if (resultApi?.payload?.data) {
        Messaege("Succes", "Success Order", "success");
        const orderDetail = await dispatch(
          orders.getOrderByOrderId(searchParams.id)
        );
        if (orderDetail.payload.data) {
          setDetailOrder(orderDetail.payload.data.data);
        }
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  console.log("detail", detailOrder);

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
                <td>{detailOrder?.applicantStaff}</td>
              </tr>
              <tr className="mt-5">
                <td>Activity</td>
                <td>:</td>
                <td>{detailOrder?.activity}</td>
              </tr>
              <tr className="mt-5">
                <td>Division</td>
                <td>:</td>
                <td>{detailOrder?.division}</td>
              </tr>
              <tr className="mt-5">
                <td>Machine</td>
                <td>:</td>
                <td>{detailOrder?.machine}</td>
              </tr>
              <tr className="mt-5">
                <td>Status Order</td>
                <td>:</td>
                <td>
                  <span
                    className={`badge ${
                      detailOrder?.orderStatus === "pending"
                        ? "badge-error text-white"
                        : "badge-success"
                    }`}
                    style={{ padding: "5px" }}
                  >
                    {detailOrder?.orderStatus}
                  </span>
                </td>
              </tr>
            </table>

            <table className="mt-5">
              <thead>
                <tr>
                  {/* <th>Category</th> */}
                  <th>QTY</th>
                  <th>UOM</th>
                  <th>Requested Dates</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {detailOrder?.Carts?.map((item) => (
                  <tr key={item.id}>
                    {/* <td>{detailOrder?.Product?.category}</td> */}
                    <td>{item?.quantity}</td>
                    <td>{item?.uom}</td>
                    <td>{moment(item.requestDate).format("YYYY-MM-DD")}</td>
                    <td>{item?.Location?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {localStorage.getItem("role") === "admin" &&
              detailOrder?.orderStatus === "pending" && (
                <div className={"d-flex justify-content-center mt-4"}>
                  <button
                    type="button"
                    onClick={() => confirmOrder()}
                    className="btn btn-success"
                  >
                    Confirm
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default DetailOrder;
