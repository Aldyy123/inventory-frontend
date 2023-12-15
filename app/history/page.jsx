"use client";
import Layouts from "../components/layouts";
import {useEffect, useState} from "react";
import moment from "moment";
import {useDispatch} from "react-redux";
import {Messaege} from "../helper/Message";
import {histories} from "../stores/thunk";

const Requestsnpm = () => {
    const dispatch = useDispatch();

    const [dataRequest, setDataRequest] = useState([])

    const getAllHistory = async () => {
        try {
            const resultRequets = await dispatch(histories.listHistory())
            if (resultRequets.payload?.data?.data) {
                setDataRequest(resultRequets.payload.data.data)
            }
        } catch (error) {
            console.log(error)
            Messaege('Data Not found', error.message, 'error')
        }
    }

    useEffect(() => {
        getAllHistory();
    }, []);


    return (<Layouts>
        <div className="container">
            <div>
                <h1>History</h1>

                <div className="card">

                    <table>
                        <thead>
                        <tr>
                            <th>History Log</th>
                            <th>Tanggal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dataRequest?.map((item, index) => (<tr key={index}>
                            <td>{item?.log_type}</td>
                            <td>{moment(item?.createdAt).format('YYYY-MM-DD')}</td>
                        </tr>))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    </Layouts>);
};

export default Requestsnpm;
