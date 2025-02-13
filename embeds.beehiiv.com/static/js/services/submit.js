import { defaultHeaders } from "./base";

const axios = require("axios");

export const submitEmail = (payload) => {
  const humanCookie = localStorage.getItem("pxcookie");

  return axios.post("/api/submit", payload, {
    headers: {
      ...defaultHeaders,
      ...(humanCookie ? { "x-px-cookies": humanCookie } : {}),
    },
  });
};
