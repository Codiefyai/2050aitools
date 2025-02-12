var JetboostBootstrap = (function () {
  "use strict";
  var t = "URLSearchParams" in self,
    e = "Symbol" in self && "iterator" in Symbol,
    o =
      "FileReader" in self &&
      "Blob" in self &&
      (function () {
        try {
          return new Blob(), !0;
        } catch (t) {
          return !1;
        }
      })(),
    r = "FormData" in self,
    n = "ArrayBuffer" in self;
  if (n)
    var i = [
        "[object Int8Array]",
        "[object Uint8Array]",
        "[object Uint8ClampedArray]",
        "[object Int16Array]",
        "[object Uint16Array]",
        "[object Int32Array]",
        "[object Uint32Array]",
        "[object Float32Array]",
        "[object Float64Array]",
      ],
      s =
        ArrayBuffer.isView ||
        function (t) {
          return t && i.indexOf(Object.prototype.toString.call(t)) > -1;
        };
  function a(t) {
    if (
      ("string" != typeof t && (t = String(t)),
      /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))
    )
      throw new TypeError("Invalid character in header field name");
    return t.toLowerCase();
  }
  function c(t) {
    return "string" != typeof t && (t = String(t)), t;
  }
  function d(t) {
    var o = {
      next: function () {
        var e = t.shift();
        return { done: void 0 === e, value: e };
      },
    };
    return (
      e &&
        (o[Symbol.iterator] = function () {
          return o;
        }),
      o
    );
  }
  function l(t) {
    (this.map = {}),
      t instanceof l
        ? t.forEach(function (t, e) {
            this.append(e, t);
          }, this)
        : Array.isArray(t)
        ? t.forEach(function (t) {
            this.append(t[0], t[1]);
          }, this)
        : t &&
          Object.getOwnPropertyNames(t).forEach(function (e) {
            this.append(e, t[e]);
          }, this);
  }
  function u(t) {
    if (t.bodyUsed) return Promise.reject(new TypeError("Already read"));
    t.bodyUsed = !0;
  }
  function h(t) {
    return new Promise(function (e, o) {
      (t.onload = function () {
        e(t.result);
      }),
        (t.onerror = function () {
          o(t.error);
        });
    });
  }
  function f(t) {
    var e = new FileReader(),
      o = h(e);
    return e.readAsArrayBuffer(t), o;
  }
  function p(t) {
    if (t.slice) return t.slice(0);
    var e = new Uint8Array(t.byteLength);
    return e.set(new Uint8Array(t)), e.buffer;
  }
  function y() {
    return (
      (this.bodyUsed = !1),
      (this._initBody = function (e) {
        var i;
        (this._bodyInit = e),
          e
            ? "string" == typeof e
              ? (this._bodyText = e)
              : o && Blob.prototype.isPrototypeOf(e)
              ? (this._bodyBlob = e)
              : r && FormData.prototype.isPrototypeOf(e)
              ? (this._bodyFormData = e)
              : t && URLSearchParams.prototype.isPrototypeOf(e)
              ? (this._bodyText = e.toString())
              : n && o && (i = e) && DataView.prototype.isPrototypeOf(i)
              ? ((this._bodyArrayBuffer = p(e.buffer)),
                (this._bodyInit = new Blob([this._bodyArrayBuffer])))
              : n && (ArrayBuffer.prototype.isPrototypeOf(e) || s(e))
              ? (this._bodyArrayBuffer = p(e))
              : (this._bodyText = e = Object.prototype.toString.call(e))
            : (this._bodyText = ""),
          this.headers.get("content-type") ||
            ("string" == typeof e
              ? this.headers.set("content-type", "text/plain;charset=UTF-8")
              : this._bodyBlob && this._bodyBlob.type
              ? this.headers.set("content-type", this._bodyBlob.type)
              : t &&
                URLSearchParams.prototype.isPrototypeOf(e) &&
                this.headers.set(
                  "content-type",
                  "application/x-www-form-urlencoded;charset=UTF-8"
                ));
      }),
      o &&
        ((this.blob = function () {
          var t = u(this);
          if (t) return t;
          if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }),
        (this.arrayBuffer = function () {
          return this._bodyArrayBuffer
            ? u(this) || Promise.resolve(this._bodyArrayBuffer)
            : this.blob().then(f);
        })),
      (this.text = function () {
        var t,
          e,
          o,
          r = u(this);
        if (r) return r;
        if (this._bodyBlob)
          return (
            (t = this._bodyBlob),
            (e = new FileReader()),
            (o = h(e)),
            e.readAsText(t),
            o
          );
        if (this._bodyArrayBuffer)
          return Promise.resolve(
            (function (t) {
              for (
                var e = new Uint8Array(t), o = new Array(e.length), r = 0;
                r < e.length;
                r++
              )
                o[r] = String.fromCharCode(e[r]);
              return o.join("");
            })(this._bodyArrayBuffer)
          );
        if (this._bodyFormData)
          throw new Error("could not read FormData body as text");
        return Promise.resolve(this._bodyText);
      }),
      r &&
        (this.formData = function () {
          return this.text().then(w);
        }),
      (this.json = function () {
        return this.text().then(JSON.parse);
      }),
      this
    );
  }
  (l.prototype.append = function (t, e) {
    (t = a(t)), (e = c(e));
    var o = this.map[t];
    this.map[t] = o ? o + ", " + e : e;
  }),
    (l.prototype.delete = function (t) {
      delete this.map[a(t)];
    }),
    (l.prototype.get = function (t) {
      return (t = a(t)), this.has(t) ? this.map[t] : null;
    }),
    (l.prototype.has = function (t) {
      return this.map.hasOwnProperty(a(t));
    }),
    (l.prototype.set = function (t, e) {
      this.map[a(t)] = c(e);
    }),
    (l.prototype.forEach = function (t, e) {
      for (var o in this.map)
        this.map.hasOwnProperty(o) && t.call(e, this.map[o], o, this);
    }),
    (l.prototype.keys = function () {
      var t = [];
      return (
        this.forEach(function (e, o) {
          t.push(o);
        }),
        d(t)
      );
    }),
    (l.prototype.values = function () {
      var t = [];
      return (
        this.forEach(function (e) {
          t.push(e);
        }),
        d(t)
      );
    }),
    (l.prototype.entries = function () {
      var t = [];
      return (
        this.forEach(function (e, o) {
          t.push([o, e]);
        }),
        d(t)
      );
    }),
    e && (l.prototype[Symbol.iterator] = l.prototype.entries);
  var b = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
  function m(t, e) {
    var o,
      r,
      n = (e = e || {}).body;
    if (t instanceof m) {
      if (t.bodyUsed) throw new TypeError("Already read");
      (this.url = t.url),
        (this.credentials = t.credentials),
        e.headers || (this.headers = new l(t.headers)),
        (this.method = t.method),
        (this.mode = t.mode),
        (this.signal = t.signal),
        n || null == t._bodyInit || ((n = t._bodyInit), (t.bodyUsed = !0));
    } else this.url = String(t);
    if (
      ((this.credentials = e.credentials || this.credentials || "same-origin"),
      (!e.headers && this.headers) || (this.headers = new l(e.headers)),
      (this.method =
        ((o = e.method || this.method || "GET"),
        (r = o.toUpperCase()),
        b.indexOf(r) > -1 ? r : o)),
      (this.mode = e.mode || this.mode || null),
      (this.signal = e.signal || this.signal),
      (this.referrer = null),
      ("GET" === this.method || "HEAD" === this.method) && n)
    )
      throw new TypeError("Body not allowed for GET or HEAD requests");
    this._initBody(n);
  }
  function w(t) {
    var e = new FormData();
    return (
      t
        .trim()
        .split("&")
        .forEach(function (t) {
          if (t) {
            var o = t.split("="),
              r = o.shift().replace(/\+/g, " "),
              n = o.join("=").replace(/\+/g, " ");
            e.append(decodeURIComponent(r), decodeURIComponent(n));
          }
        }),
      e
    );
  }
  function g(t, e) {
    e || (e = {}),
      (this.type = "default"),
      (this.status = void 0 === e.status ? 200 : e.status),
      (this.ok = this.status >= 200 && this.status < 300),
      (this.statusText = "statusText" in e ? e.statusText : "OK"),
      (this.headers = new l(e.headers)),
      (this.url = e.url || ""),
      this._initBody(t);
  }
  (m.prototype.clone = function () {
    return new m(this, { body: this._bodyInit });
  }),
    y.call(m.prototype),
    y.call(g.prototype),
    (g.prototype.clone = function () {
      return new g(this._bodyInit, {
        status: this.status,
        statusText: this.statusText,
        headers: new l(this.headers),
        url: this.url,
      });
    }),
    (g.error = function () {
      var t = new g(null, { status: 0, statusText: "" });
      return (t.type = "error"), t;
    });
  var v = [301, 302, 303, 307, 308];
  g.redirect = function (t, e) {
    if (-1 === v.indexOf(e)) throw new RangeError("Invalid status code");
    return new g(null, { status: e, headers: { location: t } });
  };
  var E = self.DOMException;
  try {
    new E();
  } catch (t) {
    ((E = function (t, e) {
      (this.message = t), (this.name = e);
      var o = Error(t);
      this.stack = o.stack;
    }).prototype = Object.create(Error.prototype)),
      (E.prototype.constructor = E);
  }
  function T(t, e) {
    return new Promise(function (r, n) {
      var i = new m(t, e);
      if (i.signal && i.signal.aborted)
        return n(new E("Aborted", "AbortError"));
      var s = new XMLHttpRequest();
      function a() {
        s.abort();
      }
      (s.onload = function () {
        var t,
          e,
          o = {
            status: s.status,
            statusText: s.statusText,
            headers:
              ((t = s.getAllResponseHeaders() || ""),
              (e = new l()),
              t
                .replace(/\r?\n[\t ]+/g, " ")
                .split(/\r?\n/)
                .forEach(function (t) {
                  var o = t.split(":"),
                    r = o.shift().trim();
                  if (r) {
                    var n = o.join(":").trim();
                    e.append(r, n);
                  }
                }),
              e),
          };
        o.url =
          "responseURL" in s ? s.responseURL : o.headers.get("X-Request-URL");
        var n = "response" in s ? s.response : s.responseText;
        r(new g(n, o));
      }),
        (s.onerror = function () {
          n(new TypeError("Network request failed"));
        }),
        (s.ontimeout = function () {
          n(new TypeError("Network request failed"));
        }),
        (s.onabort = function () {
          n(new E("Aborted", "AbortError"));
        }),
        s.open(i.method, i.url, !0),
        "include" === i.credentials
          ? (s.withCredentials = !0)
          : "omit" === i.credentials && (s.withCredentials = !1),
        "responseType" in s && o && (s.responseType = "blob"),
        i.headers.forEach(function (t, e) {
          s.setRequestHeader(e, t);
        }),
        i.signal &&
          (i.signal.addEventListener("abort", a),
          (s.onreadystatechange = function () {
            4 === s.readyState && i.signal.removeEventListener("abort", a);
          })),
        s.send(void 0 === i._bodyInit ? null : i._bodyInit);
    });
  }
  (T.polyfill = !0),
    self.fetch ||
      ((self.fetch = T),
      (self.Headers = l),
      (self.Request = m),
      (self.Response = g));
  const S = "jetboost-list-item-hide",
    _ = "jetboost-filter-active",
    A = "jetboost-filter-none-",
    j = "jetboost-hidden",
    x = {
      SORT_ASC: "jetboost-sort-asc-",
      SORT_DESC: "jetboost-sort-desc-",
      SORT_RESET: "jetboost-sort-reset-",
      SORT_ACTIVE: "jetboost-sort-active",
    },
    B = function (t, e) {
      return "." + t + (e ? e.shortId : "");
    };
  var O = function (t) {
    var e = document.createElement("script");
    (e.src = t),
      (e.async = 1),
      document.getElementsByTagName("head")[0].appendChild(e);
  };
  const U = function (t) {
    var e = document.createElement("link");
    (e.rel = "stylesheet"),
      (e.type = "text/css"),
      (e.href = t),
      document.getElementsByTagName("head")[0].appendChild(e);
  };
  return function (t) {
    var e;
    (window.Jetboost = window.Jetboost || {}),
      window.Jetboost.loaded
        ? console.log("Ignoring extra Jetboost script")
        : ((window.Jetboost.loaded = !0),
          (e = function () {
            if (!document.querySelector("[class*='jetboost']")) return !1;
            !(function () {
              var t = "jetboost-list-search-styles";
              if (!document.getElementById(t)) {
                var e = document.createElement("style");
                (e.id = t),
                  (e.type = "text/css"),
                  (e.innerHTML =
                    "." +
                    S +
                    " { display: none !important; } ." +
                    j +
                    " { visibility: hidden !important; }  @keyframes jetboost-fadeout-animation { 0% { opacity: 1; } 100% { opacity: 0.5; } } @keyframes jetboost-fadein-animation { 0% { opacity: 0.5; } 100% { opacity: 1; } }"),
                  document.getElementsByTagName("head")[0].appendChild(e);
              }
            })(),
              (function () {
                for (
                  var t = document.querySelectorAll(B(_)), e = 0;
                  e < t.length;
                  e++
                )
                  t[e].className.includes(A) || t[e].classList.remove(_);
                document
                  .querySelectorAll(B(x.SORT_ACTIVE))
                  .forEach(function (t) {
                    t.className.includes(x.SORT_RESET) ||
                      t.classList.remove(x.SORT_ACTIVE);
                  });
              })();
            var e = window.JETBOOST_SITE_ID,
              o = window.location.hostname.endsWith("webflow.io");
            if (!o && "ckafk0rmgqmeq0704lwprjww7" === e) return !1;
            (function (t, e, o) {
              var r = t + "sites/" + e;
              o && (r += "?staging=1");
              let n = null;
              const i = window.sessionStorage.getItem(
                "jetboost-site-config-origin"
              );
              return (
                o ||
                  i === window.location.origin + window.location.pathname ||
                  (n = window.sessionStorage.getItem("jetboost-site-config")),
                n
                  ? new Promise((t) => {
                      t({
                        status: 200,
                        json: () =>
                          new Promise((t) => {
                            t(JSON.parse(n));
                          }),
                      });
                    })
                  : fetch(r)
              );
            })(t, e, o)
              .then(function (t) {
                200 === t.status
                  ? t
                      .json()
                      .then(function (t) {
                        window.sessionStorage.setItem(
                          "jetboost-site-config",
                          JSON.stringify(t)
                        ),
                          window.sessionStorage.setItem(
                            "jetboost-site-config-origin",
                            window.location.origin + window.location.pathname
                          );
                        var e = t.boosters;
                        (window.Jetboost.boosters = e),
                          t.majorVersion &&
                            (window.Jetboost.version =
                              t.branchVersion ||
                              "v" +
                                t.majorVersion +
                                "." +
                                t.minorVersion +
                                "." +
                                t.patchVersion);
                        var o = (function (t) {
                          return !(
                            !(1 === t.majorVersion && t.minorVersion >= 6) ||
                            t.branchVersion ||
                            (!window.JetboostListSearchComplete &&
                              !window.JetboostPaginationComplete)
                          );
                        })(t);
                        if (
                          (o
                            ? (console.error(
                                "The " +
                                  (window.JetboostListSearchComplete
                                    ? "JetboostListSearchComplete"
                                    : "JetboostPaginationComplete") +
                                  " function isn't supported by newer versions of Jetboost. Please contact our support team if you'd like to upgrade to the latest version! support@jetboost.io"
                              ),
                              O(t.backwardsCompatScriptUrl))
                            : O(t.mainScriptUrl),
                          t.plugins && t.plugins.length > 0)
                        ) {
                          const e = !!document.querySelector(
                            "[class*='jetboost-map-']"
                          );
                          t.plugins.forEach(function (t) {
                            switch (t.name) {
                              case "mapbox":
                                !window.mapboxgl &&
                                  e &&
                                  (U(t.cssUrl), O(t.scriptUrl));
                                break;
                              case "geocoder":
                                if (!window.MapboxGeocoder && e) {
                                  U(t.cssUrl), O(t.scriptUrl);
                                  var o = document.createElement("style");
                                  (o.id = "jetboost-mapbox-overrides"),
                                    (o.innerHTML =
                                      ".mapboxgl-ctrl-geocoder { width: 100%; max-width: 100%; box-shadow: none; color: inherit; background: inherit; border-radius: inherit; font: inherit; } .mapboxgl-ctrl-geocoder--input { background: inherit; color: inherit; border-radius: inherit;} .mapboxgl-ctrl-geocoder--input::placeholder { color: inherit; } .mapboxgl-ctrl-geocoder--input:focus { background: inherit; color: inherit; border-radius: inherit; outline: inherit} .mapboxgl-ctrl-geocoder--button { background: inherit; } .mapboxgl-ctrl-geocoder--icon { fill: currentColor; } "),
                                    document.head.appendChild(o);
                                }
                                break;
                              case "markjs":
                                window.Mark || O(t.scriptUrl);
                            }
                          });
                        }
                      })
                      .catch(function (t) {
                        console.error(t);
                      })
                  : console.error("Jetboost - Couldn't load Boosters");
              })
              .catch(function (t) {
                console.error(t);
              });
          }),
          "loading" != document.readyState
            ? e()
            : document.addEventListener("DOMContentLoaded", e));
  };
})();
JetboostBootstrap("https://api.jetboost.io/");
