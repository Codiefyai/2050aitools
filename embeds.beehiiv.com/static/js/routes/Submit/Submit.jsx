import React, { Component } from "react";
import PropTypes from "prop-types";
import dig from "object-dig";
import styled from "styled-components";
import Turnstile from "react-turnstile";

// Components
import { Container, Box, HeaderContainer } from "../../components/Container";
import Header from "../../components/Header";
import Description from "../../components/Description";
import Watermark from "../../components/Watermark";
import LoadingDots from "../../components/LoadingDots";
import { CheckmarkIcon } from "../../components/Icons";

// Services
import { submitEmail } from "../../services/submit";
import DataLayer from "../../services/DataLayer";

const StyledForm = styled.form`
  margin-left: auto;
  margin-right: auto;
  display: flex;
`;

const FullWidth = styled.div`
  width: 100%;
`;

const ScreenReaderOnly = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const StyledInput = styled.input`
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
  box-sizing: border-box;
  border: 0 solid #e5e7eb;
  font-family: ${(props) =>
    props.fontFamily ? props.fontFamily : "Open-Sans"};
  margin: 0;
  appearance: none;
  background-color: rgba(255, 255, 255);
  border-color: ${(props) =>
    props.borderColor ? props.borderColor : "rgb(61, 0, 223)"};
  border-width: 2px;
  display: block;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  color: #000;
  width: 100%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;

  :focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 0;
`;

const TurnstileContainer = styled.div`
  margin-top: 4px;
`;

const Button = styled.button`
  white-space: pre;
  appearance: button;
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
  box-sizing: border-box;
  border: 0 solid #e5e7eb;
  margin: 0;
  font-family: ${(props) =>
    props.fontFamily ? props.fontFamily : "Open-Sans"};
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "rgb(61, 0, 223)"};
  color: ${(props) => (props.textColor ? props.textColor : "#000")};
  border-color: transparent;
  border-width: 1px;
  cursor: pointer;
  display: block;
  font-weight: 500;
  height: 100%;
  font-size: 1rem;
  line-height: 1.5rem;
  min-width: 100px;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform, filter, backdrop-filter,
    -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.2s;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 0 1rem;

  :disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const ErrorMessage = styled.p`
  font-family: ${(props) =>
    props.fontFamily ? props.fontFamily : "Open-Sans"};
  color: #ef4444;
  font-size: 12px;
`;

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  color: ${(props) => (props.color ? props.color : "#FFF")};
  fill: ${(props) => (props.color ? props.color : "#FFF")};
  width: 20px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: -5px;
`;

