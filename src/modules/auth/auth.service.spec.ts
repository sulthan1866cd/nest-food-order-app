import { JwtService } from '@nestjs/jwt';
import { IAuthService } from 'src/interface/authService.interface';
import { UsersService } from '../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: IAuthService;
  let jwtService: JwtService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'AuthService', useClass: AuthService },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
        {
          provide: UsersService,
          useValue: { findOne: jest.fn(), findOneByEmail: jest.fn() },
        },
      ],
    }).compile();
    authService = module.get<IAuthService>('AuthService');
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('generateToken()', () => {
    it('should return jwt token', () => {
      const token = 'sdk    ifjoie  ifjfw ';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const actual = authService.generateToken(getMockUser());
      expect(actual).toEqual(token);
    });
  });

  describe('validateToken()', () => {
    it('should validate and return user', () => {
      const user = getMockUser();
      const token = 'sdk    ifjoie  ifjfw ';
      jest.spyOn(jwtService, 'verify').mockReturnValue(user);

      const actual = authService.validateToken(token);
      expect(actual).toEqual(user);
    });

    it('should throw error if token is invalid', () => {
      const token = 'sdk    ifjoie  ifjfw ';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      expect(() => authService.validateToken(token)).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser()', () => {
    it('should validate and return user', async () => {
      const user = getMockUser();
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      const actual = await authService.validateUser(
        user.username,
        user.email,
        user.password,
      );
      expect(actual).toEqual(user);
    });

    it('should throw exception if user dosent exist', async () => {
      const user = getMockUser();
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        authService.validateUser(user.username, user.email, user.password),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw exception if invalid password', async () => {
      const user = getMockUser();
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);

      await expect(
        authService.validateUser(
          user.username,
          user.email,
          user.password + 'fsfrf',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
