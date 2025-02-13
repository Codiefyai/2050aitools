import React, { Component } from 'react';

// Components
import { Container, Box, HeaderContainer } from '../../components/Container'
import Header from '../../components/Header'
import Description from '../../components/Description'
import Watermark from '../../components/Watermark'

class NotFound extends Component {
  render() {
    return (
      <Container>
        <Box>
          <HeaderContainer>
            <Header>
              Not found
            </Header>
            <Description>
              Oops. We can't find what you're looking for.
            </Description>
          </HeaderContainer>
        </Box>
        <Watermark />
      </Container>
    )
  }
}

export default NotFound
