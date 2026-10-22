import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Unauthorized - missing credentials");
    }

    const userRole = (user.role || "").toLowerCase();
    const userRoles = Array.isArray(user.roles)
      ? user.roles.map((r: string) => (r || "").toLowerCase())
      : [userRole];

    const hasRole = requiredRoles.some((required) =>
      userRoles.includes(required.toLowerCase())
    );

    if (!hasRole) {
      throw new ForbiddenException("Forbidden - insufficient permissions");
    }

    return true;
  }
}
