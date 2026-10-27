let current = 0;
let target = 4.16; // say delta was 4.16
let diff = target - current;
let animating = true;

for (let i = 0; i < 20; i++) {
  if (Math.abs(diff) < 0.5) {
    current = target;
    animating = false;
    break;
  }
  let step = diff * 0.12;
  // simulate browser truncating assignment to scrollTop
  current = Math.floor(current + step);
  diff = target - current;
  console.log(`Frame ${i}: step=${step}, current=${current}, diff=${diff}`);
}
