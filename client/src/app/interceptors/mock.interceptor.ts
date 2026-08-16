import { HttpInterceptorFn } from '@angular/common/http';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`API Call Mocked: ${req.method} ${req.url}`);
  return next(req);
};
