import express from "express";
import dotenv from "dotenv";
import { databaseConnection } from "./database/db.connection.js";
import authRoutes from "./modules/auth/index.js";
import userRoutes from "./modules/user/user.routes.js";
import { GlobalError } from "./common/errors.response.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Global error handler
app.use(GlobalError);

// Start server
app.listen(PORT, async () => {
  await databaseConnection();
  console.log(`Server is running on port ${PORT}`);
});