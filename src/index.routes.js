import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import morgan from "morgan";
import cors from "cors";
import connectDB from "../DB/db.js";
import { GlobalErrorHandling } from "./utils/errorHandling.js";

const bootstrap = (app, express) => {
  //middelwares
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());

  //databse config
  connectDB();

  //routes
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/category", categoryRoutes);
  app.use("/api/v1/product", productRoutes);

  //Globale error handling
  app.use(GlobalErrorHandling);

  //rest api
  app.get("/", (req, res) => {
    res.send("<h1>Welcome to ecommerce app</h1>");
  });

  //Ivalid Api
  app.all("*", (req, res) => {
    return res.send("<h1>Invalid Api url or Method</h1>");
  });
};

export default bootstrap;
