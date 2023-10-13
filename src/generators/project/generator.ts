import { addProjectConfiguration, formatFiles, generateFiles, Tree } from "@nx/devkit"
import { ProjectGeneratorSchema } from "./schema"
import * as path from "path"
import { getUnityBasePath, getUnityBinaryRelativePath } from "../../utils/platform"
import { promptUnityVersion } from "../../utils/unity-version"
import { executeCommand } from "../../utils/exec"
import * as fs from "fs"

export async function projectGenerator(tree: Tree, options: ProjectGeneratorSchema) {
  const projectRoot = `apps/${options.name}`

  // Add the project to the Nx workspace
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: "application",
    sourceRoot: path.join(projectRoot, "Assets"),
    targets: {},
  })

  // Check if Unity is installed
  const unityBasePath = getUnityBasePath()
  if (fs.existsSync(unityBasePath) === false) {
    throw new Error(`Unity installation not found at ${unityBasePath}`)
  }

  // Let the user select the Unity version
  const unityVersion = await promptUnityVersion(unityBasePath)

  // Generate some starter files
  generateFiles(tree, path.join(__dirname, "files"), projectRoot, options)

  // Create the project by starting Unity with the -createProject flag
  console.log("Starting Unity...")
  const unityBinaryPath = path.join(unityBasePath, unityVersion, getUnityBinaryRelativePath())
  executeCommand(`"${unityBinaryPath}" -createProject ${projectRoot}`)

  await formatFiles(tree)
}

export default projectGenerator
