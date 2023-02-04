import * as assemblyscript from "assemblyscript";
import { Transform } from "assemblyscript/transform";

class AddHeapAnalyzerInfo extends Transform {
  getHeapBase(module) {
    let heapBaseGlobalRef = module.getGlobal("~lib/memory/__heap_base");
    let heapBaseValue = assemblyscript.getConstValueI32(assemblyscript.getGlobalInit(heapBaseGlobalRef));
    return heapBaseValue;
  }
  getClassInfo() {
    let result = {};
    for (const [k, v] of this.program.managedClasses) {
      result[k] = v.internalName;
    }
    return result;
  }

  afterCompile(module) {
    const heapBase = this.getHeapBase(module);
    const classInfo = this.getClassInfo(module);

    module.addCustomSection(
      "heapAnalyzerInfo",
      Uint8Array.from(Buffer.from(JSON.stringify({ heapBase, classInfo }), "utf8"))
    );
  }
}
export default AddHeapAnalyzerInfo;
