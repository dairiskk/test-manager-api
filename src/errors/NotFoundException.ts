import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor() {
    super({}, HttpStatus.NOT_FOUND);
  }
}
