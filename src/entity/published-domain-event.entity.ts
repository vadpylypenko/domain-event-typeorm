import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'handled_domain_event'
})
export class HandledDomainEventEntity {
    @PrimaryColumn()
    eventId: string;

    @Column({ type: 'timestamptz' })
    publishedAt: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    handledAt?: Date;
}