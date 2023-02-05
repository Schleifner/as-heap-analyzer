const AL_BITS = 4;
const AL_SIZE = 1 << AL_BITS;
export const AL_MASK = AL_SIZE - 1;

const SL_BITS = 4;
const SL_SIZE = 1 << SL_BITS;

const SB_BITS = SL_BITS + AL_BITS;

const FL_BITS = 31 - SB_BITS;

const SL_START = 4;
const SL_END = SL_START + (FL_BITS << 2);
export const HL_START = (SL_END + AL_MASK) & ~AL_MASK;
const HL_END = HL_START + FL_BITS * SL_SIZE * 4;
export const ROOT_SIZE = HL_END + 4;

export const BLOCK_OVERHEAD = 4;

export const BLOCK_MIN_SIZE = ((3 * 4 + BLOCK_OVERHEAD + AL_MASK) & ~AL_MASK) - BLOCK_OVERHEAD; // prev + next + back
