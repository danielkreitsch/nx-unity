import { exec } from "child_process"

function executeCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, (error) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        reject(error)
        return
      }
      resolve()
    })

    childProcess.stdout?.pipe(process.stdout)
    childProcess.stderr?.pipe(process.stderr)
  })
}

export { executeCommand }
