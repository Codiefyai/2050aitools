// Wrapper around pushing events to the data layer that Google Tag Manager uses that
// provides sane defaults for the information we care about in GTM
const pushEvent = ({
  name,
  category,
  action,
  label = window.location.href,
  value = 0,
  data = {},
}) => {
  if (typeof window.dataLayer !== "undefined") {
    const timestamp = new Date();
    window.dataLayer.push({
      event: name,
      eventProps: {
        category,
        action,
        label,
        value,
        timestamp: timestamp.toISOString(),
        ...data,
      },
    });
  }
};

export default {
  pushEvent,
};
