using System.IO;
using UnityEngine;

namespace NxUnity
{
  public static class NxUtils
  {
    public static string GetWorkspaceRoot()
    {
      var currentDirectory = Directory.GetCurrentDirectory();
      while (!File.Exists(Path.Combine(currentDirectory, "package.json")))
      {
        var parent = Directory.GetParent(currentDirectory);
        if (parent == null)
        {
          throw new FileNotFoundException("Could not determine workspace root.");
        }
        currentDirectory = parent.FullName;
      }
      return currentDirectory;
    }

    public static string GetProjectRoot()
    {
      return Path.GetRelativePath(GetWorkspaceRoot(), Directory.GetParent(Application.dataPath)!.FullName).Replace('\\', '/');
    }
  }
}
