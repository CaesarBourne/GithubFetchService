import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import * as path from "path";
import { utilities } from "./constant";

const { combine, timestamp, label, printf } = format;

// Custom log format
const myFormat = printf(({ message, label }) => {
  return `${label}${message}`;
});

// Daily rotate file transport
const transport = new transports.DailyRotateFile({
  filename: path.join(
    __dirname,
    `../logs/recharge_${utilities.nodeName}-%DATE%.csv`
  ),
  datePattern: "YYYYMMDD_HH",
  zippedArchive: false,
});

// Event listener for rotation
transport.on("rotate", () => {
  // Custom action on log file rotation
});

// Create logger instance
const cdrlogger = createLogger({
  format: combine(label({ label: "" }), timestamp(), myFormat),
  transports: [transport],
  level: "info",
});

export default cdrlogger;

// import { createLogger, format, transports } from 'winston';
// import 'winston-daily-rotate-file';
// import { utilities } from 'src/config/configuration';
// const { combine, timestamp, label, printf } = format;

// // Custom log format
// const myFormat = printf(({ message, label }) => {
//   return `${label}${message}`;
// });

// // Daily rotate file transport
// const transport = new transports.DailyRotateFile({
//   filename: `/logs/recharge_${utilities.nodeName}-%DATE%.csv`,
//   datePattern: 'YYYYMMDD_HH',
//   zippedArchive: false,
// });

// // Event listener for rotation
// transport.on('rotate', () => {
//   // Custom action on log file rotation
// });

// // Create logger instance
// const logger = createLogger({
//   format: combine(label({ label: '' }), timestamp(), myFormat),
//   transports: [transport],
//   level: 'info',
// });

// export default logger;
