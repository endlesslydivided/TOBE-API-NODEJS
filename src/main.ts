import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./pipes/validation.pipe";
import { Role } from "./roles/roles.model";


async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:  true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  const config = new DocumentBuilder()
    .setTitle("ToBe API")
    .setDescription(`
      Documentation for the ToBe social web application API.`)
    .setVersion(`1.0.1`)
    .setContact("Alexander Kovalyov",
      "https://github.com/endlesslydivided",
      "sashakovalev2002@hotmail.com")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("/api/docs", app, document);

  app.useGlobalPipes(new ValidationPipe());
  await Role.create({ name: "USER" , description: 'Basic user role' });
  await Role.create({ name: "ADMIN", description: 'Admin role' });

  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

start();