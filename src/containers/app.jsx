import { observer } from "mobx-react";
import React from "react";

import DistrictPanel from "./districtpanel";
import ErrorBoundary from "./errorboundary";
import AppMap from "./map";
import Panel from "./panel";

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
          <DistrictPanel />
          <AppMap />
        </ErrorBoundary>
      </div>
    );
  }
}
