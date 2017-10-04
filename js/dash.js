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
        time = Dash.time

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
          es = time.parse(e.s),
          ee = time.parse(e.e),
          q = time.convert(es)

			c1.innerHTML = Aequirys.shorter(
        Aequirys.convert(
          new Date(
            q.getFullYear(),
            q.getMonth(),
            q.getDate()
          )
        )
      )

      c2.innerHTML = time.stamp(es)
      c3.innerHTML = time.stamp(ee)
      c4.innerHTML = time.duration(es, ee).toFixed(2)
			c5.innerHTML = e.c
			c6.innerHTML = e.t
			c7.innerHTML = e.d
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
        let p = (ee - es) / 86400 * 100,
            s = Dash.time.convert(es),
    				sy = s.getFullYear(),
    				sm = s.getMonth(),
    				sd = s.getDate(),
            ds = new Date(sy, sm, sd).getTime() / 1000,
            de = new Date(sy, sm, sd, 23, 59, 59).getTime() / 1000,
            e = Dash.time.convert(ee),
            et = new Date(
              sy, sm, sd, e.getHours(), e.getMinutes(), e.getSeconds()
            ).getTime() / 1000,
            dt = new Date(
              sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()
            ).getTime() / 1000,
            dp = (dt - ds) / (de - ds) * 100,
            m = dp - (lw + lp)

        return {
          "dp": dp,
          "perc": p,
          "margin": m
        }
      }

      function newRow(es, date) {
        lw = 0
        lp = 0

        let lb = document.createElement("p"),
            dy = document.createElement("div"),
            q = Dash.time.convert(es),
            aq = Aequirys.convert(
              new Date(
                q.getFullYear(),
                q.getMonth(),
                q.getDate()
              )
            )

        lb.className = "f6 mon pb1 bb mb3"
        lb.innerHTML = aq.mn + aq.dt

        dy.className = "sh2 wf mb1"
        dy.id = date

        v.appendChild(lb)
        v.appendChild(dy)
      }
		}
	},

  barChart: function() {

    let v = document.getElementById("weekChart"),
        lw = 0

		for (let i = 0, l = Dash.log.length; i < l; i++) {
      let e = Dash.log[i]

      if (e.e == "undefined") continue

      let es = Dash.time.parse(e.s),
          ee = Dash.time.parse(e.e)
				  date = Dash.time.date(es),
          end = Dash.time.date(ee)

      if (date !== end) {
        if (document.getElementById(date) === null) newCol(es, date)

        let a = Dash.time.convert(es),
            eDate = new Date(
              a.getFullYear(),
              a.getMonth(),
              a.getDate(),
              23,
              59
            ).getTime() / 1000

        addEntry(calc(Dash.time.parse((+eDate).toString(16)), es))

        if (document.getElementById(end) === null) newCol(es, end)

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
        if (document.getElementById(date) === null) newCol(es, date)
        addEntry(calc(ee, es))
      }

      function addEntry(r) {
        let entry = document.createElement("div"), bg = ""

        if      (e.c == "PHO") bg = "bg-blu"
        else if (e.c == "RES") bg = "bg-grn"
        else if (e.c == "DSG") bg = "bg-red"
        else if (e.c == "ACA") bg = "bg-ylw"

        entry.className    = "psa wf bg-noir fw " + bg
        entry.style.height  = r.perc + "%"
        entry.style.bottom = lw + "%"

        document.getElementById(date).appendChild(entry)

        lw += r.perc
        // lp += r.dp
      }

      function calc(ee, es) {
        let p = (ee - es) / 86400 * 100,
            s = Dash.time.convert(es),
    				sy = s.getFullYear(),
    				sm = s.getMonth(),
    				sd = s.getDate(),
            ds = new Date(sy, sm, sd).getTime() / 1000,
            de = new Date(sy, sm, sd, 23, 59, 59).getTime() / 1000,
            e = Dash.time.convert(ee),
            et = new Date(
              sy, sm, sd, e.getHours(), e.getMinutes(), e.getSeconds()
            ).getTime() / 1000,
            dt = new Date(
              sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()
            ).getTime() / 1000,
            dp = (dt - ds) / (de - ds) * 100,
            m = dp - (lw)

        return {
          "dp": dp,
          "perc": p,
          "margin": m
        }
      }

      function newCol(es, date) {
        lw = 0

        let dy = document.createElement("div")

        dy.className = "dib w1 hf psr"
        dy.id = date

        v.appendChild(dy)
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
			let a = Dash.time.convert(t)
			return a.getFullYear() + '' + a.getMonth() + '' + a.getDate()
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
          n = Math.ceil((
              new Date(
                d.getFullYear(), d.getMonth(), d.getDate()
              ) - new Date(
                e.getFullYear(), e.getMonth(), e.getDate()
              )) / 8.64e7)

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
    },

    /**
     * Calculate sector hours
     * @param {string} sector - sector
     * @return {number} number of sector hours
     */

    sectorHours: function(sector) {
      let lh = 0, time = Dash.time
      for (let i = 0, l = Dash.log.length; i < l; i++) {
        let e = Dash.log[i]
        if (e.e == "undefined") continue
        if (e.c == sector)
          lh += Number(time.duration(time.parse(e.s), time.parse(e.e)))
      }
      return lh
    },

    /**
     * Calculate sector percentage
     * @param {string} sector - sector
     * @return {number} sector percentage
     */

    sectorPercentage: function(sector) {
      return Dash.data.sectorHours(sector) / Dash.data.loggedHours() * 100
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
    let data = Dash.data,
        sp = data.sectorPercentage

		Dash.log = log

    Dash.barChart()

    d("status", Dash.status())
    d("LHH", f(data.loggedHours(),        " h"))
    d("LHT", f(data.loggedToday(),        " h"))
    d("LPH", f(data.logPercentage(),       "%"))
    d("LPT", f(data.logPercentageToday(),  "%"))
    d("ASD", f(data.average(),            " h"))

    d("pCOD", f(sp("COD"), "%"))
    d("pDSG", f(sp("DSG"), "%"))
    d("pRES", f(sp("RES"), "%"))
    d("pPHO", f(sp("PHO"), "%"))
    d("pACA", f(sp("ACA"), "%"))

    Dash.display()
		// Dash.visualise()

    function d(e, m) {
      document.getElementById(e).innerHTML = m
    }

    function f(a, b) {
      return a.toFixed(2) + b
    }
	}
}
