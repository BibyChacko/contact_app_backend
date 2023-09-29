var dotenv = require("dotenv");
var app = require("./app");
var mongoose = require("mongoose");



dotenv.config({ path: "./config.env" });
mongoose.connect( process.env.DATABASE_ATLAS, {
    // useNewUrlParser: true, 
    useUnifiedTopology: true,}).then(conn=>{
        console.log("DB Connected");
    });


    
const port = 3001;

app.listen(port, () =>
    console.log(`App Listening on port ${port}`)
)