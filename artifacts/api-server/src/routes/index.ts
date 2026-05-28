import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import privateRouter from "./private";
import reorderRouter from "./reorder";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(privateRouter);
router.use(reorderRouter);

export default router;
