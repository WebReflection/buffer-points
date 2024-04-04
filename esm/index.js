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
  const bytes = [];
  let needed = 0;
  return buffer => {
    let written = 0;
    for (const byte of buffer) {
      bytes.push(byte);
      // @see https://encoding.spec.whatwg.org/#utf-8-bytes-needed
      if (needed) needed--;
      else if (0xc2 <= byte && byte <= 0xdf) needed = 1;
      else if (0xe0 <= byte && byte <= 0xef) needed = 2;
      else if (0xf0 <= byte && byte <= 0xf4) needed = 3;
      if (!needed) {
        written += bytes.length;
        stdio(new Uint8Array(bytes.splice(0)));
      }
    }
    return written;
  };
};

export default bufferPoints;
