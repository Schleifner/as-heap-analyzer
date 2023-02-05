import { BLOCK_MIN_SIZE } from "./constant";

class MemoryBlock {
  static MEMORY_INFO_POSITION = 0;
  static RUNTIME_ID_POSITION = 3;
  static OBJECT_SIZE_POSITION = 4;

  constructor(public data_: number[]) {}

  isManagedMemoryBlock(): boolean {
    if (this.data_.length < 4) {
      return false;
    }
    const objectSize = this.data_[MemoryBlock.OBJECT_SIZE_POSITION];
    if (objectSize == undefined || objectSize / 4 + 5 > this.data_.length) {
      return false;
    }
    return true;
  }

  isAllocated(): boolean {
    const memoryInfo = this.data_[0];
    if (memoryInfo == undefined) {
      throw RangeError();
    }
    return (memoryInfo & 1) == 0;
  }

  get runtimeId(): number {
    const id = this.data_[MemoryBlock.RUNTIME_ID_POSITION];
    if (id == undefined) {
      throw RangeError();
    }
    return id;
  }

  get size(): number {
    const memoryInfo = this.data_[MemoryBlock.MEMORY_INFO_POSITION];
    if (memoryInfo == undefined) {
      throw RangeError();
    }
    return (4 + memoryInfo) & ~3;
  }
}

export function splitMemoryBlock(data: Uint32Array, memoryStart: number): Map<number, MemoryBlock> {
  const result = new Map<number, MemoryBlock>();
  let next = memoryStart;
  while (next < data.length - 1) {
    const currentOffset = next;
    const memoryInfo = data[next];
    if (memoryInfo == undefined) {
      break;
    }
    next += 1 + memoryInfo / 4;
    const blockSize = (4 + memoryInfo) & ~3;
    if (blockSize <= BLOCK_MIN_SIZE) {
      throw Error(`broken heap`);
    }
    result.set(currentOffset, new MemoryBlock(Array.from(data.slice(currentOffset, next - 1))));
  }
  return result;
}
