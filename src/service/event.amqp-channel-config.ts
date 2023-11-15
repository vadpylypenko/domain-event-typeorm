import { Injectable } from '@nestjs/common';
import { AbstractAmqpChannelConfiguration, AmqpExchangeConfigurationAwareInterface, AmqpExchangeConfigurationInterface } from 'amp-configuration';
import { ExchangeType } from 'amp-configuration/lib/constant/amqp.constant';
import { EXCHANGE_NAME } from '../constant';

@Injectable()
export class EventAmqpChannelConfig extends AbstractAmqpChannelConfiguration implements AmqpExchangeConfigurationAwareInterface {
    /**
     * @inheritdoc
     */
    getExchangeConfiguration(): AmqpExchangeConfigurationInterface[] {
        return [{
            name: EXCHANGE_NAME,
            type: ExchangeType.TOPIC,
            options: { durable: true },
        }];
    }   
}