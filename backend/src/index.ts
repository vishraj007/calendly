import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import eventTypesRouter from "./routes/eventTypes";
import availabilityRouter from "./routes/availability";
import bookingsRouter from "./routes/bookings";
import contactsRouter from "./routes/contacts";
import analyticsRouter from "./routes/analytics";
import integrationsRouter from "./routes/integrations";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/event-types", eventTypesRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/integrations", integrationsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;