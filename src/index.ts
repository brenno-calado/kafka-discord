import dotenv from 'dotenv'
import express from 'express'

import { setup } from './ports/setup'
import { handleMessage, handlePublish } from './logic'

dotenv.config()

export const app = express()
app.use(express.json())

const { PORT } = process.env


const main = async () => {
  await setup()

  app.post('/hook', handleMessage)
  app.on('npm-package', handlePublish)

  app.listen(PORT || 3000, () => { console.log(`Server listening on port ${PORT || 3000}`) })

  process.on('uncaughtException', error => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(error);
    process.exit(1)
  })

  process.on('unhandledRejection', error => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(error);
    process.exit(1)
  })

  process.on('SIGHUP', () => {
    console.log('SIGHUP! Shutting down...');
    process.exit(128 + 1)
  })

  process.on('SIGINT', () => {
    console.log('SIGINT! Shutting down...');
    process.exit(128 + 2)
  })

  process.on('SIGTERM', () => {
    console.log('SIGTERM! Shutting down...');
    process.exit(128 + 3)
  })
}

main().catch(error => console.log(error))
