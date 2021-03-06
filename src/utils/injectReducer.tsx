import * as React from 'react';
import getInjectors from './reducerInjectors';
import * as PropTypes from 'prop-types';
import hoistNonReactStatics = require('hoist-non-react-statics');
import { SofaAction } from '../types';
/**
 * 动态注入reducer
 * 优点：效率高，相当于仅仅注入一个激活状态的reducer；
 * 缺点：在跨页面跳转时可能导致无法直接更新store;
 */
export default ({ key = '', reducer = (state: any, action: SofaAction) => {} }) => (WrappedComponent: React.ComponentClass) => {
  class ReducerInjector extends React.Component {
    static WrappedComponent = WrappedComponent;

    static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    static displayName = `withReducer(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;

    componentWillMount() {
      const { injectReducer } = this.injectors;

      injectReducer(key, reducer);
    }

    // eslint-disable-next-line
    injectors = getInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props}></WrappedComponent>;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};
