// Server bootstrap: connect DB and start the Express app
import path from "path";
import dotenv from "dotenv";
import app from "./app";
import { ConnectDB } from "./config/db";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 5000;

ConnectDB()
  .then(() => {
    console.log("Database connection established, starting server...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
