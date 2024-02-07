import { CreateUserDto } from './CreateUser';

export class ListUsersResponse {
  constructor(data: CreateUserDto[], count: number) {
    Object.assign(this, {
      data: data.map((user) => new CreateUserDto(user)),
      count,
    });
  }
}

export class UserResponse extends CreateUserDto {
  constructor(data: CreateUserDto) {
    super(data);
  }
}
