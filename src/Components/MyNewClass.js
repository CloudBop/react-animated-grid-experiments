import React from 'react';

import React, { Component } from 'react';

export class MyNewClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }
  // METHODS
  handleChange(evt) {
    this.setState(() => ({
      [evt.name]: evt.value
    }));
  }

  render() {
    return (
      <div>
        <input type="text" name="firstName" id="" onClick={this.handleChange(evt)} />
        <input type="text" name="lastName" id="" onClick={this.handleChange(evt)} />
      </div>
    );
  }
}

import React from 'react';

function MyNewFn() {
  const [ credentials, setCredentials ] = useState({
    firstName: '',
    lastName: ''
  });

  return (
    <div>
      <input type="text" name="firstName" id="" onClick={this.handleChange(evt)} />
      <input type="text" name="lastName" id="" onClick={this.handleChange(evt)} />
    </div>
  );
}

export default MyNewFn;
