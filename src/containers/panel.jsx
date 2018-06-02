import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

@observer
class Panel extends React.Component {
  @action
  handleSubjectChange = e => {
    const newSubject = e.target.value;
    store.changeSubject(newSubject);
  };

  render() {
    return (
      <div id="panel" className="panel">
        Predmet
        <div className="control">
          {store.subjects.map(subject => {
            return (
              <p key={subject.id}>
                <label className="radio" id={subject.id}>
                  <input
                    type="radio"
                    name="rsvp"
                    id={subject.id}
                    value={subject.id}
                    checked={store.subject === subject.id}
                    onChange={this.handleSubjectChange.bind(this)}
                  />
                  {subject.label}
                </label>
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Panel;
