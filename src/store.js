import { observable, action, computed, toJS } from 'mobx';
import Base from './base.js';
import turf from 'turf';

export default class AppStore {
  @observable _mapExtent;
  @observable _subject;
  _districts = [];
  subjects = [
    {
      id: 'm',
      label: 'matematika'
    },
    {
      id: 'sj',
      label: 'slovenský jazyk'
    }
  ];
  districtColors = [
    '#ffffe5',
    '#f7fcb9',
    '#d9f0a3',
    '#addd8e',
    '#78c679',
    '#41ab5d',
    '#238443',
    '#006837',
    '#004529'
  ].reverse();

  constructor() {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    this._map = observable.box(false);
    this._subject = observable.box('sj');
    this._mapExtent = observable.box(
      L.latLngBounds(L.latLng(47, 18), L.latLng(50, 23))
    );
    const districtsData = require('./../data/okresy.json');
    const schoolsData = require('./../data/schools.json');
    this.schools = schoolsData;
    this._districts = districtsData.features;

    this._districts.map(district => {
      const schoolsInDistrict = Object.values(this.schools).filter(
        school => school.okres === district.properties.TXT
      );
      this.subjects.map(subject => {
        const sumOfAllGrades = Base.sumArray(
          schoolsInDistrict.map(school => {
            const students = parseInt(school[subject.id + '_n'], 10) || 0;
            const grade = parseFloat(school[subject.id + '_z']) || 0;
            //console.log(school.nazov, school.mesto, students, grade);
            return students * grade;
          })
        );
        const allStudents = Base.sumArray(
          schoolsInDistrict.map(school => {
            const students = parseInt(school[subject.id + '_n'], 10) || 0;
            return students;
          })
        );

        /* console.log(
          district.properties.TXT,
          sumOfAllGrades,
          allStudents,
          schoolsInDistrict.length
        ); */
        district.properties['avg_' + subject.id] = sumOfAllGrades / allStudents;
      });
    });
  }

  gradeColor(grade) {
    return grade && grade > 1
      ? this.districtColors[
          Math.ceil((grade - 1) / 4 * (this.districtColors.length - 1))
        ]
      : 'grey';
  }

  @computed
  get districts() {
    return this._districts.map(district => {
      return {
        geo: turf.flip(district.geometry).coordinates,
        name: district.properties.TXT,
        grade: district.properties['avg_' + store.subject]
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
