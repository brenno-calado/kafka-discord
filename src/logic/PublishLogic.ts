import { Request, Response, NextFunction, Application } from 'express'
import { NPMPackage } from 'interfaces'
import { app } from "../index"
import { publish } from '../ports/Kafka'

export const handleMessage = (request: Request, response: Response, next: NextFunction) => {
  try {
    app.emit(request.body.event, request.body)
    response.status(200).json({ status: 'OK!' })
    next()
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const handlePublish = async (event: NPMPackage & Application) => {
  console.log("received event =>", event)

  try {
    const responses = await publish(
      event.event,
      [{
        key: event.time,
        value: JSON.stringify(event)
      }]
    )

    console.log('Recorded message =>', { responses })
  } catch (error) {
    console.error('Error publishing message =>', error)
    return false
  }
}
