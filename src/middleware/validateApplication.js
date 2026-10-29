import ApiError from "../errors/ApiError.js";

const allowedFields = [
  "company",
  "role",
  "status",
  "appliedOn",
  "priority"
];

const allowedStatuses = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected"
];

const allowedPriorities = [
  "Low",
  "Medium",
  "High"
];

export default function validateApplication(req, res, next) {
  try {
    const body = req.body;

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      throw new ApiError(400, "Validation failed", {
        body: "Request body must be a JSON object"
      });
    }

    const errors = {};
    const isPatch = req.method === "PATCH";

    // Reject unknown fields.
    for (const field of Object.keys(body)) {
      if (!allowedFields.includes(field)) {
        errors[field] = "Unknown field";
      }
    }

    // PATCH must update at least one recognised field.
    const suppliedFields = Object.keys(body).filter(
      field => allowedFields.includes(field)
    );

    if (isPatch && suppliedFields.length === 0) {
      errors.body = "Provide at least one valid field to update";
    }

    // Required fields for POST.
    if (!isPatch) {
      for (const field of ["company", "role"]) {
        if (
          typeof body[field] !== "string" ||
          body[field].trim().length === 0
        ) {
          errors[field] = `${field} is required`;
        } else if (
          body[field].trim().length < 2 ||
          body[field].trim().length > 60
        ) {
          errors[field] =
            `${field} must contain between 2 and 60 characters`;
        }
      }
    } else {
      // Validate company and role only if supplied in PATCH.
      for (const field of ["company", "role"]) {
        if (field in body) {
          if (
            typeof body[field] !== "string" ||
            body[field].trim().length < 2 ||
            body[field].trim().length > 60
          ) {
            errors[field] =
              `${field} must contain between 2 and 60 characters`;
          }
        }
      }
    }

    // Validate status when supplied.
    if ("status" in body) {
      if (!allowedStatuses.includes(body.status)) {
        errors.status =
          `Status must be one of: ${allowedStatuses.join(", ")}`;
      }
    }

    // Validate priority when supplied.
    if ("priority" in body) {
      if (!allowedPriorities.includes(body.priority)) {
        errors.priority =
          `Priority must be one of: ${allowedPriorities.join(", ")}`;
      }
    }

    // Validate appliedOn when supplied.
    if ("appliedOn" in body) {
      const value = body.appliedOn;

      if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
      ) {
        errors.appliedOn = "appliedOn must use YYYY-MM-DD format";
      } else {
        const date = new Date(`${value}T00:00:00Z`);
        const today = new Date();

        today.setUTCHours(0, 0, 0, 0);

        if (
          Number.isNaN(date.getTime()) ||
          date.toISOString().slice(0, 10) !== value
        ) {
          errors.appliedOn = "appliedOn must be a valid date";
        } else if (date > today) {
          errors.appliedOn = "appliedOn cannot be in the future";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, "Validation failed", errors);
    }

    // Remove leading/trailing whitespace from text fields.
    for (const field of ["company", "role"]) {
      if (typeof body[field] === "string") {
        body[field] = body[field].trim();
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}