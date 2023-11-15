import { DynamicModule, Logger, LoggerService, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmqpChannelConfigurationInterface, AmqpOptionsInterface, AmqpService } from 'amp-configuration';
import { DomainEventEnvelopeEntity } from './entity/domain-event-envelope.entity';
import { EventTailService } from './service/event-tail.service';
import { EventAmqpChannelConfig } from './service/event.amqp-channel-config';
import { AmqpServiceToken } from './constant/service-name';
import { HandledDomainEventEntity } from './entity/published-domain-event.entity';

@Module({
    providers: [
        {
            provide: AmqpServiceToken,
            useFactory: (config: AmqpChannelConfigurationInterface, logger: LoggerService): AmqpService => {
               const amqpOptions: AmqpOptionsInterface = { urls: [process.env.RMQ_TRANSPORT_URLS] };
              return new AmqpService(amqpOptions, [config], logger);
            },
            inject: [EventAmqpChannelConfig, Logger],
        },
        EventAmqpChannelConfig,
        Logger
    ],
    exports: [AmqpServiceToken],
})
export class DomainEventTypeOrmModule {
    static forRoot(): DynamicModule {
        return {
            global: true, 
            module: DomainEventTypeOrmModule,
            providers: [EventTailService],
            imports: [TypeOrmModule.forFeature([DomainEventEnvelopeEntity, HandledDomainEventEntity])]
        }
    }
}