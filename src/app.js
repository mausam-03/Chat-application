import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* -------------------- GLOBAL MIDDLEWARE -------------------- */

app.use(express.json()); // parse JSON body


/* -------------------- HEALTH CHECK -------------------- */

app.get("/", (req, res) => {
  res.json({
    status: "API running",
    message: "Chat App Backend"
  });
});


/* -------------------- ROUTES -------------------- */

app.use("/auth", authRoutes);


/* -------------------- GLOBAL ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});


export default app;