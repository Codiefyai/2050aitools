import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  text-align: center;
  padding: 12px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "#f3f4f6"};
`;

export const Box = styled.div`
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
`;

export const HeaderContainer = styled.div`
  margin-bottom: 1.5rem;
`;
