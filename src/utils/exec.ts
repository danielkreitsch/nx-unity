import { ExecOptions } from "child_process"

/**
 * Executes a command and logs the output to the console.
 * @returns true if the command was successful
 */
async function executeCommand(
  command: string,
  workingDirectory: string | null = null
): Promise<boolean> {
  const options: ExecOptions = {}
  if (workingDirectory) {
    options.cwd = workingDirectory
    if (isVerbose) {
      console.debug(`Working directory: ${options.cwd}`)
    }
  }

  const { exec } = await import("child_process")
  return new Promise<boolean>((resolve, reject) => {
    if (isVerbose) {
      console.debug(`Executing command: ${command}`)
    }
    const process = exec(command, options)
    process.stdout?.on("data", (data) => console.log(data.toString()))
    process.stderr?.on("data", (data) => console.error(data.toString()))
    process.on("exit", (code) => {
      if (code === 0) {
        resolve(true)
      } else {
        reject(new Error(`Command '${command}' exited with code ${code}`))
      }
    })
  })
}

function isVerbose() {
  return process.argv.includes("--verbose")
}

export { executeCommand }
