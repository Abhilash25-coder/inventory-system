import express from "express";
import { getProducts, getLedger, simulate } from "../controllers/inventoryController.js";
import { startAutoProducer, stopAutoProducer } from "../utils/dummyEvents.js";
const router = express.Router();

router.get("/products", getProducts);
router.get("/ledger", getLedger);
router.post("/simulate", simulate);

router.post("/producer/start", async (req, res) => {
    await startAutoProducer();
    res.json({ message: "Auto producer started" });
  });
  
  router.post("/producer/stop", async (req, res) => {
    await stopAutoProducer();
    res.json({ message: "Auto producer stopped" });
  });

export default router;
