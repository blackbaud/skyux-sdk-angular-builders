type Level = 'info' | 'warn' | 'error';

interface Log {
  message: string;
  level: Level
}

export abstract class Logger {
  private static logs: Log[] = [];

  public static log(message: string, level: Level) {
    this.logs.push({
      level,
      message
    });
  }

  public static info(message: string): void {
    this.log(message, 'info');
  }

  public static warn(message: string): void {
    this.log(message, 'warn');
  }

  public static error(message: string): void {
    this.log(message, 'error');
  }

  public static flush(): void {
    this.logs.forEach(log => console[log.level](log.message));
    this.logs = [];
  }
}
