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
  AttributionControl,
  Pane,
  Polygon,
  CircleMarker
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
      left: 0,
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
    const zoom = store.map ? store.map.getZoom() : 0;
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
          <Pane>
            {zoom < 11 &&
              store.districts.map(district => {
                return (
                  <Polygon
                    key={district.name}
                    positions={district.geo}
                    fillColor={store.gradeColor(district.grade)}
                    fillOpacity={0.6}
                    weight="1"
                    color="white"
                    smoothFactor="1"
                  />
                );
              })}
          </Pane>
          <Pane>
            {zoom > 9 &&
              Object.values(store.schools)
                .filter(s => s[store.subject + '_n'])
                .filter(s => parseInt(s[store.subject + '_z'], 10))
                .filter(s => s.x && s.y)
                .map((school, si) => {
                  return (
                    <CircleMarker
                      key={si}
                      center={[school.y, school.x]}
                      radius={school[store.subject + '_n'] / 30 + 3}
                      fillOpacity={0.6}
                      fillColor={store.gradeColor(school[store.subject + '_z'])}
                      color="black"
                      weight="1.5"
                    />
                  );
                })}
          </Pane>
        </Map>
      </div>
    );
  }
}
