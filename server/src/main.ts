import express from 'express';
import dotenv from 'dotenv';
import movieRouter from './routers/movieRouter.js'
import usersRouter from './routers/userRouter.js'
import cors from 'cors'
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import setupSwagger from './docs/swagger.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "";

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static("static"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());


app.use('/api', movieRouter);
app.use('/auth', usersRouter);
const PORT = process.env.PORT || 3000;

const startApp = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(MONGO_URI);
        console.log("Sucessefully connected to db");

        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

setupSwagger(app);

startApp();