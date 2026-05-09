import type { FastifyReply } from 'fastify';

export class NotFoundError extends Error {
  readonly statusCode = 404;
  readonly code = 'NOT_FOUND';
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function sendError(reply: FastifyReply, err: NotFoundError | ValidationError): void {
  void reply.status(err.statusCode).send({
    error: {
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    },
  });
}
