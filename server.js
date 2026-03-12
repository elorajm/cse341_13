import 'dotenv/config.js';
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Database connected and server running on port ${port}`);
  });
}).catch((err) => {
  console.log(err);
});