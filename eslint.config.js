import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["web/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-unused-vars": ["warn", { args: "none", caughtErrors: "none" }],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-restricted-properties": [
        "error",
        {
          object: "document",
          property: "write",
          message: "Do not use document.write; render into #app or #screen."
        }
      ]
    }
  },
  {
    files: ["web/js/domain/**/*.js"],
    rules: {
      "no-restricted-globals": ["error", "document", "localStorage", "sessionStorage", "setTimeout", "setInterval"],
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='G'][property.name=/^(services|router)$/]",
          message: "Domain models must stay pure and cannot access G.services or G.router."
        }
      ]
    }
  },
  {
    files: ["web/js/application/**/*.js"],
    rules: {
      "no-restricted-globals": ["error", "document", "setTimeout", "setInterval"],
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='G'][property.name='router']",
          message: "Application services cannot control navigation (G.router)."
        }
      ]
    }
  },
  {
    files: ["web/js/features/**/*.js", "web/js/shared/**/*.js"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='G'][property.name=/^(AndroidRuntimeAdapter|SampleMediaRepository|SampleAlbumRepository|SampleFileOperationAdapter|SamplePrivateVaultAdapter|SampleImportAdapter|SampleCompositionAdapter|SampleWallpaperAdapter|LocalArchiveAdapter)$/]",
          message: "UI layers must call G.services.* instead of reaching directly into runtime or sample adapters."
        }
      ]
    }
  }
];
