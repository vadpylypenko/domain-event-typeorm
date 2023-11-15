import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { DomainEventEnvelopeEntity } from '../entity/domain-event-envelope.entity';
import { AmqpService } from 'amp-configuration';
import { AmqpServiceToken } from '../constant/service-name';
import { from, map, mergeMap } from 'rxjs';
import { DomainEventInterface } from 'domain-event';
import { EXCHANGE_NAME } from '../constant';

@Injectable()
export class EventTailService {
  /**
   * Constructor.
   * 
   * @param amqpClient - The AMQP client. Publishes domain events with appropriate topic.
   * @param repository - The instance of the domain event repository.
   */
  constructor(
    @Inject(AmqpServiceToken)
    private readonly amqpClient: AmqpService,
    @InjectRepository(DomainEventEnvelopeEntity)
    private readonly repository: Repository<DomainEventEnvelopeEntity<DomainEventInterface>>,
  ) {}

  /**
   * Publishes the last unpublished messages.
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async tail() {
    from(
      this.repository.find({
        where: { publishedAt: IsNull() },
        order: { createdAt: 'ASC' },
      }),
    )
    .pipe(
      mergeMap(domainEvents => domainEvents),
      mergeMap(domainEvent => {
      const routingKey = domainEvent.eventName
      .split(/\.?(?=[A-Z])/)
      .filter(eventPart => eventPart !== 'Event')
      .join('.')
      .toLowerCase();
     
      /** @todo: Configuration for the exchange */
      return from(this.amqpClient.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(domainEvent))))
        .pipe(map(() => domainEvent))
    }),
      map(domainEvent => from(this.repository.update(domainEvent.id, {publishedAt: new Date()})).pipe(map(() => domainEvent))),
      mergeMap(domainEvent => domainEvent),  
    )
    .subscribe({
      next: (event) => console.log(event),
      error: (err) => console.log(err),
    });
  }
}
