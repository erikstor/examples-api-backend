"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("../shared/kafka/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.connectMicroservice(config_1.kafkaConfig);
    await app.startAllMicroservices();
    await app.listen(3002);
    console.log('Create User Service ejecutándose en puerto 3002');
    console.log('Microservicio Kafka configurado');
}
bootstrap();
//# sourceMappingURL=main.js.map