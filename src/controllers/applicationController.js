import { randomUUID } from "node:crypto";
import { applications } from "../data/applications.js";
import ApiError from "../errors/ApiError.js";

// GET /api/applications
export function getApplications(req, res) {
  let result = [...applications];

  const { status, search } = req.query;

  if (status) {
    result = result.filter(
      app => app.status.toLowerCase() === String(status).toLowerCase()
    );
  }

  if (search) {
    const keyword = String(search).toLowerCase();

    result = result.filter(
      app =>
        app.company.toLowerCase().includes(keyword) ||
        app.role.toLowerCase().includes(keyword)
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
}

// GET /api/applications/:id
export function getApplicationById(req, res, next) {
  const application = applications.find(
    app => app.id === req.params.id
  );

  if (!application) {
    return next(new ApiError(404, "Application not found"));
  }

  res.status(200).json({
    success: true,
    data: application
  });
}

// POST /api/applications
export function createApplication(req, res) {
  const application = {
    id: randomUUID(),
    company: req.body.company,
    role: req.body.role,
    status: req.body.status ?? "Applied",
    appliedOn: req.body.appliedOn ?? new Date().toISOString().slice(0, 10),
    priority: req.body.priority ?? "Medium"
  };

  applications.push(application);

  res.status(201).json({
    success: true,
    message: "Application created successfully",
    data: application
  });
}

// PATCH /api/applications/:id
export function updateApplication(req, res, next) {
  const application = applications.find(
    app => app.id === req.params.id
  );

  if (!application) {
    return next(new ApiError(404, "Application not found"));
  }

  const allowedFields = [
    "company",
    "role",
    "status",
    "appliedOn",
    "priority"
  ];

  for (const field of allowedFields) {
    if (Object.hasOwn(req.body, field)) {
      application[field] = req.body[field];
    }
  }

  res.status(200).json({
    success: true,
    message: "Application updated successfully",
    data: application
  });
}

// DELETE /api/applications/:id
export function deleteApplication(req, res, next) {
  const index = applications.findIndex(
    app => app.id === req.params.id
  );

  if (index === -1) {
    return next(new ApiError(404, "Application not found"));
  }

  applications.splice(index, 1);

  res.status(204).end();
}

// GET /api/slow
export function slowEndpoint(req, res) {
  setTimeout(() => {
    res.status(200).json({
      success: true,
      message: "Slow request completed after 3 seconds"
    });
  }, 3000);
}

// GET /api/block
export function blockEndpoint(req, res) {
  const start = Date.now();

  // Deliberately blocks the Node.js event loop.
  while (Date.now() - start < 3000) {
    // Busy loop for demonstration.
  }

  res.status(200).json({
    success: true,
    message: "Blocking request completed after 3 seconds"
  });
}