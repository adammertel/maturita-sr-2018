const csv = require("csv-parser");
const fs = require("fs");
const turf = require("turf");
const booleanPointInPolygon = require("@turf/boolean-point-in-polygon");
const Json2csvParser = require("json2csv").Parser;
const https = require("https");

const pointInPolygon = booleanPointInPolygon.default;

var schools = {};
var key = "AqiGj_hcXmk8QUwzrcbjvXIPxZsWva6309l6TUtcFmGhz2j1vf2B4M-apV7RUG5H";

var sumArray = (arr) => {
  let sum = 0;
  arr.forEach((a) => (sum += a));
  return sum;
};

var subjects = ["m", "sj", "aj"];
let subjectDone = 0;

// load districts
var districtsJSON = JSON.parse(fs.readFileSync("okresy.json", "utf8"));

// parse subjects datasets
var rows = [];
subjects.map((subject) => {
  fs.createReadStream(subject + ".tsv")
    .pipe(
      csv({
        separator: "\t",
      })
    )
    .on("data", (data) => {
      rows.push(data);
    })
    .on("end", () => {
      subjectDone++;
    });
});

var checkSubjectsDone = () => {
  if (subjectDone === subjects.length) {
    afterSubjectsDone();
  } else {
    setTimeout(() => checkSubjectsDone(), 1000);
  }
};
checkSubjectsDone();

var afterSubjectsDone = () => {
  // merge rows
  rows.map((row) => {
    const id = row.skola;

    if (schools[id]) {
      schools[id] = Object.assign(schools[id], row);
    } else {
      schools[id] = row;
    }
  });

  // geocoding

  let geocoded = 0;
  Object.values(schools).map((school, si) => {
    const location = school.mesto + "/" + school.adresa + ", " + school.nazov;
    const url = encodeURI(
      "https://dev.virtualearth.net/REST/v1/Locations/Slovakia/" +
        location +
        "?o=json&key=" +
        key
    );

    setTimeout(() => {
      https.get(url, (res) => {
        let geocodedData = "";
        res.on("data", (dat) => {
          geocodedData += dat;
        });
        res.on("end", () => {
          geocoded += 1;
          try {
            const point =
              JSON.parse(geocodedData).resourceSets[0].resources[0].point;
            //console.log(point);
            school.y = point.coordinates[0];
            school.x = point.coordinates[1];

            const tpoint = turf.point([school.x, school.y]);
            districtsJSON.features.map((districtF) => {
              const polygon = turf.polygon(districtF.geometry.coordinates);
              const inside = pointInPolygon(tpoint, polygon);
              if (inside) {
                school.okres = districtF.properties.TXT;
              }
            });
          } catch (err) {
            console.log(err);
          }
        });
      });
    }, si * 150);
  });

  const saveFile = () => {
    console.log("saving file");

    // average grades per district
    districtsJSON.features.map((district) => {
      const schoolsInDistrict = Object.values(schools).filter(
        (school) => school.okres === district.properties.TXT
      );
      subjects.map((subject) => {
        const sumOfAllGrades = sumArray(
          schoolsInDistrict.map((school) => {
            const students = parseInt(school[subject + "_n"], 10) || 0;
            const grade = parseFloat(school[subject + "_z"]) || 0;
            //console.log(school.nazov, school.mesto, students, grade);
            return students * grade;
          })
        );
        const allStudents = sumArray(
          schoolsInDistrict.map((school) => {
            const grade = parseFloat(school[subject + "_z"]) || 0;
            const students = parseInt(school[subject + "_n"], 10) || 0;
            return grade ? students : 0;
          })
        );

        district.properties["avg_" + subject] = sumOfAllGrades / allStudents;
      });
    });
    fs.writeFile("districts.json", JSON.stringify(districtsJSON));
    fs.writeFile("schools.json", JSON.stringify(schools));
  };

  const noSchools = Object.values(schools).length;

  const waitUntilAllGeocoded = () => {
    console.log("waiting", geocoded, "/", noSchools);
    if (geocoded === noSchools) {
      saveFile();
    } else {
      setTimeout(() => waitUntilAllGeocoded(), 5000);
    }
  };
  waitUntilAllGeocoded();
};
