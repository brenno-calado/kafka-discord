import { CompressionTypes, Kafka, Producer, KafkaConfig, logLevel } from "kafkajs";

const {
  KAFKA_CLIENT_ID,
  KAFKA_BROKERS,
} = process.env

const config: KafkaConfig = {
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKERS],
  logLevel: logLevel.ERROR
}

let producer: Producer
export const KafkaBroker: Kafka = new Kafka(config)

export const connect = async () => {
  producer = KafkaBroker.producer()
  await producer.connect()
}

export const publish = async (topic: string, message: object) => {
  const producerConfig = {
    topic,
    compression: CompressionTypes.GZIP,
    messages: [{ value: JSON.stringify(message)}]
  }
  return producer.send(producerConfig)
}

export const consumer = async (groupId: string, topic: string) => {
  const consumer = KafkaBroker.consumer({ groupId })
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  return consumer
}

export const createTopic = async (topic: string) => {
  await KafkaBroker.admin().connect()
  await KafkaBroker.admin().createTopics({
    topics: [{ topic }],
    waitForLeaders: true
  })
}
