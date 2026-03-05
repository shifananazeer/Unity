import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running successfully 🚀");
});

// Test API route
app.get("/api/test", (req: Request, res: Response) => {
  res.json({
    message: "Test API working",
    status: "success"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});