import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { verifyJwt } from "../../config/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const authHeader = request.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
    
    if (!token && request.cookies) {
      token = request.cookies["token"] || request.cookies["refreshToken"];
    }

    if (!token) {
      throw new UnauthorizedException("Access token required");
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    if (decoded && decoded.sub) {
      request.user = {
        _id: decoded.sub,
        id: decoded.sub,
        email: decoded.email || "",
        role: Array.isArray(decoded.roles)
          ? decoded.roles[0]
          : (decoded as any).role || undefined,
      };
    } else {
      request.user = decoded;
      if (request.user && (request.user as any).userId && !(request.user as any)._id) {
        (request.user as any)._id = (request.user as any).userId;
      }
    }

    return true;
  }
}
