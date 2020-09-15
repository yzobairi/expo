import { Task } from './Task';
import chalk from 'chalk';
import fs from 'fs-extra';

export type RemoveDirectorySettings = {
  target?: string;
  name?: string;
};

/**
 * A task which will remove the working directory.
 */
export class RemoveDirectory extends Task {
  private target?: string;

  constructor({ target, name }: RemoveDirectorySettings) {
    super(name || 'remove');
    this.target = target;
  }

  protected overrideWorkingDirectory(): string | undefined {
    return this.target;
  }

  async execute() {
    const workDirectory = this.getWorkingDirectory();

    this.logSubStep(`remove ${chalk.green(workDirectory)}`);
    return await fs.remove(workDirectory);
  }
}
