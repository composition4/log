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
		let v = document.getElementById("logbook"),
        t = Dash.time,
        a = Aequirys

		v.className = "bn f6 mon"

		for (let i = 0, l = Dash.log.length; i < l; i++) {
			let e = Dash.log[i],
          r = v.insertRow(i + 2),
  				c1 = r.insertCell(0),
  				c2 = r.insertCell(1),
  				c3 = r.insertCell(2),
  				c4 = r.insertCell(3),
  				c5 = r.insertCell(4),
  				c6 = r.insertCell(5),
  				c7 = r.insertCell(6),
          es = t.parse(e.s),
          ee = t.parse(e.e),
          q = t.convert(es)

      ih(c1, a.shorter(
        a.convert(new Date(q.getFullYear(), q.getMonth(), q.getDate()))
      ))

      ih(c2, t.stamp(es))
      ih(c3, t.stamp(ee))
      ih(c4, t.duration(es, ee).toFixed(2))
      ih(c5, e.c)
      ih(c6, e.t)
      ih(c7, e.d)

      function ih(e, c) {
        e.innerHTML = c
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
      let e = Dash.log[i],
          time = Dash.time

      if (e.e == "undefined") continue

      let es = time.parse(e.s),
          ee = time.parse(e.e)
				  date = time.date(es),
          end = time.date(ee)

      if (date !== end) {
        if (document.getElementById("v" + date) === null) newRow(es, date)

        let a = time.convert(es),
            eDate = new Date(
              a.getFullYear(),
              a.getMonth(),
              a.getDate(),
              23,
              59
            ).getTime() / 1000

        addEntry(calc(time.parse((+eDate).toString(16)), es))

        if (document.getElementById("v" + end) === null) newRow(es, end)

        let ea = time.convert(ee),
            eaDate = new Date(
              ea.getFullYear(),
              ea.getMonth(),
              ea.getDate(),
              0,
              0
            ).getTime() / 1000

        addEntry(calc(ee, time.parse((+eaDate).toString(16))))
      } else {
        if (document.getElementById("v" + date) === null) newRow(es, date)
        addEntry(calc(ee, es))
      }

      function addEntry(r) {
        let entry = document.createElement("div"), bg = ""

        if      (e.c == "PHO") bg = "bg-blu"
        else if (e.c == "RES") bg = "bg-grn"
        else if (e.c == "DSG") bg = "bg-red"
        else if (e.c == "ACA") bg = "bg-ylw"

        entry.className    = "psr t0 bg-blanc sh2 mb2 lf " + bg
        entry.style.width  = r.perc + "%"
        entry.style.margin = "0 0 0 " + r.margin + "%"

        document.getElementById("v" + date).appendChild(entry)

        lw = r.perc
        lp = r.dp
      }

      function calc(ee, es) {
        let p = (ee - es) / 86400 * 100,
            s = time.convert(es),
    				sy = s.getFullYear(),
    				sm = s.getMonth(),
    				sd = s.getDate(),
            ds = new Date(sy, sm, sd).getTime() / 1000,
            de = new Date(sy, sm, sd, 23, 59, 59).getTime() / 1000,
            dt = new Date(
              sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()
            ).getTime() / 1000,
            dp = (dt - ds) / (de - ds) * 100,
            m = dp - (lw + lp)

        return {"dp": dp, "perc": p, "margin": m}
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

        // lb.className = "dn dib-m dib-l w1 f6 mon mb3"
        // lb.innerHTML = aq.mn + aq.dt

        dy.className = "db wf pt2 pb3"
        dy.id = "v" + date

        v.appendChild(lb)
        v.appendChild(dy)
      }
		}
	},

  barChart: function() {
    let v = document.getElementById("weekChart"),
        lw = 0,
        time = Dash.time

		for (let i = 0, l = Dash.log.length; i < l; i++) {
      let e = Dash.log[i]

      if (e.e == "undefined") continue

      let es = time.parse(e.s),
          ee = time.parse(e.e)
				  date = time.date(es),
          end = time.date(ee)

      if (date !== end) {
        if (document.getElementById(date) === null) newCol(es, date)
        let a = time.convert(es),
            eDate = new Date(
              a.getFullYear(),
              a.getMonth(),
              a.getDate(),
              23,
              59
            ).getTime() / 1000

        addEntry(calc(time.parse((+eDate).toString(16)), es))

        if (document.getElementById(end) === null) newCol(es, end)
        let ea = time.convert(ee),
            eaDate = new Date(
              ea.getFullYear(),
              ea.getMonth(),
              ea.getDate(),
              0,
              0
            ).getTime() / 1000

        addEntry(calc(ee, time.parse((+eaDate).toString(16))))
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
        entry.style.height = r + "%"
        entry.style.bottom = lw + "%"

        document.getElementById(date).appendChild(entry)

        lw += r
      }

      function calc(ee, es) {
        return (ee - es) / 86400 * 100
      }

      function newCol(es, date) {
        lw = 0

        let dy = document.createElement("div")

        dy.className = "dib sw2 hf psr"
        // dy.style.width = (100 / 8) + "%"
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

    lhmin: function(d) {
      let m, time = Dash.time
      for (let i = 0, l = Dash.log.length; i < l; i++) {
        let e = Dash.log[i]
        if (e.e == "undefined") continue
        if (d !== undefined) {
          let es = time.parse(e.s),
              a = time.convert(es)

          if (a.getFullYear() == d.getFullYear() &&
              a.getMonth() == d.getMonth() &&
              a.getDate() == d.getDate())
            check()
        } else check()
        function check() {
          let n = Number(time.duration(time.parse(e.s), time.parse(e.e)))
          if (n < m || m == undefined) m = n
        }
      }
      return m
    },

    lhmax: function(d) {
      let m, time = Dash.time
      for (let i = 0, l = Dash.log.length; i < l; i++) {
        let e = Dash.log[i]
        if (e.e == "undefined") continue
        if (d !== undefined) {
          let es = time.parse(e.s),
              a = time.convert(es)

          if (a.getFullYear() == d.getFullYear() &&
              a.getMonth() == d.getMonth() &&
              a.getDate() == d.getDate())
            check()
        } else check()
        function check() {
          let n = Number(time.duration(time.parse(e.s), time.parse(e.e)))
          if (n > m || m == undefined) m = n
        }
      }
      return m
    },

    /**
     * Calculate average session duration (ASD)
     * @return {number} ASD
     */

    asd: function() {
      let a = 0, c = 0, time = Dash.time

      for (let i = 0, l = Dash.log.length; i < l; i++) {
        let e = Dash.log[i]
        if (e.e == "undefined") continue
        a += Number(time.duration(time.parse(e.s), time.parse(e.e)))
        c++
      }

      return a / c
    },

    /**
     * Calculate the total number of logged hours
     * @return {number} total logged hours
     */

    lh: function(d) {
      let h = 0, t = Dash.time
      for (let i = 0, l = Dash.log.length; i < l; i++) {
        let e = Dash.log[i]
        if (e.e == "undefined") continue

        if (d !== undefined) {
          let es = t.parse(e.s),
              a = t.convert(es)

          if (a.getFullYear() == d.getFullYear() &&
              a.getMonth() == d.getMonth() &&
              a.getDate() == d.getDate())
            add()
        } else add()
        function add() {
          h += Number(t.duration(t.parse(e.s), t.parse(e.e)))
        }
      }
      return h
    },

    /**
     * Calculate how much of a time period was logged
     * @return {number} log percentage
     */

    lp: function(date) {
      if (date !== undefined) {
        let entriesToday = [], time = Dash.time

        for (let i = Dash.log.length - 1; i >= 0; i--) {
          let e = Dash.log[i]

          if (e.e == "undefined") continue

          let a = time.convert(time.parse(e.s)),
      				y = a.getFullYear(),
      				m = a.getMonth(),
      				d = a.getDate(),

              t = new Date(),
              ty = t.getFullYear(),
              tm = t.getMonth(),
              td = t.getDate()

          if (y == ty && m == tm && d == td) entriesToday.push(e)
        }

        if (entriesToday.length == 0) return 0
        else {
          let h = Number(Dash.data.lh(new Date())),
              e = time.convert(time.parse(entriesToday[0].s)),
              earliest = new Date(e.getFullYear(), e.getMonth(), e.getDate()),
              d = new Date(),
              today = new Date(d.getFullYear(), d.getMonth(), d.getDate()),
              n = Math.ceil((today - earliest) / 8.64e7)

          return (h / 24) * 100
        }
      } else {
        let h = Number(Dash.data.lh()),
            e = Dash.time.convert(Dash.time.parse(Dash.log[0].s)),
            d = new Date(),
            n = Math.ceil((
                new Date(
                  d.getFullYear(), d.getMonth(), d.getDate()
                ) - new Date(
                  e.getFullYear(), e.getMonth(), e.getDate()
                )) / 8.64e7)

        return (h / ((n + 1) * 24)) * 100
      }
    },

    /**
     * Calculate sector hours
     * @param {string} s - sector
     * @return {number} number of sector hours
     */

    sh: function(s) {
      let h = 0, time = Dash.time

      for (let i = 0, l = Dash.log.length; i < l; i++) {
        let e = Dash.log[i]
        if (e.e == "undefined") continue
        if (e.c == s)
          h += Number(time.duration(time.parse(e.s), time.parse(e.e)))
      }

      return h
    },

    /**
     * Calculate sector percentage
     * @param {string} s - sector
     * @return {number} sector percentage
     */

    sp: function(s) {
      return Dash.data.sh(s) / Dash.data.lh() * 100
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
        sp = data.sp,
        n = new Date()

		Dash.log = log

    Dash.barChart()

    d("status", Dash.status())

    d("LHH",  f(data.lh(),     " h"))
    d("LHT",  f(data.lh(n),    " h"))
    d("LPH",  f(data.lp(),      "%"))
    d("LPT",  f(data.lp(n),     "%"))
    d("ASD",  f(data.asd(),    " h"))
    d("LHN",  f(data.lhmin(n), " h"))
    d("LHX",  f(data.lhmax(n), " h"))
    d("LHNH", f(data.lhmin(),  " h"))
    d("LHXH", f(data.lhmax(),  " h"))

    d("pCOD", f(sp("COD"), "%"))
    d("pDSG", f(sp("DSG"), "%"))
    d("pRES", f(sp("RES"), "%"))
    d("pPHO", f(sp("PHO"), "%"))
    d("pACA", f(sp("ACA"), "%"))

    Dash.display()
    Dash.visualise()

    function d(e, m) {
      document.getElementById(e).innerHTML = m
    }

    function f(a, b) {
      return a.toFixed(2) + b
    }
	}
}
