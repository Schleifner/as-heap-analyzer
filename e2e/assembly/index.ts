import { dumpUsedMemoryDetail } from "../../assembly/index";

class A {
  a: i32 = 10;
  a1: i32 = 10;
  a2: i32 = 10;
  a3: i32 = 10;
  a4: i32 = 10;
  a5: i32 = 10;
  a6: i32 = 10;
  a7: i32 = 10;
  b: string = "I am string in class A";
}

class B {}

export function _start(): void {
  let t: A[] = [];

  for (let i = 0; i < 100; i++) {
    t.push(new A());
    let b = new B();
  }

  trace(dumpUsedMemoryDetail());
}
