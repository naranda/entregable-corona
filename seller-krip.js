(() => {
	"use strict";
	const e = 720, epoint="https://api.retail.corona.cl/partners/sellers/krip/v1", bciplusepoint="https://api.bciplus.cl/ms-loyalty-sales/v2", 
		t = (t, r) => {
			let o = (e => {
				let t = new URLSearchParams(e.search).get("krip-config");
				if (!t) return null;
				t.includes("?") && (t = t.split("?")[0]);
				return JSON.parse(t)
			})(t);
			if (o) return ((e, t) => {
				const r = JSON.stringify(e);
				t.setItem("krip-config", r)
			})(o, r), (e => {
				const t = Date.now();
				e.setItem("krip-time", t)
			})(r), o;
			if (o = (e => {
					const t = e.getItem("krip-config");
					if (!t) return null;
					return JSON.parse(t)
				})(r), !o) return {};
			const {
				validCookieHours: n = e
			} = o;
			return ((e, t) => {
				const r = e.getItem("krip-time");
				if (!r) return !1;
				const o = +r;
				return Date.now() - o < 36e5 * t
			})(r, n) ? o : ((e => {
				e.removeItem("krip-config"), e.removeItem("krip-time")
			})(r), {})
		},
		r = e => +e.replace(/\D/g, ""),
		o = ({
			parent: e,
			query: t = "",
			document: r
		}) => {
			const o = t.split(",").reduce((t, r) => {
				if (t) return t;
				if (!r) return t;
				const o = e.querySelector(r);
				return o || null
			}, null);
			return o || r.createElement("div")
		},
		n = e => e instanceof HTMLInputElement || e instanceof HTMLSelectElement ? e.value : e.textContent,
		c = ({
			location: e,
			path: t
		}) => {
			const {
				pathname: r,
				hash: o
			} = e, n = new RegExp(t), c = n.test(r), a = n.test(o);
			return c || a
		},
		a = ({
			parent: e,
			query: t,
			document: r
		}) => {
			const c = o({
				parent: e,
				query: t,
				document: r
			});
			return n(c).trim()
		},
		s = ({
			parent: e,
			query: t,
			document: c
		}) => {
			const a = o({
					parent: e,
					query: t,
					document: c
				}),
				s = n(a);
			return r(s)
		},
		i = ({
			parent: e,
			query: t,
			document: c
		}) => {
			const a = o({
					parent: e,
					query: t,
					document: c
				}),
				s = n(a);
			return r(s)
		},
		l = ({
			parent: e,
			query: t,
			document: r,
			location: n
		}) => ((e, t) => {
			let r;
			try {
				r = new URL(e)
			} catch (o) {
				const n = `${t.origin}${e}`;
				r = new URL(n)
			}
			return r.href
		})(o({
			parent: e,
			query: t,
			document: r
		}).getAttribute("href"), n),
		u = ({
			parent: e,
			query: t,
			document: r
		}) => {
			const c = o({
				parent: e,
				query: t,
				document: r
			});
			return n(c).trim()
		},
		m = (e, t) => {
			const r = [...e.querySelectorAll(t.itemQuery)].map(((e, t) => r => ({
				title: a({
					parent: r,
					query: e.itemTitleQuery,
					document: t
				}),
				quantity: s({
					parent: r,
					query: e.itemQuantityQuery,
					document: t
				}),
				totalPrice: i({
					parent: r,
					query: e.itemTotalQuery,
					document: t
				})
			}))(t, e));
			let o = 0;
			o = t.subtotalPriceQuery ? i({
				parent: e,
				query: t.subtotalPriceQuery,
				document: e
			}) : r.reduce((e, t) => e + t.totalPrice, 0);
			return {
				subtotal: o,
				orderNumber: u({
					parent: e,
					query: t.orderNumberQuery,
					document: e
				}),
				items: r
			}
		},
		p = ({
			document: e,
			location: t,
			queries: r
		}) => {
			const o = [...e.querySelectorAll(r.itemCartQuery)].map(((e, t, r) => o => ({
				title: a({
					parent: o,
					query: e.itemTitleQuery,
					document: r
				}),
				url: l({
					parent: o,
					query: e.itemURLQuery,
					document: r,
					location: t
				}),
				price: i({
					parent: o,
					query: e.itemPriceQuery,
					document: r
				}),
				quantity: s({
					parent: o,
					query: e.itemQuantityQuery,
					document: r
				}),
				totalPrice: i({
					parent: o,
					query: e.itemTotalQuery,
					document: r
				}),
				orderNumber: u({
					parent: r,
					query: e.orderNumberQuery,
					document: r
				})
			}))(r, t, e));
			return {
				subtotal: i({
					parent: e,
					query: r.totalCartQuery,
					document: e
				}),
				items: o
			}
		},
		d = epoint + "/logs",
		dd = bciplusepoint + "/log-pixel-error",
		y = "e44f9a1818354d42a4be560b4a8f4179",
		g = (e, t, r, o) => ({
			store: `${e}=>${t}`,
			leadCode: r,
			message: o
		}),
		f = e => !e || 0 === Object.keys(e).length,
		h = async(e, t = {}, r = null, o, n) => {
			let c;
			const {
				orderNumberQuery: a,
				...s
			} = t;
			if (c = f(s) ? (e => {
					const t = e.getItem("krip-cart");
					return t ? JSON.parse(t) : {}
				})(o) : m(e, t), r && r.disconnect(), !f(c)) {
				if (a) {
					c = {...(({
							document: e,
							orderNumberQuery: t
						}) => ({
							orderNumber: u({
								parent: e,
								query: t,
								document: e
							})
						}))({
							document: e,
							orderNumberQuery: a
						}),
						...c
					}
				}
				c.successUrl = (({
					location: e
				}) => e.href)({
					location: e.location
				}), console.log("Borrando el cart start"), o.removeItem("krip-cart"), console.log("Borrando el cart end");
				try {
					console.log("Enviando el cart start",), await (async(e, {
						campaign: t,
						code: r
					}) => {
						const o = {
								campaign: t,
								code: r,
								sale: e
							},
							n = JSON.stringify(o);
						console.log("stringifyData", n);
						const c = window.location.host,
							{
								subtotal: a,
								items: s
							} = e;
						if (console.log("cart", e), console.log("subtotal", a), console.log("items", s), console.log("campaign", t), console.log("code", r), isNaN(+a) || +a <= 0) {
							const e = g(c, t, r, "Error de compra Subtotal");
							console.log(">>>> Error, registrando en : ",dd);
							await fetch(dd, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									"Ocp-Apim-Subscription-Key": y
								},
								body: JSON.stringify(e)
							});
							console.log(">>>> Error, registrando interno en : ",d);
							return void await fetch(d, {
								method: "POST",
								headers: {
									"Content-Type": "application/json"
								},
								body: JSON.stringify(e)
							})
						}
						if (s.length > 0)
							for (let e = 0; e < s.length; e++)
								if (isNaN(+s[e].totalPrice)) {
									const e = g(c, t, r, "Error de compra items.totalPrice y no numerico");
									await fetch(dd, {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
											"Ocp-Apim-Subscription-Key": y
										},
										body: JSON.stringify(e)
									})

									return void await fetch(d, {
										method: "POST",
										headers: {
											"Content-Type": "application/json"
										},
										body: JSON.stringify(e)
									})
								}
						await fetch(bciplusepoint + "/sales", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Ocp-Apim-Subscription-Key": y
							},
							body: n
						})

						return await fetch(epoint + "/sales", {
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: n
						})
					})(c, n), console.log("Enviando el cart end")
				} catch (e) {
					console.log("err", e), console.log("Error: Catch sendCart start");
					const t = epoint + "/sales";
					console.log("API_URL", t);
					const r = epoint + "/logs";
					console.log("API_ERROR_URL", r);
					const o = window.location.host;
					console.log("urlHost", o);
					const {
						subtotal: a,
						items: s
					} = c;
					console.log("cart", c), console.log("subtotal", a), console.log("items", s);
					const i = "e44f9a1818354d42a4be560b4a8f4179",
						l = b(o, n.campaign, n.code, "Error generico", e);
					console.log("datosCompra", l), console.log("Error: Catch sendCart before fetch"), 
					await fetch(bciplusepoint + "/log-pixel-error", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Ocp-Apim-Subscription-Key": i
						},
						body: JSON.stringify(l)
					}),
					await fetch(epoint + "/logs", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(l)
					}), console.log("Error: Catch sendCart end")
				}
			}
		},
		b = (e, t, r, o, n = "") => ({
			store: `${e}=>${t}`,
			leadCode: r,
			message: o,
			error: JSON.stringify(n, Object.getOwnPropertyNames(n))
		}),
		q = (e, t, r = null, o) => {
			if (r && f(t)) return r.disconnect();
			((e, t) => {
				const r = JSON.stringify(e);
				t.setItem("krip-cart", r)
			})(p({
				document: e,
				location,
				queries: t
			}), o)
		},
		S = (e, t, r, {
			confirmationConfig: o,
			cartConfig: n,
			campaign: a,
			code: s
		}) => {
			const i = (i = null) => {
				c({
					location: t,
					path: o.path
				}) ? h(e, o.queries, i, r, {
					campaign: a,
					code: s
				}) : c({
					location: t,
					path: n.path
				}) && q(e, n.queries, i, r)
			};
			i();
			const l = new MutationObserver(() => i(l));
			return l.observe(e, {
				childList: !0,
				subtree: !0
			}), l
		},
		O = e => {
			if (top !== self) return;
			const {
				document: r,
				location: o,
				localStorage: n,
				history: c
			} = e, a = t(o, n);
			var s;
			(s = a) && 0 !== Object.keys(s).length && (((e, t) => {
				const r = new URL(e.href);
				r.searchParams.delete("krip-config"), t.replaceState(null, null, r.href)
			})(o, c), S(r, o, n, a))
		},
		N = (e, t, r = 10, o = null) => {
			if (o && clearTimeout(o), e()) return void t();
			if (r < 1) return;
			const n = ((e = 0) => Math.round(1e5 / Math.pow(2, e)))(r),
				c = setTimeout(() => N(e, t, r - 1, c), n)
		};
	N(() => "complete" === document.readyState, () => O(window))
})();