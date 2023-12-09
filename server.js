import express from "express";
import dotenv from "dotenv";

import bootstrap from "./src/index.routes.js";

//configure env
dotenv.config();

// App
const app = express();
bootstrap(app, express);

//PORT
const PORT = process.env.PORT || 8080;
//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
