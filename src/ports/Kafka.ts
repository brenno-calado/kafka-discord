import { CompressionTypes, Kafka, Producer, ProducerConfig, ProducerRecord, KafkaConfig, logLevel } from "kafkajs";

const {
  KAFKA_CLIENT_ID,
  KAFKA_BROKERS,
} = process.env

const config: KafkaConfig = {
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS.split(','),
  logLevel: logLevel.ERROR
}

const producerConfig: ProducerConfig = {
  allowAutoTopicCreation: true,
}

let producer: Producer
export const KafkaBroker: Kafka = new Kafka(config)

export const connect = async () => {
  producer = KafkaBroker.producer(producerConfig)
  await producer.connect()
}

export const publish = async (topic: string, message: object) => {
  const record: ProducerRecord = {
    topic,
    compression: CompressionTypes.GZIP,
    messages: [{ value: JSON.stringify(message)}]
  }
  const prod = KafkaBroker.producer(producerConfig)
  await prod.connect()
  return prod.send(record)
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
