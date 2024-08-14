import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";

@observer
class Panel extends React.Component {
  @action
  handleSubjectChange = (e) => {
    const newSubject = e.target.value;
    store.changeSubject(newSubject);
  };

  render() {
    return (
      <div id="panel" className="panel">
        <h3>Predmet</h3>
        <div className="control">
          {store.subjects.map((subject) => (
            <p key={subject.id} className="radio-option">
              <label className="radio-label" id={subject.id}>
                <input
                  type="radio"
                  name="rsvp"
                  id={subject.id}
                  value={subject.id}
                  checked={store.subject === subject.id}
                  onChange={this.handleSubjectChange.bind(this)}
                />
                <span className="radio-custom"></span>
                {subject.label}
              </label>
            </p>
          ))}
        </div>
      </div>
    );
  }
}

export default Panel;
