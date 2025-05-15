import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/user.routes";
import catRoutes from "./routes/cats.routes";
import litterRoutes from "./routes/litter.routes";
import foodRoutes from "./routes/foods.routes";
import calendarRoutes from "./routes/calendar.routes";
import medicationRoutes from "./routes/medications.routes";
import vaccineRoutes from "./routes/vaccines.routes";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(userRoutes);
app.use("/cats", catRoutes);
app.use("/litter", litterRoutes);
app.use("/food", foodRoutes);
app.use("/calendar", calendarRoutes);
app.use("/medications", medicationRoutes);
app.use("/vaccines", vaccineRoutes)

app.listen(port, () => {
  console.log(`🚀 Server rodando em http://localhost:${port}`);
  console.log(process.env);
});
