import { readProjectConfiguration, Tree, updateProjectConfiguration, output } from "@nx/devkit"
import { LinkGeneratorSchema } from "./schema"
import { addWorkspacePackageToUnityProject } from "../../utils/unity-project"
import { promptForLibrary, promptForUnityProject } from "../../utils/prompts"

export async function linkGenerator(tree: Tree, options: LinkGeneratorSchema) {
  const projectName = await promptForUnityProject(
    tree,
    "Select the Unity project to add a package to"
  )
  const packageName = await promptForLibrary(tree, "Select the package to add to the Unity project")
  const addedToUnityProject = addWorkspacePackageToUnityProject(tree, projectName, packageName)
  const addedToNxConfiguration = addImplicitDependency(tree, projectName, packageName)

  if (addedToUnityProject || addedToNxConfiguration) {
    output.success({
      title: "Successfully linked!",
      bodyLines: [
        `Package '${packageName}' was added to Unity project '${projectName}'`,
        `and configured as a dependency in Nx`,
      ],
    })
  } else {
    output.error({
      title: "Link already exists.",
      bodyLines: [`Unity project '${projectName}' and package '${packageName}' are already linked`],
    })
  }
}

/**
 * Adds a package to the implicit dependencies of a project.
 * @returns true if the package was added, false if it was already present
 */
function addImplicitDependency(tree: Tree, projectName: string, packageName: string): boolean {
  const projectConfig = readProjectConfiguration(tree, projectName)
  const implicitDependencies = projectConfig.implicitDependencies || []
  if (!implicitDependencies.includes(packageName)) {
    implicitDependencies.push(packageName)
    projectConfig.implicitDependencies = implicitDependencies
    updateProjectConfiguration(tree, projectName, projectConfig)
    return true
  }
  return false
}

export default linkGenerator
