import axios from "axios";
import { TrafficApi } from "../apis";

const { UPDATE_TRAFFIC } = TrafficApi;

export const updateTraffic = async () => {
  try {
    const response = await axios.get(UPDATE_TRAFFIC);
    return response.data;
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
