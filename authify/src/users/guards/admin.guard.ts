import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    console.log(request.currentUser);
    if (!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;
  }
}
