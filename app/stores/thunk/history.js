import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../config";

const listHistory = createAsyncThunk(
    'history/list',
    async (payload, thunkAPI) => {
        try {
            return axios.get(
                `${API.API_URL}/history/`,
            )
        } catch (e) {
            return e
        }
    }
)

export {listHistory}