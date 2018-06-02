var csv = require('csv-parser');
var fs = require('fs');
var turf = require('turf');
const Json2csvParser = require('json2csv').Parser;
const https = require('https');

var schools = [];
var key = 'AqiGj_hcXmk8QUwzrcbjvXIPxZsWva6309l6TUtcFmGhz2j1vf2B4M-apV7RUG5H';

fs
  .createReadStream('raw_dataset.csv')
  .pipe(
    csv({
      separator: '\t'
    })
  )
  .on('data', data => {
    schools.push(data);
  })
  .on('end', () => {
    let geocoded = 0;
    schools.map((school, si) => {
      const location = school.mesto + ', ' + school.ulica;
      const url = encodeURI(
        'https://dev.virtualearth.net/REST/v1/Locations/Slovakia/' +
          location +
          '?o=json&key=' +
          key
      );
      console.log(url);

      setTimeout(() => {
        https.get(url, res => {
          let geocodedData = '';
          res.on('data', dat => {
            geocodedData += dat;
          });
          res.on('end', () => {
            geocoded += 1;
            try {
              const point = JSON.parse(geocodedData).resourceSets[0]
                .resources[0].point;
              console.log(point);
              school.y = point.coordinates[0];
              school.x = point.coordinates[1];
            } catch (err) {
              console.log(err);
            }
          });
        });
      }, si * 200);
    });

    const saveFile = () => {
      console.log('saving file');
      const json2csvParser = new Json2csvParser(Object.keys(schools));

      const out = json2csvParser.parse(schools);
      fs.writeFile('out.csv', out);
    };

    const waitUntilAllGeocoded = () => {
      console.log('waiting', geocoded, '/', schools.length);
      if (geocoded === schools.length) {
        saveFile();
      } else {
        setTimeout(() => waitUntilAllGeocoded(), 5000);
      }
    };
    waitUntilAllGeocoded();
  });
