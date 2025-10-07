import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Axoma 2.0 backend is live " });
});


app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
