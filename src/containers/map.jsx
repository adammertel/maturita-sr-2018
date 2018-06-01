import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import {
  Map,
  LayerGroup,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  ScaleControl,
  AttributionControl
} from 'react-leaflet';
require('leaflet.measure');

@observer
export default class AppMap extends React.Component {
  constructor(props) {
    super(props);
  }

  style() {
    return {
      position: 'absolute',
      left: 500,
      right: 0,
      bottom: 0,
      top: 0
    };
  }

  mapStyle() {
    return {
      width: '100%',
      height: '100%'
    };
  }

  componentDidMount() {
    store.loadMap(this.refs.map.leafletElement);
  }

  render() {
    return (
      <div className="map-wrapped" style={this.style()}>
        <Map
          onViewportChanged={store.mapMoved}
          useFlyTo={true}
          ref="map"
          style={this.mapStyle()}
          attributionControl={false}
          bounds={store.mapExtent}
        >
          <ScaleControl position="topleft" imperial={false} />
          <AttributionControl position="bottomleft" />

          <LayerGroup>
            <TileLayer
              url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              attribution="&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
            />
          </LayerGroup>
        </Map>
      </div>
    );
  }
}
