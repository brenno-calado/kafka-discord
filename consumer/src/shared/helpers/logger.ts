import { format, transports, createLogger } from 'winston';

const formatter = format.combine(
  format.colorize({ all: false }),
  format.timestamp(),
  format.printf(({ timestamp, level, ...info}) => `${timestamp} ${level}: ${JSON.stringify(info, null, '\t')}`)
)

export const logger = createLogger({
  level: 'verbose',
  format: formatter,
  transports: [new transports.Console()],
});
