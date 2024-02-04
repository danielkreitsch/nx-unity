using System;
using System.IO;
using System.Linq;
using System.Threading;
using UnityEditor;
using UnityEditor.PackageManager;
using UnityEngine;

namespace NxUnity
{
  [InitializeOnLoad]
  public static class DependencyResolver
  {
    public static bool Verbose = true;

    static DependencyResolver()
    {
      EditorApplication.projectChanged += ResolveDependencies;
      EditorApplication.focusChanged += OnFocusChange;
      ResolveDependencies();
    }

    private static void OnFocusChange(bool focus)
    {
      if (focus)
      {
        ResolveDependencies();
      }
    }

    [MenuItem("Tools/Nx Unity/Resolve Dependencies")]
    public static void ResolveDependencies()
    {
      var somethingChanged = false;

      var globalDependenciesDefinition = GlobalDependenciesDefinition.Get();
      var installedPackages = GetInstalledPackages();

      if (globalDependenciesDefinition.Dependencies.Count > 0)
      {
        // Install packages that are in the global package.json but not in the project manifest.json
        foreach (var globalDependency in globalDependenciesDefinition.Dependencies)
        {
          if (!IsPackageInstalled(installedPackages, globalDependency.Key))
          {
            if (InstallPackage(globalDependency.Key, globalDependency.Value))
            {
              somethingChanged = true;
            }
          }
        }
      }
      else
      {
        // Add all installed packages to the global package.json
        foreach (var installedPackage in installedPackages)
        {
          globalDependenciesDefinition.AddDependency(installedPackage);
          somethingChanged = true;
        }
      }

      // Handle packages that are in the project manifest.json but not in the global package.json
      foreach (var installedPackage in installedPackages)
      {
        if (!globalDependenciesDefinition.Dependencies.ContainsKey(installedPackage.name))
        {
          bool add = EditorUtility.DisplayDialog(
            "Dependency Resolution",
            $"{installedPackage.displayName} ({installedPackage.version}) is present in this project's manifest.json but not in the global package.json. Would you like to add this package to the global package.json, or remove it?",
            "Add to global package.json",
            "Remove package");

          if (add)
          {
            globalDependenciesDefinition.AddDependency(installedPackage);
            somethingChanged = true;
          }
          else
          {
            if (RemovePackage(installedPackage.name))
            {
              somethingChanged = true;
            }
          }
        }
      }

      if (somethingChanged)
      {
        globalDependenciesDefinition.Save();
        AssetDatabase.Refresh();
      }
    }

    private static PackageCollection GetInstalledPackages()
    {
      var request = Client.List();
      while (!request.IsCompleted)
      {
      }
      return request.Result;
    }

    private static bool IsPackageInstalled(PackageCollection packageCollection, string packageName)
    {
      return packageCollection.Any(p => p.name == packageName);
    }

    private static bool InstallPackage(string packageName, string version)
    {
      string packageIdentifier = $"{packageName}@{version}";
      LogVerbose($"Attempting to install package: {packageIdentifier}");

      var addRequest = Client.Add(packageIdentifier);
      while (!addRequest.IsCompleted)
      {
        Thread.Sleep(100);
      }

      if (addRequest.Status == StatusCode.Success)
      {
        LogVerbose($"Package {packageIdentifier} installed successfully.");
        return true;
      }

      LogVerbose($"Package {packageIdentifier} could not be installed. Trying to install via OpenUPM CLI.");
      try
      {
        InstallPackageViaOpenUPMCLI(packageIdentifier);
        LogVerbose($"Package {packageIdentifier} installed successfully via OpenUPM CLI.");
        return true;
      }
      catch (Exception ex)
      {
        Debug.LogError($"Exception occurred while installing package {packageIdentifier} via OpenUPM CLI: {ex.Message}");
        return false;
      }
    }

    private static void InstallPackageViaOpenUPMCLI(string packageIdentifier)
    {
      using (var process = new System.Diagnostics.Process())
      {
        process.StartInfo.FileName = "cmd.exe";
        process.StartInfo.Arguments = $"/C npx openupm add {packageIdentifier}";
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.RedirectStandardError = true;
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.CreateNoWindow = true;
        process.StartInfo.WorkingDirectory = Directory.GetParent(Application.dataPath).FullName;
        process.Start();
        string output = process.StandardOutput.ReadToEnd();
        string error = process.StandardError.ReadToEnd();
        process.WaitForExit();

        Debug.Log("Working directory: " + process.StartInfo.WorkingDirectory);
        Debug.Log("Executing command: " + process.StartInfo.FileName + " " + process.StartInfo.Arguments);
        Debug.Log("Output: " + output);

        if (process.ExitCode != 0)
        {
          throw new Exception($"Failed to install package {packageIdentifier} via OpenUPM CLI: {error}");
        }
      }
    }

    private static bool RemovePackage(string packageName)
    {
      LogVerbose($"Removing package: {packageName}");
      var removeRequest = Client.Remove(packageName);
      while (!removeRequest.IsCompleted)
      {
        Thread.Sleep(100);
      }
      if (removeRequest.Status == StatusCode.Failure)
      {
        Debug.LogError($"Package {packageName} could not be removed");
        return false;
      }

      LogVerbose($"Package {packageName} removed successfully");
      return true;
    }

    private static void LogVerbose(string message)
    {
      if (Verbose)
      {
        Debug.Log(message);
      }
    }
  }
}
