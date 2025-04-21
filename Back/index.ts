import express from "express";
import { dataRouter } from "./routes/data";
import { corsMiddleware } from "./middlewares/cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(corsMiddleware());

app.use("/api", dataRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is runing on Port: https://localhost:${PORT}`);
});
