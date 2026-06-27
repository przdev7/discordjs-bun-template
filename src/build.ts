await Bun.build({
  entrypoints: ["src/main.ts"],
  tsconfig: "./tsconfig.build.json",
  outdir: "./dist",
  external: ["discord.js", "joi", "prettier"],
  target: "bun",
});
