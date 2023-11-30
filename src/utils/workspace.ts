import { getProjects, readProjectConfiguration, Tree } from "@nx/devkit"

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

function getLibraries(tree: Tree) {
  const libraries = []
  getProjects(tree).forEach((project) => {
    if (project.name && project.projectType === "library") {
      libraries.push(project.name)
    }
  })
  return libraries
}

export { getUnityProjects, getApplications, getLibraries }
