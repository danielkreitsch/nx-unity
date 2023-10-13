import { prompt } from "enquirer"
import { readdirSync } from "fs"

function getAvailableUnityVersions(basePath: string): string[] {
  try {
    return readdirSync(basePath)
  } catch (error) {
    console.error(`Failed to read directory: ${basePath}`, error)
    throw error
  }
}

async function promptUnityVersion(basePath: string): Promise<string> {
  const versions = await getAvailableUnityVersions(basePath)
  const result: { version: string } = await prompt({
    type: "select",
    name: "version",
    message: "Select Unity version",
    choices: versions,
  })
  return result.version
}

export { getAvailableUnityVersions, promptUnityVersion }
