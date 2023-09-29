const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const userRouter = require("./routers/user_route");
const contactRouter = require("./routers/contact_router");

const authMiddleware = require("./middlewares/auth_middleware");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get("/health",(req,res)=>{
    res.send("Server running successfully");
});

/// Open Routes goes here
app.use("/user",userRouter);

app.use("/contact",contactRouter);
app.all("*",(req,res,next)=>{
    res.status(404).json({status:false,error: `Can't find the route ${req.originalUrl}`});
});

app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = false;

    res.status(err.statusCode).json({
        status : err.status,
        error : "Something went wrong"
    });
    next();
});

module.exports = app;