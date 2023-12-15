import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../config";
import axios from "axios";

const getRequestByUser = createAsyncThunk(
  "requests/getRequestByUser",
  async ({user_id, status}) => {
    try {

        if(status){
            return await axios.get(`${API.API_URL}/requests/user/${user_id}?status=${status}`);
        }

      return await axios.get(`${API.API_URL}/requests/user/${user_id}`);
    } catch (e) {
      return e;
    }
  }
);

const addRequest = createAsyncThunk("requests/addRequest", async (data) => {
  try {
    return await axios.post(`${API.API_URL}/requests`, data);
  } catch (e) {
    return e;
  }
});

const getAllRequests = createAsyncThunk(
    'requests/getAllRequests',
    async (payload) => {
        try {
            if(payload?.search){
                return await axios.get(`${API.API_URL}/requests?name=${payload?.search}`)
            }

            if(payload?.user){
                return await axios.get(`${API.API_URL}/requests?user=${payload?.user}`)
            }

            if(payload?.status){
                return await axios.get(`${API.API_URL}/requests?status=${payload?.status}`)
            }

            return await axios.get(`${API.API_URL}/requests`)
        } catch (e) {
            return e
        }
    }
)

const updateRequest = createAsyncThunk(
    'requests/updateRequest',
    async (payload) => {
        try {
            console.log(payload)
            return await axios.put(`${API.API_URL}/requests/${payload.id}`, payload.data)
        } catch (e) {
            return e
        }
    }
)

const getRequestById = createAsyncThunk(
    'requests/getRequestById',
    async (id) => {
        try {
            return await axios.get(`${API.API_URL}/requests/detail/${id}`)
        } catch (e) {
            return e
        }
    }
)


export { getRequestByUser, getAllRequests, addRequest, updateRequest, getRequestById };
