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

  display() {
    let v = document.getElementById("logbook"),
        t = Log.time,
        a = Aequirys,

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

    v.className = "bn f6 mon"

    for (var b = takeRight(Log.log, 30), i = 0, l = b.length; i < l; i++) {
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

      ih(c1, a.dis(
        a.con(new Date(q.getFullYear(), q.getMonth(), q.getDate()))
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

    line(set, con) {
      let v = document.getElementById(con),
          lw = 0,
          lp = 0

      for (let i = 0, l = set.length; i < l; i++) {
        let e = set[i],
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
          }

        if (e.e == "undefined") continue

        let es = lt.parse(e.s),
            ee = lt.parse(e.e),
            date = lt.date(es),
            end = lt.date(ee),
            id = con + date

        if (date !== end) {
          if (document.getElementById(id) == null) newRow(date)

          let a = lt.convert(es),
              eDate = new Date(
                a.getFullYear(), a.getMonth(), a.getDate(), 23, 59
              ).getTime() / 1000

          addEntry(calc(lt.parse((+eDate).toString(16)), es))

          if (document.getElementById(con + end) == null) newRow(end)

          let ea = lt.convert(ee),
              eaDate = new Date(
                ea.getFullYear(), ea.getMonth(), ea.getDate(), 0, 0
              ).getTime() / 1000

          addEntry(calc(ee, lt.parse((+eaDate).toString(16))))
        } else {
          if (document.getElementById(id) == null) newRow(date)
          addEntry(calc(ee, es))
        }
      }
    },

    bar(set, con) {
      let v = document.getElementById(con),
          lw = 0,
          time = Log.time

      for (let i = 0, l = set.length; i < l; i++) {
        let e = set[i],

          addEntry = r => {
            let en = document.createElement("div"),
                bg = ""

            if      (e.c == "PHO") bg = "bg-bdbdbd"
            else if (e.c == "RES") bg = "bg-a9a9a9"
            else if (e.c == "DSG") bg = "bg-969696"
            else if (e.c == "ACA") bg = "bg-828282"
            else                   bg = "bg-blanc"

            en.className    = `psa wf fw ${bg}`
            en.style.height = `${r}%`
            en.style.bottom = `${lw}%`

            document.getElementById(date).appendChild(en)

            lw += r
          },

          calc = (e, s) => (e - s) / 86400 * 100,

          newCol = d => {
            lw = 0

            let dy = document.createElement("div")

            dy.className   = "dib hf psr"
            dy.style.width = `1%`
            dy.id          = d

            v.appendChild(dy)
          }

        if (e.e == "undefined") continue

        let es   = time.parse(e.s),
            ee   = time.parse(e.e),
            date = time.date(es),
            end  = time.date(ee)

        if (date !== end) {
          if (document.getElementById(date) == null) newCol(date)
          let a = time.convert(es),
              eDate = new Date(
                a.getFullYear(), a.getMonth(), a.getDate(), 23, 59
              ).getTime() / 1000

          addEntry(calc(time.parse((+eDate).toString(16)), es))

          if (document.getElementById(end) == null) newCol(end)
          let ea = time.convert(ee),
              eaDate = new Date(
                ea.getFullYear(), ea.getMonth(), ea.getDate(), 0, 0
              ).getTime() / 1000

          addEntry(calc(ee, time.parse((+eaDate).toString(16))))
        } else {
          if (document.getElementById(date) == null) newCol(date)
          addEntry(calc(ee, es))
        }
      }
    },

    day() {
      let v = document.getElementById("daychart"),
          a = Log.data.getEntries(new Date()),
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

        let es = lt.parse(e.s),
            ee = lt.parse(e.e),
            date = lt.date(es),
            end = lt.date(ee)

        addEntry(calc(ee, es))
      }
    },

    peakH(day) {
      let v = document.getElementById("peakTimesChart"),
          hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      for (let i = 0, l = Log.log.length; i < l; i++) {
        let e = Log.log[i]
        if (e.e == "undefined") continue
        if (day != undefined) {
          let d = Log.time.convert(Log.time.parse(e.s))
          if (day == d.getDay()) hours[d.getHours()]++
        } else {
          let d = Log.time.convert(Log.time.parse(e.s))
          hours[d.getHours()]++
        }
      }

      let max = hours.reduce(function(a, b) {
        return Math.max(a, b)
      })

      for (let i = 0, l = hours.length; i < l; i++) {
        let e = Log.log[i],
            addEntry = _ => {
              let dy = document.createElement("div")

              dy.className   = "dib hf psr line"
              dy.style.width = `${100 / 24}%`
              dy.id          = "peak-"+i

              v.appendChild(dy)

              let en = document.createElement("div"), bg = ""
              bg = i == (new Date).getHours() ? "bg-blanc" : "bg-828282"

              en.className    = `psa wf fw ${bg}`
              en.style.height = (hours[i] / max * 100) + "%"
              en.style.bottom = "0"

              document.getElementById("peak-"+i).appendChild(en)
            }

        addEntry()
      }
    },

    peakD() {
      let v = document.getElementById("peakDaysChart"),
          days = [0, 0, 0, 0, 0, 0, 0]

      for (let i = 0, l = Log.log.length; i < l; i++) {
        let e = Log.log[i]
        if (e.e == "undefined") continue
        let d = Log.time.convert(Log.time.parse(e.s))
        days[d.getDay()]++
      }

      let max = days.reduce(function(a, b) {
        return Math.max(a, b)
      })

      for (let i = 0, l = days.length; i < l; i++) {
        let e = Log.log[i],
            addEntry = _ => {
              let dy = document.createElement("div")

              dy.className   = "dib hf psr line"
              dy.style.width = `${100 / 7}%`
              dy.id          = "peakday-"+i

              v.appendChild(dy)

              let en = document.createElement("div"), bg = ""
              bg = i == (new Date).getDay() ? "bg-blanc" : "bg-828282"

              en.className = `psa wf fw ${bg}`
              en.style.height = (days[i] / max * 100) + "%"
              en.style.bottom = "0"

              document.getElementById("peakday-"+i).appendChild(en)
            }

        addEntry()
      }
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
      let ent = [], t = Log.time

      if (d == undefined) {
        for (let i = 0, l = Log.log.length; i < l; i++) {
          let e = Log.log[i]
          if (e.e != "undefined") ent.push(e)
        }

        return ent
      } else {
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

        return ent
      }
    },

    /**
     * List projects
     * @param {Date} d - a specific date
     * @return {[]} list of projects
     */

    listProjects(d) {
      let p = [], lt = Log.time

      for (let i = 0, l = Log.log.length; i < l; i++) {
        let e = Log.log[i],
            t = e.t,
            c = (e.e != "undefined" && p.indexOf(t) == -1)

        if (d == undefined && c) p.push(t)
        else if (d != undefined && c) {
          let a = lt.convert(lt.parse(e.s))
          a.getFullYear() == d.getFullYear() &&
          a.getMonth() == d.getMonth() &&
          a.getDate() == d.getDate() &&
          p.push(t)
        }
      }

      return p
    },

    /**
     * List sectors
     * @param {Date} d - a specific date
     * @return {[]} list of sectors
     */

    listSectors(d) {
      let p = [], lt = Log.time

      for (let i = 0, l = Log.log.length; i < l; i++) {
        let e = Log.log[i],
            t = e.c,
            c = (e.e != "undefined" && p.indexOf(t) == -1)

        if (d == undefined && c) p.push(t)
        else if (d != undefined && c) {
          let a = lt.convert(lt.parse(e.s))
          a.getFullYear() == d.getFullYear() && a.getMonth() == d.getMonth() &&
          a.getDate() == d.getDate() && p.push(t)
        }
      }

      return p
    },

    /**
     * Calculate shortest log session
     * @param {Date} d - of a specific date
     * @return {number} shortest log session
     */

    lsmin(d) {
      let m, lt = Log.time,

          check = e => {
            let n = Number(lt.duration(lt.parse(e.s), lt.parse(e.e)))
            if (n < m || m == undefined) m = n
          }

      if (d != undefined) {
        let entD = Log.data.getEntries(d)
        if (entD.length == 0) return 0
        for (let i = 0, l = entD.length; i < l; i++) check(entD[i])
      } else {
        let entH = Log.data.getEntries()
        if (entH.length == 0) return 0
        for (let i = 0, l = entH.length; i < l; i++) check(entH[i])
      }

      return m
    },

    /**
     * Calculate longest log session
     * @param {Date} d - of a specific date
     * @return {number} longest log session
     */

    lsmax(d) {
      let m, lt = Log.time,

          check = e => {
            let n = Number(lt.duration(lt.parse(e.s), lt.parse(e.e)))
            if (n > m || m == undefined) m = n
          }

      if (d != undefined) {
        let entD = Log.data.getEntries(d)
        if (entD.length == 0) return 0
        for (let i = 0, l = entD.length; i < l; i++) check(entD[i])
      } else {
        let entH = Log.data.getEntries()
        if (entH.length == 0) return 0
        for (let i = 0, l = entH.length; i < l; i++) check(entH[i])
      }

      return m
    },

    /**
     * Calculate average session duration (ASD)
     * @return {number} ASD
     */

    asd() {
      let a = 0, c = 0, lt = Log.time

      for (let i = 0, l = Log.log.length; i < l; i++) {
        let e = Log.log[i]
        if (e.e != "undefined") {
          a += Number(lt.duration(lt.parse(e.s), lt.parse(e.e)))
          c++
        }
      }

      return a / c
    },

    /**
     * Calculate the total number of logged hours
     * @return {number} total logged hours
     */

    lh(d) {
      let h = 0,
          lt = Log.time,
          dur = e => Number(lt.duration(lt.parse(e.s), lt.parse(e.e)))

      if (d != undefined) {
        let entD = Log.data.getEntries(d)
        for (let i = 0, l = entD.length; i < l; i++) h += dur(entD[i])
      } else {
        let entH = Log.data.getEntries()
        for (let i = 0, l = entH.length; i < l; i++) h += dur(entH[i])
      }

      return h
    },

    /**
     * Calculate how much of a time period was logged
     * @param {Date} d - date of specified period
     * @return {number} log percentage
     */

    lp(d) {
      let n = 0, h = 0, lt = Log.time

      if (d != undefined) {
        h = Log.data.getEntries(d).length == 0 ? 0 : Log.data.lh(d)
      } else {
        let e = lt.convert(lt.parse(Log.log[0].s)),
            d = new Date()

        h = Number(Log.data.lh())
        n = Math.ceil((
            new Date(d.getFullYear(), d.getMonth(), d.getDate()) -
            new Date(e.getFullYear(), e.getMonth(), e.getDate())) / 8.64e7)
      }

      return h / (24 * (n + 1)) * 100
    },

    /**
     * Calculate sector hours
     * @param {string} s - sector
     * @return {number} number of sector hours
     */

    sh(s) {
      let h = 0, t = Log.time

      for (let i = 0, l = Log.log.length; i < l; i++) {
        let e = Log.log[i]
        if (e.e == "undefined") continue
        if (e.c == s) h += Number(t.duration(t.parse(e.s), t.parse(e.e)))
      }

      return h
    },

    /**
     * Calculate sector percentage
     * @param {string} s - sector
     * @return {number} sector percentage
     */

    sp(s) {
      return Log.data.sh(s) / Log.data.lh() * 100
    },

    trend(a, b) {
      return (a - b) / b
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
    let ld = Log.data,
        sp = ld.sp,
        n = new Date(),
        y = new Date(n),

        d = (e, m) => { document.getElementById(e).innerHTML = m.toFixed(2) },

        s = (e, c) => { document.getElementById(e).className = c }

    y.setDate(n.getDate() - 1)

    Log.log = log
    Log.vis.bar(Log.log, "weekChart")
    Log.vis.peakH()
    Log.vis.peakD()
    Log.vis.day()

    document.getElementById("status").className = `rf mb4 f6 ${Log.status()}`

    let lhh = ld.lh(),
        lht = ld.lh(n),
        lph = ld.lp(),
        lpt = ld.lp(n),
        asd = ld.asd(),
        lsn = ld.lsmin(n),
        lsx = ld.lsmax(n),
        lsnh = ld.lsmin(),
        lsxh = ld.lsmax(),

        lhtt = ld.trend(lht, ld.lh(y)),
        lptt = ld.trend(lpt, ld.lp(y)),
        lsnt = ld.trend(lsn, ld.lsmin(y)),
        lsxt = ld.trend(lsx, ld.lsmax(y))

        console.log(ld.lp(n))
        console.log(ld.lp(y))

    if (lhtt < 0) s("lhtt", "red")
    if (lptt < 0) s("lptt", "red")
    if (lsnt < 0) s("lsnt", "red")
    if (lsxt < 0) s("lsxt", "red")

    d("LHH", lhh)
    d("LHT", lht)

    d("lhtt", lhtt)

    d("LPH", lph)
    d("LPT", lpt)
    d("lptt", lptt)
    d("ASD", asd)
    d("LSN", lsn)
    d("lsnt", lsnt)
    d("LSX", lsx)
    d("lsxt", lsxt)
    d("LSNH", lsnh)
    d("LSXH", lsxh)

    d("pCOD", sp("COD"))
    d("pDSG", sp("DSG"))
    d("pRES", sp("RES"))
    d("pPHO", sp("PHO"))
    d("pACA", sp("ACA"))

    Log.vis.line(Log.log, "vis")
    Log.display()
  }
}
