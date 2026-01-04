import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { IAuthService } from 'src/interface/authService.interface';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AuthService',
          useValue: {
            validateUser: jest.fn(),
            generateToken: jest.fn(),
            validateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<IAuthService>('AuthService');
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('authoriseUser()', () => {
    it('should authorize user and return user with authorization', async () => {
      const user = getMockUser();
      const authorization = 'rwf wnfonwenfnweo';
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(authService, 'generateToken').mockReturnValue(authorization);

      const actual = await authController.authoriseUser(user);
      expect(actual).toEqual({ ...user, authorization });
    });
  });

  describe('validateToken()', () => {
    it('should authorize user and return user with authorization', () => {
      const user = getMockUser();
      const authorization = 'rwf wnfonwenfnweo';
      const validateTokenFn = jest
        .spyOn(authService, 'validateToken')
        .mockReturnValue(user);

      const actual = authController.validateToken(authorization);
      expect(actual).toEqual(user);
      expect(validateTokenFn).toHaveBeenCalledWith('wnfonwenfnweo');
    });
  });
});
