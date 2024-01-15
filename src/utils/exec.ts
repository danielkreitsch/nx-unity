import { exec } from "child_process"
import { promisify } from "util"

/**
 * Executes a command and logs the output to the console.
 * @returns true if the command was successful
 */
async function executeCommand(command: string): Promise<boolean> {
  const { stdout, stderr } = await promisify(exec)(command)
  console.log(stdout)
  console.error(stderr)
  return !stderr
}

export { executeCommand }
