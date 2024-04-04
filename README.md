# buffer-points

A module that buffers code points before flushing these as single char.

```js
import bufferPoints from 'buffer-points';

const encoder = new TextEncoder;
const decoder = new TextDecoder;

const buffered = bufferPoints(buffer => {
  console.log(escape(decoder.decode(buffer)));
});

const test = encoder.encode('🤷‍♂️');
console.log(buffered(test), test.length, 'bytes parsed');

/*
%uD83E%uDD37
%u200D
%u2642
%uFE0F
13 13 bytes parsed
*/

```

That's it.
