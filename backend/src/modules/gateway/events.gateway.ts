import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { AiService } from "../ai/ai.service";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
})
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    @Inject(forwardRef(() => AiService))
    private readonly aiService: AiService
  ) {}

  async handleConnection(client: Socket) {
    try {
      
      const token =
        client.handshake.auth?.token ||
        client.handshake.query?.token ||
        (client.handshake.headers?.authorization
          ? client.handshake.headers.authorization.replace("Bearer ", "")
          : null);

      if (token) {
        const secret = process.env.JWT_SECRET || "supersecretkey";
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded.userId || decoded.id || decoded._id;

        if (userId) {
          client.data.userId = userId.toString();
          const userRoom = `user_${userId}`;
          await client.join(userRoom);
          this.logger.log(`Socket client ${client.id} authenticated as User ${userId} and joined room ${userRoom}`);
          client.emit("auth:status", { authenticated: true, userId });
          return;
        }
      }

      this.logger.log(`Socket client ${client.id} connected unauthenticated`);
      client.emit("auth:status", { authenticated: false, message: "No valid JWT token provided" });
    } catch (err: any) {
      this.logger.warn(`Socket authentication error for ${client.id}: ${err.message}`);
      client.emit("auth:status", { authenticated: false, error: err.message });
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket client ${client.id} disconnected`);
  }

  @SubscribeMessage("interview:send-answer")
  async handleInterviewAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; question?: string; answer: string; jobTitle?: string; sessionType?: string }
  ) {
    const { sessionId, question, answer, jobTitle, sessionType } = data || {};

    if (!sessionId || !answer) {
      client.emit("interview:error", { message: "sessionId and answer are required" });
      return;
    }

    this.logger.log(`Received interview answer for session ${sessionId} from client ${client.id}`);

    try {
      
      client.emit("interview:stream-start", { sessionId });

      let fullResponse = "";

      await this.aiService.streamInterviewFeedback(
        question || "General interview question",
        answer,
        jobTitle || "Software Engineer",
        sessionType || "technical",
        (chunkText: string) => {
          fullResponse += chunkText;
          client.emit("interview:stream-chunk", {
            sessionId,
            chunk: chunkText,
            partialText: fullResponse,
          });
        }
      );

      client.emit("interview:stream-end", {
        sessionId,
        fullResponse,
      });

      this.logger.log(`Finished streaming interview response for session ${sessionId}`);
    } catch (err: any) {
      this.logger.error(`Error in handleInterviewAnswer: ${err.message}`);
      client.emit("interview:error", {
        sessionId,
        message: err.message || "Failed to generate AI interview response stream",
      });
    }
  }

  sendNotificationToUser(userId: string, event: string, payload: any) {
    if (!this.server) return;
    const room = `user_${userId}`;
    this.logger.log(`Emitting event '${event}' to room ${room}`);
    this.server.to(room).emit(event, payload);
  }

  sendCvAnalysisComplete(userId: string, analysisData: any) {
    this.sendNotificationToUser(userId, "notification:cv-analysis-complete", {
      type: "CV_ANALYSIS_COMPLETE",
      title: "CV Analysis Complete!",
      message: `Your CV analysis is finished with an overall score of ${analysisData.overallScore ?? 'N/A'}/100.`,
      data: analysisData,
      timestamp: new Date().toISOString(),
    });
  }
}
