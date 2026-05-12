import { Request, Response, NextFunction } from "express";
import {
	validateChangePassword,
	validateForgotPassword,
	validateLogin,
	validateRegister,
	validateResetPassword,
} from "../validators/auth.validator";

export const validationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	switch (req.path) {
		case "/register":
			return validateRegister(req, res, next);
		case "/login":
			return validateLogin(req, res, next);
		case "/forgot-password":
			return validateForgotPassword(req, res, next);
		case "/reset-password":
			return validateResetPassword(req, res, next);
		case "/change-password":
			return validateChangePassword(req, res, next);
		default:
			return next();
	}
};

export default { validationMiddleware };
