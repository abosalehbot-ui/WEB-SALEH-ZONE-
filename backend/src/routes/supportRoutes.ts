import { Router } from "express";

import { addTicketMessage, createSupportTicket, getEmployeeQueue, getMyTickets, resolveTicket } from "../controllers/supportController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/my", getMyTickets);
router.post("/", createSupportTicket);
router.post("/:ticketId/messages", addTicketMessage);
router.get("/queue", restrictTo("Employee", "SuperAdmin"), getEmployeeQueue);
router.post("/:ticketId/resolve", restrictTo("Employee", "SuperAdmin"), resolveTicket);

export default router;
