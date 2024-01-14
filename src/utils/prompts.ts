import { Tree } from "@nx/devkit"
import { prompt } from "enquirer"
import { getLibraries, getUnityProjects } from "./workspace"

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

export { promptForUnityProject, promptForLibrary }
