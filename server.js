import express from "express";
import dotenv from "dotenv";
import { startjob } from "./src/utils/reqestApi.js";

import bootstrap from "./src/index.routes.js";

//configure env
dotenv.config();

// App
const app = express();
bootstrap(app, express);
startjob();

//PORT
const PORT = process.env.PORT || 8080;
//run listen
//liverpool
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
