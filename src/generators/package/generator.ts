import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  Tree,
} from "@nx/devkit"
import * as path from "path"
import { PackageGeneratorSchema } from "./schema"
import { createAssemblyDefinition } from "../../utils/assemblies"

export async function packageGenerator(tree: Tree, options: PackageGeneratorSchema) {
  const { name: projectName } = options
  const projectRoot = path.join(getWorkspaceLayout(tree).libsDir, projectName)

  // Add the project to the Nx workspace
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: "library",
    sourceRoot: `${projectRoot}`,
    targets: {},
  })

  // Copy default files
  generateFiles(tree, path.join(__dirname, "files"), projectRoot, options)

  // Create assembly definitions
  createAssemblyDefinition(tree, path.join(projectRoot, "Runtime"), options.assemblyName)
  createAssemblyDefinition(tree, path.join(projectRoot, "Editor"), options.assemblyName + ".Editor")
  createAssemblyDefinition(
    tree,
    path.join(projectRoot, "Tests", "Runtime"),
    options.assemblyName + ".Tests"
  )
  createAssemblyDefinition(
    tree,
    path.join(projectRoot, "Tests", "Editor"),
    options.assemblyName + ".Editor.Tests"
  )

  await formatFiles(tree)
}

export default packageGenerator
