#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { ArchitectureGenerator } from './generators/ArchitectureGenerator';
import { LayeredArchitectureGenerator } from './generators/LayeredArchitectureGenerator';
import { CleanArchitectureGenerator } from './generators/CleanArchitectureGenerator';
import { HexagonalArchitectureGenerator } from './generators/HexagonalArchitectureGenerator';
import { AWSHexagonalArchitectureGenerator } from './generators/AWSHexagonalArchitectureGenerator';
import { HybridWallyArchitectureGenerator } from './generators/HybridWallyArchitectureGenerator';

const program = new Command();

program
  .name('cli-builder')
  .description('CLI para generar skeletons de proyectos con diferentes arquitecturas')
  .version('1.0.0');

program
  .command('create')
  .description('Crear un nuevo proyecto con una arquitectura específica')
  .action(async () => {
    try {
      console.log(chalk.blue.bold('\nGenerador de Arquitecturas CLI\n'));
      
      // Preguntar por la arquitectura
      const { architecture } = await inquirer.prompt([
        {
          type: 'list',
          name: 'architecture',
          message: '¿Qué arquitectura quieres usar?',
          choices: [
            { name: 'Layered Architecture (Arquitectura en Capas)', value: 'layered' },
            { name: 'Clean Architecture', value: 'clean' },
            { name: 'Hexagonal Architecture', value: 'hexagonal' },
            { name: 'AWS Hexagonal Architecture', value: 'aws-hexagonal' },
            { name: 'Hybrid Wally Architecture', value: 'hybrid-wally' }
          ]
        }
      ]);

      // Preguntar por el nombre del proyecto
      const { projectName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '¿Cuál es el nombre de tu proyecto?',
          validate: (input: string) => {
            if (!input.trim()) {
              return 'El nombre del proyecto no puede estar vacío';
            }
            if (!/^[a-zA-Z0-9-_]+$/.test(input.trim())) {
              return 'El nombre solo puede contener letras, números, guiones y guiones bajos';
            }
            return true;
          }
        }
      ]);

      // Preguntar si desea especificar un path personalizado
      const { useCustomPath } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useCustomPath',
          message: '¿Desea especificar un path personalizado para crear el proyecto?',
          default: false
        }
      ]);

      // Si se selecciona path personalizado, preguntar por la ruta
      let customPath = '';
      if (useCustomPath) {
        const { projectPath } = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectPath',
            message: 'Ingrese la ruta completa donde desea crear el proyecto:',
            validate: (input: string) => {
              if (!input.trim()) {
                return 'La ruta no puede estar vacía';
              }
              return true;
            }
          }
        ]);
        customPath = projectPath.trim();
      }

      // Preguntar por el logger de powertools
      const { usePowertoolsLogger } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'usePowertoolsLogger',
          message: '¿Desea agregar el logger de powertools?',
          default: true
        }
      ]);

      // Preguntar por la auditoria de Wally
      const { useWallyAudit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useWallyAudit',
          message: '¿Desea agregar la auditoria de Wally?',
          default: true
        }
      ]);

      // Seleccionar el generador apropiado
      let generator: ArchitectureGenerator;
      
      switch (architecture) {
        case 'layered':
          generator = new LayeredArchitectureGenerator();
          break;
        case 'clean':
          generator = new CleanArchitectureGenerator();
          break;
        case 'hexagonal':
          generator = new HexagonalArchitectureGenerator();
          break;
        case 'aws-hexagonal':
          generator = new AWSHexagonalArchitectureGenerator();
          break;
        case 'hybrid-wally':
          generator = new HybridWallyArchitectureGenerator();
          break;
        default:
          throw new Error('Arquitectura no soportada');
      }

      console.log(chalk.yellow(`\nGenerando proyecto..."${projectName}" con ${architecture}...\n`));
      
      await generator.generate(projectName, { usePowertoolsLogger, useWallyAudit, customPath });
      
      const projectLocation = customPath ? `${customPath}/${projectName}` : `./${projectName}`;
      
      console.log(chalk.green.bold('\n¡Proyecto generado exitosamente!\n'));
      console.log(chalk.cyan(`Ubicación: ${projectLocation}`));
      console.log(chalk.cyan(`Para empezar: cd ${projectLocation} && npm install`));
      
    } catch (error) {
      console.error(chalk.red.bold('\nError:'), error);
      process.exit(1);
    }
  });

program.parse();
