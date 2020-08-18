// Creating a shared singled to display hashed assets at the end
let logs: log[] = [];

type level = 'info' | 'warn' | 'error';

interface log {
  message: string;
  level: level
}

export namespace Logger {
  export function log(message: string, level: level) {
    logs.push({
      level,
      message
    });
  }

  export function info(message: string) {
    this.log(message, 'info');
  }

  export function warn(message: string) {
    this.log(message, 'warn');
  }

  export function error(message: string) {
    this.log(message, 'error');
  }

  export function flush() {
    logs.forEach(log => console[log.level](log.message));
    logs = [];
  }
}