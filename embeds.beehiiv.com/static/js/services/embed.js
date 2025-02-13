import { defaultHeaders } from "./base";

const axios = require("axios");

export const getExternalEmbed = (id) => {
  return axios.get(`/api/embeds/${id}`, {
    headers: defaultHeaders,
  });
};
