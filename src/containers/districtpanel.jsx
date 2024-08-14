import { observer } from "mobx-react";
import React from "react";

@observer
class DistrictPanel extends React.Component {
  render() {
    const district = store.overDistrict;

    const districtName = district ? district.properties.TXT : "";
    return (
      <div id="district-panel" className="district-panel">
        {district && (
          <div>
            <h2 className="title is-4">{districtName}</h2>

            <h2 className="subtitle is-4">
              {store.subjects.find((s) => s.id === store.subject).label}
            </h2>
            <ul className="menu-list">
              {store.overDistrictSchools
                .filter((s) => s[store.subject + "_z"])
                .sort((a, b) => {
                  return a[store.subject + "_z"] > b[store.subject + "_z"]
                    ? 1
                    : -1;
                })
                .map((school, si) => {
                  return (
                    <li key={si}>
                      {school.nazov + " - " + school[store.subject + "_z"]}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default DistrictPanel;
