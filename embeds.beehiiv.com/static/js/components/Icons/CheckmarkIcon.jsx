import React, { Component } from 'react';
import PropTypes from 'prop-types';

const checkmarkSvg = (
  <svg viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9.5,18.2c-0.4,0.4-1,0.4-1.4,0l-3.8-3.8C4,14,4,13.4,4.3,13s1-0.4,1.4,0l3.1,3.1l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4 L9.5,18.2z"></path>
  </svg>
)

class CheckmarkIcon extends Component {
  render() {
    return (
      <div className={this.props.className}>
        {checkmarkSvg}
      </div>
    )
  }
}

CheckmarkIcon.propTypes = {
  className: PropTypes.string
}

export default CheckmarkIcon