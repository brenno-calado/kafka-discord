import { Request, Response, NextFunction, Application } from 'express'
import { NPMPackage } from 'interfaces'
import { app } from "../index"
import { publish } from '../ports/Kafka'

const { TOPIC } = process.env

export const handleMessage = (request: Request, response: Response, next: NextFunction) => {
  app.emit(request.body.event, request.body)
  response.status(200).json({ status: 'OK!' })
  next()
}

export const handlePublish = async (event: NPMPackage & Application) => {
  console.log("received event =>", event)

  try {
    const responses = await publish(
      TOPIC,
      [{
        key: event.time,
        value: JSON.stringify(event)
      }]
    )

    console.log('Published message =>', { responses })
  } catch (error) {
    console.error('Error publishing message =>', error)
  }
}
