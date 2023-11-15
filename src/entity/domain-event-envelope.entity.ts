import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { DomainEventInterface } from 'domain-event'

@Entity({
  name: 'domain_event'
})
export class DomainEventEnvelopeEntity<T extends DomainEventInterface> {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  eventName: string;

  @Column({
    type: 'json',
    array: false,
    nullable: false,
  })
  event: T;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;
}
