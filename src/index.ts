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
}

main().catch(error => console.log(error))
