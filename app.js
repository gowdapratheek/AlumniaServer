import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import alumniRoutes from "./routes/alumni.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));



app.use("/user", userRoutes);
app.use("/api", alumniRoutes);


mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.COMPASS_URL)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`listening at port ${process.env.PORT}`)
    )
  )
  .catch((error) =>
    console.log({ message: "error in connecting to mongoose DB", error })
  );
