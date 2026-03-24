import 'dotenv/config.js';
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import { connectDB } from "./db/connect.js";
import routes from "./routes/index.js";
import authRouter from "./routes/auth.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import recipesRouter from './routes/recipes.js';

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/recipes', recipesRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Database connected and server running on port ${port}`);
  });
}).catch((err) => {
  console.log(err);
});
