import chalk from 'chalk';
import logger from '../../Logger';
import { toRepoPath } from '../utils';

/**
 * An base class for all task.
 * It provides a simple task luncher, log utils and path to working directory.
 */
export abstract class Task {
  private workingDirectory?: string;

  constructor(protected stepName: string) {}

  /**
   * Tasks can contain multiple steps. This function provides a consistent way to log information about each step.
   * @param message
   */
  protected logSubStep(message: string) {
    logger.info(`  > ${message}`);
  }

  /**
   * A function which provides a consistent way of printing debug information inside a task.
   * @param message which will be printed using debug log level.
   */
  protected logDebugInfo(message: string | string[]) {
    if (typeof message === 'string') {
      logger.debug(`    ${message}`);
    } else {
      logger.debug(`    ${message.join('\n    ')}`);
    }
  }

  /**
   * We want to have a way to change working directory using task's settings.
   * For example, we could run pipe in the temp directory but one task from it in the repo.
   * It's ignored if undefined was returned.
   * @returns the override working directory for task.
   */
  protected overrideWorkingDirectory(): string | undefined {
    return;
  }

  /**
   * @returns the absolute path to working directory for task based on overrideWorkDirectory().
   */
  protected getWorkingDirectory(): string {
    const overrideValue = this.overrideWorkingDirectory();
    if (overrideValue) {
      return toRepoPath(overrideValue);
    }

    return toRepoPath(this.workingDirectory!);
  }

  /**
   * Sets the working directory for the task.
   * @param workingDirectory
   */
  public setWorkingDirectory(workingDirectory: string) {
    this.workingDirectory = workingDirectory;
  }

  /**
   * @returns a task name.
   */
  public getName() {
    return this.stepName;
  }

  /**
   * A function which will be call in start method. The body of the task.
   */
  protected abstract async execute();

  /**
   * A method that starts the task. It provides error handling and logs that the task starts.
   */
  public async start() {
    logger.info(`🚀 Staring ${chalk.green(this.stepName)}...`);
    try {
      await this.execute();
    } catch (e) {
      logger.error(e);
      logger.error(chalk.red(`❌ ${this.stepName} failed.`));
      return;
    }
    logger.info(`✅ ${chalk.green(this.stepName)} finished.\n`);
  }
}
