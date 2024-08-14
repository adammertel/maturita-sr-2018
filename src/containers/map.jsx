import { observer } from "mobx-react";
import React from "react";
import {
  AttributionControl,
  LayerGroup,
  Map,
  Marker,
  Pane,
  Polygon,
  Popup,
  ScaleControl,
  TileLayer,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import Base from "./../base";
require("leaflet.markercluster.placementstrategies");

@observer
export default class AppMap extends React.Component {
  constructor(props) {
    super(props);
  }

  style() {
    return {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    };
  }

  mapStyle() {
    return {
      width: "100%",
      height: "100%",
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

    const containerStyle = { marginTop: "4px" };
    const listStyle = { listStyle: "circle", marginLeft: "10px", padding: 0 };
    const listItemStyle = {
      display: "list-item",
      marginBottom: "2px",
      marginLeft: "5px",
    };

    const listItemLineStyle = {
      display: "flex",
      gap: "2px 2px",
      alignItems: "center",
    };

    const gradeStyle = (grade) => ({
      display: "flex",
      backgroundColor: store.gradeColor(grade),
      padding: "1px 5px",
      fontWeight: "bold",
      borderRadius: "3px",
      marginLeft: "5px",
    });

    const schoolsMarkers = Object.values(store.schools)
      .filter((s) => s[store.subject + "_n"])
      //.filter((s, si) => si < 10)
      .filter((s) => parseInt(s[store.subject + "_z"], 10))
      .filter((s) => s.x && s.y)
      .map((school, si) => {
        const size = parseInt(school[store.subject + "_n"], 10) / 6 + 10;
        return (
          <Marker
            key={si}
            position={[parseFloat(school.y), parseFloat(school.x)]}
            icon={Base.icon(
              store.gradeColor(school[store.subject + "_z"]),
              size
            )}>
            <Popup direction="right">
              <div>
                <div style={{ fontWeight: "bold" }}>{school.nazov}</div>
                <div>{school.adresa}</div>
                <div>{school.okres}</div>
                <div>{school.mesto}</div>

                <div style={containerStyle}>
                  <ul style={listStyle}>
                    {school.sj_z && (
                      <li key="sj" style={listItemStyle}>
                        <div style={listItemLineStyle}>
                          Slovenský jazyk:
                          <div style={gradeStyle(school.sj_z)}>
                            {school.sj_z}
                          </div>
                          ({school.sj_n} študentov)
                        </div>
                      </li>
                    )}
                    {school.m_z && (
                      <li key="m" style={listItemStyle}>
                        <div style={listItemLineStyle}>
                          Matematika:
                          <div style={gradeStyle(school.m_z)}>{school.m_z}</div>
                          ({school.m_n} študentov)
                        </div>
                      </li>
                    )}
                    {school.aj_z && (
                      <li key="aj" style={listItemStyle}>
                        <div style={listItemLineStyle}>
                          Anglický jazyk B1:
                          <div style={gradeStyle(school.aj_z)}>
                            {school.aj_z}
                          </div>
                          ({school.aj_n} študentov)
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </Popup>
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
          bounds={store.mapExtent}>
          <ScaleControl position="topleft" imperial={false} />
          <AttributionControl position="bottomleft" />

          <LayerGroup>
            <TileLayer
              url="https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              attribution={
                '© <a href="/copyright">OpenStreetMap contributors</a>. Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>. <a href="https://wiki.osmfoundation.org/wiki/Terms_of_Use">Website and API terms</a>'
              }
            />
          </LayerGroup>
          <Pane style={{ mixBlendMode: "multiply" }}>
            {zoom < 13 &&
              store.districts
                .filter((district) => {
                  const selected = store.overDistrict
                    ? store.overDistrict.properties.TXT === district.name
                    : false;
                  return selected;
                })
                .map((district) => {
                  return (
                    <Polygon
                      key={district.name}
                      positions={district.geo}
                      fillColor={store.gradeColor(district.grade)}
                      fillOpacity={1}
                      style={{ mixBlendMode: "multiply" }}
                      weight={2}
                      color={"black"}
                      smoothFactor="1"
                    />
                  );
                })}
          </Pane>
          <Pane style={{ mixBlendMode: "multiply" }}>
            {zoom < 13 &&
              store.districts.map((district) => {
                return (
                  <Polygon
                    key={district.name}
                    positions={district.geo}
                    fillColor={store.gradeColor(district.grade)}
                    fillOpacity={0.4}
                    style={{ mixBlendMode: "multiply" }}
                    weight={1}
                    color={"white"}
                    smoothFactor="1"
                    onMouseOver={this.handleOverDistrict.bind(this, district)}
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
              spiderLegPolylineOptions={{ weight: 0 }}>
              {schoolsMarkers}
            </MarkerClusterGroup>
          </Pane>
        </Map>
      </div>
    );
  }
}
