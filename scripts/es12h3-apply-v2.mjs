import fs from "node:fs";

const sourcePath = new URL("./es12h3-apply.mjs", import.meta.url);
let source = fs.readFileSync(sourcePath, "utf8");

source = source.replace(
  'assert.ok(max<=140, `${formation} total=${total} radius=${max}`);',
  'assert.ok(max<=140, "formation="+formation+" total="+total+" radius="+max);',
);
source = source.replace(
  'sessionId:`h3:${sector}`',
  'sessionId:"h3:"+sector',
);

const target = "/tmp/es12h3-apply-fixed.mjs";
fs.writeFileSync(target, source, "utf8");
await import(`file://${target}?v=${Date.now()}`);
