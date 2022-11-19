import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Role } from "./roles/roles.model";
import { HttpExceptionFilter } from "./filters/httpException.filter";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from 'multer';
import { ValidationPipe } from "@nestjs/common";

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
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

  app.useGlobalPipes(new ValidationPipe({transform:true}));
  await Role.findOrCreate({where: {name:"USER"}, defaults:{ name: "USER" , description: 'Basic user role' }});
  await Role.findOrCreate({where: {name:"ADMIN"}, defaults:{ name: "ADMIN" , description: 'Admin role' }});

  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });


}

start();