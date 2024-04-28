import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  Tree,
} from "@nx/devkit"
import { PackageGeneratorSchema } from "./schema"
import { createAssemblyDefinition } from "../../utils/assemblies"
import { addImplicitDependency, getUnityProjects } from "../../utils/workspace"
import { posixJoin } from "../../utils/posix"

export async function packageGenerator(tree: Tree, options: PackageGeneratorSchema) {
  const { name: projectName } = options
  const projectRoot = posixJoin(getWorkspaceLayout(tree).libsDir, projectName)

  // Add the project to the Nx workspace
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: "library",
    sourceRoot: `${projectRoot}`,
    targets: {},
  })

  // Copy default files
  generateFiles(tree, posixJoin(__dirname, "files"), projectRoot, options)

  // Create assembly definitions
  createAssemblyDefinition(tree, posixJoin(projectRoot, "Runtime"), options.assemblyName)
  createAssemblyDefinition(tree, posixJoin(projectRoot, "Editor"), options.assemblyName + ".Editor")
  createAssemblyDefinition(
    tree,
    posixJoin(projectRoot, "Tests", "Runtime"),
    options.assemblyName + ".Tests"
  )
  createAssemblyDefinition(
    tree,
    posixJoin(projectRoot, "Tests", "Editor"),
    options.assemblyName + ".Editor.Tests"
  )

  // Add to global package.json
  const packageJson = JSON.parse(tree.read("package.json").toString())
  if (!packageJson.unityDependencies) {
    packageJson.unityDependencies = {}
  }
  packageJson.unityDependencies[projectName] = `file:${projectRoot}`
  tree.write("package.json", JSON.stringify(packageJson, null, 2))

  // Add implicit dependency to all Unity projects in the Nx config
  getUnityProjects(tree).forEach((unityProjectName) => {
    addImplicitDependency(tree, unityProjectName, projectName)
  })

  await formatFiles(tree)
}

export default packageGenerator
