import { readdirSync } from "fs"

function getAvailableUnityVersions(basePath: string): string[] {
  try {
    return readdirSync(basePath)
  } catch (error) {
    console.error(`Failed to read directory: ${basePath}`, error)
    throw error
  }
}

export { getAvailableUnityVersions }
