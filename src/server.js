import path from "path";
import express from "express";
import morgan from "morgan";
import {
  handleDetail,
  handleHome,
  handleLogin,
  handleMe,
  handleWrite,
} from "./handlers/globalHandler";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", path.join(process.cwd(), "src/views"));

app.use(logger);
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/me", handleMe);
app.get("/write", handleWrite);
app.get("/detail", handleDetail);
app.get("/:pk(\\d+)", handleDetail);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT} ✅`);

app.listen(PORT, handleListening);
