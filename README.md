# Nx Unity

This repository contains two projects that integrate Unity development with Nx workspaces:

1. An Nx plugin for Unity projects
2. A Unity package to enable all plugin features

## Nx Plugin

Location: `packages/nx-unity`

This plugin allows you to seamlessly integrate Unity projects into your Nx workspace. It provides custom executors and generators to streamline your Unity development workflow within the Nx ecosystem.

## Unity Package

Location: `packages/unity-package`

This Unity package should be referenced in all Unity projects within your Nx workspace to fully utilize the features provided by the Nx plugin.

## Getting Started

Install the Nx plugin in your Nx workspace:

```shell
npm install --save-dev nx-unity
```

### New Project

If you want to start a new Unity project, generate one with the following command:

```shell
npx nx generate nx-unity:project
```

That's it! You can now open the generated Unity project in Unity Hub and start developing.

### Existing Project

Integrating Nx into an existing Unity project is also possible, but requires manual setup.

1. Create a `project.json` file in the root of your Unity project. Below is a minimal example with a build target for Windows:

```json
{
  "name": "client",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "apps/<projectName>/Assets",
  "targets": {
    "build": {
      "executor": "nx-unity:build",
      "configurations": {
        "windows": {
          "executeMethod": "BuildCommands.BuildWindows"
        }
      },
      "defaultConfiguration": "windows"
    }
  }
}
```

2. Add the Unity package to the Unity project using OpenUPM:

```shell
npm install -g openupm-cli
openupm add com.danielkreitsch.nx-unity -r http://verdaccio.danielkreitsch.com
```

## Support

Encountered an issue or have suggestions for improvements?
Feel free to [raise an issue](https://github.com/danielkreitsch/nx-unity/issues/new).

Contributions are welcome!
