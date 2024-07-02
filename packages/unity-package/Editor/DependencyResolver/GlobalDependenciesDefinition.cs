using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEditor.PackageManager;
using UnityEngine;

namespace NxUnity
{
  [Serializable]
  public class GlobalDependenciesDefinition
  {
    public static string Path => NxUtils.GetWorkspaceRoot() + "/package.json";

    [SerializeField]
    [JsonProperty("unityDependencies")]
    private Dependencies dependencies = new();

    [JsonIgnore]
    public Dependencies Dependencies => this.dependencies;

    public static GlobalDependenciesDefinition Get()
    {
      string jsonContent = File.ReadAllText(Path);
      return JsonConvert.DeserializeObject<GlobalDependenciesDefinition>(jsonContent);
    }

    public void RegisterInstalledPackage(PackageInfo package)
    {
      var packageName = package.name;
      package.TryFindPrivateBaseField("m_ProjectDependenciesEntry", out string dependencyReference);

      if (dependencyReference.StartsWith("file:"))
      {
        var packagesDirectory = NxUtils.GetWorkspaceRoot() + "/" + NxUtils.GetProjectRoot() + "/Packages";
        var absolutePath = packagesDirectory + "/" + dependencyReference.Substring(5);
        dependencyReference = "file:" + System.IO.Path.GetRelativePath(NxUtils.GetWorkspaceRoot(), absolutePath).Replace('\\', '/');;
      }

      this.dependencies.Add(packageName, dependencyReference);
    }

    public void Save()
    {
      this.dependencies.Sort();
      var fullStructure = JObject.Parse(File.ReadAllText(Path));
      fullStructure["unityDependencies"] = JObject.FromObject(this.dependencies);
      string newJsonContent = JsonConvert.SerializeObject(fullStructure, Formatting.Indented);
      File.WriteAllText(Path, newJsonContent);
    }
  }

  [Serializable]
  public class Dependencies : Dictionary<string, string>
  {
    public void Sort()
    {
      var sortedKeys = new List<string>(Keys);
      sortedKeys.Sort();
      var sortedDictionary = new Dictionary<string, string>();
      foreach (var key in sortedKeys)
      {
        sortedDictionary.Add(key, this[key]);
      }
      Clear();
      foreach (var key in sortedKeys)
      {
        Add(key, sortedDictionary[key]);
      }
    }
  }
}
