import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: Record<string, any>, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<{ currentUser?: unknown }>();
    return request.currentUser;
  },
);
