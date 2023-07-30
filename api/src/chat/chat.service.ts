import { Injectable } from '@nestjs/common';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { WebBuilderService } from 'src/web-builder/web-builder.service';

@Injectable()
export class ChatService {
  private conversation: ChatCompletionRequestMessage[] = [];
  private openai: OpenAIApi;

  constructor(private webBuilderService: WebBuilderService) {
    // Substitua 'your-api-key' pela sua chave de API real
    const apiKey = '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';
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
  }

  async sendMessageToGPT(
    message: string,
    model = 'gpt-3.5-turbo',
  ): Promise<string> {
    try {
      // Verificar se a mensagem contém "criar" ou "crie"
      const isCreateMessage =
        message.toLowerCase().includes('criar') ||
        message.toLowerCase().includes('crie') ||
        message.toLowerCase().includes('criação') ||
        message.toLowerCase().includes('criar um site') ||
        message.toLowerCase().includes('criar um site em') ||
        message.toLowerCase().includes('criar um site em next.js') ||
        message.toLowerCase().includes('criar');

      // Adicionar a mensagem do usuário à conversa
      // Se a mensagem contém "criar" ou "crie", adicione a linguagem Next.js ao prompt
      const prompt = isCreateMessage
        ? `Imagine que você é um programador expert em Next JS e UI/UX com 30 anos de carreira e referência na área, e vai criar o código completo de um site em Next.js, quero que capture minhas sugestoes e que me pergunte o que gostaria de ter em meu site! Sempre que eu te der uma resposta sobre o que adicionar no site, só me responda com "O que você gostaria de adicionar a mais no seu site?", e quando eu falar "começar", você vai montar o codigo, para que eu possa implementar em meu projeto!`
        : `${message}`;

      this.conversation.push({ role: 'user', content: prompt });

      // Se o modelo for gpt-3.5-turbo, use createChatCompletion
      if (model === 'gpt-3.5-turbo') {
        const response = await this.openai.createChatCompletion({
          model,
          messages: this.conversation,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.5,
        });

        // console.log(response);

        const gptResponse = response.data.choices[0].message.content.trim();
        this.conversation.push({ role: 'assistant', content: gptResponse });
        return gptResponse;
      } else {
        // Caso contrário, use createCompletion para modelos GPT-3
        const response = await this.openai.createCompletion({
          model,
          prompt,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.5,
        });

        const gptResponse = response.data.choices[0].text.trim();
        this.conversation.push({ role: 'assistant', content: gptResponse });
        return gptResponse;
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async sendCreateWebsiteMessageToGPT(): Promise<string> {
    const prompt = `Agora, por favor, me forneça um JSON (obrigatoriamente) com instruções detalhadas e códigos para criar o site em Next.js, incluindo o nome do projeto, código CSS, componentes, separando por páginas e bibliotecas que devem ser instaladas. Lembre-se de considerar todas as informações que discutimos anteriormente.
    Além disso não se esqueça jamais de me trazer o código completo, eu estou criando um chatbot que com base na conversa do usuario com o chat ( que no caso é você), preciso que crie um site completo de acordo com a conversa, por isso preciso do código!!!
    Sua resposta deve estar no seguinte formato JSON:
    {
      "projectName": "nome_do_projeto",
      "css": "código CSS",
      "components": [
        // Array de componentes
      ],
      "pages": [
        // Array de páginas
      ],
      "libraries": [
        // Array de bibliotecas
      ]
    }`;

    this.conversation.push({ role: 'user', content: prompt });

    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: this.conversation,
      n: 1,
      stop: null,
      temperature: 0.2,
    });

    this.conversation.push({
      role: 'assistant',
      content: response.data.choices[0].message.content,
    });

    const secondPrompt =
      'Agora inclua o código das páginas, componentes, CSS no JSON';

    this.conversation.push({ role: 'user', content: secondPrompt });

    const secondResponse = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: this.conversation,
      n: 1,
      stop: null,
      temperature: 0.2,
    });

    this.conversation.push({
      role: 'assistant',
      content: secondResponse.data.choices[0].message.content,
    });

    console.log(secondResponse.data.choices[0].message.content);

    const thridPrompt = 'continue';

    this.conversation.push({ role: 'user', content: thridPrompt });

    const thirdResponse = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: this.conversation,
      n: 1,
      stop: null,
      temperature: 0.2,
    });

    const gptResponse = secondResponse.data.choices[0].message.content.trim();
    // Encontre o índice das chaves de abertura e fechamento do JSON na string de resposta
    const startIndex = gptResponse.indexOf('{');
    const endIndex = gptResponse.lastIndexOf('}') + 1;

    // Extraia a parte do JSON da resposta
    const jsonString = gptResponse.slice(startIndex, endIndex);

    this.conversation = [];
    return jsonString;
  }

  async createWebsite(): Promise<string> {
    const gptResponse = await this.sendCreateWebsiteMessageToGPT();

    console.log(gptResponse);

    const parsedData = JSON.parse(gptResponse);
    console.log('========================================');
    console.log(parsedData);
    const { projectName, css, components, pages, libraries } = parsedData;

    // Crie um novo projeto Next.js
    await this.webBuilderService.createNewNextjsProject(projectName);

    // Instale as bibliotecas
    await this.webBuilderService.installLibraries(projectName, libraries);

    // Crie o arquivo CSS
    await this.webBuilderService.createCSSFile(projectName, css);

    // Crie os componentes
    for (const component of components) {
      await this.webBuilderService.createComponentFile(
        projectName,
        component.name,
        component.code,
      );
    }

    for (const page of pages) {
      await this.webBuilderService.createPageFile(
        projectName,
        page.name,
        page.code,
      );
    }
    return `Projeto finalizado com sucesso! Você pode encontrar o projeto na pasta: ${process.cwd()}/${projectName}`;
  }
}
