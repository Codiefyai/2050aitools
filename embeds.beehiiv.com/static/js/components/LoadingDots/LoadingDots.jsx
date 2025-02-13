import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dot } from 'react-animated-dots';

const DotsContainer = styled.div`
  font-size: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: ${props => props.color ? props.color : '#000'};
`

class LoadingDots extends Component {
  render() {
    return (
      <DotsContainer color={this.props.color}>
        <Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </DotsContainer>
    )
  }
}

LoadingDots.propTypes = {
  color: PropTypes.string
}

LoadingDots.defaultProps = {
  color: "#000"
}

export default LoadingDots