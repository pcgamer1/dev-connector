const express = require("express")
const connectDB = require("./config/db")

const app = express()

connectDB()

//Init middleware
app.use(express.json({ extended: false }))

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
  res.send("API Running")
})

//Define routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/posts", require("./routes/api/posts"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/auth", require("./routes/api/auth"))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
