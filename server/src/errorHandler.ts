import { Request, Response, ErrorRequestHandler, NextFunction } from 'express'

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: err.message })
  } else {
    console.error(err) // TODO: Log error (eg: Sentry)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default errorHandler
