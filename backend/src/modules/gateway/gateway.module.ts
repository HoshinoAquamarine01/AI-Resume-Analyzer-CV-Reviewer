import { Module, forwardRef } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [forwardRef(() => AiModule)],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class GatewayModule {}
