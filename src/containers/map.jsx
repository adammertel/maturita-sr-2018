import React, { Component } from 'react';
import Base from './../base';
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
  Marker,
  Tooltip
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
require('leaflet.markercluster.placementstrategies');

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

  handleOverDistrict(district) {
    store.setOverDistrict(district.name);
  }
  handleOutDistrict() {
    store.cancelOverDistrict();
  }

  render() {
    const zoom = store.map ? store.map.getZoom() : 0;

    const schoolsMarkers = Object.values(store.schools)
      .filter(s => s[store.subject + '_n'])
      //.filter((s, si) => si < 10)
      .filter(s => parseInt(s[store.subject + '_z'], 10))
      .filter(s => s.x && s.y)
      .map((school, si) => {
        const size = parseInt(school[store.subject + '_n'], 10) / 10 + 5;
        return (
          <Marker
            key={si}
            position={[parseFloat(school.y), parseFloat(school.x)]}
            icon={Base.icon(
              store.gradeColor(school[store.subject + '_z']),
              size
            )}
          >
            <Tooltip direction="right">
              <h4>{school.nazov}</h4>
            </Tooltip>
          </Marker>
        );
      });

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
                    onMouseMove={this.handleOverDistrict.bind(this, district)}
                    onMouseOut={this.handleOutDistrict.bind(this)}
                  />
                );
              })}
          </Pane>
          <Pane>
            <MarkerClusterGroup
              showCoverageOnHover={false}
              zoomToBoundsOnClick={true}
              removeOutsideVisibleBounds={true}
              elementsPlacementStrategy="clock"
              animate={false}
              singleMarkerMode={true}
              spiderLegPolylineOptions={{ weight: 0 }}
            >
              {schoolsMarkers}
            </MarkerClusterGroup>
          </Pane>
        </Map>
      </div>
    );
  }
}
