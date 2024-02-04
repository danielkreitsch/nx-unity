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

    public void AddDependency(string name, string version)
    {
      this.dependencies.Add(name, version);
    }

    public void AddDependency(PackageInfo packageInfo)
    {
      var name = packageInfo.name;
      packageInfo.TryFindPrivateBaseField("m_ProjectDependenciesEntry", out string entry);
      this.AddDependency(name, entry);
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
