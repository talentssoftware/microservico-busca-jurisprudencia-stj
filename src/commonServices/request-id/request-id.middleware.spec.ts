import { RequestIdMiddleware } from './request-id.middleware';

describe('RequestIdMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestIdMiddleware()).toBeDefined();
  });
  // test if the middleware is setting the request id header
  it('should set the request id header', () => {
    const middleware = new RequestIdMiddleware();
    const req = {};
    const res = {
      setHeader: jest.fn(),
    };
    const next = jest.fn();
    middleware.use(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith(
      'x-request-id',
      expect.any(String),
    );
    expect(next).toHaveBeenCalled();
  });
});
