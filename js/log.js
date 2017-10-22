/**
 * Log
 * A log and time-tracking system
 *
 * @author Josh Avanier
 * @version 0.0.1
 * @license MIT
 */

"use strict";

var Log = {

  log: [],

  /**
   * Get log status; true means a session is in progress
   * @returns {boolean} Log status
   */

  status() {
    return this.log[this.log.length - 1].e == "undefined" ? true : false
  },

  /**
   * Display a session timer
   * @param {boolean} status - Log status
   */

  timer(status) {
    if (status) {
      let l = this.time.convert(this.time.parse(this.log[this.log.length - 1].s)).getTime(),

      tick = _ => {
        let s = Math.floor((new Date().getTime() - l) / 1E3),
            m = Math.floor(s / 60),
            h = Math.floor(m / 60)

        h %= 24
        m %= 60
        s %= 60

        h = `0${h}`
        m = `0${m}`
        s = `0${s}`

        document.getElementById("timer").innerHTML = `${h.substr(-2)}:${m.substr(-2)}:${s.substr(-2)}`
      },

      t = setInterval(function() { tick() }, 1E3)
    } else return
  },

  /**
   * Display log table
   * @param {Object[]=} a - Log entries
   * @param {string=} c - The container
   */

  display(a = Log.log, c = "logTable") {
    let tr = (a, n = 1) => {
      const l = a == null ? 0 : a.length
      let slice = (a, s, e) => {
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
        const r = new Array(l)
        while (++i < l) r[i] = a[i + s]
        return r
      }
      if (!l) return []
      n = l - n
      return slice(a, n < 0 ? 0 : n, l)
    },

    ih = (e, c) => {
      e.innerHTML = c
    },

    aq = a => {
      let b = Log.time.convert(a)
      let c = Aequirys.display(
        Aequirys.convert(new Date(b.getFullYear(), b.getMonth(), b.getDate()))
      )
      return c
    },

    en = (e, i) => {
      let r = document.getElementById(c).insertRow(i),

          c1 = r.insertCell(0),
          c2 = r.insertCell(1),
          c3 = r.insertCell(2),
          c4 = r.insertCell(3),
          c5 = r.insertCell(4),
          c6 = r.insertCell(5),
          c7 = r.insertCell(6),

          es = Log.time.parse(e.s),
          ee = Log.time.parse(e.e)

      ih(c1, aq(es))
      ih(c2, Log.time.stamp(es))
      ih(c3, Log.time.stamp(ee))
      ih(c4, Log.time.duration(es, ee).toFixed(2))
      ih(c5, e.c)
      ih(c6, e.t)
      ih(c7, e.d)
    }

    let b = tr(a, 50)

    for (let i = 0, l = b.length; i < l; i++) en(b[i], i)
  },

  /**
   * Visualisations
   */

  vis: {

    /**
     * Display a line visualisation
     * @param {Object[]=} a - Log entries
     * @param {string} con - The container
     */

    line(a = this.log, con) {
      let lt = Log.time,

          lw = 0,
          lp = 0,

      addEntry = (e, r) => {
        let en = document.createElement("div"),

            b = e.c == "PHO" ? "bg-blu" :
                e.c == "RES" ? "bg-grn" :
                e.c == "DSG" ? "bg-red" :
                e.c == "ACA" ? "bg-ylw" : "bg-blanc"

        en.className    = `psr t0 sh1 mb2 lf ${b}`
        en.style.width  = `${r.p}%`
        en.style.margin = `0 0 0 ${r.m}%`

        document.getElementById(con + lt.date(lt.parse(e.s))).appendChild(en)

        lw = r.p
        lp = r.dp
      },

      calc = (ee, es) => {
        let p  = (ee - es) / 86400 * 100,
            s  = lt.convert(es),
            sy = s.getFullYear(),
            sm = s.getMonth(),
            sd = s.getDate(),

            dp = (new Date(sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()).getTime() / 1E3 - (new Date(sy, sm, sd).getTime() / 1E3)) / 86400 * 100

        return {dp, p, m: dp - (lw + lp)}
      },

      newRow = d => {
        lw = 0, lp = 0

        let e = document.createElement("div")

        e.className = "db wf sh1 mt2 mb3 bsia bg-noir br1"
        e.id        = con + d

        document.getElementById(con).appendChild(e)
      },

      check = e => (document.getElementById(e) == null)

      for (let i = 0, l = a.length; i < l; i++) {
        if (a[i].e == "undefined") continue

        let es   = lt.parse(a[i].s),
            ee   = lt.parse(a[i].e),
            date = lt.date(es),
            end  = lt.date(ee),
            id   = con + date

        if (date !== end) {
          check(id) && newRow(date)
          let aa = lt.convert(es)
          addEntry(a[i], (calc(lt.parse((+(new Date(aa.getFullYear(), aa.getMonth(), aa.getDate(), 23, 59).getTime() / 1E3)).toString(16)), es)))

          check(con + end) && newRow(end)
          let ea = lt.convert(ee)
          addEntry(a[i], (calc(ee, lt.parse((+(new Date(ea.getFullYear(), ea.getMonth(), ea.getDate(), 0, 0).getTime() / 1E3)).toString(16)))))
        } else {
          check(id) && newRow(date)
          addEntry(a[i], calc(ee, es))
        }
      }
    },

    /**
     * Display a bar visualisation
     * @param {Object[]=} set - Log entries
     * @param {string} con - The container
     */

    bar(set = this.log, con) {
      let v = document.getElementById(con),
          lt = Log.time,
          lw = 0,

      addEntry = (e, r) => {
        let d = document.createElement("div"),

            b = "PHO" == e.c ? "bg-blu" :
                "RES" == e.c ? "bg-grn" :
                "DSG" == e.c ? "bg-red" :
                "ACA" == e.c ? "bg-ylw" : "bg-blanc"

        d.className    = `psa sw1 cn fw ${b}`
        d.style.height = `${r}%`
        d.style.bottom = `${lw}%`

        document.getElementById(lt.date(lt.parse(e.s))).appendChild(d)

        lw += r
      },

      calc = (e, s) => (e - s) / 86400 * 100,

      newCol = d => {
        lw = 0

        let dy = document.createElement("div")

        dy.className   = "dib hf psr"
        dy.style.width = `3.5714285714285716%`
        dy.id          = d

        v.appendChild(dy)
      },

      check = e => (document.getElementById(e) == null)

      for (let i = 0, l = set.length; i < l; i++) {
        if (set[i].e != "undefined") {
          let es   = lt.parse(set[i].s),
              ee   = lt.parse(set[i].e),
              date = lt.date(es),
              end  = lt.date(ee)

          if (date !== end) {
            check(date) && newCol(date)

            let a = lt.convert(es)

            addEntry(e, (calc(lt.parse((+(new Date(a.getFullYear(), a.getMonth(), a.getDate(), 23, 59).getTime() / 1E3)).toString(16)), es)))

            check(end) && newCol(end)

            let b = lt.convert(ee)

            addEntry(e, (calc(ee, lt.parse((+(new Date(b.getFullYear(), b.getMonth(), b.getDate(), 0, 0).getTime() / 1E3)).toString(16)))))
          } else {
            check(date) && newCol(date)
            addEntry(set[i], calc(ee, es))
          }
        }
      }
    },

    /**
     * Display a day chart
     * @param {Object=} d - A date
     */

    day(d = new Date()) {
      let v  = document.getElementById("daychart"),
          a  = Log.data.getEntries(d),
          lt = Log.time,
          lw = 0,
          lp = 0,

      addEntry = (e, r) => {
        let en = document.createElement("div"),

            b = e.c == "PHO" ? "bg-blu" :
                e.c == "RES" ? "bg-grn" :
                e.c == "DSG" ? "bg-red" :
                e.c == "ACA" ? "bg-ylw" : "bg-blanc"

        en.className    = `psr t0 hf mb2 lf ${b}`
        en.style.width  = `${r.p}%`
        en.style.margin = `0 0 0 ${r.m}%`

        document.getElementById("dayChart").appendChild(en)

        lw = r.p, lp = r.dp
      },

      calc = (ee, es) => {
        let s  = lt.convert(es),
            sy = s.getFullYear(),
            sm = s.getMonth(),
            sd = s.getDate(),
            dp = (new Date(sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()).getTime() / 1E3 - (new Date(sy, sm, sd).getTime() / 1E3)) / 86400 * 100

        return {dp, p: (ee - es) / 86400 * 100, m: dp - (lw + lp)}
      }

      for (let i = 0, l = a.length; i < l; i++)
        a[i].e != "undefined" && addEntry(a[i], calc(lt.parse(a[i].e), lt.parse(a[i].s)))
    },

    /**
     * Display peak hours chart
     * @param {Object[]=} a - Log entries
     * @param {string} con - The container
     */

    peakH(a = Log.log, con) {
      let v = document.getElementById(con),
          h = Log.data.peakHours(a),
          m = Log.utils.getMax(h),

      addEntry = i => {
        let d = document.createElement("div"),
          e = document.createElement("div"),
          n = document.createElement("div"),
          t = `${con}-${i}`,
          b = i == (new Date).getHours() ? "bg-blanc" : "bg-5"

        d.className = "dib hf psr"
        d.style.width = `4.166666666666667%`
        d.id = t

        n.className = `sw1 hf cn ${b}`

        e.className = `psa b0 wf fw`
        e.style.height = `${h[i] / m * 100}%`

        e.appendChild(n)
        v.appendChild(d)

        document.getElementById(t).appendChild(e)
      }

      for (let i = 0, l = h.length; i < l; i++) addEntry(i)
    },

    /**
     * Display peak days chart
     * @param {Object[]=} a - Log entries
     * @param {string} con - The container
     */

    peakD(a = Log.log, con = "peakDaysChart") {
      let d = Log.data.peakDays(a),
          m = Log.utils.getMax(d),

        addEntry = i => {
          let c = document.createElement("div"),
              e = document.createElement("div"),
              n = document.createElement("div"),
              t = `peakday-${i}`,
              b = i == (new Date).getDay() ? "bg-blanc" : "bg-5"

          c.className    = "dib hf psr"
          c.style.width  = `14.285714285714286%`
          c.id           = t

          n.className    = `sw1 hf cn ${b}`

          e.className    = `psa b0 wf fw`
          e.style.height = `${d[i] / m * 100}%`
          e.appendChild(n)

          document.getElementById(con).appendChild(c)
          document.getElementById(t).appendChild(e)
        }

      for (let i = 0, l = d.length; i < l; i++) addEntry(i)
    },

    /**
     * Display sector bar
     * @param {Object[]=} a - Log entries
     * @param {string=} c - The container
     */

    sectorBar(a = Log.log, c = "sectorBar") {
      let s = Log.data.listSectors(a).sort(),

      add = s => {
        let d = document.createElement("div"),
            v = Log.data.sp(a, s),

            b = s == "PHO" ? "blu" :
                s == "RES" ? "grn" :
                s == "DSG" ? "red" :
                s == "ACA" ? "ylw" : "blanc"

        d.className   = `psr t0 hf mb2 lf bg-${b}`
        d.style.width = `${v}%`
        d.title       = `${s} (${v.toFixed(2)}%)`

        document.getElementById(c).appendChild(d)
      }

      for (let i = 0, l = s.length; i < l; i++) add(s[i])
    },

    /**
     * Display project bars
     * @param {Object[]=} a - Log entries
     * @param {string=} con - The container
     */

    projectBars(a = Log.log, con) {
      let s = Log.data.listProjects(a).sort(),

      add = p => {
        let sh = Log.data.ph(a, p),
            li = document.createElement("li"),
            tl = document.createElement("span"),
            st = document.createElement("span"),
            br = document.createElement("div"),
            dt = document.createElement("div")

        li.className = "mb4 f6"
        tl.className = "f6 mb2 mon upc tk"
        st.className = "f6 rf"
        br.className = "wf sh1 mb3 bg-noir bsia"

        dt.className   = "psr t0 hf lf bg-blanc"
        dt.style.width = `${(Log.data.pp(a, p))}%`

        tl.innerHTML = p
        st.innerHTML = `LH \u00B7 ${sh.toFixed(2)}`

        br.appendChild(dt)
        li.appendChild(tl)
        li.appendChild(st)
        li.appendChild(br)

        document.getElementById(con).appendChild(li)
      }

      for (let i = 0, l = s.length; i < l; i++) add(s[i])
    }
  },

  /**
   * Time functions
   */

  time: {

    /**
     * Convert hexadecimal into decimal
     * @param {string} s - A hexadecimal string
     * @returns {number} Decimal conversion
     */

    parse(s) {
      return parseInt(s, 16)
    },

    /**
     * Convert Unix time
     * @param {number} t - Unix time
     */

    convert(t) {
      return new Date(t * 1E3)
    },

    /**
     * Convert Unix time into a timestamp
     * @param {number} t - Unix time
     * @returns {string} Timestamp
     */

    stamp(t) {
      let d = Log.time.convert(t),
          h = `0${d.getHours()}`,
          m = `0${d.getMinutes()}`,
          s = `0${d.getSeconds()}`

      return `${h.substr(-2)}:${m.substr(-2)}:${s.substr(-2)}`
    },

    /**
     * Convert Unix time into date
     * @param {number} t - Unix time
     * @returns {string} year, month, day
     */

    date(t) {
      let a = Log.time.convert(t)
      return `${a.getFullYear()}${a.getMonth()}${a.getDate()}`
    },

    /**
     * Calculate duration
     * @param {number} a - Start (Unix time)
     * @param {number} b - End (Unix time)
     * @returns {number} Duration
     */

    duration(a, b) {
      return (b - a) / 3600
    }
  },

  /**
   * Data functions
   */

  data: {

    /**
     * Get entries
     * @param {Object} d - A date
     * @returns {Object[]} Log entries
     */

    getEntries(d) {
      let e = []

      if (d == undefined) return this.log
      else {
        for (let i = 0, l = Log.log.length; i < l; i++) {
          if (Log.log[i].e == "undefined") continue

          let a = Log.time.convert(Log.time.parse(Log.log[i].s))

          a.getFullYear() == d.getFullYear() &&
          a.getMonth() == d.getMonth() &&
          a.getDate() == d.getDate() &&
          e.push(Log.log[i])
        }

        return e
      }
    },

    /**
     * Get entries of a specific day of the week
     * @param {number} d - Day of the week (0 - 6)
     * @returns {Object[]} Log entries
     */

    getEntriesByDay(d) {
      let e = [],

      g = e => Log.time.convert(Log.time.parse(e.s)).getDay()

      for (let i = 0, l = Log.log.length; i < l; i++)
        Log.log[i].e != "undefined" && g(Log.log[i]) == d && e.push(Log.log[i])

      return e
    },

    /**
     * Get entries of a specific project
     * @param {string} p - Project name
     * @returns {Object[]} Log entries
     */

    getEntriesByProject(p) {
      let e = []

      for (let i = 0, l = Log.log.length; i < l; i++)
        Log.log[i].e != "undefined" && Log.log[i].t == p && e.push(Log.log[i])

      return e
    },

    /**
     * List projects
     * @param {Object[]=} a - Log entries
     * @returns {Object[]} A list of projects
     */

    listProjects(a = Log.log) {
      let p = []

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i], t = e.t
        e.e != "undefined" && p.indexOf(t) == -1 && p.push(t)
      }

      return p
    },

    /**
     * List sectors
     * @param {Object[]=} a - Log entries
     * @returns {Object[]} A list of sectors
     */

    listSectors(a = Log.log) {
      let s = []

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i], t = e.c
        e.e != "undefined" && s.indexOf(t) == -1 && s.push(t)
      }

      return s
    },

    /**
     * Get peak days
     * @param {Object[]=} a - Log entries
     * @returns {Object[]} Peak days
     */

    peakDays(a = Log.log) {
      let d = [0, 0, 0, 0, 0, 0, 0],

      count = e => {
        d[(Log.time.convert(Log.time.parse(e.s))).getDay()]++
      }

      for (let i = 0, l = a.length; i < l; i++)
        a[i].e != "undefined" && count(a[i])

      return d
    },

    /**
     * Get peak hours
     * @param {Object[]=} a - Log entries
     * @returns {Object[]} Peak hours
     */

    peakHours(a = Log.log) {
      let h = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

      count = e => {
        h[(Log.time.convert(Log.time.parse(e.s))).getHours()]++
      }

      for (let i = 0, l = a.length; i < l; i++)
        a[i].e != "undefined" && count(a[i])

      return h
    },

    /**
     * Calculate shortest log session
     * @param {Object[]=} a - Log entries
     * @returns {number} Shortest log session
     */

    lsmin(a = Log.log) {
      if (a.length == 0) return 0

      let m, lt = Log.time,

      check = e => {
        let n = Number(lt.duration(lt.parse(e.s), lt.parse(e.e)))
        if (n < m || m == undefined) m = n
      }

      for (let i = 0, l = a.length; i < l; i++) check(a[i])

      return m
    },

    /**
     * Calculate longest log session
     * @param {Object[]=} a - Log entries
     * @returns {number} Longest log session
     */

    lsmax(a = Log.log) {
      if (a.length == 0) return 0

      let m, lt = Log.time,

      check = e => {
        let n = Number(lt.duration(lt.parse(e.s), lt.parse(e.e)))
        if (n > m || m == undefined) m = n
      }

      for (let i = 0, l = a.length; i < l; i++) check(a[i])

      return m
    },

    /**
     * Calculate average session duration (ASD)
     * @param {Object[]=} a - Log entries
     * @returns {number} Average session duration
     */

    asd(a = Log.log) {
      let avg = 0, c = 0,

      count = e => {
        avg += Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))
        c++
      }

      for (let i = 0, l = a.length; i < l; i++)
        a[i].e != "undefined" && count(a[i])

      return avg / c
    },

    /**
     * Calculate the total number of logged hours
     * @param {Object[]=} a - Log entries
     * @returns {number} Total logged hours
     */

    lh(a = Log.log) {
      if (a.length == 0) return 0

      let h = 0,

      count = e => {
        h += Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))
      }

      for (let i = 0, l = a.length; i < l; i++)
        a[i].e != "undefined" && count(a[i])

      return h
    },

    /**
     * Calculate how much of a time period was logged
     * @param {Object[]=} a - Log entries
     * @returns {number} Log percentage
     */

    lp(a = Log.log) {
      if (a.length == 0) return 0

      let e = Log.time.convert(Log.time.parse(a[0].s)),
          d = Log.time.convert(Log.time.parse(a[a.length - 1].s)),
          h = Number(Log.data.lh(a)),
          n = Math.ceil((
            new Date(d.getFullYear(), d.getMonth(), d.getDate()) -
            new Date(e.getFullYear(), e.getMonth(), e.getDate())
          ) / 8.64e7)

      return h / (24 * (n + 1)) * 100
    },

    /**
     * Calculate sector hours
     * @param {Object[]=} a - Log entries
     * @param {string} s - Sector
     * @returns {number} Sector hours
     */

    sh(a = Log.log, s) {
      let h = 0,

      count = e => {
        h += Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))
      }

      for (let i = 0, l = a.length; i < l; i++)
        a[i].e != "undefined" && a[i].c == s && count(a[i])

      return h
    },

    /**
     * Calculate sector percentage
     * @param {Object[]=} a - Log entries
     * @param {string} s - Sector
     * @returns {number} Sector percentage
     */

    sp(a = Log.log, s) {
      return Log.data.sh(a, s) / Log.data.lh(a) * 100
    },

    /**
     * Calculate project hours
     * @param {Object[]=} a - Log entries
     * @param {string} p - Project
     * @returns {number} Project hours
     */

    ph(a, p) {
      let h = 0,

      duration = e => Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))

      for (let i = 0, l = a.length; i < l; i++)
        a[i].e != "undefined" && a[i].t == p && (h += duration(a[i]))

      return h
    },

    /**
     * Calculate project percentage
     * @param {Object[]=} a - Log entries
     * @param {string} p - Project
     * @returns {number} Project percentage
     */

    pp(a = Log.log, p) {
      return Log.data.ph(a, p) / Log.data.lh(a) * 100
    },

    /**
     * Calculate trend
     * @param {number} a
     * @param {number} b
     * @returns {number} Trend
     */

    trend(a, b) {
      return (a - b) / b * 100
    },

    /**
     * Predict the future
     * @returns {Object} forecasts
     */

    forecast() {
      let ent = Log.data.getEntriesByDay(new Date().getDay()),
          eph = Log.data.peakHours(ent),
          mph = 0,
          mpht = 0,
          asd = Log.data.asd(ent),
          s = Log.data.listSectors(ent),
          p = Log.data.listProjects(ent),
          sf = 0,
          sfs = "",
          pf = 0,
          pfp = ""

      for (let i = 0, l = eph.length; i < l; i++)
        eph[i] > mph && (mph = eph[i], mpht = i)

      for (let i = 0, l = s.length; i < l; i++) {
        let x = Log.data.sp(ent, s[i])
        x > sf && (sf = x, sfs = s[i])
      }

      for (let i = 0, l = p.length; i < l; i++) {
        let x = Log.data.pp(ent, p[i])
        x > pf && (pf = x, pfp = p[i])
      }

      return {
        sf: sfs,
        pf: pfp,
        pt: mpht + ":00",
        sd: asd
      }
    }
  },

  utils: {

    /**
     * Get the max value in an array
     * @param {Object[]} a - An array
     * @returns {number} Max value
     */

    getMax(a) {
      return a.reduce(function(x, y) {
        return Math.max(x, y)
      })
    }
  },

  /**
   * Open a tab
   */

  openSect(s) {
    let x = document.getElementsByClassName("sect"),
        b = document.getElementsByClassName("tab")

    for (let i = 0, l = x.length; i < l; i++)
      x[i].style.display = "none"

    for (let i = 0, l = b.length; i < l; i++)
      b[i].className = "pv1 tab on bg-noir c-5 f6 mon tk mr3"

    document.getElementById(s).style.display = "block"
    document.getElementById(`b-${s}`).className = "pv1 tab on bg-noir blanc f6 mon tk mr3"
  },

  /**
   * Reset
   */

  reset() {
    let r = e => {
      document.getElementById(e).innerHTML = ""
    }
    r("weekChart")
    r("dayChart")
    r("peakTimesChart")
    r("peakDaysChart")
    r("sectorBar")
    r("projectStats")
    r("projectsList")
    r("vis")
    r("logbook")
  },

  /**
   * Initialise
   */

  init() {
    Log.log = log

    let ld = Log.data,
        sp = ld.sp,

        n = new Date(),
        y = new Date(n),

    d = (e, m) => {
      document.getElementById(e).innerHTML = m.toFixed(2)
    },

    s = (e, c) => {
      document.getElementById(e).className = c
    },

    t = (e, c) => {
      let s = "", r, d = document.getElementById(e)

      c > 0 ? (s = `+${c.toFixed(2)}%`, r = "grn") :
        (s = `${c.toFixed(2)}%`, r = "red")

      d.innerHTML = s
      d.className = r
    }

    y.setDate(n.getDate() - 1)

    let en = Log.data.getEntries(n),
        ey = Log.data.getEntries(y)

    Log.vis.bar(Log.log, "weekChart")
    Log.vis.peakH(Log.data.getEntriesByDay(n.getDay()), "peakTimesChart")
    Log.vis.peakD()
    Log.vis.day()

    let fc = Log.data.forecast()

    document.getElementById("fsf").innerHTML = fc.sf
    document.getElementById("fpf").innerHTML = fc.pf
    document.getElementById("fpt").innerHTML = fc.pt
    document.getElementById("fsd").innerHTML = fc.sd.toFixed(2) + " h"

    let status = Log.status()

    Log.timer(status)

    document.getElementById("status").className = status ? "rf mb4 f6 blanc pulse" : "rf mb4 f6 noir"

    let lhh = ld.lh(),
        lht = ld.lh(en),
        lph = ld.lp(),
        lpt = ld.lp(en),
        asd = ld.asd(),
        asdt = ld.asd(en),
        lsn = ld.lsmin(en),
        lsx = ld.lsmax(en),
        lsnh = ld.lsmin(),
        lsxh = ld.lsmax(),

        lhtt = ld.trend(lht, ld.lh(ey)),
        asdtt = ld.trend(asdt, ld.asd(ey)),
        lptt = ld.trend(lpt, ld.lp(ey)),
        lsnt = ld.trend(lsn, ld.lsmin(ey)),
        lsxt = ld.trend(lsx, ld.lsmax(ey))

    let els = ["LHH", "LHT", "LPH", "LPT", "ASD", "ASDT", "LSN", "LSX", "LSNH", "LSXH"],
        val = [lhh, lht, lph, lpt, asd, asdt, lsn, lsx, lsnh, lsxh],
        tels = ["lhtt", "asdtt", "lptt", "lsnt", "lsxt"],
        tval = [lhtt, asdtt, lptt, lsnt, lsxt]

    for (let i = 0, l = els.length; i < l; i++)
      document.getElementById(els[i]).innerHTML = val[i].toFixed(2)

    for (let i = 0, l = tels.length; i < l; i++)
      t(tels[i], tval[i])

    Log.vis.peakH(undefined, "peakTimesHistory")
    Log.vis.sectorBar(en, "sectorBar")
    Log.vis.projectBars(en, "projectStats")

    Log.vis.projectBars(undefined, "projectsList")

    Log.vis.line(Log.log, "vis")
    Log.display(Log.log, "logbook")
  }
}
