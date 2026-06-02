import libraryConfig from "./packages/eslint-config/library.js";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/node_modules/**",
      "apps/docs/.vitepress/cache/**",
      "apps/docs/.vitepress/dist/**",
    ],
  },
  ...libraryConfig.map((config) => ({
    ...config,
    files: ["toolkit/*/ts/src/**/*.ts", "toolkit/*/ts/src/**/*.tsx"],
  })),
];
