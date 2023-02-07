# as-heap-analyzer

assemblyscript heap dump analysis tooling

## How to use

- install as-heap-analyzer

```bash
npm i -D as-heap-analyzer
```

- Before you build assemblyscript to wasm, add `--transform as-heap-analyzer/transform/addHeapAnalyzerInfo.mjs`
  or add following line in `asconfig.json`

```json
"transform": ["as-heap-analyzer/transform/addHeapAnalyzerInfo.mjs"]
```

### for run assemblyscript in nodejs

- run code and use `analysis` function

```js
import { memory } from "../build/debug.js";
import { readFileSync } from "fs";
import { analysis } from "as-heap-analyzer/dist/index.js";
import assert from "assert";

const wasm = readFileSync("build/debug.wasm");
const memoryUsage = analysis(memory, wasm);
memoryUsage.forEach((v, k) => console.log(`${k} use ${v} bytes`));
```

### for run assemblyscript in browser

- run code and use `analysis` function

```js
import { memory } from "./build/release.js";
import { analysis } from "as-heap-analyzer/dist/index.js";

const wasm = (await (await fetch(new URL("build/release.wasm", import.meta.url))).body.getReader().read()).value;
const memoryUsage = analysis(new Uint8Array(memory.buffer), wasm);
memoryUsage.forEach((v, k) => {
  document.body.innerText += `${k} use ${v} bytes\n`;
});
```

### for run assemblyscript in other device (self-diagnosis)

- use self-diagnosis API in assemblyscript to trace memory information to log

```ts
import { dumpUsedMemoryDetail } from "as-heap-analyzer/assembly/index";

trace(dumpUsedMemoryDetail());
```

- run cli

```bash
npx as-heap-analyzer frame <transformed_wasm_module_path>
```

- copy and paste self-diagnosis result from log to cli

- the result should be:

```
total memory usage is 48300
  class ~lib/arraybuffer/ArrayBuffer use 544 bytes
  class assembly/index/A use 6400 bytes
  class ~lib/array/Array<assembly/index/A> use 48 bytes
  class assembly/index/B use 32 bytes
```
