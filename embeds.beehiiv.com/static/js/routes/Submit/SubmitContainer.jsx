import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import dig from "object-dig";
import GoogleFontLoader from "react-google-font-loader";
import queryString from "qs";

// Components
import Submit from "./Submit";

import { getExternalEmbed } from "../../services/embed";

class SubmitContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isNotFound: false,
      error: null,
      publicationId: null,
      header: null,
      description: null,
      inputPlaceholder: null,
      buttonText: null,
      successMessageText: null,
      successRedirectUrl: null,
      captchaEnabled: false,
      config: {
        body_font: "Poppins",
        button_font: "Open Sans",
        header_font: "Poppins",
        button_color: "#62FF2B",
        background_color: "#62ECFF",
        text_color: "#000",
        button_text_color: "#000",
      },
      requiredFonts: [],
      isBeehiivBranded: false,
      removeEmailFromRedirectUrl: false,
    };

    this.humanResponseDomainScript = null;
    this.humanScript = null;
    this.humanCookieStorageScript = null;
    this.observer = null;
  }

  componentDidMount() {
    const { location: { search } } = this.props;
    const query = queryString.parse(search, { ignoreQueryPrefix: true });
    const isSlim = !!query.slim;

    this.fetchExternalEmbed();
    this.addHumanScriptToHead(isSlim);

    if (isSlim) {
      this.setupMutationObserver();
    }
  }

  componentWillUnmount() {
    this.removeHumanScriptFromHead();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupMutationObserver = () => {
    const targetNode = document.body;
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.target?.id === "px-captcha-modal") {
          const captchaDoc = mutation.target.contentDocument;

          Array.from(captchaDoc.getElementsByClassName("px-captcha-message")).forEach((el) => el.setAttribute("style", "display:none"));
          Array.from(captchaDoc.getElementsByClassName("px-captcha-header")).forEach((el) => el.setAttribute("style", "display:none"));
          Array.from(captchaDoc.getElementsByClassName("px-captcha-report")).forEach((el) => el.setAttribute("style", "display:none"));
          Array.from(captchaDoc.getElementsByClassName("px-captcha-refid")).forEach((el) => el.setAttribute("style", "display:none"));
          Array.from(captchaDoc.getElementsByClassName("px-captcha-container")).forEach((el) => {
            el.setAttribute("style", "height:50px; width: 100%; top: 0; left: 0; margin-top: 0; margin-left: 0;")
          });
        }
      }
    };

    this.observer = new MutationObserver(callback);
    this.observer.observe(targetNode, config);
  };

  addHumanScriptToHead = (isSlim) => {
    if (window.env.REACT_APP_HUMAN_ENABLED === 'true') {
      // By default, the sensor runs on a domain that differs from the parent domain.
      // Because of this, some browsers with stricter cross-domain policies (Safari) prevent HUMAN from working.
      // The fix is to add this script, which tells the HUMAN Sensor which domain to expect block responses on.
      if (window.env.REACT_APP_HUMAN_RESPONSE_DOMAIN) {
        this.humanResponseDomainScript = document.createElement('script');
        this.humanResponseDomainScript.innerHTML = `
          window._pxCustomAbrDomains = ["${window.env.REACT_APP_HUMAN_RESPONSE_DOMAIN}"];
        `
        document.head.appendChild(this.humanResponseDomainScript);
      }

      // Save HUMAN cookie content to local storage
      this.humanCookieStorageScript = document.createElement('script');
      this.humanCookieStorageScript.textContent = `
        window.${window.env.REACT_APP_HUMAN_APP_ID}_asyncInit = function (px) {
          px.Events.on('risk', function (risk, name) {
            localStorage.setItem("pxcookie", risk + "=" + name);
          });
        };
      `
      document.head.appendChild(this.humanCookieStorageScript);

      // Load HUMAN Sensor JS
      this.humanScript = document.createElement('script');
      this.humanScript.src = window.env.REACT_APP_HUMAN_URL;
      this.humanScript.async = true;
      document.head.appendChild(this.humanScript);

      // Customize the HUMAN challenge modal for slim embeds
      if (isSlim) {
        this.humanScript.onload = function() {
          window['_' + window._pxAppId] = {
            challenge: {
              view: {
                texSize: 12,
              },
              translation: {
                default: {
                  btn: "Press & Hold to confirm you're human"
                }
              }
            }
          }
        };
      }

      // Prevents form refresh after challenge solved
      this.captchaScript = document.createElement('script');
      this.captchaScript.innerHTML = `
          window._pxOnCaptchaSuccess = function (isValid) {
          console.log("Captcha success", isValid);
        };
      `
      document.head.appendChild(this.captchaScript);
    }
  };

  removeHumanScriptFromHead = () => {
    if (this.humanCookieStorageScript) {
      document.head.removeChild(this.humanCookieStorageScript);
    }
    if (this.humanScript) {
      document.head.removeChild(this.humanScript);
    }
    if (this.captchaScript) {
      document.head.removeChild(this.captchaScript);
    }
    if (this.humanResponseDomainScript) {
      document.head.removeChild(this.humanResponseDomainScript);
    }
  };

  fetchExternalEmbed = () => {
    const {
      match: {
        params: { embedId },
      },
    } = this.props;

    this.updateState({ isLoading: true });
    getExternalEmbed(embedId)
      .then((payload) => {
        const externalEmbed = dig(payload, "data");
        const publicationId = dig(externalEmbed, "publication_id");
        const header = dig(externalEmbed, "header");
        const description = dig(externalEmbed, "description");
        const inputPlaceholder = dig(externalEmbed, "input_placeholder");
        const buttonText = dig(externalEmbed, "button_text");
        const successMessageText = dig(externalEmbed, "success_message_text");
        const successRedirectUrl = dig(externalEmbed, "success_redirect_url");
        const embedConfig = dig(externalEmbed, "config");
        const captchaEnabled = dig(externalEmbed, "captcha_enabled");
        const isBeehiivBranded = dig(externalEmbed, "beehiiv_branded");
        const removeEmailFromRedirectUrl = dig(externalEmbed, "remove_email_from_redirect_url");

        // Merge config over default
        const config = Object.assign({}, this.state.config, embedConfig);

        // Pull out what fonts are required for design
        const requiredFonts = this.fontsToLoad(config);

        this.updateState({
          publicationId,
          header,
          description,
          inputPlaceholder,
          buttonText,
          successMessageText,
          successRedirectUrl,
          config,
          requiredFonts,
          captchaEnabled,
          isBeehiivBranded,
          removeEmailFromRedirectUrl,
        });
      })
      .catch((payload) => {
        const status = dig(payload, "response", "status");
        const error = dig(payload, "response", "data", "message") || "Something went wrong";
        this.updateState({
          isNotFound: status === 404,
          error,
        });
      })
      .finally(() => {
        this.updateState({
          isLoading: false,
        });
      });
  };

  updateState = (updatedState) => {
    const newState = Object.assign({}, this.state, updatedState);
    this.setState(newState);
  };

  fontsToLoad = (config) => {
    const headerFont = dig(config, "header_font");
    const bodyFont = dig(config, "body_font");
    const buttonFont = dig(config, "button_font");

    const fonts = [];
    if (
      headerFont &&
      headerFont !== "Open Sans" &&
      !fonts.includes(headerFont)
    ) {
      fonts.push(headerFont);
    }

    if (bodyFont && bodyFont !== "Open Sans" && !fonts.includes(bodyFont)) {
      fonts.push(bodyFont);
    }

    if (
      buttonFont &&
      buttonFont !== "Open Sans" &&
      !fonts.includes(buttonFont)
    ) {
      fonts.push(buttonFont);
    }

    return fonts;
  };

  render() {
    const {
      location: { search },
      match: {
        params: { embedId },
      },
    } = this.props;

    const query = queryString.parse(search, { ignoreQueryPrefix: true });
    const isSlim = !!query.slim;
    const utmSource = query?.utm_source;
    const utmCampaign = query?.utm_campaign;
    const utmMedium = query?.utm_medium;
    const referrer = query?.referrer;
    const userAgent = window?.navigator?.userAgent;

    const {
      isLoading,
      isNotFound,
      publicationId,
      header,
      description,
      inputPlaceholder,
      buttonText,
      successMessageText,
      successRedirectUrl,
      config,
      requiredFonts,
      captchaEnabled,
      isBeehiivBranded,
      removeEmailFromRedirectUrl,
    } = this.state;

    if (isNotFound) {
      return <Redirect to="/not-found" />;
    }

    if (isLoading) {
      return null;
    }

    const fonts = requiredFonts.map((fontName) => {
      return { font: fontName, weights: [400, 700] };
    });

    return (
      <>
        {fonts.length > 0 && <GoogleFontLoader fonts={fonts} />}
        <Submit
          embedId={embedId}
          publicationId={publicationId}
          header={header}
          description={description}
          inputPlaceholder={inputPlaceholder}
          buttonText={buttonText}
          successMessageText={successMessageText}
          successRedirectUrl={successRedirectUrl}
          config={config}
          isSlim={isSlim}
          utmSource={utmSource}
          utmMedium={utmMedium}
          utmCampaign={utmCampaign}
          referrer={referrer}
          userAgent={userAgent}
          captchaEnabled={captchaEnabled}
          isBeehiivBranded={isBeehiivBranded}
          removeEmailFromRedirectUrl={removeEmailFromRedirectUrl}
        />
      </>
    );
  }
}

SubmitContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(SubmitContainer);
