import express from "express";
import cors from "cors";

import applicationRoutes from "./routes/applicationRoutes.js";
import requestLogger from "./middleware/requestLogger.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// 1. CORS: allow only the configured client origin.
app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
);

// 2. Parse incoming JSON request bodies.
app.use(express.json());

// 3. Log incoming requests.
app.use(requestLogger);

// 4. Register API routes.
app.use("/api", applicationRoutes);

// 5. Handle unknown routes.
app.use(notFound);

// 6. Central error handler must be last.
// If registered first, it would run before later route handlers
// have an opportunity to generate errors. Errors passed with
// next(err) would not travel backwards to reach it.
app.use(errorHandler);

export default app;