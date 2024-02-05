import * as path from "path"

export function posixJoin(...segments: string[]): string {
  const joinedPath = path.join(...segments)
  return joinedPath.replace(/\\/g, "/")
}
