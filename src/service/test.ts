export class Some {
    constructor(
        private readonly entityManager: any,
        private readonly transactionManager: any,
        private readonly amqpService: any,
      ) {
      }
    
    // async save(data) {
    //     await this.entityManager.save(data);
    //     // Some record was created/updated
    //     const message = this.createMessage(data);
    //     // What if this fails
    //     await this.amqpService.publish(message);
    // }

    async save(data) {
        await this.transactionManager.startTransaction();

        try {
            await this.entityManager.save(data);
            // Some record was created/updated
            const message = this.createMessage(data);
            // If this fails we'll rollback 
            await this.amqpService.publish(message);

            await this.transactionManager.commitTransaction();
        } catch (e) {
            this.transactionManager.rollbackTransaction();

            throw e;
        }
    }

    createMessage(data) {
        return data;
    }
}