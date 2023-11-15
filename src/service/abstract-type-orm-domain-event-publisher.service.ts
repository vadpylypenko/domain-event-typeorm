import { randomUUID } from 'crypto';
import { instanceToPlain } from 'class-transformer';
import { DomainEventInterface, DomainEventPublisherInterface } from 'domain-event';
import { QueryRunner } from 'typeorm';
import { DomainEventEnvelopeEntity } from '../entity/domain-event-envelope.entity';

export class AbstractTypeOrmDomainEventPublisherService<
  E extends DomainEventInterface,
> implements DomainEventPublisherInterface
{
  /**
   * Constructor.
   * 
   * @param queryRunner - The instance of the TypeORM query runner.
   */
  constructor(private readonly queryRunner: QueryRunner) {}

  /**
   * @inheritdoc
   */
  publish(event: E): Promise<void> {
    const eventEnvelope = new DomainEventEnvelopeEntity();

    eventEnvelope.id = randomUUID()
    eventEnvelope.eventName = Object.getPrototypeOf(event).constructor.name;
    eventEnvelope.event = instanceToPlain(event);

    this.queryRunner.manager.save(eventEnvelope);

    return undefined;
  }
}
