import { Router } from "express";

import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  slowEndpoint,
  blockEndpoint
} from "../controllers/applicationController.js";

import validateApplication from "../middleware/validateApplication.js";

const router = Router();

// Demonstration endpoints.
router.get("/slow", slowEndpoint);
router.get("/block", blockEndpoint);

// Application CRUD routes.
router.get("/applications", getApplications);

router.get("/applications/:id", getApplicationById);

router.post(
  "/applications",
  validateApplication,
  createApplication
);

router.patch(
  "/applications/:id",
  validateApplication,
  updateApplication
);

router.delete("/applications/:id", deleteApplication);

export default router;