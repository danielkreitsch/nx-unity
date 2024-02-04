import { getProjects, readProjectConfiguration, Tree, updateProjectConfiguration } from "@nx/devkit"
import * as path from "path"

function getUnityProjects(tree: Tree) {
  return getApplications(tree).filter((application) => {
    const projectConfig = readProjectConfiguration(tree, application)
    return projectConfig.sourceRoot.includes("Assets")
  })
}

function getApplications(tree: Tree) {
  const applications = []
  getProjects(tree).forEach((project) => {
    if (project.projectType === "application") {
      applications.push(project.name)
    }
  })
  return applications
}

function getUnityPackages(tree: Tree) {
  return getLibraries(tree).filter((library) => {
    const projectConfig = readProjectConfiguration(tree, library)
    const packageJsonExists = tree.exists(path.join(projectConfig.sourceRoot, "package.json"))
    const packageJsonMetaExists = tree.exists(
      path.join(projectConfig.sourceRoot, "package.json.meta")
    )
    const runtimeFolderExists = tree.exists(path.join(projectConfig.sourceRoot, "Runtime"))
    return packageJsonExists && (packageJsonMetaExists || runtimeFolderExists)
  })
}

function getLibraries(tree: Tree) {
  const libraries = []
  getProjects(tree).forEach((project) => {
    if (project.name && project.projectType === "library") {
      libraries.push(project.name)
    }
  })
  return libraries
}

/**
 * Adds an implicit dependency to a project.
 * @returns true if the dependency was added, false if it was already present
 */
function addImplicitDependency(tree: Tree, projectName: string, dependency: string): boolean {
  const projectConfig = readProjectConfiguration(tree, projectName)
  const implicitDependencies = projectConfig.implicitDependencies || []
  if (!implicitDependencies.includes(dependency)) {
    implicitDependencies.push(dependency)
    projectConfig.implicitDependencies = implicitDependencies
    updateProjectConfiguration(tree, projectName, projectConfig)
    return true
  }
  return false
}

export { getUnityProjects, getApplications, getUnityPackages, getLibraries, addImplicitDependency }
