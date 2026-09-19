import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import articleRoutes from "./routes/articleRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

const app = express()
connectDB()
app.use(cors())
app.use(express.json())
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "TechPravah API is running"
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/articles", articleRoutes)
app.use("/api/comments", commentRoutes)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`)
})