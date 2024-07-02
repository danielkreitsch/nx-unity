import { Tree } from "@nx/devkit"
import { prompt } from "enquirer"
import { getLibraries, getUnityProjects } from "./workspace"
import { getAvailableUnityVersions } from "./unity-version"

async function promptForUnityVersion(basePath: string, message: string): Promise<string> {
  const result: { version: string } = await prompt({
    type: "select",
    name: "version",
    message: message,
    choices: getAvailableUnityVersions(basePath),
  })
  return result.version
}

async function promptForUnityProject(tree: Tree, message: string) {
  const result: { project: string } = await prompt({
    type: "select",
    name: "project",
    message: message,
    choices: getUnityProjects(tree),
  })
  return result.project
}

async function promptForLibrary(tree: Tree, message: string) {
  const result: { library: string } = await prompt({
    type: "select",
    name: "library",
    message: message,
    choices: getLibraries(tree),
  })
  return result.library
}

export { promptForUnityVersion, promptForUnityProject, promptForLibrary }
