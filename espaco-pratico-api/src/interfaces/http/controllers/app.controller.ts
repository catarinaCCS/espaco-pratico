import { Controller, Get } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('health')
export class AppController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  getHealth() {
    const state = this.connection.readyState;
    let status: string;
    if (state === 1) {
      status = 'connected';
    } else if (state === 2) {
      status = 'connecting';
    } else if (state === 0) {
      status = 'disconnected';
    } else {
      status = 'disconnecting';
    }

    return { mongo: status };
  }
}
