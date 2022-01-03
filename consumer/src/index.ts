import { Kafka, KafkaConfig, logLevel } from 'kafkajs';
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const { KAFKA_CLIENT_ID, KAFKA_BROKERS, TOPIC, GROUP_ID, DISCORD_URL } = process.env

const config: KafkaConfig = {
  brokers: [String(KAFKA_BROKERS)],
  clientId: KAFKA_CLIENT_ID,
  logLevel: logLevel.INFO
}

const kafka = new Kafka(config)

const consumer = kafka.consumer({ groupId: String(GROUP_ID) })

async function run() {
  await consumer.connect()
  await consumer.subscribe({ topic: String(TOPIC) })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`

      const payload = JSON.parse(String(message.value))
      payload[1] = prefix
      const response = await axios.post(String(DISCORD_URL), {
        username: 'Captain Hook',
        content: JSON.stringify(payload, null, '\t')
      },
        {
          headers: { 'content-type': 'application/json' }
        }
      )
      console.log(response.status)
    },
  })
}

run().catch(console.error)
