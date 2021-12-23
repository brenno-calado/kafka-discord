import * as dotenv from 'dotenv'

dotenv.config()

import * as Kafka from './Kafka'

export const setup = async () => {
  await Kafka.connect()
}
