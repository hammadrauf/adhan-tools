import fs from "fs";
import YAML from "yaml";

export function loadConfig(path) {
  const raw = fs.readFileSync(path, "utf8");
  return YAML.parse(raw);
}