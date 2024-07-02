import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing"
import { Tree, readProjectConfiguration } from "@nx/devkit"

import { projectGenerator } from "./generator"
import { ProjectGeneratorSchema } from "./schema"

describe("project generator", () => {
  let tree: Tree
  const options: ProjectGeneratorSchema = { name: "test" }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it("should run successfully", async () => {
    await projectGenerator(tree, options)
    const config = readProjectConfiguration(tree, "test")
    expect(config).toBeDefined()
  })
})
