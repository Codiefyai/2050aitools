import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const WatermarkLink = styled.a`
`

const WatermarkImg = styled.img`
  position: absolute;
  display: block;
  right: 12px;
  bottom: 12px;
  max-height: 18px;
  opacity: .3;
  transition: all .25s ease-out;

  :hover {
    opacity: 1;
  }
`

class Watermark extends Component {
  render() {
    return (
      <WatermarkLink target="_blank" href={this.props.targetUrl}>
        <WatermarkImg src="/img/beehiiv-logo.png" />
      </WatermarkLink>
    )
  }
}

Watermark.propTypes = {
  targetUrl: PropTypes.string
}

Watermark.defaultProps = {
  targetUrl: "https://www.beehiiv.com"
}

export default Watermark