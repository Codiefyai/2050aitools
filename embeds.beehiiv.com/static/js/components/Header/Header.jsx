import styled from "styled-components";

const StyledHeader = styled.h2`
  color: ${(props) => (props.textColor ? props.textColor : "#000")};
  font-family: ${(props) =>
    props.fontFamily ? props.fontFamily : "Open-Sans"};
  font-size: 28px;
  line-height: 1;
  margin-block: 0;
  margin-bottom: 0.4;
`;

export default StyledHeader;
