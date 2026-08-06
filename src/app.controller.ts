import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // 서버가 살아있는지 확인용. GET /health
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
