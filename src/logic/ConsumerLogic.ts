import { consumer } from '../ports/Kafka'
import { Request } from 'express'

export const handleConsumer = async (request: Request) => {
  const { group_id, topic } = request.query

  const Consumer = await consumer(group_id.toString(), topic.toString())
  await Consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message', {
        topic,
        partition,
        value: message.value.toString()
      })
    }
  })
}