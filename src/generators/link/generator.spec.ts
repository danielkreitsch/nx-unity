import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing"
import { Tree, readProjectConfiguration } from "@nx/devkit"

import { linkGenerator } from "./generator"
import { LinkGeneratorSchema } from "./schema"

describe("link generator", () => {
  let tree: Tree
  const options: LinkGeneratorSchema = { name: "test" }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it("should run successfully", async () => {
    await linkGenerator(tree, options)
    const config = readProjectConfiguration(tree, "test")
    expect(config).toBeDefined()
  })
})
