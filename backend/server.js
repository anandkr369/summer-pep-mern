const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const app = express()
const fileUpload = require('express-fileupload');
const router = require('./routes/router');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

dotenv.config()

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


app.use(cors({
    origin: ["http://localhost:5173"],
    credentials : true
}))
app.use(cookieparser())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(bodyParser.json())
mongoose.connect(process.env.MONGO_URI, {
    dbName: "Assignment"
}).then(()=>{
    console.log("Connected to MongoDB...");
});

app.use('/auth', router)

app.listen(3000, ()=>{
    console.log("Server is listening...");
})