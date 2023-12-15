"use client"

import Image from "next/image";
import logo from "../../public/logo.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Messaege } from "../helper/Message";
import {useDispatch} from "react-redux";
import {users} from "../stores/thunk";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassowrd] = useState("");

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      e.preventDefault();
      const response = await dispatch(users.loginUser({
        username,
        password,
      }));

      if(response?.payload?.data){
        localStorage.setItem("token", response.payload.data.data.token);
        localStorage.setItem("nama", response.payload.data.data.nama);
        localStorage.setItem("position", response.payload.data.data.position);
        localStorage.setItem("role", response.payload.data.data.role);
        localStorage.setItem("iduser", response.payload.data.data.id);
      }

      Messaege("Succes", "Success Login", "success");
      setTimeout(() => {
        router.push("/home");
      }, 2000);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="container">
        <div className="loginPage">
          <Image src={logo} alt="mml"></Image>
          <form onSubmit={handleLogin}>
            <div className="boxLogin">
              <div className="form-group">
                <label htmlFor="">username</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username anda"
                />
              </div>

              <div className="form-group">
                <label htmlFor="">password</label>
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setPassowrd(e.target.value)}
                  placeholder="Password"
                />
              </div>

              <div className="form-group">
              <button type="submit" className="btn">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
