import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class QuoteGateway {
  @WebSocketServer() server: Server;

  broadcastQuote(quote: { symbol: string; source: string; price: number }) {
    this.server.emit("quote", quote);
  }
}
