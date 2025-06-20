import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = `${Constants.expoConfig?.extra?.API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
});

export { api };
