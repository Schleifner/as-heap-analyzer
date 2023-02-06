import { memory, _start } from "../build/debug.js";
import { readFileSync } from "fs";
import { analysis } from "../../dist/index.js";
import assert from "assert";

_start();

const wasm = readFileSync("build/debug.wasm");

const memoryUsage = analysis(new Uint8Array(memory.buffer), wasm);
memoryUsage.forEach((v, k) => console.log(`${k} use ${v} bytes`));

assert(memoryUsage.get("assembly/index/A") == 6400);
assert(memoryUsage.get("assembly/index/B") == 3200);
