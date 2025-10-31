La implementación de la auditoria en el archivo index.ts debe de ajustarse la importacion y el catch. 
Además el paquete que debe ser instalado debe tener la versión "@wallytech/sdk-audit": "^1.1.4".

import { Audit, AuditTracker } from '@wallytech/sdk-audit';

catch (error: any) {
    Logger.getInstance().error('Error in handler:', { raw: error, error: { error }, extra: {} });
    await auditTracker.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }

El archivo infra/Audit.ts debe ser eliminado

Los paquetes del package.json deben ser ajustados en la seccion "dependencies"

"dependencies": {
  "aws-sdk": "^2.1490.0",
  "aws-lambda": "^1.0.7",
  "@aws-lambda-powertools/logger": "^2.27.0",
  "@aws-lambda-powertools/tracer": "^2.27.0",
  "@wallytech/sdk-audit": "^1.1.4",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1",
  "reflect-metadata": "^0.2.2",
  "aws-xray-sdk": "^3.5.0",
  "@aws-sdk/client-dynamodb": "^3.894.0",
  "@aws-sdk/lib-dynamodb": "^3.894.0"
},

Se debe incluir un archivo tsconfig.test.json. En este path podrás encontrar un ejemplo 

C:\Users\JARVIS\Desktop\Wally\WA0002-Wallet-Recharge\ms-recharge-confirmation\tsconfig.test.json

También necesito que añadas un archivo para peticiones http. Te dejo un ejemplo acá 

C:\Users\JARVIS\Desktop\Wally\WA0002-Wallet-Tokenization\ms-digitalize-card\src\infra\HttpClient.ts

Ese archivo usa axios, demodo qué, necesito que incluyas axios en los paquetes así cómo su set de tipos.

También necesito que agregues un archivo para manipular las fechas acá te dejo un ejemplo

C:\Users\JARVIS\Desktop\Wally\WA0002-Wallet-Tokenization\ms-digitalize-card\src\infra\Date.ts

Este archivo usa luxon por ende y del mismo modo que se hace con axios necesito que agreges este paquete y sus tipos al package.json

En el controller en deberás agregar un metodo "validateRequest" para encapsular toda la validación del evento que se recibe, además deberás reemplazar el código que hace lo mismo en el metodo handler:

  private async validateRequest(event: APIGatewayProxyEvent) {
    const body = JSON.parse(event.body ?? '{}');
    const params = event.pathParameters ?? {};

    const request = plainToInstance(InputDigitize, { ...body, ...params }) as unknown as InputDigitize;

    const validationErrors = await validate(request);

    if (validationErrors.length > 0) {

      const extractedErrors = extractValidationErrors(validationErrors);
      const errorMessages = flattenErrorMessages(extractedErrors);

      Logger.getInstance().error('Mensajes de error:', JSON.stringify(errorMessages));

      const errorResponse = new InvalidDataException(errorMessages)

      this.auditService.error(errorResponse);

      return errorResponse.toResponse();

    }
  }

El metodo handler debería ser similar a este: 

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    try {
      Logger.getInstance().info('Inicio de proceso de validación de datos', JSON.stringify(event));

      const request = await this.validateRequest(event);

      if (request instanceof InvalidDataException) {
        return request.toResponse();
      }

      const command = new DigitizeCommand(request.data)
      const result = await this.getCustomerHandler.handle(command);

      if (!result) {
        return new NotFoundException().toResponse();
      }

      return new SuccessResponse(result).toResponse();
    } catch (error) {

      if (error instanceof BaseException) {

        this.auditService.error(error);

        return error.toResponse();
      }

      this.auditService.error(new SystemException(ERROR_MESSAGES.INTERNAL_ERROR));

      return new SystemException(ERROR_MESSAGES.INTERNAL_ERROR).toResponse();
    }


  }

Además en la clase SuccessResponse deberás hacer una modificación en el constructor.

  constructor(
    public readonly data: any = {},
    public readonly name: string = 'SuccessResponse',
    public readonly title: string = 'Success',
    public readonly message: string = SUCCESS_MESSAGES.OK,
    public readonly code: string = SUCCESS_CODES.OK,
    public readonly statusCode: number = HTTP_STATUS_CODES.OK,
  ) { }


Necesito también que renombres las constantes de auditoría a AuditConstants (actualmente se llama audit.constants.ts)

Además necesito que elimines del adapter/service el archivo de AwsSecret, si quieres renombralo como ExampleService y haz una clase vacía. 

Agrega este archivo al caso de uso de aws hexagonal 
C:\Users\JARVIS\Desktop\Wally\WA0002-Wallet-Tokenization\ms-digitalize-card\src\infra\AwsSecretManager.ts