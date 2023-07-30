import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebBuilderService } from 'src/web-builder/web-builder.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ChatController],
  providers: [ChatService, WebBuilderService],
})
export class ChatModule {}
