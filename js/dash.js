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
			let r = t.insertRow(i + 1),
				c1 = r.insertCell(0), // date
				c2 = r.insertCell(1), // start
				c3 = r.insertCell(2), // end
				c4 = r.insertCell(3), // duration
				c5 = r.insertCell(4), // category
				c6 = r.insertCell(5), // title
				c7 = r.insertCell(6), // description

				e = Dash.log[i]

			c1.innerHTML = Dash.time.date(Dash.time.parse(e.s))
			c1.className = "ar"
			c2.innerHTML = Dash.time.stamp(Dash.time.parse(e.s))
			c2.className = "ar"
			c3.innerHTML = Dash.time.stamp(Dash.time.parse(e.e))
			c3.className = "ar"
			c4.innerHTML = Dash.time.duration(Dash.time.parse(e.s), Dash.time.parse(e.e))
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

		let v = document.getElementById("vis")

		// for (let i = 0, l = Dash.log.length; i < l; i++) {
		//   let e = Dash.log[i],
		//       date = Dash.time.date(Dash.time.parse(e.s))
		//       day = document.createElement("div")
		//
		//       v.appendChild(day)
		//       day.className = "line"
		//       day.id = date
		// }

		let lastItemEndingPoint = 0

    let lastWidth = 0, lastPerc = 0

		for (let i = 0, l = Dash.log.length; i < l; i++) {

      let e = Dash.log[i],
				date = Dash.time.date(Dash.time.parse(e.s))

			if (document.getElementById(date) === null) {
				let day = document.createElement("div")
				day.className = "line"
				day.id = date
				v.appendChild(day)
			}

      // let e = Dash.log[i]

			console.log(e)
			let entry = document.createElement("div")
			entry.className = "entry"
			// console.log(Dash.time.parse(e.e))
			let percentage = ((Dash.time.parse(e.e) - Dash.time.parse(e.s)) / 86400) * 100
			// console.log(percentage)
			entry.style.width = percentage + "%"
			let a = Dash.time.convert(Dash.time.parse(e.s)),
				y = a.getFullYear(),
				m = a.getMonth(),
				d = a.getDate(),
				hor = a.getHours(),
				min = a.getMinutes(),
				sec = a.getSeconds()
			let daystart = new Date(y, m, d).getTime() / 1000
			let dayend = new Date(y, m, d, 23, 59).getTime() / 1000

			// lastItemEndingPoint = daystart

			let x = Dash.time.convert(Dash.time.parse(e.e)),
				horx = x.getHours(),
				minx = x.getMinutes(),
				secx = x.getSeconds()

			let xTime = new Date(y, m, d, horx, minx, secx).getTime() / 1000

      let xPer = ((xTime - daystart) / (dayend - daystart) * 100)


			// lastItemEndingPoint = xTime

			// console.log("x: " + xTime)
			// console.log(lastItemEndingPoint)

			// console.log(dayend - daystart)
			let daytime = new Date(y, m, d, hor, min, sec).getTime() / 1000
      let dayPerc = ((daytime - daystart) / (dayend - daystart) * 100)

      // console.log((xPer - dayPerc))

      let stuff = ((xTime - daystart) / (dayend - daystart) * 100)

      // console.log(100 - stuff)

			entry.style.margin = "0 0 0 " + (dayPerc - (lastWidth + lastPerc))  + "%"

			document.getElementById(date).appendChild(entry)
      console.log("LOOP" + i)

      lastWidth = percentage
      lastPerc = dayPerc
		}
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
			// console.log(b - a)
			let dif = b - a,
				hor = (dif / 3600).toFixed(2),
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
