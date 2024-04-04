/**
 * Create a callback that will forward, to the argument callback,
 * the buffer only once its code points have been resolved.
 * 
 * It solves codepoints accordingly with the standard:
 * https://encoding.spec.whatwg.org/#utf-8-bytes-needed
 * 
 * It returns the amount of written bytes if needed by the
 * REPL or any other abstraction behind the scene.
 * @param {(buffer: Uint8Array) => unknown} stdio
 * @returns {(buffer: Uint8Array) => number}
 */
const bufferPoints = stdio => {
  const acc = [];
  let needed = 0;
  return (buffer) => {
    let written = 0;
    for (const c of buffer) {
      acc.push(c);
      // @see https://encoding.spec.whatwg.org/#utf-8-bytes-needed
      if (needed) needed--;
      else if (0xc2 <= c && c <= 0xdf) needed = 1;
      else if (0xe0 <= c && c <= 0xef) needed = 2;
      else if (0xf0 <= c && c <= 0xf4) needed = 3;
      if (!needed) {
        const out = new Uint8Array(acc.splice(0));
        written += out.length;
        stdio(out);
      }
    }
    return written;
  };
};

export default bufferPoints;
