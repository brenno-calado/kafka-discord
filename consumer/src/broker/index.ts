import { Consumer, ConsumerRunConfig, EachMessagePayload, Kafka as KafkaBuilder, KafkaConfig, logLevel, Producer } from 'kafkajs';
import axios from 'axios'
import dotenv from 'dotenv'
import { logger } from '../shared/helpers';

dotenv.config()

const { KAFKA_CLIENT_ID, KAFKA_BROKERS, TOPICS, SERVER_PORT, ENVIRONMENT, KAFKA_GROUP_ID, DISCORD_URL } = process.env

class Kafka {
  private static config: KafkaConfig = {
    brokers: (KAFKA_BROKERS as string).split(","),
    clientId: KAFKA_CLIENT_ID,
    logLevel: logLevel.INFO,
    retry: {
      initialRetryTime: 400,
      retries: 5
    }
  }

  private static topics: string[] = String(TOPICS).split(',')

  constructor(private kafka = new KafkaBuilder(Kafka.config)) { }

  private async connect(kafka: Consumer | Producer) {
    try {
      await kafka.connect()
      return true
    } catch (error) {
      await kafka.disconnect()
      logger.error(`App [${ENVIRONMENT}] running on port ${SERVER_PORT}\n
      failed at Kafka Connect => Kafka Config: ${JSON.stringify(Kafka.config)} \n ${error}`)
      return false
    }
  }

  public async consume() {
    const consumer = this.kafka.consumer({ groupId: String(KAFKA_GROUP_ID) })

    try {
      const connect = await this.connect(consumer)

      if (!connect) return

      for await (const topic of Kafka.topics) {
        consumer.subscribe({ topic: topic as string })
      }

      this.consumeMessages(consumer)
    } catch (error) {
      logger.error(`App [${ENVIRONMENT}] running on port ${SERVER_PORT}\n
      failed to run Kafka => Kafka Config: ${JSON.stringify(Kafka.config)} \n ${error}`);
      return false
    }
  }

  private async consumeMessages(consumer: Consumer): Promise<void> {
    const config: ConsumerRunConfig = {
      eachMessage: async payload => {
        try {
          const message = this.processMessage(payload)

          const response = await axios.post(String(DISCORD_URL), {
            username: 'Captain Hook',
            content: JSON.stringify(message, null, '\t')
          },
            {
              headers: { 'content-type': 'application/json' }
            }
          )
          logger.info(`${response.status}: Sent response`)
        } catch (error) {
          logger.error(`App [${ENVIRONMENT}] at ${SERVER_PORT}\n
          failed to send payload to Discord: ${JSON.stringify(Kafka.config)}\n ERROR: ${error}`)
        }
      }
    }

    try {
      consumer.run(config)
    } catch (error) {
      logger.error(`App [${ENVIRONMENT}] running on port ${SERVER_PORT}\n
      failed to run Kafka => Kafka Config: ${JSON.stringify(Kafka.config)} \n ${error}`)
    }
  }

  private processMessage({ topic, partition, message }: EachMessagePayload) {
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`

    return ({
      'kafka_info': prefix,
      data: JSON.parse(String(message.value))
    })
  }
}

export default new Kafka()
