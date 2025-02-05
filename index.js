const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload());

//db connect
require("./config/database").connect();

//coonect to the cloud
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//route import and mount
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload",Upload);

//activate server

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
})