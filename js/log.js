/*

  Log
  Log & time-tracker

  Josh Avanier

*/

var Log = {

  log: [],

  /**
   * Display log status
   * @return {string} log status
   */

  status() {
    return Log.log[Log.log.length - 1].e == "undefined" ? "grn" : "red"
  },

  /**
   * Display logs into a table
   */

  display(a = Log.log, c) {
    let v = document.getElementById(c),
        t = Log.time,
        aq = Aequirys,

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
        }

    for (var b = takeRight(a, 30), i = 0, l = b.length; i < l; i++) {
      let e = b[i],
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
          q = t.convert(es),

          ih = (e, c) => { e.innerHTML = c }

      ih(c1, aq.dis(
        aq.con(new Date(q.getFullYear(), q.getMonth(), q.getDate()))
      ))

      ih(c2, t.stamp(es))
      ih(c3, t.stamp(ee))
      ih(c4, t.duration(es, ee).toFixed(2))
      ih(c5, e.c)
      ih(c6, e.t)
      ih(c7, e.d)
    }
  },

  vis: {

    line(a = Log.log, con) {
      let v = document.getElementById(con),
          lw = 0,
          lp = 0

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i],
            lt = Log.time,

          addEntry = r => {
            let en = document.createElement("div"), bg = ""

            if      (e.c == "PHO") bg = "bg-bdbdbd"
            else if (e.c == "RES") bg = "bg-a9a9a9"
            else if (e.c == "DSG") bg = "bg-969696"
            else if (e.c == "ACA") bg = "bg-828282"
            else                   bg = "bg-blanc"

            en.className    = `psr t0 sh1 mb2 lf ${bg}`
            en.style.width  = `${r.p}%`
            en.style.margin = `0 0 0 ${r.m}%`

            document.getElementById(con + date).appendChild(en)

            lw = r.p
            lp = r.dp
          },

          calc = (ee, es) => {
            let p = (ee - es) / 86400 * 100,
                s = lt.convert(es),
                sy = s.getFullYear(),
                sm = s.getMonth(),
                sd = s.getDate(),
                ds = new Date(sy, sm, sd).getTime() / 1000,

                dp = (
                  (new Date(sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()).getTime() / 1000) - ds
                ) / (
                  (new Date(sy, sm, sd, 23, 59, 59).getTime() / 1000) - ds
                ) * 100,

                m = dp - (lw + lp)

            return {dp, p, m}
          },

          newRow = d => {
            lw = 0
            lp = 0

            let en = document.createElement("div")

            en.className = "db wf sh1 mt2 mb3 bsia bg-noir br1"
            en.id = con + d

            v.appendChild(en)
          },

          check = e => (document.getElementById(e) == null)

        if (e.e == "undefined") continue

        let es = lt.parse(e.s),
            ee = lt.parse(e.e),
            date = lt.date(es),
            end = lt.date(ee),
            id = con + date

        if (date !== end) {
          if (check(id)) newRow(date)

          let a = lt.convert(es)

          addEntry(calc(lt.parse((+(new Date(a.getFullYear(), a.getMonth(), a.getDate(), 23, 59).getTime() / 1000)).toString(16)), es))

          if (check(con + end)) newRow(end)

          let ea = lt.convert(ee)

          addEntry(calc(ee, lt.parse((+(new Date(ea.getFullYear(), ea.getMonth(), ea.getDate(), 0, 0).getTime() / 1000)).toString(16))))
        } else {
          if (check(id)) newRow(date)
          addEntry(calc(ee, es))
        }
      }
    },

    bar(set, con) {
      let v = document.getElementById(con),
          lw = 0,
          lt = Log.time

      for (let i = 0, l = set.length; i < l; i++) {
        let e = set[i],

          addEntry = r => {
            let d = document.createElement("div"),
                b = ""

            if      (e.c == "PHO") b = "bg-bdbdbd"
            else if (e.c == "RES") b = "bg-a9a9a9"
            else if (e.c == "DSG") b = "bg-969696"
            else if (e.c == "ACA") b = "bg-828282"
            else                   b = "bg-blanc"

            d.className    = `psa wf fw br noir ${b}`
            d.style.height = `${r}%`
            d.style.bottom = `${lw}%`

            document.getElementById(date).appendChild(d)

            lw += r
          },

          calc = (e, s) => (e - s) / 86400 * 100,

          newCol = d => {
            lw = 0

            let dy = document.createElement("div")

            dy.className   = "dib hf psr"
            dy.style.width = `${100 / 30}%`
            dy.id          = d

            v.appendChild(dy)
          },

          check = e => (document.getElementById(e) == null)

        if (e.e == "undefined") continue

        let es   = lt.parse(e.s),
            ee   = lt.parse(e.e),
            date = lt.date(es),
            end  = lt.date(ee)

        if (date !== end) {
          if (check(date)) newCol(date)
          let a = lt.convert(es)
          addEntry(calc(lt.parse((+(new Date(a.getFullYear(), a.getMonth(), a.getDate(), 23, 59).getTime() / 1000)).toString(16)), es))

          if (check(end)) newCol(end)
          let b = lt.convert(ee)
          addEntry(calc(ee, lt.parse((+(new Date(b.getFullYear(), b.getMonth(), b.getDate(), 0, 0).getTime() / 1000)).toString(16))))
        } else {
          if (check(date)) newCol(date)
          addEntry(calc(ee, es))
        }
      }
    },

    day(d = new Date()) {
      let v = document.getElementById("daychart"),
          a = Log.data.getEntries(d),
          lw = 0,
          lp = 0

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i],
            lt = Log.time,

          addEntry = r => {
            let en = document.createElement("div"),
                bg = ""

            if      (e.c == "PHO") bg = "bg-bdbdbd"
            else if (e.c == "RES") bg = "bg-a9a9a9"
            else if (e.c == "DSG") bg = "bg-969696"
            else if (e.c == "ACA") bg = "bg-828282"
            else                   bg = "bg-blanc"

            en.className    = `psr t0 hf mb2 lf ${bg}`
            en.style.width  = `${r.p}%`
            en.style.margin = `0 0 0 ${r.m}%`

            document.getElementById("dayChart").appendChild(en)

            lw = r.p
            lp = r.dp
          },

          calc = (ee, es) => {
            let p = (ee - es) / 86400 * 100,
                s = lt.convert(es),
                sy = s.getFullYear(),
                sm = s.getMonth(),
                sd = s.getDate(),
                ds = new Date(sy, sm, sd).getTime() / 1000,

                dp = ((new Date(sy, sm, sd, s.getHours(), s.getMinutes(), s.getSeconds()).getTime() / 1000) - ds) / ((new Date(sy, sm, sd, 23, 59, 59).getTime() / 1000) - ds) * 100,

                m = dp - (lw + lp)

            return {dp, p, m}
          }

        if (e.e == "undefined") continue

        addEntry(calc(lt.parse(e.e), lt.parse(e.s)))
      }
    },

    peakH(a = Log.log) {
      let v = document.getElementById("peakTimesChart"),
          h = Log.data.peakHours(a),
          m = Log.utils.getMax(h)

      for (let i = 0, l = h.length; i < l; i++) {
        let addEntry = _ => {
          let d = document.createElement("div"),
              e = document.createElement("div"),
              t = `peak-${i}`,
              b = ""

          b = i == (new Date).getHours() ? "bg-blanc" : "bg-828282"

          d.className    = "dib hf psr line"
          d.style.width  = `4.166666666666667%`
          d.id           = t

          e.className    = `psa wf fw ${b}`
          e.style.height = `${h[i] / m * 100}%`
          e.style.bottom = "0"

          v.appendChild(d)

          document.getElementById(t).appendChild(e)
        }

        addEntry()
      }
    },

    /**
     * Display peak days
     * @param {[]} a - entries
     */

    peakD(a = Log.log) {
      let v = document.getElementById("peakDaysChart"),
          d = Log.data.peakDays(a),
          m = Log.utils.getMax(d)

      for (let i = 0, l = d.length; i < l; i++) {
        let addEntry = _ => {
          let c = document.createElement("div"),
              e = document.createElement("div"),
              t = `peakday-${i}`,
              b = ""

          b = i == (new Date).getDay() ? "bg-blanc" : "bg-828282"

          c.className    = "dib hf psr line"
          c.style.width  = `14.285714285714286%`
          c.id           = t

          e.className    = `psa wf fw ${b}`
          e.style.height = `${d[i] / m * 100}%`
          e.style.bottom = "0"

          v.appendChild(c)

          document.getElementById(t).appendChild(e)
        }

        addEntry()
      }
    },

    sectorBar(a = Log.log) {

    }
  },

  time: {

    /**
     * Convert hexadecimal into decimal
     * @param {string} s - hexadecimal
     * @return {number} decimal
     */

    parse(s) {
      return parseInt(s, 16)
    },

    /**
     * Convert Unix time
     * @param {number} t - Unix time
     */

    convert(t) {
      return new Date(t * 1000)
    },

    /**
     * Convert Unix time into a timestamp
     * @param {number} t - Unix time
     * @return {string} timestamp
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
     * @return {string} year, month, day
     */

    date(t) {
      let a = Log.time.convert(t)
      return a.getFullYear() + '' + a.getMonth() + '' + a.getDate()
    },

    /**
     * Calculate duration
     * @param {number} a - start (Unix time)
     * @param {number} b - end (Unix time)
     * @return {number} duration
     */

    duration(a, b) {
      return (b - a) / 3600
    }
  },

  data: {

    /**
     * Get entries
     * @param {Date} d - a specific date
     * @return {[]} entries
     */

    getEntries(d) {
      let ent = []

      if (d == undefined) {
        for (let i = 0, l = Log.log.length; i < l; i++) {
          let e = Log.log[i]
          if (e.e != "undefined") ent.push(e)
        }
      } else {
        let lt = Log.time
        for (let i = 0, l = Log.log.length; i < l; i++) {
          let e = Log.log[i]

          if (e.e != "undefined") {
            let a = lt.convert(lt.parse(e.s))

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
     * List projects
     * @param {[]} a - array of entries
     * @return {[]} list of projects
     */

    listProjects(a = Log.log) {
      let p = [], lt = Log.time

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i], t = e.t
        if (e.e != "undefined" && p.indexOf(t) == -1) p.push(t)
      }

      return p
    },

    /**
     * List sectors
     * @param {[]} a - array of entries
     * @return {[]} list of sectors
     */

    listSectors(a = Log.log) {
      let s = [], lt = Log.time

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i], t = e.c
        if (e.e != "undefined" && s.indexOf(t) == -1) s.push(t)
      }

      return s
    },

    /**
     * Get peak days
     * @param {[]} a - entries
     * @param {number} day - day
     * @return {[]} peak days
     */

    peakDays(a = Log.log) {
      let days = [0,0,0,0,0,0,0]

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        if (e.e != "undefined"){
          let d = Log.time.convert(Log.time.parse(e.s))
          days[d.getDay()]++
        }
      }

      return days
    },

    /**
     * Get peak hours
     * @param {[]} a - entries
     * @param {number} day - day
     * @return {[]} peak hours
     */

    peakHours(a = Log.log, d) {
      let h = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          t = Log.time

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        if (e.e != "undefined") {
          let x = t.convert(t.parse(e.s))
          if (d != undefined && d == x.getDay()) h[x.getHours()]++
          else h[x.getHours()]++
        }
      }

      return h
    },

    /**
     * Calculate shortest log session
     * @param {[]} a - array of entries
     * @return {number} shortest log session
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
     * @return {number} longest log session
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
     * @return {number} ASD
     */

    asd(a = Log.log) {
      let avg = 0, c = 0, lt = Log.time

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        if (e.e != "undefined") {
          avg += Number(lt.duration(lt.parse(e.s), lt.parse(e.e)))
          c++
        }
      }

      return avg / c
    },

    /**
     * Calculate the total number of logged hours
     * @return {number} total logged hours
     */

    lh(a = Log.log) {
      if (a.length == 0) return 0

      let h = 0, lt = Log.time,
          dur = e => Number(lt.duration(lt.parse(e.s), lt.parse(e.e)))

      for (let i = 0, l = a.length; i < l; i++) {
        if (a[i].e == "undefined") continue
        h += dur(a[i])
      }

      return h
    },

    /**
     * Calculate how much of a time period was logged
     * @param {Date} d - date of specified period
     * @return {number} log percentage
     */

    lp(a = Log.log) {
      if (a.length == 0) return 0

      let n = 0, h = 0, lt = Log.time,
          e = lt.convert(lt.parse(a[0].s)),
          d = lt.convert(lt.parse(a[a.length - 1].s))

      h = Number(Log.data.lh(a))
      n = Math.ceil((
          new Date(d.getFullYear(), d.getMonth(), d.getDate()) -
          new Date(e.getFullYear(), e.getMonth(), e.getDate())) / 8.64e7)

      return h / (24 * (n + 1)) * 100
    },

    /**
     * Calculate sector hours
     * @param {[]} a - array of entries
     * @param {string} s - sector
     * @return {number} number of sector hours
     */

    sh(a, s) {
      let h = 0, t = Log.time

      for (let i = 0, l = a.length; i < l; i++) {
        let e = a[i]
        if (e.e == "undefined") continue
        if (e.c == s) h += Number(t.duration(t.parse(e.s), t.parse(e.e)))
      }

      return h
    },

    /**
     * Calculate sector percentage
     * @param {[]} a - array of entries
     * @param {string} s - sector
     * @return {number} sector percentage
     */

    sp(a = Log.log, s) {
      return Log.data.sh(a, s) / Log.data.lh(a) * 100
    },

    trend(a, b) {
      return (a - b) / b
    }
  },

  utils: {

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
      b[i].className = "pv1 tab on bg-noir blanc f6 mon tk mr3"

    document.getElementById(s).style.display = "block"
    document.getElementById(`b-${s}`).className = "pv1 tab on bg-noir blanc f6 mon tk mr3 bb"
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
          let s = "", r, d = document.getElementById(e)

          c > 0 ? (s = `+${c.toFixed(2)}`, r = "grn") :
                  (s = `-${c.toFixed(2)}`, r = "red")

          d.innerHTML = s
          d.className = r
        }

    y.setDate(n.getDate() - 1)

    let en = Log.data.getEntries(new Date()),
        ey = Log.data.getEntries(y)

    Log.vis.bar(Log.log, "weekChart")
    Log.vis.peakH()
    Log.vis.peakD()
    Log.vis.day()

    document.getElementById("status").className = `rf mb4 f6 ${Log.status()}`

    let lhh = ld.lh(),
        lht = ld.lh(en),
        lph = ld.lp(),
        lpt = ld.lp(en),
        asd = ld.asd(),
        lsn = ld.lsmin(en),
        lsx = ld.lsmax(en),
        lsnh = ld.lsmin(),
        lsxh = ld.lsmax(),

        lhtt = ld.trend(lht, ld.lh(ey)),
        lptt = ld.trend(lpt, ld.lp(ey)),
        lsnt = ld.trend(lsn, ld.lsmin(ey)),
        lsxt = ld.trend(lsx, ld.lsmax(ey))

    let els = ["LHH", "LHT", "LPH", "LPT", "ASD", "LSN", "LSX", "LSNH", "LSXH"],
        val = [lhh, lht, lph, lpt, asd, lsn, lsx, lsnh, lsxh],
        tels = ["lhtt", "lptt", "lsnt", "lsxt"],
        tval = [lhtt, lptt, lsnt, lsxt]

    for (let i = 0, l = els.length; i < l; i++)
      document.getElementById(els[i]).innerHTML = val[i].toFixed(2)

    for (let i = 0, l = tels.length; i < l; i++)
      t(tels[i], tval[i])

    Log.vis.sectorBar()

    d("pCOD", sp(Log.log, "COD"))
    d("pDSG", sp(Log.log, "DSG"))
    d("pRES", sp(Log.log, "RES"))
    d("pPHO", sp(Log.log, "PHO"))
    d("pACA", sp(Log.log, "ACA"))

    Log.vis.line(Log.log, "vis")
    Log.display(Log.log, "logbook")
  }
}
