import path from "node:path";
import { Config } from "@remotion/cli/config";

// A composição MapaBrasil vem de ../src/motion/map (código da página). Estes aliases fazem
// esses arquivos usarem o React e o Remotion deste subprojeto, sem duas cópias no bundle.
const local = (m: string) => path.resolve(process.cwd(), "node_modules", m);
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      remotion: local("remotion"),
      react: local("react"),
      "react-dom": local("react-dom"),
    },
  },
}));

// Máquina sensível a travamentos: um quadro por vez.
Config.setConcurrency(1);
