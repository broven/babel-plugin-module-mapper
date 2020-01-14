//TODO: a as function
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
describe('import', () => {
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
  it ('only import one', () => {
    const {code} = babel.transformSync(`
    import { a } from 'origin';
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
});
describe('imported', () => {
  it('import', () => {
    const {code} = babel.transformSync(`
    import {a, b} from 'origin';
    console.log(a.b);
    `, opt);
    expect(code).toMatchSnapshot();
  });
   it ('use default import name', () => {
    const {code} = babel.transformSync(`
    import originDefault from 'origin';
    console.log(originDefault.a);
    `, {
      babelrc: false,
      plugins: [
        [plugin, {
          origin: {
           originDefault: ['destModule', 'a']
        }}]
      ]
    });
    expect(code).toMatchSnapshot();
  });
  // it ('use default import name', () => {
  //   const {code} = babel.transformSync(`
  //   import originDefault from 'origin';
  //   console.log(originDefault.a);
  //   const { a } = originDefault;
  //   const testVar = originDefault.a;
  //   `, opt);
  //   expect(code).toMatchSnapshot();
  // });
})

describe('real world case', () => {
  it ('propTypes', () => {
    const {code} = babel.transformSync(`
    import Nerv, { PropTypes, PureComponent } from 'nervjs';
    let contextTypes = {
      onClose: PropTypes.func
    };
    `, {
      babelrc: false,
      plugins: [
        [plugin, {
          nervjs: {
            PropTypes: ['prop-types', 'default']
        }}]
      ]
    });
    expect(code).toMatchSnapshot();
  });
  it ('multiple property mapper', () => {
    const {code} = babel.transformSync(`
    import Nerv, { PropTypes, PureComponent } from 'nervjs';
    let contextTypes = {
      onClose: PropTypes.func
    };
    `, {
      babelrc: false,
      plugins: [
        [plugin, {
          nervjs: {
            PropTypes: ['prop-types', 'default'],
            Nerv: ['react', 'default', 'React'],
            PureComponent: ['react', 'PureComponent']
        }}]
      ]
    });
    expect(code).toMatchSnapshot();
  });
  it ('should not throw error', () => {
    const {code} = babel.transformSync(`
    import 'weui'
    import Nerv from 'nervjs'
    import PickerGroup from './picker-group'
    import classNames from 'classnames'
    import { TOP, LINE_HEIGHT } from './constant'
    import * as dateHandle from './date'
    import './style/index.scss'

    `, {
      babelrc: false,
      plugins: [
        [plugin, {
          nervjs: {
            PropTypes: ['prop-types', 'default'],
            Nerv: ['react', 'default', 'React'],
            PureComponent: ['react', 'PureComponent']
        }}]
      ]
    });
    expect(code).toMatchSnapshot();
  });
})
