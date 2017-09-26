/*

  Dashboard

  Josh Avanier

*/

var Dash = {

	log: [],

	display() {
		let t = document.getElementById("logbook"),
			  a = takeRight(Dash.log, 30)

		t.className = "bn bg-noir blanc f6 mon"

		for (let i = 0, l = Dash.log.length; i < l; i++) {
			let e = Dash.log[i],
          r = t.insertRow(i + 1),

  				c1 = r.insertCell(0), // date
  				c2 = r.insertCell(1), // start
  				c3 = r.insertCell(2), // end
  				c4 = r.insertCell(3), // duration
  				c5 = r.insertCell(4), // category
  				c6 = r.insertCell(5), // title
  				c7 = r.insertCell(6), // description

          es = Dash.time.parse(e.s),
          ee = Dash.time.parse(e.e)

			c1.innerHTML = Dash.time.date(es)
			c1.className = "ar"
			c2.innerHTML = Dash.time.stamp(es)
			c2.className = "ar"
			c3.innerHTML = Dash.time.stamp(ee)
			c3.className = "ar"
			c4.innerHTML = Dash.time.duration(es, ee)
			c4.className = "ar"
			c5.innerHTML = e.c
			c6.innerHTML = e.t
			c7.innerHTML = e.d
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

	visualise: function() {
		let v = document.getElementById("vis"),
        lastWidth = 0,
        lastPerc = 0

		for (let i = 0, l = Dash.log.length; i < l; i++) {
      let e = Dash.log[i],
          es = Dash.time.parse(e.s),
          ee = Dash.time.parse(e.e)
				  date = Dash.time.date(es)

			if (document.getElementById(date) === null) {
        lastWidth = 0
        lastPerc = 0

        let label = document.createElement("p"),
            day = document.createElement("div")

        let q = Dash.time.convert(es),
            qy = q.getFullYear(),
            qm = q.getMonth(),
            qd = q.getDate(),

            aq = Aequirys.convert(new Date(qy, qm, qd))

        label.className = "f6 mon pb1 bb mb1"
        day.className = "line"
        label.innerHTML = Aequirys.shorter(aq)
        day.id = date
        v.appendChild(label)
				v.appendChild(day)
			}

			let perc = ((ee - es) / 86400) * 100,
          a = Dash.time.convert(es),
  				y = a.getFullYear(),
  				m = a.getMonth(),
  				d = a.getDate(),
  				h = a.getHours(),
  				n = a.getMinutes(),
  				s = a.getSeconds(),

          ds = new Date(y, m, d).getTime() / 1000,
          de = new Date(y, m, d, 23, 59, 59).getTime() / 1000,

          x = Dash.time.convert(ee),
  				hx = x.getHours(),
  				nx = x.getMinutes(),
  				sx = x.getSeconds(),
          xTime = new Date(y, m, d, hx, nx, sx).getTime() / 1000,
          xPer = (xTime - ds) / (de - ds) * 100,

          dt = new Date(y, m, d, h, n, s).getTime() / 1000,
          dp = (dt - ds) / (de - ds) * 100,
          stuff = (xTime - ds) / (de - ds) * 100,
          margin = dp - (lastWidth + lastPerc),

          entry = document.createElement("div")

			entry.className = "psr t0 bg-noir hf dib"
      entry.style.width = perc + "%"
      entry.style.margin = "0 0 0 " + margin  + "%"
      document.getElementById(date).appendChild(entry)

      lastWidth = perc
      lastPerc = dp
		}

    console.log("Log visualisation ready.")
	},

	time: {

		parse: function(s) {
			return parseInt(s, 16)
		},

		convert: function(t) {
			return new Date(t * 1000)
		},

		stamp: function(t) {
			let d = Dash.time.convert(t),
  				h = "0" + d.getHours(),
  				m = "0" + d.getMinutes(),
  				s = "0" + d.getSeconds()

			return h.substr(-2) + ':' + m.substr(-2) + ':' + s.substr(-2)
		},

		date: function(t) {
			let a = Dash.time.convert(t),
  				y = a.getFullYear(),
  				m = a.getMonth(),
  				d = a.getDate()

			return y + '' + m + '' + d
		},

		duration: function(a, b) {
			let dif = b - a,
  				hor = (dif / 3600).toFixed(2)
  				min = Math.floor(dif / 60),
  				sec = dif % 60

			return hor
		},
	},

	openSect: function(sect) {
		let x = document.getElementsByClassName("sect")

		for (let i = 0, l = x.length; i < l; i++)
			x[i].style.display = "none"

		document.getElementById(sect).style.display = "block"
	},

	init() {
		Dash.log = log
		Dash.display()
		Dash.visualise()
	}
}
