import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/formatResponse";

function badRequest(res: Response, message: string) {
  return res.status(400).json(formatResponse(null, message, "error"));
}

export const validateCreateJob = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title,
    company,
    location,
    description,
    employmentType,
    salaryRange,
    skills,
    postedAt,
  } = req.body as Record<string, any>;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return badRequest(res, "Job title is required");
  }

  if (!company || typeof company !== "string" || company.trim().length === 0) {
    return badRequest(res, "Company is required");
  }

  if (location !== undefined && typeof location !== "string") {
    return badRequest(res, "location must be a string");
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    return badRequest(res, "Description is required (min length 10)");
  }

  if (employmentType !== undefined) {
    const allowed = [
      "full-time",
      "part-time",
      "contract",
      "temporary",
      "internship",
      "remote",
    ];
    if (
      typeof employmentType !== "string" ||
      !allowed.includes(employmentType)
    ) {
      return badRequest(
        res,
        `employmentType must be one of: ${allowed.join(", ")}`,
      );
    }
  }

  if (salaryRange !== undefined) {
    const ok =
      typeof salaryRange === "object" &&
      (salaryRange.min === undefined || typeof salaryRange.min === "number") &&
      (salaryRange.max === undefined || typeof salaryRange.max === "number");
    if (!ok)
      return badRequest(
        res,
        "salaryRange must be an object with numeric min/max",
      );
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills) || skills.some((s) => typeof s !== "string")) {
      return badRequest(res, "skills must be an array of strings");
    }
  }

  if (postedAt !== undefined && isNaN(Date.parse(String(postedAt)))) {
    return badRequest(res, "postedAt must be a valid date");
  }

  req.body.title = title.trim();
  req.body.company = company.trim();
  if (typeof description === "string")
    req.body.description = description.trim();
  next();
};

export const validateUpdateJob = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const allowedFields = [
    "title",
    "company",
    "location",
    "description",
    "employmentType",
    "salaryRange",
    "skills",
    "isActive",
  ];

  const updates = req.body as Record<string, any>;
  for (const key of Object.keys(updates)) {
    if (!allowedFields.includes(key)) {
      return badRequest(res, `Invalid field in update: ${key}`);
    }
  }

  if (
    updates.title &&
    (typeof updates.title !== "string" || updates.title.trim().length === 0)
  ) {
    return badRequest(res, "title must be a non-empty string");
  }

  if (
    updates.description &&
    (typeof updates.description !== "string" ||
      updates.description.trim().length < 10)
  ) {
    return badRequest(res, "description must be at least 10 characters");
  }

  if (
    updates.skills &&
    (!Array.isArray(updates.skills) ||
      updates.skills.some((s: any) => typeof s !== "string"))
  ) {
    return badRequest(res, "skills must be an array of strings");
  }

  next();
};

export const validateSearchJobs = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    page = 1,
    limit = 10,
    query,
    location,
    employmentType,
  } = req.query as Record<string, any>;

  if (isNaN(Number(page)) || Number(page) < 1)
    return badRequest(res, "page must be a positive number");
  if (isNaN(Number(limit)) || Number(limit) < 1)
    return badRequest(res, "limit must be a positive number");

  if (employmentType !== undefined) {
    const allowed = [
      "full-time",
      "part-time",
      "contract",
      "temporary",
      "internship",
      "remote",
    ];
    if (
      typeof employmentType !== "string" ||
      !allowed.includes(employmentType)
    ) {
      return badRequest(
        res,
        `employmentType must be one of: ${allowed.join(", ")}`,
      );
    }
  }

  next();
};

export default {
  validateCreateJob,
  validateUpdateJob,
  validateSearchJobs,
};
