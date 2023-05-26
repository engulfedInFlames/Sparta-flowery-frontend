import path from "path";
import express from "express";
import morgan from "morgan";
import parser from "body-parser";
import * as handler from "./src/handlers/globalHandler";

require("dotenv").config();

const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");

const PORT = 3000;

const app = express();
const logger = morgan("dev");
const upload = multer();

app.set("view engine", "pug");
app.set("views", path.join(process.cwd(), "src/views"));

app.use(logger);
app.use(cors());
app.use(cookieParser());
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(express.static(path.join(process.cwd(), "public")));

app.route("/").get(handler.getHome);

app.get("/", handler.getHome);
app
  .route("/write")
  .get(handler.getWrite)
  .post(upload.single("photos"), handler.postWrite);
app.route("/:pk(\\d+)").get(handler.getDetail).post(handler.postComment);
app.route("/login").get(handler.getLogin).post(handler.postLogin);
app.get("/logout", handler.getLogout);
app.get("/kakao-login", handler.getKakakoLogin);
app.get("/github-login", handler.getGithubLogin);
app.get("/google-login", handler.getGoogleLogin);

const handleListening = () =>
  console.log(`Server listening on http://127.0.0.1:${PORT} ✅`);

app.listen(PORT, "127.0.0.1", handleListening);
