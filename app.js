import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import alumniRoutes from "./routes/alumni.js";
import studentRoutes from "./routes/student.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));



app.use("/user", userRoutes);
app.use("/api", alumniRoutes);

import resourceRoutes from "./routes/resource.js";
app.use("/r", resourceRoutes);

app.use("/api", studentRoutes); // Use student routes at /student endpoint



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
