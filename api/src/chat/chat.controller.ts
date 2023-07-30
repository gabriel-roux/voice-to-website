import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(
    @Body('message') message: string,
  ): Promise<{ response: string }> {
    if (message.toLowerCase().includes('começar')) {
      const gptResponse = await this.chatService.createWebsite();

      return { response: gptResponse };
    }

    const gptResponse = await this.chatService.sendMessageToGPT(message);

    return { response: gptResponse };
  }
}
