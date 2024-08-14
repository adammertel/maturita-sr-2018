import { action, computed, observable, toJS } from "mobx";
import turf from "turf";

export default class AppStore {
  @observable _mapExtent;
  @observable _subject;
  @observable _overDistrict;
  _districts = [];
  subjects = [
    {
      id: "m",
      label: "matematika",
    },
    {
      id: "sj",
      label: "slovenský jazyk",
    },
    {
      id: "aj",
      label: "anglický jazyk B1",
    },
  ];

  districtColors = [
    "#a50026",
    "#d73027",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#ffffbf",
    "#d9ef8b",
    "#a6d96a",
    "#66bd63",
    "#1a9850",
    "#006837",
  ].reverse();

  constructor() {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    this._map = observable.box(false);
    this._overDistrict = observable.box(false);
    this._subject = observable.box("sj");
    this._mapExtent = observable.box(
      L.latLngBounds(L.latLng(47, 18), L.latLng(50, 23))
    );
    const districtsData = require("./../data/districts.json");
    const schoolsData = require("./../data/schools.json");
    this.schools = schoolsData;
    this._districts = districtsData.features;
  }

  gradeColor(grade) {
    return grade && grade > 1
      ? this.districtColors[
          Math.ceil(
            0.0001 + ((grade - 1) / 4) * (this.districtColors.length - 1)
          )
        ]
      : "grey";
  }

  @computed
  get districts() {
    return this._districts.map((district) => {
      return {
        geo: turf.flip(district.geometry).coordinates,
        name: district.properties.TXT,
        grade: district.properties["avg_" + store.subject],
      };
    });
  }
  @computed
  get map() {
    return toJS(this._map);
  }
  @computed
  get mapExtent() {
    return toJS(this._mapExtent);
  }
  @computed
  get overDistrict() {
    return store._overDistrict === false
      ? false
      : store._districts.find(
          (d) => d.properties.TXT === toJS(store._overDistrict)
        );
  }

  @computed
  get overDistrictSchools() {
    return store.overDistrict
      ? Object.values(store.schools).filter(
          (school) => school.okres === store.overDistrict.properties.TXT
        )
      : [];
  }

  @computed
  get subject() {
    return toJS(this._subject);
  }

  @action
  loadMap(map) {
    this._map.set(map);
  }

  @action
  changeSubject(newSubject) {
    this._subject.set(newSubject);
  }

  @action
  mapMoved(e) {
    if (store.map) {
      store._mapExtent.set(store.map.getBounds());
      if (store.map.getZoom() < 11) {
        store.cancelOverDistrict();
      }
    }
  }

  @action
  cancelOverDistrict() {
    store._overDistrict.set(false);
  }
  @action
  setOverDistrict(district) {
    store._overDistrict.set(district);
  }
}
