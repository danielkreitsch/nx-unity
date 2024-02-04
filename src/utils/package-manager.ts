import { executeCommand } from "./exec"
import { detectPackageManager, workspaceRoot } from "@nx/devkit"
import * as path from "path"

async function installPackages(
  projectRoot: string,
  packageNames: string[] | undefined = undefined,
  isDevDependency = false
) {
  const packageManager = detectPackageManager(path.join(workspaceRoot))
  let command = packageManager === "yarn" ? "yarn" : "npm install"
  if (packageNames !== undefined) {
    command =
      packageManager === "yarn"
        ? `yarn add ${packageNames.join(" ")}`
        : `npm install ${packageNames.join(" ")}`
    if (isDevDependency) {
      command += packageManager === "yarn" ? " --dev" : " --save-dev"
    }
  }
  await executeCommand(command, path.join(workspaceRoot, projectRoot))
}

async function installPackage(projectRoot: string, packageName: string, isDevDependency: boolean) {
  await installPackages(projectRoot, [packageName], isDevDependency)
}

export { installPackages, installPackage }
