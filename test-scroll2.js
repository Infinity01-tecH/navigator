let current = 0;
let target = 4.16;
let diff = target - current;
let animating = true;

for (let i = 0; i < 20; i++) {
  if (Math.abs(diff) < 0.5) {
    current = target;
    animating = false;
    break;
  }
  let step = diff * 0.12;
  const sign = Math.sign(step);
  const minStep = Math.abs(step) < 1 ? sign : step;
  
  current = Math.floor(current + minStep);
  diff = target - current;
  console.log(`Frame ${i}: step=${step}, minStep=${minStep}, current=${current}, diff=${diff}`);
}
