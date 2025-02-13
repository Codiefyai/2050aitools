import styled from 'styled-components';

const StyledDescription = styled.p`
  font-family: ${props => props.fontFamily ? props.fontFamily : 'Open-Sans'};
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.textColor ? props.textColor : '#000'};
`

export default StyledDescription