var dotenv = require("dotenv");
var app = require("./app");
var mongoose = require("mongoose");



dotenv.config({ path: "./config.env" });
mongoose.connect( process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,}).then(conn=>{
        console.log("DB Connected");
    });


    
const port = 80;

app.listen(port, () =>
    console.log(`App Listening on port ${port}`)
)