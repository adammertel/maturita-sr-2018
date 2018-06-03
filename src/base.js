import { divIcon } from 'leaflet';

var Base = {
  sortAlphabetical(array, by) {
    const sortedArray = array.slice();
    sortedArray.sort((a, b) => {
      return a[by].toUpperCase() > b[by].toUpperCase() ? 1 : -1;
    });
    return sortedArray;
  },

  label() {
    return 'todo example';
  },

  sumArray(arr) {
    let sum = 0;
    arr.forEach(a => (sum += a));
    return sum;
  },

  icon(color, size) {
    const s = size;
    return divIcon({
      html:
        '<svg height="' +
        (s + 5) +
        '" width="' +
        (s + 5) +
        '">' +
        '<circle cx="' +
        (s / 2 + 2) +
        '" cy="' +
        (s / 2 + 2) +
        '" r="' +
        s / 2 +
        '" stroke="black" stroke-width="1" fill="' +
        color +
        '" />' +
        '</svg>',
      /*         '<span style="' +
        style +
        '; vertical-align: bottom"' +
        ' class="icon">' +
        '<i style="font-size:' +
        size[0] +
        'px" class="' +
        classes +
        '"></i></span>', */
      className: 'map-sort-icon',
      iconAnchor: [10, 10],
      iconSize: size
    });
  }
};

module.exports = Base;
