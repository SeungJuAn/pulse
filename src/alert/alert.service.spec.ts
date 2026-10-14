import { MikroORM } from "@mikro-orm/better-sqlite";
import { AlertService } from "./alert.service";

describe("AlertService", () => {
  let service: AlertService;
  let orm: MikroORM;
  const mockNotifier = { channel: "email", send: jest.fn() };
});
