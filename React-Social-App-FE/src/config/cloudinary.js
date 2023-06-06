import { API_KEY, API_SECRET, CLOUD_NAME } from "../contants";

const cloudinary = require("cloudinary/lib-es5/cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

export default cloudinary;
