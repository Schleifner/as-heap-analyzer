import { AL_MASK, BLOCK_OVERHEAD, ROOT_SIZE } from "./constant";

export function calculateMemoryStart(heapBase: number): number {
  const rootOffset = (heapBase + AL_MASK) & ~AL_MASK;
  const memStart = ((rootOffset + ROOT_SIZE + BLOCK_OVERHEAD + AL_MASK) & ~AL_MASK) - BLOCK_OVERHEAD;
  return memStart;
}
