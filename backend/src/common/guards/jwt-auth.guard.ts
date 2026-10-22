import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import mongoose from "mongoose";
import { verifyJwt } from "../../config/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const authHeader = request.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    
    if (!token && request.cookies) {
      token = request.cookies["token"] || request.cookies["refreshToken"];
    }

    if (!token) {
      if (request.url && request.url.includes("/templates")) {
        return true;
      }
      throw new UnauthorizedException("Access token required");
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const userId = decoded.sub || decoded.userId || decoded.id || decoded._id;
    let userRole = decoded.role || (Array.isArray(decoded.roles) ? decoded.roles[0] : undefined);
    let userEmail = decoded.email || "";

    const userModel =
      mongoose.models?.User ||
      mongoose.connections?.find((c) => c.models?.User)?.models?.User;

    if (!userRole && userId && userModel) {
      try {
        const dbUser = await userModel.findById(userId).select("role email isActive").lean();
        if (dbUser) {
          userRole = (dbUser as any).role || "user";
          if (!userEmail) userEmail = (dbUser as any).email || "";
        }
      } catch {
       
      }
    }

    request.user = {
      _id: userId,
      id: userId,
      userId: userId,
      email: userEmail,
      role: userRole || "user",
      roles: userRole ? [userRole] : ["user"],
    };

    return true;
  }
}