class Submit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      isSubmitted: false,
      email: "",
      error: null,
      captchaToken: "",
      captchaInteractionNeeded: false,
      captchaLoading: false,
      captchaPrematurelySubmitted: false,
      captchaInteractionChallengeShowing: false,
    };
  }

  handleChange = (event) => {
    const {
      target: { value, name },
    } = event;

    this.updateState({ [name]: value, error: null });
  };

  updateState = (updatedState) => {
    const newState = Object.assign({}, this.state, updatedState);
    this.setState(newState);
  };

  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    const { captchaInteractionNeeded, captchaToken, captchaLoading } =
      this.state;
    const { captchaEnabled } = this.props;

    if (captchaEnabled && captchaInteractionNeeded) {
      this.updateState({
        captchaInteractionChallengeShowing: true,
      });
      return;
    }

    if (captchaEnabled && !captchaToken && captchaLoading) {
      this.updateState({
        isSubmitting: true,
        captchaPrematurelySubmitted: true,
      });

      return;
    }

    const { successRedirectUrl } = this.props;

    // Deduplicate and decode parameters
    const getUniqueParam = (paramName) => {
      const values = this.props[paramName];

      const decodeValue = (value) => {
        if (value == null) return null;
        try {
          return decodeURIComponent(value);
        } catch (e) {
          return value;
        }
      };

      if (Array.isArray(values)) {
        return decodeValue(values[0]);
      }
      return decodeValue(values);
    };

    const requestPayload = {
      external_embed_id: this.props.embedId,
      publication_id: this.props.publicationId,
      email: this.state.email,
      captcha_token: this.state.captchaToken,
      utm_source: getUniqueParam("utmSource"),
      utm_medium: getUniqueParam("utmMedium"),
      utm_campaign: getUniqueParam("utmCampaign"),
      referrer: getUniqueParam("referrer"),
      slim: this.props.isSlim,
      user_agent: this.props.userAgent,
    };

    // Remove null or undefined values
    Object.keys(requestPayload).forEach(
      (key) => requestPayload[key] == null && delete requestPayload[key]
    );

    if (
      !requestPayload.email ||
      (requestPayload.email && requestPayload.email.trim() === "")
    ) {
      // Missing email
      return;
    }

    this.updateState({ isSubmitting: true });
    submitEmail(requestPayload)
      .then((payload) => {
        this.updateState({ isSubmitted: true });

        DataLayer.pushEvent({
          name: "submittedEmail",
          category: "conversion",
          action: "submittedEmail",
          label: "embedded form",
          data: {
            email: this.state.email,
            utm_source: this.props.utmSource,
            utm_medium: this.props.utmMedium,
            utm_campaign: this.props.utmCampaign,
          },
        });

        if (successRedirectUrl && window?.parent?.location) {
          const redirectUrl = new URL(successRedirectUrl);

          // Previously we included the email of the subscriber in the redirect URL by default.
          //
          // Due to privacy concerns, we now allow a toggle on the create and edit page for the subscribe forms
          // to substitute the email of the subscriber with the subscription ID.
          //
          // This allows for tracking of the subscribers obtained through the embed form on third-party platforms
          // without compromising the privacy of the subscribers.

          const removeEmailFromRedirectUrl =
            this.props.removeEmailFromRedirectUrl;
          const subscriptionId = payload.data.subscription_id || null;

          if (removeEmailFromRedirectUrl && subscriptionId) {
            redirectUrl.searchParams.set("sub_id", subscriptionId);
          } else {
            redirectUrl.searchParams.set("email", this.state.email);
          }

          window.parent.location.href = redirectUrl.href;
        } else {
          // pass a message to show recommendations widget
          // targetOrigin -> *
          // ...because we don't know the origin of the parent window
          // as this will be received by an externally hosted publication site
          // window.top -> allows us to send message when the subscriber form is in nested iframes (WIX etc.)
          const targetWindow = window.top || window.parent || window;
          targetWindow.postMessage(
            {
              type: "BEEHIIV_SUBSCRIBER_FORM_SUBMITTED",
              email: this.state.email,
              externalEmbedId: this.props.embedId,
            },
            "*"
          );
        }
      })
      .catch((payload) => {
        const status = dig(payload, "response", "status");

        if (status === 403) {
          return;
        }

        const error =
          dig(payload, "response", "data", "message") || "Something went wrong";
        this.updateState({ error });
      })
      .finally(() => {
        this.updateState({
          isSubmitting: false,
        });
      });
  };

  // CAPTCHA CONTEXT //

  // Captcha was introduced to the forms to prevent users from mass uploading lists, in addiiton to preventing bot signups.
  // An issue we encountered with slim embed forms was the height for all legacy forms was 52px. This was not enough space to render the captcha challenge.
  // Our goal for optimial user experience included the following:
  // 1. Keep captcha invisible as long as user does not need to interact with it and check the box to get the token.
  // 2. If the user needs to interact with captcha, show the challenge and swap it in place of the sign up form.
  //
  // The above required some interesting state management to ensure the user experience was not compromised.
  // Example if a user prematurely submitted the form before the captcha token was generated, we wait for the token to
  // Be generated and then resubmit the form with the token for them. To the end user it just appears like the submission is
  // taking a little longer than usual.

  handleSubmitOnSuccessfulCaptchaInteraction = (token) => {
    this.updateState({
      captchaToken: token,
      captchaPrematurelySubmitted: false,
      captchaLoading: false,
      captchaInteractionNeeded: false,
    });

    setTimeout(() => {
      this.updateState({
        captchaInteractionChallengeShowing: false,
      });
    }, 1000);
  };

  handleResubmitWhenTokenGenerated = (token) => {
    this.updateState({
      captchaToken: token,
      captchaPrematurelySubmitted: false,
      captchaLoading: false,
      captchaInteractionNeeded: false,
    });

    setTimeout(() => {
      this.updateState({
        captchaInteractionChallengeShowing: false,
      });
    }, 1000);
  };

  handleSetToken = (token) => {
    this.updateState({ captchaToken: token, captchaLoading: false });
  };

  handleResetCaptcha = () => {
    this.updateState({ captchaToken: "" });
    window.turnstile.reset(this.props.embedId);
  };

  beehiivLink = () => {
    const { embedId, publicationId } = this.props;

    return `https://beehiiv.com?utm_source=external_embed&utm_content=${embedId}&publication_id=${publicationId}`;
  };

  isLocked = () => {
    if (this.state.isSubmitted) {
      return true;
    }

    return false;
  };

  renderForm = () => {
    const {
      inputPlaceholder,
      buttonText,
      successMessageText,
      config,
      captchaEnabled,
      embedId,
      isSlim,
    } = this.props;
    const {
      isSubmitting,
      isSubmitted,
      error,
      captchaInteractionChallengeShowing,
      captchaToken,
      captchaInteractionNeeded,
    } = this.state;

    const buttonColor = dig(config, "button_color");
    const buttonTextColor = dig(config, "button_text_color");
    const bodyFont = dig(config, "body_font");
    const textColor = dig(config, "text_color");
    const buttonFont = dig(config, "button_font");
    const isLocked = this.isLocked();
    const captchaLoading = captchaEnabled && !captchaToken;
    const hideSignupForm = captchaInteractionChallengeShowing && isSlim;

    if (successMessageText && isSubmitted) {
      return (
        <Description textColor={textColor} fontFamily={bodyFont}>
          {successMessageText}
        </Description>
      );
    }

    return (
      <>
        {!hideSignupForm && (
          <StyledForm
            onSubmit={this.handleSubmit}
            captchaLoading={captchaLoading}
          >
            <FullWidth>
              <ScreenReaderOnly htmlFor="email">Email</ScreenReaderOnly>
              <StyledInput
                borderColor={buttonColor}
                fontFamily={buttonFont}
                autoComplete="email"
                placeholder={inputPlaceholder || "Enter your email"}
                onChange={this.handleChange}
                onFocus={() => {
                  if (captchaInteractionNeeded) {
                    this.updateState({
                      captchaInteractionChallengeShowing: true,
                    });
                  }
                }}
                value={this.state.email}
                disabled={isLocked}
                type="email"
                name="email"
                required
              />
            </FullWidth>
            <ButtonContainer>
              <Button
                backgroundColor={buttonColor}
                fontFamily={buttonFont}
                textColor={buttonTextColor}
                type="submit"
                disabled={isLocked}
              >
                {isSubmitted ? (
                  <StyledCheckmarkIcon color={buttonTextColor} />
                ) : isSubmitting ? (
                  <LoadingDots color={buttonTextColor} />
                ) : (
                  buttonText
                )}
              </Button>
            </ButtonContainer>
          </StyledForm>
        )}
        {error && <ErrorMessage fontFamily={bodyFont}>{error}</ErrorMessage>}
        {captchaEnabled && process.env.REACT_APP_TURNSTILE_SITEKEY && (
          <TurnstileContainer>
            {/** Turnstile Test Keys: https://developers.cloudflare.com/turnstile/reference/testing/ */}
            <Turnstile
              widgetId={embedId}
              sitekey={process.env.REACT_APP_TURNSTILE_SITEKEY || ""}
              appearance={"interaction-only"}
              style={{
                margin: hideSignupForm ? "-12px" : "",
              }}
              onLoad={() => {
                this.updateState({ captchaLoading: true });
              }}
              onTimeout={() => this.handleResetCaptcha()}
              onExpire={() => this.handleResetCaptcha()}
              theme="auto"
              size="normal"
              onBeforeInteractive={() => {
                this.updateState({ captchaInteractionNeeded: true });
              }}
              onVerify={(token) => {
                const {
                  captchaPrematurelySubmitted,
                  captchaInteractionNeeded,
                } = this.state;

                if (captchaInteractionNeeded && token) {
                  this.handleSubmitOnSuccessfulCaptchaInteraction(token);
                } else if (captchaPrematurelySubmitted && token) {
                  this.handleResubmitWhenTokenGenerated(token);
                } else {
                  this.handleSetToken(token);
                }
              }}
            />
          </TurnstileContainer>
        )}
      </>
    );
  };

  render() {
    const { header, description, config, isSlim, isBeehiivBranded } =
      this.props;

    const backgroundColor = dig(config, "background_color");
    const textColor = dig(config, "text_color");
    const headerFont = dig(config, "header_font");
    const bodyFont = dig(config, "body_font");

    if (isSlim) {
      return this.renderForm();
    }

    return (
      <Container backgroundColor={backgroundColor}>
        <Box>
          <HeaderContainer>
            <Header textColor={textColor} fontFamily={headerFont}>
              {header}
            </Header>
            <Description textColor={textColor} fontFamily={bodyFont}>
              {description}
            </Description>
          </HeaderContainer>
          {this.renderForm()}
        </Box>
        {isBeehiivBranded ? <Watermark targetUrl={this.beehiivLink()} /> : null}
      </Container>
    );
  }
}

Submit.propTypes = {
  embedId: PropTypes.string,
  publicationId: PropTypes.string,
  header: PropTypes.string,
  description: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  buttonText: PropTypes.string,
  successMessageText: PropTypes.string,
  successRedirectUrl: PropTypes.string,
  config: PropTypes.object,
  isSlim: PropTypes.bool,
  utmSource: PropTypes.string,
  utmMedium: PropTypes.string,
  utmCampaign: PropTypes.string,
  referrer: PropTypes.string,
  userAgent: PropTypes.string,
  captchaEnabled: PropTypes.bool,
  isBeehiivBranded: PropTypes.bool,
  removeEmailFromRedirectUrl: PropTypes.bool,
};

Submit.defaultProps = {
  isSlim: false,
};

export default Submit;
