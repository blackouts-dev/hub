import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join as joinPaths } from 'path';
import { PresenceModule } from './presence/presence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: joinPaths(__dirname, '..', 'hub.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URI'),
        synchronize: configService.get('DATABASE_SYNCHRONIZE', process.env.NODE_ENV === 'development'),
        logging: configService.get('TYPEORM_LOGGING', process.env.NODE_ENV === 'development'),
        entities: [joinPaths(__dirname, '**', '*.entity{.ts,.js}')],
      }),
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      exports: [],
      useFactory: async (configService: ConfigService): Promise<RabbitMQConfig> => ({
        exchanges: [
          {
            name: 'presence',
            type: 'topic',
          },
        ],
        uri: configService.get('RABBITMQ_URI'),
        connectionInitOptions: { wait: false },
      }),
    }),

    PresenceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
