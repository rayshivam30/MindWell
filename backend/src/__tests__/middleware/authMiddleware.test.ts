import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, requireUserType } from '../middleware/authMiddleware';
import { redisUtils } from '../config/redis';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../config/redis');

const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockRedisUtils = redisUtils as jest.Mocked<typeof redisUtils>;

describe('authMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header', async () => {
    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', async () => {
    mockRequest.headers = { authorization: 'Basic token123' };

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    mockRequest.headers = { authorization: 'Bearer invalid-token' };
    mockJwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('Invalid token');
    });

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if session does not exist in Redis', async () => {
    const mockDecoded = {
      userId: 'user123',
      email: 'test@example.com',
      userType: 'patient',
    };

    mockRequest.headers = { authorization: 'Bearer valid-token' };
    mockJwt.verify.mockReturnValue(mockDecoded);
    mockRedisUtils.getSession.mockResolvedValue(null);

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Session expired' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() and set user info if token and session are valid', async () => {
    const mockDecoded = {
      userId: 'user123',
      email: 'test@example.com',
      userType: 'patient',
    };

    const mockSession = {
      userId: 'user123',
      email: 'test@example.com',
      userType: 'patient',
    };

    mockRequest.headers = { authorization: 'Bearer valid-token' };
    mockJwt.verify.mockReturnValue(mockDecoded);
    mockRedisUtils.getSession.mockResolvedValue(mockSession);

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect((mockRequest as any).user).toEqual({
      userId: 'user123',
      email: 'test@example.com',
      userType: 'patient',
      isGuest: false,
    });
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should handle guest sessions', async () => {
    const mockDecoded = {
      userId: 'guest_123',
      email: 'guest@example.com',
      userType: 'patient',
    };

    const mockSession = {
      userId: 'guest_123',
      email: 'guest@example.com',
      userType: 'patient',
      isGuest: true,
    };

    mockRequest.headers = { authorization: 'Bearer guest-token' };
    mockJwt.verify.mockReturnValue(mockDecoded);
    mockRedisUtils.getSession.mockResolvedValue(mockSession);

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect((mockRequest as any).user).toEqual({
      userId: 'guest_123',
      email: 'guest@example.com',
      userType: 'patient',
      isGuest: true,
    });
    expect(mockNext).toHaveBeenCalled();
  });
});

describe('requireUserType', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next() if user type is allowed', () => {
    (mockRequest as any).user = { userType: 'patient' };
    const middleware = requireUserType(['patient', 'therapist']);

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 403 if user type is not allowed', () => {
    (mockRequest as any).user = { userType: 'patient' };
    const middleware = requireUserType(['therapist']);

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Access denied. Insufficient permissions.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should allow multiple user types', () => {
    (mockRequest as any).user = { userType: 'therapist' };
    const middleware = requireUserType(['patient', 'therapist']);

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});