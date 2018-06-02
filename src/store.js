import { observable, action, computed, toJS } from 'mobx';
import Base from './base.js';

export default class AppStore {
  @observable _mapExtent;
  @observable _subject;
  subjects = [
    {
      id: 'sj',
      label: 'slovenský jazyk'
    },
    {
      id: 'm',
      label: 'matematika'
    }
  ];

  constructor() {
    this._map = observable.box(false);
    this._subject = observable.box('sj');
    this._mapExtent = observable.box(
      L.latLngBounds(L.latLng(47, 18), L.latLng(50, 23))
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
    }
  }
}
