import { DomainEventPublisherFactoryInterface, DomainEventPublisherInterface } from 'domain-event';
import { TypeOrmEventPublisherFactoryOptionsInterface } from '../interface/type-orm-event-publisher-factory-options.interface';

export abstract class AbstractTypeOrmDomainEventPublisherFactoryService
  implements
    DomainEventPublisherFactoryInterface<TypeOrmEventPublisherFactoryOptionsInterface>
{
  /**
   * Creates the instance of the domain event publisher.
   * 
   * @param options - The options for the factory.
   */
  abstract create(options: TypeOrmEventPublisherFactoryOptionsInterface): DomainEventPublisherInterface;
}