import fs from "node:fs";
import { pathToFileURL } from "node:url";

const sourcePath = new URL("./es12h4-apply.mjs", import.meta.url);
let source = fs.readFileSync(sourcePath, "utf8");

source = source.replace(
  '`DOCTRINA DE ENJAMBRE: veterano L${newLevel} habilita slot ${doctrineCapacityAfter}/30.`',
  '"DOCTRINA DE ENJAMBRE: veterano L" + newLevel + " habilita slot " + doctrineCapacityAfter + "/30."',
);

const fixedPath = "/tmp/es12h4-apply-fixed.mjs";
fs.writeFileSync(fixedPath, source, "utf8");
await import(pathToFileURL(fixedPath).href + `?t=${Date.now()}`);
