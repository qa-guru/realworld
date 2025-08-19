require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3001;
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");
const errorHandler = require("./middleware/errorHandler");

const usersRoutes = require("./routes/users");
const userRoutes = require("./routes/user");
const articlesRoutes = require("./routes/articles");
const profilesRoutes = require("./routes/profiles");
const tagsRoutes = require("./routes/tags");

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log(`Connection with ${env} database has been established.`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// API routes must come BEFORE static files and catch-all route
app.use("/api/users", usersRoutes);
app.use("/api/user", userRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/tags", tagsRoutes);

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => res.json({ status: "API is running on /api" }));
  
  app.get("*", (req, res) =>
    res.status(404).json({ errors: { body: ["Not found"] } }),
  );
}

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
