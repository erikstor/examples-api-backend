import { mkdir, writeFile } from 'fs/promises';
import { join, dirname, resolve } from 'path';

export interface GeneratorOptions {
  usePowertoolsLogger: boolean;
  useWallyAudit: boolean;
  customPath?: string;
}

export abstract class ArchitectureGenerator {
  protected projectName: string = '';
  protected projectPath: string = '';
  protected options: GeneratorOptions = {
    usePowertoolsLogger: false,
    useWallyAudit: false
  };

  async generate(projectName: string, options?: GeneratorOptions): Promise<void> {
    this.projectName = projectName;
    this.options = options || this.options;
    
    // Determinar la ruta del proyecto
    if (this.options.customPath) {
      // Convertir path de Git Bash a Windows si es necesario
      const normalizedPath = this.normalizePath(this.options.customPath);
      this.projectPath = resolve(normalizedPath, projectName);
    } else {
      this.projectPath = resolve(projectName);
    }
    
    // Crear directorio del proyecto
    await mkdir(this.projectPath, { recursive: true });
    
    // Generar estructura específica de la arquitectura
    await this.generateArchitecture();
    
    // Generar archivos comunes
    await this.generateCommonFiles();
  }

  protected abstract generateArchitecture(): Promise<void>;

  protected async generateCommonFiles(): Promise<void> {
    // package.json
    await this.createFile('package.json', this.getPackageJson());
    
    // tsconfig.json
    await this.createFile('tsconfig.json', this.getTsConfig());
    
    // .gitignore
    await this.createFile('.gitignore', this.getGitIgnore());
    
    // README.md
    await this.createFile('README.md', this.getReadme());
    
    // webpack.config.js
    await this.createFile('webpack.config.js', this.getWebpackConfig());

    // Logger class si está habilitado
    if (this.options.usePowertoolsLogger) {
      await this.createFile('src/utils/Logger.ts', this.getLoggerClass());
    }

    // Audit constants si está habilitado - se maneja en cada generador específico
  }

  protected async createFile(filePath: string, content: string): Promise<void> {
    const fullPath = join(this.projectPath, filePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content, 'utf8');
  }

  protected async createDirectory(dirPath: string): Promise<void> {
    const fullPath = join(this.projectPath, dirPath);
    await mkdir(fullPath, { recursive: true });
  }

  protected getPackageJson(): string {
    const dependencies: string[] = [
      '"aws-sdk": "^2.1490.0"',
      '"aws-lambda": "^1.0.7"'
    ];

    if (this.options.usePowertoolsLogger) {
      dependencies.push('"@aws-lambda-powertools/logger": "^1.15.0"');
      dependencies.push('"@aws-lambda-powertools/tracer": "^1.15.0"');
    }

    if (this.options.useWallyAudit) {
      dependencies.push('"@wallytech/sdk-audit": "^1.0.0"');
    }

    return `{
  "name": "${this.projectName}",
  "version": "1.0.0",
  "description": "Lambda generado con CLI Builder",
  "main": "dist/index.js",
  "scripts": {
    "build": "webpack --mode production",
    "build:tsc": "tsc",
    "dev": "ts-node src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "package": "npm run build && zip -r ${this.projectName}.zip dist/"
  },
  "dependencies": {
    ${dependencies.join(',\n    ')}
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/aws-lambda": "^8.10.130",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "ts-loader": "^9.5.1",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.5"
  }
}`;
  }

  protected getTsConfig(): string {
    return `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}`;
  }

  protected getGitIgnore(): string {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Coverage
coverage/
.nyc_output

# Temporary files
*.tmp
*.temp
`;
  }

  protected getReadme(): string {
    return `# ${this.projectName}

Proyecto generado con CLI Builder Architecture Generator.

## Instalación

\`\`\`bash
npm install
\`\`\`

## Desarrollo

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Ejecutar

\`\`\`bash
npm start
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`

## Package for Lambda

\`\`\`bash
npm run package
\`\`\`
`;
  }

  protected getWebpackConfig(): string {
    return `const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  externals: {
    'aws-sdk': 'aws-sdk',
  },
  optimization: {
    minimize: true,
  },
};
`;
  }

  protected getLoggerClass(): string {
    return `import { Logger as LoggerPower } from '@aws-lambda-powertools/logger';
import { Context } from "aws-lambda";

class Logger {
  private static instance: LoggerPower;

  public static getInstance(): LoggerPower {
    return Logger.instance;
  }
  
  public static setInstance(context: Context) {
    Logger.instance = new LoggerPower({ serviceName: context.functionName });
    Logger.getInstance().addContext(context);
  }
}

export default Logger;
`;
  }

  protected getAuditConstants(): string {
    return `export const AUDIT_OVERRIDES = {
  location: 'lambda'
};
`;
  }

  /**
   * Normaliza paths de Git Bash a Windows
   * Convierte /c/Users/... a C:\Users\...
   */
  private normalizePath(inputPath: string): string {
    // Verificar si el path es de Git Bash (formato /letra/)
    const gitBashPathRegex = /^\/([a-zA-Z])\//;
    const match = inputPath.match(gitBashPathRegex);
    
    if (match) {
      const driveLetter = match[1].toUpperCase();
      // Convertir /c/Users/... a C:\Users\...
      return inputPath.replace(`/${match[1]}/`, `${driveLetter}:\\`).replace(/\//g, '\\');
    }
    
    // Si no coincide con ningún patrón, devolver el path original
    return inputPath;
  }
}
