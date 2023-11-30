import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  Tree,
} from "@nx/devkit"
import * as path from "path"
import { PackageGeneratorSchema } from "./schema"

export async function packageGenerator(tree: Tree, options: PackageGeneratorSchema) {
  const { name: projectName } = options
  const projectRoot = path.join(getWorkspaceLayout(tree).libsDir, projectName)
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: "library",
    sourceRoot: `${projectRoot}`,
    targets: {},
  })
  generateFiles(tree, path.join(__dirname, "files"), projectRoot, options)
  await formatFiles(tree)
}

export default packageGenerator
