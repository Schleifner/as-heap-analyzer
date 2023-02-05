import { extractInputInfoFromWasm } from "../src/wasmParser";
import { readFileSync } from "fs";
import { join } from "path";

describe("extract input from wasm custom section", () => {
  test("ok", () => {
    const wasm = Uint8Array.from(readFileSync(join(__dirname, "ok.wasm")));
    expect(extractInputInfoFromWasm(wasm)).toMatchInlineSnapshot(`
      {
        "classInfo": {
          "0": "~lib/object/Object",
          "1": "~lib/arraybuffer/ArrayBuffer",
          "2": "~lib/string/String",
          "3": "~lib/arraybuffer/ArrayBufferView",
          "4": "assembly/index/A",
        },
        "heapBase": 133944,
      }
    `);
  });
  test("without heap analyzer custom section", () => {
    const wasm = Uint8Array.from(readFileSync(join(__dirname, "no_custom_section.wasm")));
    expect(() => extractInputInfoFromWasm(wasm)).toThrowError(`not transformed wasm`);
  });
  test("invalid wasm 1", () => {
    const wasm = Uint8Array.from([1, 2, 3]);
    expect(() => extractInputInfoFromWasm(wasm)).toThrowError(/invalid wasm/g);
  });
});
