const bufferPoints = require('../cjs');

const assert = (current, expected) => {
  if (!Object.is(current, expected))
    throw new Error(`expected ${expected} but got ${current}`);
};

const decoder = new TextDecoder();
const encoder = new TextEncoder();

const decode = value => decoder.decode(value);
const encode = value => encoder.encode(value);

const result = [];

const buffered = bufferPoints(buffer => {
  result.push(decode(buffer));
});

const test = c => {
  const points = [...c];
  // console.log('testing', points);
  buffered(encode(c));
  assert(result.length, points.length);
  assert(JSON.stringify(result), JSON.stringify(points));
  result.splice(0);
};

test('u');
test('µ');
test('💩');
test('🤷‍♂️');
test('👩‍❤️‍👨');
test('aaa🤷‍♂️bbb');
