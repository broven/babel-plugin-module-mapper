const babel = require('@babel/core');
const plugin = require('../index');

const opt = {
  babelrc: false,
  plugins: [
    [plugin, {
      origin: {
      a: ['destModule', 'a']
    }}]
  ]
};

var example = `
import {a, b} from 'origin';
`;

it('simple Usage', () => {
  const {code} = babel.transformSync(example, opt);
  expect(code).toMatchSnapshot();
});
it('with local name', () => {
  const {code} = babel.transformSync(`
  import {a as c, b} from 'origin';
  `, opt);
  expect(code).toMatchSnapshot();
})
it('rewrite to default', () => {
  const {code} = babel.transformSync(`
  import {a as c, b} from 'origin';
  `, {
    babelrc: false,
    plugins: [
      [plugin, {
        origin: {
        a: ['destModule', 'default']
      }}]
    ]
  });
  expect(code).toMatchSnapshot();
})