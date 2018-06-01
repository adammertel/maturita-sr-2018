import React from 'react';
import { observer } from 'mobx-react';

import Base from './../base';
import AppMap from './map';
import ErrorBoundary from './errorboundary';
import Panel from './panel';

@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ErrorBoundary>
          <Panel />
          <AppMap />
        </ErrorBoundary>
      </div>
    );
  }
}
