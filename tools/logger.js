import chalk from "chalk";
import cliProgress from "cli-progress";

export class Logger {
  constructor(taskName, total) {
    this.taskName = taskName;
    this.bar = new cliProgress.SingleBar({
      format: `${chalk.cyan(taskName)} |${chalk.green("{bar}")}| {percentage}% {value}/{total}`,
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
      clearOnComplete: true,
    });
    this.bar.start(total, 0);
  }

  update(value) {
    this.bar.update(value);
  }

  success() {
    this.bar.stop();
    console.log(chalk.green.bold(`✔ ${this.taskName} completed successfully`));
  }

  error(msg) {
    this.bar.stop();
    console.log(chalk.red.bold(`✖ ${this.taskName} failed: ${msg}`));
  }
}
