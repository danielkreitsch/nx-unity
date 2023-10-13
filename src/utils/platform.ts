import * as os from "os"

const UNITY_BASE_PATHS = {
  win32: "C:/Program Files/Unity/Hub/Editor",
  darwin: "/Applications/Unity/Hub/Editor",
  linux: "~/Unity/Hub/Editor",
}

const UNITY_EXECUTABLE_PATHS = {
  win32: "Editor/Unity.exe",
  darwin: "Unity.app/Contents/MacOS/Unity",
  linux: "Unity",
}

/**
 * Returns the default path to the Unity base directory.
 * Based on the platform, the base directory has a different path.
 */
function getUnityBasePath(): string {
  const platform = os.platform()
  const unityBaseDir = UNITY_BASE_PATHS[platform as keyof typeof UNITY_BASE_PATHS]
  if (!unityBaseDir) {
    throw new Error("Unsupported platform")
  }
  return unityBaseDir
}

/**
 * Returns the default path to the Unity executable relative to the Unity base directory + version.
 * Based on the platform, the executable has a different path.
 */
function getUnityBinaryRelativePath(): string {
  const platform = os.platform()
  const path = UNITY_EXECUTABLE_PATHS[platform as keyof typeof UNITY_EXECUTABLE_PATHS]
  if (!path) {
    throw new Error("Unsupported platform")
  }
  return path
}

export { getUnityBasePath, getUnityBinaryRelativePath }
