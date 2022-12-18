import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transport, RmqOptions, RmqContext } from "@nestjs/microservices";

@Injectable()
export class RMQService {

    constructor(private configService: ConfigService){}

    getOptions(queue: string, noAck = false) : RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
              urls: [this.configService.get<string>('RABBIT_MQ_URI')],
              queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
              noAck,
              queueOptions: {
                durable: true
              },
              persistent: true,
            },
        }
    }
  
    ack(context: RmqContext) {
      const channel = context.getChannelRef()
      const originalMessage = context.getMessage()
      channel.ack(originalMessage)
    }
}