import { TypeOrmTransactionInterface } from 'transaction-typeorm';
import { DomainEventHandlerInterface } from 'domain-event';
import { QueryRunner } from 'typeorm';
import { DomainEventEnvelopeEntity } from '../entity/domain-event-envelope.entity';
import { HandledDomainEventEntity } from '../entity/published-domain-event.entity';


export abstract class AbstractTypeOrmDomainEventHandler<T> implements DomainEventHandlerInterface {
    /**
     * Constructor.
     * 
     * @param transactionManager - The instance of the transaction service.
     */
    constructor(
        protected readonly transactionManager: TypeOrmTransactionInterface,
    ) {}
    
    /**
     * @inheritdoc
     */
    async handle(domainEvent: DomainEventEnvelopeEntity<T>): Promise<void> {
        return await this.transactionManager.transaction(async (queryRunner: QueryRunner) => {
            const existEvent = await queryRunner.manager.findOneBy<HandledDomainEventEntity>(HandledDomainEventEntity, { eventId: domainEvent.id });
            /**
             * Idempotent event handling. Duplication will be handled by the retry policy and message will be ack finally.
             */ 
            if (!existEvent) {
                const handledEvent = new HandledDomainEventEntity();
                
                handledEvent.eventId = domainEvent.id;
                handledEvent.publishedAt = domainEvent.createdAt;
                
                await queryRunner.manager.save<HandledDomainEventEntity>(handledEvent);
                await this.handleEvent(queryRunner, domainEvent);
            }
        });
    }

    /**
     * Handles the event directly.
     * The QueryRunner should be used for handling any persistence operations.
     * 
     * @param queryRunner - The instance of the TypeOrm QueryRunner.
     * @param domainEvent - The domain event.
     */
    protected abstract handleEvent(queryRunner: QueryRunner, domainEvent: DomainEventEnvelopeEntity<T>): Promise<void>;
} 