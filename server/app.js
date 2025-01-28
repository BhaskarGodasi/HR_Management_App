const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")


dotenv.config()

app.use(express.json())
app.use(cors())


mongoose.connect("").then(()=>{
       console.log("Database is Connected")
})

app.listen(PORT , ()=>{
          console.log(`Server Running on PORT ${PORT}`)
})






