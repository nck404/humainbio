// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import catppuccin from "@catppuccin/starlight";
import starlightSiteGraph from "starlight-site-graph";
// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      plugins: [

        catppuccin({
          dark: { flavor: "macchiato", accent: "pink" },
          light: { flavor: "latte", accent: "pink" },
        }),
        starlightSiteGraph(),
      ],
      customCss: ["./src/styles/custom.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
