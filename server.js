require("dotenv").config()
const PORT = process.env.PORT || 4000
const DATABASE_URL = process.env.DATABASE_URL
const express = require("express")
const { default: mongoose } = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const app = express()

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
//The useUnifiedTopology option removes support for several connection options that are no longer relevant with the new topology engine: autoReconnect. reconnectTries. reconnectInterval.

// Establish Connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

// Connection Events

mongoose.connection
.on("open", () => console.log("Your are connected to mongoose"))
.on("close", () => console.log("Your are disconnected from mongoose"))
.on("error", (error) => console.log(error));

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// MODELS
////////////////////////////////

const CheeseSchema = new mongoose.Schema({
    name: String, 
    image: String, 
    origin: String,
});


const Cheese = mongoose.model("Cheese", CheeseSchema)

///////////////////////////////
// ROUTES
////////////////////////////////

app.get("/", (req, res) => {
    res.send("Hola Cartagena!")
})

app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}))

    } catch (error) {
        res.status(400).json(error)
    }
})

app.post("/cheese", async (req, res) =>{
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status.json(error)
    }
})

app.put("/cheese/:id", async (req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
        )

    } catch (error) {
        res.status.json(error)
    }
})

app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status.json(error)
    }
})

app.get("/cheese/:id", async (req, res) => {
    try{
        res.json(await Cheese.findById(req.params.id))
    } catch (error) {
        res.status.json(error)
    }
})

app.listen(PORT, () => console.log(`Can you hear the love on port ${PORT}?`))

