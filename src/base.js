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
  }
};

module.exports = Base;
