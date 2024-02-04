using System;
using System.Linq;
using System.Reflection;

namespace NxUnity
{
  public static class ReflectionUtils
  {
    /// <summary>
    /// Tries to find a private field in class or in any of the parent classes.
    /// </summary>
    /// <typeparam name="T">type of object</typeparam>
    /// <param name="obj">object to search from</param>
    /// <param name="name">name of the field</param>
    /// <param name="value">found value</param>
    /// <returns>true if value was found</returns>
    public static bool TryFindPrivateBaseField<T>(this object obj, string name, out T value)
    {
      Type t = obj.GetType();
      bool found = false;
      value = default(T);
      do
      {
        var field = t.GetFields(BindingFlags.Default | BindingFlags.NonPublic | BindingFlags.Instance)
          .FirstOrDefault(f => f.Name == name);
        if (field != default(FieldInfo))
        {
          value = (T)field.GetValue(obj);
          found = true;
        }
        else
        {
          t = t.BaseType;
        }
      } while (!found && t != null);

      return found;
    }
  }
}
