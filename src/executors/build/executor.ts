import { BuildExecutorSchema } from "./schema"
import { ExecutorContext } from "nx/src/config/misc-interfaces"
import { executeCommand } from "../../utils/exec"
import { FsTree } from "nx/src/generators/tree"
import { getUnityBinaryPath } from "../../utils/platform"

export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext) {
  // Get the Unity version from the ProjectVersion.txt
  const projectPath = `${context.root}/${context.workspace.projects[context.projectName].root}`
  const tree = new FsTree(projectPath, context.isVerbose)
  const versionFileContent = tree.read("ProjectSettings/ProjectVersion.txt").toString()
  const version = versionFileContent.split("\n")[0].split(" ")[1]

  // Build the project using the Unity CLI
  const unityBinaryPath = getUnityBinaryPath(version)
  const command = `"${unityBinaryPath}" -quit -batchmode -nographics -logFile - -executeMethod ${options.executeMethod} -projectPath "${projectPath}"`
  console.log(`Executing command: ${command}`)
  const success = await executeCommand(command)

  return { success }
}
