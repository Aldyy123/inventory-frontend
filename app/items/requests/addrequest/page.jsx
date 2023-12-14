"use client";
import { useCallback, useEffect, useState } from "react";
import { postStoks, register } from "../../../api";
import Layouts from "../../../components/layouts";
import Link from "next/link";
import { Messaege } from "../../../helper/Message";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addRequest } from "../../../stores/thunk/requests";
import { getAllProducts, getProducyById } from "../../../stores/thunk/products";
import { getAllLocations } from "../../../stores/thunk/locations";

const Employee = () => {
  const router = useRouter();
  const [productId, setProductId] = useState(0);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState();
  const [uom, setuom] = useState("");
  const [qty, setqty] = useState(0);
  const [locationId, setlocationId] = useState(0);
  const dispatch = useDispatch();

  const userId = localStorage.getItem("iduser");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await dispatch(getAllProducts());
      setProducts(response.payload.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchDetailProduct = useCallback(async () => {
    try {
      const response = await dispatch(getProducyById(productId));
      setProduct(response.payload.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [dispatch, productId]);

  useEffect(() => {
    fetchDetailProduct();
  }, [fetchDetailProduct]);

  const addRequestData = async () => {
    try {
      const response = await dispatch(
        addRequest({
          UserId: userId,
          ProductId: productId,
          quantity: qty,
          uom: uom,
          LocationId: locationId,
        })
      );
      if (response?.payload?.data) {
        Messaege("Succes", "Success submitted", "success");
        setTimeout(() => {
          router.push("/items/requests");
        }, 2000);
      } else {
        Messaege("Failed", `failed submiited`, "error");
      }
    } catch (error) {
      console.log(error);
      Messaege("Failed", `failed submiited`, "error");
    }
  };

  console.log(product);

  return (
    <Layouts>
      <div className="container">
        <div>
          <div className="card">
            <h1 className="text-center mt-5">Add Request</h1>

            <div className="card">
              <label htmlFor="">Products</label>
              <select
                className="form-select form-select-lg"
                aria-label=".form-select-lg example"
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  fetchDetailProduct();
                  console.log("target", e.target.value);
                }}
              >
                <option value="" selected>
                  Select Product
                </option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <div className="mt-4">
                <label htmlFor="">Quantity</label>
                <input
                  type="text"
                  placeholder="fill quantity"
                  className="form-control input-stock"
                  onChange={(e) => setqty(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="">UOM</label>
                <input
                  placeholder="fille uom (pcs / kg / g)"
                  type="text"
                  className="form-control input-stock"
                  onChange={(e) => setuom(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="">Location</label>
                <select
                  className="form-select form-select-lg"
                  aria-label=".form-select-lg example"
                  value={locationId}
                  onChange={(e) => setlocationId(e.target.value)}
                >
                  <option value="" selected>
                    Select Locations
                  </option>
                  {product?.Locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  addRequestData();
                }}
                className="mt-5 input-stock-btn"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Employee;
