/*

  Log
  Log & time-tracker

  Josh Avanier

*/

"use strict";

var Log = {

  log: [],

  /**
   * Display log status
   * @returns {string} log status
   */

  status() {
    let status = Log.log[Log.log.length - 1].e == "undefined" ? true : false
    Log.timer(status)
    return status
  },

  /**
   * Display a session timer
   * @param {boolean} status - Log status
   */

  timer(status) {
    if (status) {

      /*
        l = last; start time of latest Log entry
        n = now; time right now
        d = difference between now and start of last entry

        s = seconds
        m = minutes
        h = hours

        t = timer
      */

      let l = Log.time.convert(Log.time.parse(Log.log[Log.log.length - 1].s))

      let count = _ => {
          let n = new Date().getTime(),
              d = n - l.getTime()

          if (d <= 0) clearInterval(timer)
          else {
            let s = Math.floor(d / 1E3),
                m = Math.floor(s / 60),
                h = Math.floor(m / 60)

            h %= 24
            m %= 60
            s %= 60

            h = `0${h}`
            m = `0${m}`
            s = `0${s}`

            document.getElementById("timer").innerHTML = `${h.substr(-2)}:${m.substr(-2)}:${s.substr(-2)}`
          }
        },

        timer = setInterval(function() { count() }, 1E3)
    } else return
  },

  /**
   * Display logs into a table
   */

  display(a = Log.log, c) {
    let v = document.getElementById(c),
        t = Log.time,

    takeRight = (a, n = 1) => {
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

    enter = e => {
      let r = v.insertRow(i),
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

      ih(c1, Aequirys.display(
        Aequirys.convert(new Date(q.getFullYear(), q.getMonth(), q.getDate()))
      ))

      ih(c2, t.stamp(es))
      ih(c3, t.stamp(ee))
      ih(c4, t.duration(es, ee).toFixed(2))
      ih(c5, e.c)
      ih(c6, e.t)
      ih(c7, e.d)
    }

    for (var b = takeRight(a, 30), i = 0, l = b.length; i < l; i++) enter(b[i])
  },

  vis: {

    line(a = Log.log, con) {
      let v = document.getElementById(con),
          lw = 0,
          lp = 0,

          lt = Log.time,

      addEntry = (e, r) => {
        let en = document.createElement("div"),

          b = "PHO" == e.c ? "bg-blu" :
          "RES" == e.c ? "bg-grn" :
          "DSG" == e.c ? "bg-red" :
          "ACA" == e.c ? "bg-ylw" : "bg-blanc"

        en.className = `psr t0 sh1 mb2 lf ${b}`
        en.style.width = `${r.p}%`
        en.style.margin = `0 0 0 ${r.m}%`

        document.getElementById(con + lt.date(lt.parse(e.s))).appendChild(en)

        lw = r.p
        lp = r.dp
      },

      calc = (ee, es) => {
        let p = (ee - es) / 86400 * 100,
            s = lt.convert(es),
            sy = s.getFullYear(),
            sm = s.getMonth(),
            sd = s.getDate(),
            ds = new Date(sy, sm, sd).getTime() / 1E3,

            dp = (
              (new Date(sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()).getTime() / 1E3) - ds
            ) / (
              (new Date(sy, sm, sd, 23, 59, 59).getTime() / 1E3) - ds
            ) * 100

        return {
          dp,
          p,
          m: dp - (lw + lp)
        }
      },

      newRow = d => {
        lw = 0, lp = 0

        let e = document.createElement("div")
        e.className = "db wf sh1 mt2 mb3 bsia bg-noir br1"
        e.id = con + d

        v.appendChild(e)
      },

      check = e => (document.getElementById(e) == null)

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]

        if (e.e != "undefined") {
          let es = lt.parse(e.s),
              ee = lt.parse(e.e),
              date = lt.date(es),
              end = lt.date(ee),
              id = con + date

          if (date !== end) {
            if (check(id)) newRow(date)

            let a = lt.convert(es)

            addEntry(e, (calc(lt.parse((+(new Date(a.getFullYear(), a.getMonth(), a.getDate(), 23, 59).getTime() / 1E3)).toString(16)), es)))

            check(con + end) && newRow(end)

            let ea = lt.convert(ee)

            addEntry(e, (calc(ee, lt.parse((+(new Date(ea.getFullYear(), ea.getMonth(), ea.getDate(), 0, 0).getTime() / 1E3)).toString(16)))))
          } else {
            check(id) && newRow(date)
            addEntry(e, (calc(ee, es)))
          }
        }
      }
    },

    bar(set, con) {
      let v = document.getElementById(con),
          lw = 0,
          lt = Log.time,

      addEntry = (e, r) => {
        let d = document.createElement("div"),

            b = "PHO" == e.c ? "bg-blu" :
                "RES" == e.c ? "bg-grn" :
                "DSG" == e.c ? "bg-red" :
                "ACA" == e.c ? "bg-ylw" : "bg-blanc"

        d.className = `psa sw1 cn fw ${b}`
        d.style.height = `${r}%`
        d.style.bottom = `${lw}%`

        document.getElementById(lt.date(lt.parse(e.s))).appendChild(d)

        lw += r
      },

      calc = (e, s) => (e - s) / 86400 * 100,

      newCol = d => {
        lw = 0

        let dy = document.createElement("div")

        dy.className = "dib hf psr"
        dy.style.width = `${1}%`
        dy.id = d

        v.appendChild(dy)
      },

      check = e => (document.getElementById(e) == null)

      for (let i = 0, l = set.length; i < l; i++) {
        let e = set[i]

        if (e.e != "undefined") {
          let es = lt.parse(e.s),
              ee = lt.parse(e.e),
              date = lt.date(es),
              end = lt.date(ee)

          if (date !== end) {
            check(date) && newCol(date)

            let a = lt.convert(es)

            addEntry(e, (calc(lt.parse((+(new Date(a.getFullYear(), a.getMonth(), a.getDate(), 23, 59).getTime() / 1E3)).toString(16)), es)))

            check(end) && newCol(end)

            let b = lt.convert(ee)

            addEntry(e, (calc(ee, lt.parse((+(new Date(b.getFullYear(), b.getMonth(), b.getDate(), 0, 0).getTime() / 1E3)).toString(16)))))
          } else {
            check(date) && newCol(date)
            addEntry(e, (calc(ee, es)))
          }
        }
      }
    },

    day(d = new Date()) {
      let v = document.getElementById("daychart"),
          a = Log.data.getEntries(d),
          lt = Log.time,
          lw = 0,
          lp = 0,

      addEntry = (e, r) => {
        let en = document.createElement("div"),

          b = "PHO" == e.c ? "bg-blu" :
          "RES" == e.c ? "bg-grn" :
          "DSG" == e.c ? "bg-red" :
          "ACA" == e.c ? "bg-ylw" : "bg-blanc"

        en.className = `psr t0 hf mb2 lf ${b}`
        en.style.width = `${r.p}%`
        en.style.margin = `0 0 0 ${r.m}%`

        document.getElementById("dayChart").appendChild(en)

        lw = r.p, lp = r.dp
      },

      calc = (ee, es) => {
        let p = (ee - es) / 86400 * 100,
          s = lt.convert(es),
          sy = s.getFullYear(),
          sm = s.getMonth(),
          sd = s.getDate(),
          ds = new Date(sy, sm, sd).getTime() / 1E3,

          dp = (new Date(sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()).getTime() / 1E3 - ds) / (new Date(sy, sm, sd, 23, 59, 59).getTime() / 1E3 - ds) * 100,

          m = dp - (lw + lp)

        return {
          dp,
          p,
          m
        }
      }

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        e.e != "undefined" && addEntry(e, calc(lt.parse(e.e), lt.parse(e.s)))
      }
    },

    /**
     * Display peak hours
     * @param {[]} a - entries
     */

    peakH(a = Log.log) {
      let v = document.getElementById("peakTimesChart"),
          h = Log.data.peakHours(a),
          m = Log.utils.getMax(h),

      addEntry = i => {
        let d = document.createElement("div"),
          e = document.createElement("div"),
          n = document.createElement("div"),
          t = `peak-${i}`,
          b = i == (new Date).getHours() ? "bg-blanc" : "bg-5"

        d.className = "dib hf psr"
        d.style.width = `4.166666666666667%`
        d.id = t

        n.className = `sw1 br2 hf cn ${b}`

        e.className = `psa b0 wf fw`
        e.style.height = `${h[i] / m * 100}%`

        e.appendChild(n)
        v.appendChild(d)

        document.getElementById(t).appendChild(e)
      }

      for (let i = 0, l = h.length; i < l; i++) addEntry(i)
    },

    /**
     * Display peak days
     * @param {[]} a - entries
     */

    peakD(a = Log.log) {
      let v = document.getElementById("peakDaysChart"),
          d = Log.data.peakDays(a),
          m = Log.utils.getMax(d),

        addEntry = i => {
          let c = document.createElement("div"),
            e = document.createElement("div"),
            n = document.createElement("div"),
            t = `peakday-${i}`,
            b = i == (new Date).getDay() ? "bg-blanc" : "bg-5"

          c.className = "dib hf psr"
          c.style.width = `14.285714285714286%`
          c.id = t

          n.className = `sw1 br2 hf cn ${b}`

          e.className = `psa b0 wf fw`
          e.style.height = `${d[i] / m * 100}%`

          e.appendChild(n)
          v.appendChild(c)

          document.getElementById(t).appendChild(e)
        }

      for (let i = 0, l = d.length; i < l; i++) addEntry(i)
    },

    sectorBar(a = Log.log, con) {
      let s = Log.data.listSectors(a).sort(),

        add = s => {
          let d = document.createElement("div"),
              val = Log.data.sp(a, s),
              b = ""

          b = s == "PHO" ? "blu" :
              s == "RES" ? "grn" :
              s == "DSG" ? "red" :
              s == "ACA" ? "ylw" : "blanc"

          d.className = `psr t0 hf mb2 lf bg-${b}`
          d.style.width = `${val}%`
          d.title = `${s} - ${val.toFixed(2)}%`

          document.getElementById(con).appendChild(d)
        }

      for (let i = 0, l = s.length; i < l; i++) add(s[i])
    },

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

        dt.className = `psr t0 hf lf bg-blanc`
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

  time: {

    /**
     * Convert hexadecimal into decimal
     * @param {string} s - hexadecimal
     * @returns {number} decimal
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
     * @returns {string} timestamp
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
     * @param {number} a - start (Unix time)
     * @param {number} b - end (Unix time)
     * @returns {number} duration
     */

    duration(a, b) {
      return (b - a) / 3600
    }
  },

  data: {

    /**
     * Get entries
     * @param {Date} d - a specific date
     * @returns {[]} entries
     */

    getEntries(d) {
      let ent = []

      if (d == undefined) {
        for (let i = 0, l = Log.log.length; i < l; i++) {
          let e = Log.log[i]
          e.e != "undefined" && ent.push(e)
        }
      } else {
        let t = Log.time
        for (let i = 0, l = Log.log.length; i < l; i++) {
          let e = Log.log[i]

          if (e.e != "undefined") {
            let a = t.convert(t.parse(e.s))

            a.getFullYear() == d.getFullYear() &&
              a.getMonth() == d.getMonth() &&
              a.getDate() == d.getDate() &&
              ent.push(e)
          }
        }
      }

      return ent
    },

    /**
     * Get entries of a specific day of the week
     * @param {number} d - day of the week (0 - 6)
     * @returns {[]} entries
     */

    getEntriesByDay(d) {
      let ent = [],

      getDay = e => Log.time.convert(Log.time.parse(e.s)).getDay()

      for (let i = 0, l = Log.log.length; i < l; i++) {
        let e = Log.log[i]
        e.e != "undefined" && getDay(e) == d && ent.push(e)
      }

      return ent
    },

    /**
     * Get entries of a specific project
     * @param {string} p - a project
     * @returns {[]} entries
     */

    getEntriesByProject(p) {
      let ent = []

      for (let i = 0, l = Log.log.length; i < l; i++) {
        let e = Log.log[i]
        e.e != "undefined" && e.t == p && ent.push(e)
      }

      return ent
    },

    /**
     * List projects
     * @param {[]} a - array of entries
     * @returns {[]} list of projects
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
     * @param {[]} a - array of entries
     * @returns {[]} list of sectors
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
     * @param {[]} a - entries
     * @param {number} day - day
     * @returns {[]} peak days
     */

    peakDays(a = Log.log) {
      let d = [0, 0, 0, 0, 0, 0, 0],

      count = e => {
        d[(Log.time.convert(Log.time.parse(e.s))).getDay()]++
      }

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        e.e != "undefined" && count(e)
      }

      return d
    },

    /**
     * Get peak hours
     * @param {[]} a - entries
     * @returns {[]} peak hours
     */

    peakHours(a = Log.log) {
      let h = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          t = Log.time,

      count = e => {
        h[(t.convert(t.parse(e.s))).getHours()]++
      }

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        e.e != "undefined" && count(e)
      }

      return h
    },

    /**
     * Calculate shortest log session
     * @param {[]} a - array of entries
     * @returns {number} shortest log session
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
     * @param {[]} a - array of entries
     * @returns {number} longest log session
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
     * @returns {number} ASD
     */

    asd(a = Log.log) {
      let avg = 0,
          c = 0,
          t = Log.time,

      count = e => {
        avg += Number(t.duration(t.parse(e.s), t.parse(e.e)))
        c++
      }

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        e.e != "undefined" && count(e)
      }

      return avg / c
    },

    /**
     * Calculate the total number of logged hours
     * @returns {number} total logged hours
     */

    lh(a = Log.log) {
      if (a.length == 0) return 0

      let h = 0,
          t = Log.time,

      count = e => {
        h += Number(t.duration(t.parse(e.s), t.parse(e.e)))
      }

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        e.e != "undefined" && count(e)
      }

      return h
    },

    /**
     * Calculate how much of a time period was logged
     * @param {Date} d - date of specified period
     * @returns {number} log percentage
     */

    lp(a = Log.log) {
      if (a.length == 0) return 0

      let lt = Log.time,
          e = lt.convert(lt.parse(a[0].s)),
          d = lt.convert(lt.parse(a[a.length - 1].s)),
          h = Number(Log.data.lh(a)),
          n = Math.ceil((
            new Date(d.getFullYear(), d.getMonth(), d.getDate()) -
            new Date(e.getFullYear(), e.getMonth(), e.getDate())
          ) / 8.64e7)

      return h / (24 * (n + 1)) * 100
    },

    /**
     * Calculate sector hours
     * @param {[]} a - array of entries
     * @param {string} s - sector
     * @returns {number} number of sector hours
     */

    sh(a = Log.log, s) {
      let h = 0, t = Log.time,

      count = e => {
        h += Number(t.duration(t.parse(e.s), t.parse(e.e)))
      }

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        e.e != "undefined" && e.c == s && count(e)
      }

      return h
    },

    /**
     * Calculate sector percentage
     * @param {[]} a - array of entries
     * @param {string} s - sector
     * @returns {number} sector percentage
     */

    sp(a = Log.log, s) {
      return Log.data.sh(a, s) / Log.data.lh(a) * 100
    },

    /**
     * Calculate project hours
     * @param {[]} a - array of entries
     * @param {string} p - sector
     * @returns {number} number of sector hours
     */

    ph(a, p) {
      let h = 0, t = Log.time,

      duration = e => Number(t.duration(t.parse(e.s), t.parse(e.e)))

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        "undefined" != e.e && e.t == p && (h += duration(e))
      }

      return h
    },

    /**
     * Calculate project percentage
     * @param {[]} a - array of entries
     * @param {string} p - sector
     * @returns {number} sector percentage
     */

    pp(a = Log.log, p) {
      return Log.data.ph(a, p) / Log.data.lh(a) * 100
    },

    /**
     * Calculate trend
     * @param {number} a
     * @param {number} b
     * @returns {number} trend
     */

    trend(a, b) {
      return (a - b) / b
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
     * @param {} a - an array
     * @returns {number} the max
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
      let s = "",
        r, d = document.getElementById(e)

      c > 0 ? (s = `+${c.toFixed(2)}`, r = "grn") :
        (s = `-${c.toFixed(2)}`, r = "red")

      d.innerHTML = s
      d.className = r
    }

    y.setDate(n.getDate() - 1)

    let en = Log.data.getEntries(n),
        ey = Log.data.getEntries(y)

    Log.vis.bar(Log.log, "weekChart")
    Log.vis.peakH(Log.data.getEntriesByDay(n.getDay()))
    Log.vis.peakD()
    Log.vis.day()

    let fc = Log.data.forecast()

    document.getElementById("fsf").innerHTML = fc.sf
    document.getElementById("fpf").innerHTML = fc.pf
    document.getElementById("fpt").innerHTML = fc.pt
    document.getElementById("fsd").innerHTML = fc.sd.toFixed(2) + " h"

    let statusColour = Log.status() ? "grn" : "red"

    document.getElementById("status").className = `rf mb4 f6 ${statusColour}`

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

    Log.vis.sectorBar(en, "sectorBar")
    Log.vis.projectBars(en, "projectStats")

    Log.vis.projectBars(undefined, "projectsList")

    Log.vis.line(Log.log, "vis")
    Log.display(Log.log, "logbook")
  }
}
