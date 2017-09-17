/*

  Dashboard

  Josh Avanier

*/

var Dash = {

	log: [],

	displayLog() {
		let t = document.getElementById("logbook"),
			  a = takeRight(Dash.log, 30)

		t.className = "bn bg-noir blanc f6 mon"

		for (let i = 0, l = Dash.log.length; i < l; i++) {
			let r = t.insertRow(i + 1),
  				c1 = r.insertCell(0), // date
  				c2 = r.insertCell(1), // duration
  				c3 = r.insertCell(2), // category
  				c4 = r.insertCell(3), // title
  				c5 = r.insertCell(4), // description

  				entry = Dash.log[i]

			c1.innerHTML = Dash.convertDate(entry.s)
			c1.className = "ar"
			c2.innerHTML = Dash.duration(Dash.parse(entry.s), Dash.parse(entry.e))
			c2.className = "ar"
			c3.innerHTML = entry.c
			c4.innerHTML = entry.t
			c5.innerHTML = entry.d
		}

		// taken from lodash
		function takeRight(a, n = 1) {
			const l = a == null ? 0 : a.length
			if (!l) return []
			n = l - n
			return slice(a, n < 0 ? 0 : n, l)
			function slice(a, s, e) {
				let l = a == null ? 0 : a.length
				if (!l) return []
				s = s == null ? 0 : s
				e = e === undefined ? l : e
				if (s < 0) s = -s > l ? 0 : (l + s)
				e = e > l ? l : e
				if (e < 0) e += l
				l = s > e ? 0 : ((e - s) >>> 0)
				s >>>= 0
				let i = -1
				const r = new Array(l) // result
				while (++i < l) r[i] = a[i + s]
				return r
			}
		}
	},

	parse: function(s) {
		let n = parseInt(s, 16).toString()
		return {
			"y": n.charAt(0) + n.charAt(1),
			"m": n.charAt(2) + n.charAt(3),
			"d": n.charAt(4) + n.charAt(5),
			"h": n.charAt(6) + n.charAt(7),
			"n": n.charAt(8) + n.charAt(9)
		}
	},

	duration: function(a, b) {
		let md, hd, total

    md = b.n < a.n ? b.n + (60 - a.n) : b.n - a.n
		hd = b.h < a.h ? b.h + (24 - a.h) : b.h - a.h

    total = ((hd * 60) + md) / 60

    return total.toFixed(2)
	},

	convertDate: function(n) {
		n = parseInt(n, 16).toString()

		let y = "20" + n.slice(0, 3),
  			m = n.slice(3, 4),
  			d = n.slice(4, 6)

		return y + m + d
	},

	openSect: function(sect) {
		let x = document.getElementsByClassName("sect")

		for (let i = 0, l = x.length; i < l; i++)
			x[i].style.display = "none"

		document.getElementById(sect).style.display = "block"
	},

	init() {
		Dash.log = log
		Dash.displayLog()
	}
}
