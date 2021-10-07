import axios from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const axiosInstance = axios.create({
  baseURL: "https://fa1jcrwbg6.execute-api.eu-west-3.amazonaws.com/prod",
  timeout: 10000,
  timeoutErrorMessage: "TimeoutError",
  cancelToken: source.token,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    // this function is going to called every time that we made a request
    // config obj has the data of the request and in this obj we have to attach the token

    config.headers["x-api-key"] = "YOURS_API_KEY";

    // RemoveAuthHeader - it is mandatory remove the Authorization header because it goes in conflict with AWS S3
    const token = sessionStorage.getItem("token");
    if (token && !config.headers.RemoveAuthHeader) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // this function is going to called every time we have some issues with the request, for example no internet connection
    return Promise.reject(error);
  }
);

export { axiosInstance, source };
