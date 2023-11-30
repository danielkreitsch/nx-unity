import { Tree } from "@nx/devkit"
import * as path from "path"

/**
 * Creates an assembly definition file.
 * @param tree The tree to write the file to.
 * @param outputPath The path to the output directory.
 * @param name The name of the assembly definition, e.g. `MyCompany.MyPackage`.
 */
function createAssemblyDefinition(tree: Tree, outputPath: string, name: string) {
  tree.write(
    path.join(outputPath, `${name}.asmdef`),
    JSON.stringify({
      name: name,
      rootNamespace: "",
      references: [],
      includePlatforms: [],
      excludePlatforms: [],
      allowUnsafeCode: false,
      overrideReferences: false,
      precompiledReferences: [],
      autoReferenced: true,
      defineConstraints: [],
      versionDefines: [],
      noEngineReferences: false,
    })
  )
}

export { createAssemblyDefinition }
