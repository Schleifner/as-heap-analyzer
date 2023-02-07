const MEMORY_DETAIL_SIZE: u32 = isDefined(PREDEFINED_MEMORY_DETAIL_SIZE) ? PREDEFINED_MEMORY_DETAIL_SIZE : 1024;
export const memoryDetail: u32 = u32(memory.data(MEMORY_DETAIL_SIZE * 4));

export function getUsedMemorySize(): u32 {
  __collect();
  memory.fill(memoryDetail, 0, MEMORY_DETAIL_SIZE * 4);
  const rootOffset: u32 = (u32(__heap_base) + 15) & ~15;
  const memStart: u32 = ((rootOffset + 1572 + 4 + 15) & ~15) - 4;
  const totalMemory: u32 = u32(memory.size()) * 64 * 1024;
  let result: u32 = memStart;
  let next: u32 = memStart;
  while (next < totalMemory - 4) {
    const currentOffset: u32 = next;
    const memoryInfo: u32 = load<u32>(currentOffset);
    const blockSize: u32 = (4 + memoryInfo) & ~3;
    next += blockSize;
    if (blockSize < 16 || currentOffset + blockSize >= totalMemory) {
      return -1;
    }
    if ((memoryInfo & 1) == 1) {
      continue;
    }
    result += blockSize;
    const objectSize: u32 = load<u32>(currentOffset, 4 * 4);
    if (objectSize + 4 * 4 > memoryInfo) {
      continue;
    }
    if (load<u32>(currentOffset, 4) == 0 && load<u32>(currentOffset, 2 * 4) == 0) {
      continue;
    }
    const runtimeId: u32 = load<u32>(currentOffset, 3 * 4);
    if (runtimeId < MEMORY_DETAIL_SIZE) {
      store<u32>(memoryDetail + runtimeId * 4, load<u32>(memoryDetail + runtimeId * 4) + blockSize);
    }
  }
  return result;
}

export function dumpUsedMemoryDetail(): string {
  const totalUsage = getUsedMemorySize();
  let result = `{\n\ttotalUsage: ${totalUsage},\n\tclassDetail: {\n`;
  let classDetail: string[] = [];
  for (let i: u32 = 0; i < MEMORY_DETAIL_SIZE; i++) {
    const v = load<u32>(memoryDetail + i * 4);
    if (v != 0) {
      classDetail.push(`\t\t"${i}": ${v}`);
    }
  }
  result += classDetail.join(",\n");
  result += `\n\t}\n}`;
  return result;
}
