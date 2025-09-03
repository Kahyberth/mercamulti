import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Handler, Context, APIGatewayEvent } from 'aws-lambda';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    await nestApp.init();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: any,
) => {
  const server = await bootstrap();
  return server(event, context, callback);
};