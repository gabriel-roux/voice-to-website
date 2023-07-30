import { Injectable } from '@nestjs/common';
import { spawn, execSync } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class WebBuilderService {
  async createNewNextjsProject(projectName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = spawn(
        'npx',
        ['create-next-app', projectName.toLowerCase().replace(' ', '-')],
        {
          stdio: ['pipe', 'pipe', process.stderr],
          shell: true,
        },
      );

      const questions = [
        'Would you like to use TypeScript with this project?',
        'Would you like to use ESLint with this project?',
        'Would you like to use Tailwind CSS with this project?',
        'Would you like to use `src/` directory with this project?',
        'Would you like to use experimental `app/` directory with this project?',
        'What import alias would you like configured?',
      ];

      const answers = ['no', 'no', 'no', 'no', 'no', '@/*'];

      let currentQuestion = 0;

      command.stdout.on('data', (data) => {
        const output = data.toString();

        // Check if the process is asking a question
        if (
          questions[currentQuestion] &&
          output.includes(questions[currentQuestion])
        ) {
          command.stdin.write(`${answers[currentQuestion]}\n`);
          currentQuestion++;
        }

        // Log the process output
        console.log(output);
      });

      command.on('exit', (code) => {
        console.log(`Process exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  }

  async installLibraries(
    projectName: string,
    libraries: string[],
  ): Promise<void> {
    try {
      const librariesString = libraries.join(' ');
      execSync(
        `cd ${projectName
          .toLowerCase()
          .replace(' ', '-')} && npm install ${librariesString}`,
        {
          stdio: 'inherit',
        },
      );
    } catch (error) {
      console.error('Erro ao instalar as bibliotecas:', error);
    }
  }

  async createCSSFile(projectName: string, css: string): Promise<void> {
    const cssFilePath = join(
      projectName.toLowerCase().replace(' ', '-'),
      'src/styles/',
      'globals.css',
    );
    try {
      await writeFile(cssFilePath, css);
    } catch (error) {
      console.error('Erro ao criar o arquivo CSS:', error);
    }
  }

  async createComponentFile(
    projectName: string,
    componentName: string,
    componentCode: string,
  ): Promise<void> {
    const componentFilePath = join(
      projectName.toLowerCase().replace(' ', '-'),
      'src/components',
      `${componentName}.js`,
    );
    const componentsFolderPath = join(
      `${projectName.toLowerCase().replace(' ', '-')}/src`,
      'components',
    );
    try {
      // Criar o diretório components, se não existir
      await mkdir(componentsFolderPath, { recursive: true });

      await writeFile(componentFilePath, componentCode);
    } catch (error) {
      console.error('Erro ao criar o arquivo de componente:', error);
    }
  }

  async createPageFile(
    projectName: string,
    pageName: string,
    pageCode: string,
  ): Promise<void> {
    const pageFilePath = join(
      `${projectName.toLowerCase().replace(' ', '-')}/src`,
      'pages',
      `${pageName.toLowerCase()}.js`,
    );
    try {
      await writeFile(pageFilePath, pageCode);
    } catch (error) {
      console.error('Erro ao criar o arquivo de página:', error);
    }
  }
}
