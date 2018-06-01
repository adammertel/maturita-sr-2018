import { observable, action, computed, toJS } from 'mobx';
import Base from './base.js';

export default class AppStore {
  @observable _mapExtent;

  constructor() {
    this._map = observable.box(false);
    this._mapExtent = observable.box(
      L.latLngBounds(L.latLng(20, 0), L.latLng(40, 50))
    );
  }

  @computed
  get map() {
    return toJS(this._map);
  }

  @computed
  get mapExtent() {
    return toJS(this._mapExtent);
  }

  @action
  loadMap(map) {
    this._map.set(map);
  }

  @action
  mapMoved(e) {
    if (store.map) {
      store._mapExtent.set(store.map.getBounds());
    }
  }
}
