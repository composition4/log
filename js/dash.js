/*

  Dashboard

  Josh Avanier

*/

var Dash = {

	log: [],

  /**
   * Display log status
   * @return {string} log status
   */

  status: function() {
    return Dash.log[Dash.log.length - 1].e == "undefined" ? "Active" : "Idle"
  },

  /**
   * Display logs into a table
   */

	display() {
		let t = document.getElementById("logbook"),
			  a = takeRight(Dash.log, 30)

		t.className = "bn f6 mon"

		for (let i = 0, l = Dash.log.length; i < l; i++) {
			let e = Dash.log[i],
          r = t.insertRow(i + 2),
  				c1 = r.insertCell(0),
  				c2 = r.insertCell(1),
  				c3 = r.insertCell(2),
  				c4 = r.insertCell(3),
  				c5 = r.insertCell(4),
  				c6 = r.insertCell(5),
  				c7 = r.insertCell(6),
          es = Dash.time.parse(e.s),
          ee = Dash.time.parse(e.e),
          q = Dash.time.convert(es)

			c1.innerHTML = Aequirys.shorter(
        Aequirys.convert(
          new Date(
            q.getFullYear(),
            q.getMonth(),
            q.getDate()
          )
        )
      )

      c2.innerHTML = Dash.time.stamp(es)
      c3.innerHTML = Dash.time.stamp(ee)
      c4.innerHTML = Dash.time.duration(es, ee).toFixed(2)
			c5.innerHTML = e.c
			c6.innerHTML = e.t
			c7.innerHTML = e.d
		}

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

  /**
   * Draw data visualisation
   */

	visualise: function() {
		let v = document.getElementById("vis"),
        lw = 0,
        lp = 0

		for (let i = 0, l = Dash.log.length; i < l; i++) {
      let e = Dash.log[i]

      if (e.e == "undefined") continue

      let es = Dash.time.parse(e.s),
          ee = Dash.time.parse(e.e)
				  date = Dash.time.date(es),
          end = Dash.time.date(ee)

      if (date !== end) {
        if (document.getElementById(date) === null) newRow(es, date)

        let a = Dash.time.convert(es),
            eDate = new Date(
              a.getFullYear(),
              a.getMonth(),
              a.getDate(),
              23,
              59
            ).getTime() / 1000

        addEntry(calc(Dash.time.parse((+eDate).toString(16)), es))

        if (document.getElementById(end) === null) newRow(es, end)

        let ea = Dash.time.convert(ee),
            eaDate = new Date(
              ea.getFullYear(),
              ea.getMonth(),
              ea.getDate(),
              0,
              0
            ).getTime() / 1000

        addEntry(calc(ee, Dash.time.parse((+eaDate).toString(16))))
      } else {
        if (document.getElementById(date) === null) newRow(es, date)
        addEntry(calc(ee, es))
      }

      function addEntry(r) {
        let entry = document.createElement("div"), bg = ""

        if      (e.c == "PHO") bg = "bg-blu"
        else if (e.c == "RES") bg = "bg-grn"
        else if (e.c == "DSG") bg = "bg-red"
        else if (e.c == "ACA") bg = "bg-ylw"

        entry.className    = "psr t0 bg-noir hf dib " + bg
        entry.style.width  = r.perc + "%"
        entry.style.margin = "0 0 0 " + r.margin + "%"

        document.getElementById(date).appendChild(entry)

        lw = r.perc
        lp = r.dp
      }

      function calc(ee, es) {
        let perc = (ee - es) / 86400 * 100,

            a = Dash.time.convert(es),
    				y = a.getFullYear(),
    				m = a.getMonth(),
    				d = a.getDate(),

            ds = new Date(y, m, d).getTime() / 1000,
            de = new Date(y, m, d, 23, 59, 59).getTime() / 1000,

            x = Dash.time.convert(ee),
            xt = new Date(y, m, d, x.getHours(), x.getMinutes(), x.getSeconds()).getTime() / 1000,
            dt = new Date(y, m, d, a.getHours(), a.getMinutes(), a.getSeconds()).getTime() / 1000,
            dp = (dt - ds) / (de - ds) * 100,

            margin = dp - (lw + lp)

        return {
          "dp": dp,
          "perc": perc,
          "margin": margin
        }
      }

      function newRow(es, date) {
        lw = 0
        lp = 0

        let lbl = document.createElement("p"),
            day = document.createElement("div"),
            q = Dash.time.convert(es),
            aq = Aequirys.convert(
              new Date(
                q.getFullYear(),
                q.getMonth(),
                q.getDate()
              )
            )

        lbl.className = "f6 mon pb1 bb mb3 bsb"
        lbl.innerHTML = aq.mn + aq.dt

        day.className = "sh2 wf mb1"
        day.id = date

        v.appendChild(lbl)
        v.appendChild(day)
      }
		}
	},

	time: {

    /**
     * Convert hexadecimal into decimal
     * @param {string} s - hexadecimal
     * @return {number} decimal
     */

		parse: function(s) {
			return parseInt(s, 16)
		},

    /**
     * Convert Unix time
     * @param {number} t - Unix time
     */

		convert: function(t) {
			return new Date(t * 1000)
		},

    /**
     * Convert Unix time into a timestamp
     * @param {number} t - Unix time
     * @return {string} timestamp
     */

		stamp: function(t) {
			let d = Dash.time.convert(t),
  				h = "0" + d.getHours(),
  				m = "0" + d.getMinutes(),
  				s = "0" + d.getSeconds()

			return h.substr(-2) + ':' + m.substr(-2) + ':' + s.substr(-2)
		},

    /**
     * Convert Unix time into date
     * @param {number} t - Unix time
     * @return {string} year, month, day
     */

		date: function(t) {
			let a = Dash.time.convert(t),
  				y = a.getFullYear(),
  				m = a.getMonth(),
  				d = a.getDate()

			return y + '' + m + '' + d
		},

    /**
     * Calculate duration
     * @param {number} a - start (Unix time)
     * @param {number} b - end (Unix time)
     * @return {number} duration
     */

		duration: function(a, b) {
			return (b - a) / 3600
		}
	},

  data: {

    average: function() {
      let avg = 0, c = 0
      for (let i = 0, l = Dash.log.length; i < l; i++) {
        let e = Dash.log[i]
        if (e.e == "undefined") continue
        avg += Number(Dash.time.duration(Dash.time.parse(e.s), Dash.time.parse(e.e)))
        c++
      }
      return avg / c
    },

    /**
     * Calculate the total number of logged hours
     * @return {number} total logged hours
     */

    loggedHours: function() {
      let lh = 0
      for (let i = 0, l = Dash.log.length; i < l; i++) {
        let e = Dash.log[i]
        if (e.e == "undefined") continue
        lh += Number(Dash.time.duration(Dash.time.parse(e.s), Dash.time.parse(e.e)))
      }
      return lh
    },

    /**
     * Calculate how much of a time period was logged
     * @return {number} log percentage
     */

    logPercentage: function() {
      let h = Number(Dash.data.loggedHours()),
          e = Dash.time.convert(Dash.time.parse(Dash.log[0].s)),
          d = new Date(),
          n = Math.ceil(((new Date(d.getFullYear(), d.getMonth(), d.getDate())) - (new Date(e.getFullYear(), e.getMonth(), e.getDate()))) / 8.64e7)

      return (h / ((n + 1) * 24)) * 100
    },

    /**
     * Calculate number of hours logged today
     * @return {number} number of hours
     */

    loggedToday: function() {
      let lh = 0

      for (let i = Dash.log.length - 1; i >= 0; i--) {
        let e = Dash.log[i]

        if (e.e == "undefined") continue

        let es = Dash.time.parse(e.s),

            a = Dash.time.convert(es),
    				y = a.getFullYear(),
    				m = a.getMonth(),
    				d = a.getDate(),

            ct = new Date(),
            cty = ct.getFullYear(),
            ctm = ct.getMonth(),
            ctd = ct.getDate()

        if (y == cty && m == ctm && d == ctd)
          lh += Number(Dash.time.duration(es, Dash.time.parse(e.e)))
      }

      return lh
    },

    /**
     * Calculate how much of today was logged
     * @return {number} today's log percentage
     */

    logPercentageToday: function() {
      let entriesToday = []

      for (let i = Dash.log.length - 1; i >= 0; i--) {
        let e = Dash.log[i]

        if (e.e == "undefined") continue

        let a = Dash.time.convert(Dash.time.parse(e.s)),
    				y = a.getFullYear(),
    				m = a.getMonth(),
    				d = a.getDate(),
            t = new Date(),
            ty = t.getFullYear(),
            tm = t.getMonth(),
            td = t.getDate()

        if (y == ty && m == tm && d == td) entriesToday.push(e)
      }

      if (entriesToday.length == 0) {
        return 0
      } else {
        let h = Number(Dash.data.loggedToday()),
            e = Dash.time.convert(Dash.time.parse(entriesToday[0].s)),
            earliest = new Date(e.getFullYear(), e.getMonth(), e.getDate()),
            d = new Date(),
            today = new Date(d.getFullYear(), d.getMonth(), d.getDate()),
            n = Math.ceil((today - earliest) / 8.64e7)

        return (h / 24) * 100
      }
    }
  },

  /**
   * Open a tab
   */

	openSect: function(s) {
		let x = document.getElementsByClassName("sect")
		for (let i = 0, l = x.length; i < l; i++) x[i].style.display = "none"
		document.getElementById(s).style.display = "block"
	},

	init() {
		Dash.log = log
		Dash.display()
		Dash.visualise()

    dis("status", Dash.status())
    dis("loggedHours",  (Dash.data.loggedHours().toFixed(2)        + " h"))
    dis("loggedToday",  (Dash.data.loggedToday().toFixed(2)        + " h"))
    dis("logPerc",      (Dash.data.logPercentage().toFixed(2)      +  "%"))
    dis("logPercToday", (Dash.data.logPercentageToday().toFixed(2) +  "%"))

    dis("ASD", (Dash.data.average().toFixed(2) + " h"))

    function dis(e, m) {
      document.getElementById(e).innerHTML = m
    }
	}
}
