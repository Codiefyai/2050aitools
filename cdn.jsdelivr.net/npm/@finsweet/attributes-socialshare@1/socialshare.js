"use strict";
(() => {
  var f = "fs-attributes";
  var P = "cmsattribute";
  var O = "cmsload";
  var A = "socialshare";
  var R = "support";
  var M = async (...t) => {
    var o;
    let e = [];
    for (let r of t) {
      let n = await ((o = window.fsAttributes[r]) == null ? void 0 : o.loading);
      e.push(n);
    }
    return e;
  };
  var y = () => {};
  function U(t, e, o, r) {
    return t
      ? (t.addEventListener(e, o, r), () => t.removeEventListener(e, o, r))
      : y;
  }
  var H = (t) => t instanceof Element;
  var g = (t) => typeof t == "string";
  var K = {
    wrapper: "w-dyn-list",
    list: "w-dyn-items",
    item: "w-dyn-item",
    paginationWrapper: "w-pagination-wrapper",
    paginationNext: "w-pagination-next",
    paginationPrevious: "w-pagination-previous",
    pageCount: "w-page-count",
    emptyState: "w-dyn-empty",
  };
  var k = (t) => {
    let e = t.split("-"),
      o = parseInt(e[e.length - 1]);
    if (!isNaN(o)) return o;
  };
  function $(t, e, o) {
    var n;
    let r = window.fsAttributes[t];
    return (r.destroy = o || y), (n = r.resolve) == null || n.call(r, e), e;
  }
  var F = (t, e = "1", o = "iife") => {
    let n = `${t}${o === "esm" ? ".esm" : ""}.js`;
    return `https://cdn.jsdelivr.net/npm/@finsweet/attributes-${t}@${e}/${n}`;
  };
  var lt = `${f}-${R}`,
    V = async () => {
      var n;
      let { fsAttributes: t, location: e } = window,
        { host: o, searchParams: r } = new URL(e.href);
      return !o.includes("webflow.io") || !r.has(lt)
        ? !1
        : (n = t.import) == null
        ? void 0
        : n.call(t, R, "1");
    };
  var p = (t) => (e) => `${t}${e ? `-${e}` : ""}`,
    C = (t) => {
      let e = (n, i, s) => {
        let c = t[n],
          { key: l, values: w } = c,
          d;
        if (!i) return `[${l}]`;
        let L = w == null ? void 0 : w[i];
        g(L)
          ? (d = L)
          : (d = L(s && "instanceIndex" in s ? s.instanceIndex : void 0));
        let h = s && "caseInsensitive" in s && s.caseInsensitive ? "i" : "";
        if (!(s != null && s.operator)) return `[${l}="${d}"${h}]`;
        switch (s.operator) {
          case "prefixed":
            return `[${l}^="${d}"${h}]`;
          case "suffixed":
            return `[${l}$="${d}"${h}]`;
          case "contains":
            return `[${l}*="${d}"${h}]`;
        }
      };
      function o(n, i) {
        let s = e("element", n, i),
          c = (i == null ? void 0 : i.scope) || document;
        return i != null && i.all
          ? [...c.querySelectorAll(s)]
          : c.querySelector(s);
      }
      return [
        e,
        o,
        (n, i) => {
          let s = t[i];
          return s ? n.getAttribute(s.key) : null;
        },
      ];
    };
  var I = {
      preventLoad: { key: `${f}-preventload` },
      debugMode: { key: `${f}-debug` },
      src: { key: "src", values: { finsweet: "@finsweet/attributes" } },
      dev: { key: `${f}-dev` },
    },
    [N, oe] = C(I);
  var W = (t) => {
    let { currentScript: e } = document,
      o = {};
    if (!e) return { attributes: o, preventsLoad: !1 };
    let n = {
      preventsLoad: g(e.getAttribute(I.preventLoad.key)),
      attributes: o,
    };
    for (let i in t) {
      let s = e.getAttribute(t[i]);
      n.attributes[i] = s;
    }
    return n;
  };
  var G = ({ scriptAttributes: t, attributeKey: e, version: o, init: r }) => {
      var c;
      pt(), (c = window.fsAttributes)[e] || (c[e] = {});
      let { preventsLoad: n, attributes: i } = W(t),
        s = window.fsAttributes[e];
      (s.version = o),
        (s.init = r),
        n ||
          (window.Webflow || (window.Webflow = []),
          window.Webflow.push(() => r(i)));
    },
    pt = () => {
      let t = ut();
      if (window.fsAttributes && !Array.isArray(window.fsAttributes)) {
        B(window.fsAttributes, t);
        return;
      }
      let e = mt(t);
      B(e, t),
        Et(e),
        (window.fsAttributes = e),
        (window.FsAttributes = window.fsAttributes),
        V();
    },
    mt = (t) => {
      let e = {
        cms: {},
        push(...o) {
          var r, n;
          for (let [i, s] of o)
            (n = (r = this[i]) == null ? void 0 : r.loading) == null ||
              n.then(s);
        },
        async import(o, r) {
          let n = e[o];
          return (
            n ||
            new Promise((i) => {
              let s = document.createElement("script");
              (s.src = F(o, r)),
                (s.async = !0),
                (s.onload = () => {
                  let [c] = B(e, [o]);
                  i(c);
                }),
                document.head.append(s);
            })
          );
        },
        destroy() {
          var o, r;
          for (let n of t)
            (r = (o = window.fsAttributes[n]) == null ? void 0 : o.destroy) ==
              null || r.call(o);
        },
      };
      return e;
    },
    ut = () => {
      let t = N("src", "finsweet", { operator: "contains" }),
        e = N("dev");
      return [...document.querySelectorAll(`script${t}, script${e}`)].reduce(
        (n, i) => {
          var c;
          let s =
            i.getAttribute(I.dev.key) ||
            ((c = i.src.match(/[\w-. ]+(?=(\.js)$)/)) == null ? void 0 : c[0]);
          return s && !n.includes(s) && n.push(s), n;
        },
        []
      );
    },
    B = (t, e) =>
      e.map((r) => {
        let n = t[r];
        return (
          n ||
          ((t[r] = {}),
          (n = t[r]),
          (n.loading = new Promise((i) => {
            n.resolve = (s) => {
              i(s), delete n.resolve;
            };
          })),
          n)
        );
      }),
    Et = (t) => {
      let e = Array.isArray(window.fsAttributes) ? window.fsAttributes : [];
      t.push(...e);
    };
  var Y = "1.3.2";
  var v = `fs-${A}`,
    St = "facebook",
    dt = "twitter",
    ft = "pinterest",
    At = "linkedin",
    xt = "telegram",
    bt = "reddit",
    _t = "content",
    wt = "url",
    yt = "facebook-hashtags",
    It = "twitter-hashtags",
    ht = "twitter-username",
    gt = "pinterest-image",
    Ct = "pinterest-description",
    Lt = "width",
    q = 600,
    Rt = "height",
    j = 480,
    x = {
      element: {
        key: `${v}-element`,
        values: {
          facebook: p(St),
          twitter: p(dt),
          pinterest: p(ft),
          linkedin: p(At),
          telegram: p(xt),
          reddit: p(bt),
          content: p(_t),
          url: p(wt),
          facebookHashtags: p(yt),
          twitterHashtags: p(It),
          twitterUsername: p(ht),
          pinterestImage: p(gt),
          pinterestDescription: p(Ct),
        },
      },
      width: { key: `${v}-${Rt}` },
      height: { key: `${v}-${Lt}` },
    },
    [X, m] = C(x),
    b = {
      facebook: "https://www.facebook.com/sharer/sharer.php",
      twitter: "https://twitter.com/intent/tweet/",
      pinterest: "https://www.pinterest.com/pin/create/trigger/",
      reddit: "https://www.reddit.com/submit",
      linkedin: "https://www.linkedin.com/sharing/share-offsite",
      telegram: "https://t.me/share",
    };
  var a = {
    facebook: new Map(),
    twitter: new Map(),
    pinterest: new Map(),
    telegram: new Map(),
    linkedin: new Map(),
    reddit: new Map(),
  };
  var z = () =>
      U(document, "click", (e) => {
        let { target: o } = e;
        if (H(o))
          for (let r in b) {
            let n = r,
              i = o.closest(
                X("element", n, { operator: "prefixed", caseInsensitive: !0 })
              );
            if (!i) continue;
            let s = a[n].get(i);
            s && Mt(s);
            break;
          }
      }),
    Mt = ({ width: t, height: e, shareUrl: o }) => {
      let r = window.innerWidth / 2 - t / 2 + window.screenX,
        n = window.innerHeight / 2 - e / 2 + window.screenY,
        i = `scrollbars=no, width=${t}, height=${e}, top=${n}, left=${r}`,
        s = window.open(o, "", i);
      s && s.focus();
    };
  var Ut = "fs-cms-element",
    kt = {
      wrapper: "wrapper",
      list: "list",
      item: "item",
      paginationWrapper: "pagination-wrapper",
      paginationNext: "pagination-next",
      paginationPrevious: "pagination-previous",
      pageCount: "page-count",
      emptyState: "empty",
    },
    Q = (t) => {
      let e = `.${K[t]}`,
        o = `[${Ut}="${kt[t]}"]`;
      return `:is(${e}, ${o})`;
    };
  var u = (t, e) => {
    let o = t.getAttribute(e);
    return o ? k(o) : void 0;
  };
  function J(t, e, o) {
    let r = E(t, "facebook", e, o),
      n = m("facebookHashtags", {
        instanceIndex: e,
        operator: "prefixed",
        scope: o,
      }),
      i = n ? n.textContent : null;
    return { ...r, type: "facebook", hashtags: i };
  }
  function tt(t, e, o) {
    let r = E(t, "twitter", e, o),
      n = m("twitterHashtags", {
        instanceIndex: e,
        operator: "prefixed",
        scope: o,
      }),
      i =
        n && n.textContent
          ? n.textContent.replace(/[^a-zA-Z0-9_,]/g, "")
          : null,
      s = m("twitterUsername", {
        instanceIndex: e,
        operator: "prefixed",
        scope: o,
      }),
      c = s ? s.textContent : null;
    return { ...r, type: "twitter", hashtags: i, username: c };
  }
  function et(t, e, o) {
    let r = E(t, "pinterest", e, o),
      n = m("pinterestImage", {
        instanceIndex: e,
        operator: "prefixed",
        scope: o,
      }),
      i = n && n.src ? n.src : null,
      s = m("pinterestDescription", {
        instanceIndex: e,
        operator: "prefixed",
        scope: o,
      }),
      c = s ? s.textContent : null;
    return { ...r, type: "pinterest", image: i, description: c };
  }
  function E(t, e, o, r) {
    let n = Z(t, x.width.key, q),
      i = Z(t, x.height.key, j),
      s = m("content", { instanceIndex: o, operator: "prefixed", scope: r }),
      c = s ? s.textContent : null,
      l = m("url", { instanceIndex: o, operator: "prefixed", scope: r }),
      w = l && l.textContent ? l.textContent : window.location.href;
    return { content: c, url: w, width: n, height: i, type: e };
  }
  function Z(t, e, o) {
    let r = t.getAttribute(e);
    if (r) {
      let c = parseInt(r);
      return isNaN(c) ? o : c;
    }
    let n = t.closest(`[${e}]`);
    if (!n) return o;
    let i = n.getAttribute(e);
    if (!i) return o;
    let s = parseInt(i);
    return isNaN(s) ? o : s;
  }
  function ot({
    type: t,
    url: e,
    hashtags: o,
    content: r,
    width: n,
    height: i,
  }) {
    return _(t, { u: e, hashtag: o, quote: r }, n, i);
  }
  function nt({
    type: t,
    content: e,
    username: o,
    hashtags: r,
    url: n,
    width: i,
    height: s,
  }) {
    return _(t, { url: n, hashtags: r, text: e, via: o }, i, s);
  }
  function rt({
    type: t,
    url: e,
    image: o,
    description: r,
    width: n,
    height: i,
  }) {
    return _(t, { url: e, description: r, media: o }, n, i);
  }
  function st({ type: t, url: e, width: o, height: r }) {
    return _(t, { url: e }, o, r);
  }
  function it({ type: t, url: e, content: o, width: r, height: n }) {
    return _(t, { url: e, title: o }, r, n);
  }
  function ct({ type: t, content: e, url: o, width: r, height: n }) {
    return _(t, { url: o, text: e }, r, n);
  }
  function _(t, e, o, r) {
    let n = b[t],
      i = new URL(n),
      s = Object.entries(e);
    for (let [c, l] of s) l && i.searchParams.append(c, l);
    return { height: r, width: o, type: t, shareUrl: i };
  }
  var T = (t) => t.closest(Q("item")) || void 0;
  var {
      element: { key: S },
    } = x,
    D = (t) => {
      for (let e in b) {
        let o = e,
          r = m(o, {
            scope: t,
            operator: "prefixed",
            all: !0,
            caseInsensitive: !0,
          }),
          n = `${e}[-0-9]*[a-zA-Z]+`,
          i = r.filter((c) => {
            var l;
            return !(
              (l = c.getAttribute(S)) != null &&
              l.toLocaleLowerCase().match(new RegExp(n))
            );
          }),
          s = Nt[o];
        i.forEach(s);
      }
    },
    Nt = {
      facebook(t) {
        if (a.facebook.has(t)) return;
        let e = u(t, S),
          o = T(t),
          r = J(t, e, o),
          n = ot(r);
        a.facebook.set(t, n);
      },
      twitter(t) {
        if (a.twitter.has(t)) return;
        let e = u(t, S),
          o = T(t),
          r = tt(t, e, o),
          n = nt(r);
        a.twitter.set(t, n);
      },
      pinterest(t) {
        if (a.pinterest.has(t)) return;
        let e = u(t, S),
          o = T(t),
          r = et(t, e, o),
          n = rt(r);
        a.pinterest.set(t, n);
      },
      telegram(t) {
        if (a.telegram.has(t)) return;
        let e = u(t, S),
          o = T(t),
          r = E(t, "telegram", e, o),
          n = ct(r);
        a.telegram.set(t, n);
      },
      linkedin(t) {
        if (a.linkedin.has(t)) return;
        let e = u(t, S),
          o = T(t),
          r = E(t, "linkedin", e, o),
          n = st(r);
        a.linkedin.set(t, n);
      },
      reddit(t) {
        if (a.reddit.has(t)) return;
        let e = u(t, S),
          o = T(t),
          r = E(t, "reddit", e, o),
          n = it(r);
        a.reddit.set(t, n);
      },
    };
  var at = async () => {
    await M(P);
    let t = z();
    D();
    let e = (await M(O))[0] || [];
    for (let { items: o } of e) for (let { element: r } of o) D(r);
    return $(A, a, () => {
      t();
    });
  };
  G({ init: at, version: Y, attributeKey: A });
})();
