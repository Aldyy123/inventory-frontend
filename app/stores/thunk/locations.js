import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../config/";

const getAllLocations = createAsyncThunk("locations/getLocations", async () => {
  try {
    return await axios.get(`${API.API_URL}/locations`);
  } catch (e) {
    return e;
  }
});

const updateLocation = createAsyncThunk(
    "locations/updateLocation",
    async (payload) => {
        try {
        return await axios.put(
            `${API.API_URL}/locations/${payload.id}`,
            payload.data
        );
        } catch (e) {
        return e;
        }
    }
)

export { getAllLocations, updateLocation };
