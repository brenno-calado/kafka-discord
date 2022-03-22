import { Request, Response, NextFunction, Application } from 'express'
import { NPMPackage } from 'interfaces'
import { Topics } from '../interfaces/Topics'
import { app } from "../index"
import { publish } from '../ports/Kafka'

export const handleMessage = (request: Request, response: Response, next: NextFunction): Response => {
  const { event } = request.body

  if (!(event in Topics)) {
    return response.status(422).json({ error: 'Invalid event' })
  }
  app.emit(request.body.event, request.body)
  return response.status(200).json({ status: 'OK!' })
}

export const handlePublish = async (event: NPMPackage & Application) => {
  console.log("received event =>", event)

  try {
    const responses = await publish(
      event.event,
      [{
        key: event.event,
        value: JSON.stringify(event)
      }]
    )

    console.log('Recorded message =>', { responses })
  } catch (error) {
    console.error('Error publishing message =>', error)
    return false
  }
}
