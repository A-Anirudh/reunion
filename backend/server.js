import express from 'express'
import dotenv from 'dotenv';
import router from './routes/userRoutes.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

import cors from 'cors'
import postRouter from './routes/postRoutes.js';

dotenv.config();

connectDB();
const port = process.env.PORT || 8080;
const app = express()
app.use(cors({ origin: '*', credentials: true }));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cookieParser());


app.use('/api',router) // This is for userRoutes only
app.use('/api',postRouter)

// app.get('/', (req,res)=>{
    // res.send(`server is ready and running on port ${port}`)
// })

app.use(notFound);
app.use(errorHandler);
app.listen(port, () =>{
    console.log(`server is ready and running on port ${port}`)
})