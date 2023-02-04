# as-heap-analyzer

assemblyscript heap dump analysis tooling

## How to use

1. install as-heap-analyzer

```bash
npm i -D as-heap-analyzer
```

2. Before you build assemblyscript to wasm, add `--transform as-heap-analyzer/transform/addHeapAnalyzerInfo.mjs`
   or add following line in `asconfig.json`

```json
"transform": ["as-heap-analyzer/transform/addHeapAnalyzerInfo.mjs"]
```

3. run code and use `analysis` function

```js
import { memory } from "../build/debug.js";
import { readFileSync } from "fs";
import { analysis } from "as-heap-analyzer/dist/index.js";
import assert from "assert";

const wasm = readFileSync("build/debug.wasm");

const memoryUsage = analysis(memory, wasm);
memoryUsage.forEach((v, k) => console.log(`${k} use ${v} bytes`));
```
