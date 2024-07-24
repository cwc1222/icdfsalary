import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

const { version, name, description } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch] = version
    // can only contain digits, dots, or dash
    .replace(/[^\d.-]+/g, "")
    // split into version parts
    .split(/[.-]/);

export default defineManifest(async () => ({
    manifest_version: 3,
    name: name,
    description: description,
    version: `${major}.${minor}.${patch}`,
    version_name: version,
    icons: {
        "16": "static/favicon-128.png",
        "32": "static/favicon-128.png",
        "48": "static/favicon-128.png",
        "128": "static/favicon-128.png",
    },
    content_scripts: [
        {
            //matches: ["https://*/*"],
            matches: ["https://web2.icdf.org.tw/*"],
            js: ["src/content.ts"],
        },
    ],
    //background: {
    //    service_worker: "src/background.ts",
    //},
    //options_ui: {
    //    page: "src/options.html",
    //    open_in_tab: false,
    //},
    //side_panel: {
    //    default_path: "src/sidepanel.html",
    //},
    action: {
        default_popup: "src/index.html",
    },
    //permissions: ["storage", "sidePanel"] as chrome.runtime.ManifestPermissions[],
}));
