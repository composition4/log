/*

  The Aequirys
  Mithvaerian calendrical system

  Josh Avanier
  MIT

*/

"use strict";

const Aequirys = {

	miy: 13,
	dim: 28,

	ydy: "Year Day",
	ldy: "Leap Day",

	short: function(m) {
		let y = m.yr.toString().substr(-2)
		if (m.dt == this.ydy || m.dt == this.ldy)
			return this.space([m.dt, y])
		else
			return this.space([this.pad(m.dt), m.mn, y])
	},

	shorter: function(m) {
		let y = m.yr.toString().substr(-2)
		if (m.dt == this.ydy || m.dt == this.ldy)
			return m.dt + y
		else
			return this.pad(m.dt) + "" + m.mn + "" + y
	},

	convert: function(n) {
		n = n || new Date()

		let yer = n.getFullYear(),
  			nth = this.nth(n),
  			dat = 0,
  			wek = 0,
  			mon = "",
  			qrt = ""

		switch (nth) {
			case 0:
				dat = this.ydy
				wek = 0
				mon = undefined
				qrt = undefined
				break;
			case 365:
				dat = this.ldy
				wek = 0
				mon = undefined
				qrt = undefined
				break;
			default:
				dat = this.dat(nth)
				wek = this.wek(nth)
				mon = this.mon(nth)
				qrt = this.qua(nth)
				break;
		}

		return {
			yr: yer,
			q1: qrt,
			mn: mon,
			wk: wek,
			dt: dat,
			dy: this.day(nth)
		}
	},

	nth: function(d) {
		d = d || new Date()
		return Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 86400000)
	},

	day: function() {
		return ["01", "02", "03", "04", "05", "06", "07"][(new Date()).getDay()]
	},

	dat: function(n) {
		n = n || this.nth((new Date()))
		let d = n - (this.dim * Math.floor(n / this.dim))
		if (d == 0) d = this.dim
		return d
	},

	wek: function(n) {
		n = n || this.nth((new Date()))
		return Math.floor(n / 7)
	},

	mon: function(n) {
		n = n || this.nth((new Date()))
		return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"][Math.ceil(n / this.dim) - 1]
	},

	qua: function(n) {
		n = n || this.nth((new Date()))
		return ["01", "02", "03", "04"][Math.floor(this.wek(n) / this.miy)]
	},

	space: function(a) {
		let s = ""
		for (let i = 0, l = a.length; i < l; i++) s += a[i] + " "
		return s.substring(0, s.length - 1)
	},

	pad: function(n) {
		return ('0' + n).substr(-2)
	},

	abbr: function(m) {
		return m.substring(0, m.length - 3).toUpperCase()
	}
}
