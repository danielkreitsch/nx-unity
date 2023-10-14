import { getWorkspaceLayout, Tree } from "@nx/devkit"

function addWorkspacePackageToUnityProject(
  tree: Tree,
  projectName: string,
  packageName: string
): boolean {
  const workspaceLayout = getWorkspaceLayout(tree)
  return addDependencyToUnityProject(
    tree,
    projectName,
    packageName,
    `file:../../../${workspaceLayout.libsDir}/${packageName}`
  )
}

/**
 * Adds a dependency to a Unity project.
 * @returns true if the dependency was added, false if it was already present
 */
function addDependencyToUnityProject(
  tree: Tree,
  projectName: string,
  dependencyKey: string,
  dependencyValue: string
): boolean {
  const workspaceLayout = getWorkspaceLayout(tree)
  const manifestPath = `${workspaceLayout.appsDir}/${projectName}/Packages/manifest.json`
  const manifest = JSON.parse(tree.read(manifestPath).toString())
  const dependencies = manifest.dependencies
  if (!dependencies[dependencyKey]) {
    dependencies[dependencyKey] = dependencyValue
    tree.write(manifestPath, JSON.stringify(manifest, null, 2))
    return true
  }
  return false
}

export { addWorkspacePackageToUnityProject, addDependencyToUnityProject }
