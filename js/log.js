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
    return Log.log[Log.log.length - 1].e == "undefined" ? true : false
  },

  /**
   * Display a session timer
   * @param {boolean} status - Log status
   */

  timer(status) {
    if (status) {
      let l = Log.time.convert(
                Log.time.parse(Log.log[Log.log.length - 1].s)
              ).getTime(),

      tick = _ => {
        let s = Math.floor((new Date().getTime() - l) / 1E3),
            m = Math.floor(s / 60),
            h = Math.floor(m / 60)

        h %= 24
        m %= 60
        s %= 60

        document.getElementById("timer").innerHTML = `${`0${h}`.substr(-2)}:${`0${m}`.substr(-2)}:${`0${s}`.substr(-2)}`
      },

      t = setInterval(function() { tick() }, 1E3)
    } else return
  },

  /**
   * Display a log table
   * @param {Object[]=} ent - The log entries
   * @param {number=}   num - The number of entries to show
   * @param {string=}   con - The container
   */

  display(ent = Log.log, num = 50, con = "logTable") {

    /**
     * Take the last n items of an array
     * @param {Object[]} a - The array
     * @param {number=}  n - Number of items
     * @returns {Object[]} An array with the last n items
     */

    let takeRight = (a, n = 1) => {
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

    /**
     * Convert into an Aequiryean date
     * @param {number} es - A (parsed) log entry's start time
     * @return {string} An Aequiryean date
     */

    aq = es => {
      let d = Log.time.convert(es)

      return Aequirys.display(
              Aequirys.convert(
                new Date(d.getFullYear(), d.getMonth(), d.getDate())
              )
            )
    },

    /**
     * Create cells and store data
     * @param {Object} e - A Log entry
     * @param {number} i - The array position
     */

    en = (e, i) => {
      let row = document.getElementById(con).insertRow(i),

          c1 = row.insertCell(0),
          c2 = row.insertCell(1),
          c3 = row.insertCell(2),
          c4 = row.insertCell(3),
          c5 = row.insertCell(4),
          c6 = row.insertCell(5),
          c7 = row.insertCell(6),

          es = Log.time.parse(e.s),
          ee = Log.time.parse(e.e)

      c1.innerHTML = aq(es)
      c2.innerHTML = Log.time.stamp(es)
      c3.innerHTML = Log.time.stamp(ee)
      c4.innerHTML = Log.time.duration(es, ee).toFixed(2)
      c5.innerHTML = e.c
      c6.innerHTML = e.t
      c7.innerHTML = e.d
    }

    // Display last {num} entries
    let b = takeRight(ent, num)

    for (let i = 0, l = b.length; i < l; i++) en(b[i], i)
  },

  /**
   * Of visualisations
   */

  vis: {

    /**
     * Display a line visualisation
     * @param {Object[]=} ent - The Log entries
     * @param {string}    con - The container
     */

    line(ent = Log.log, con) {
      let lw = 0, // the width of the last data element
          lp = 0, // the percentage of the last data element

      /**
       * Add a data element to the chart
       * @param {Object} e - A Log entry
       * @param {Object} r - The Log entry's attributes
       */

      addEntry = (e, width, dp, margin) => {
        let v = document.createElement("div"),
            b = e.c == "PHO" ? "bg-blu" :
                e.c == "RES" ? "bg-grn" :
                e.c == "DSG" ? "bg-red" :
                e.c == "ACA" ? "bg-ylw" : "bg-blanc"

        v.className    = `psr t0 sh1 mb2 lf ${b}`
        v.style.width  = `${width}%`
        v.style.margin = `0 0 0 ${margin}%`

        let id = con + Log.time.date(Log.time.parse(e.s))
        document.getElementById(id).appendChild(v)

        lw = width
        lp = dp
      },

      /**
       * Create a new row
       * @param {string} id - The new row's ID
       */

      nr = id => {
        lw = 0
        lp = 0

        let e = document.createElement("div")

        e.className = "db wf sh1 mt2 mb3 bsia bg-noir br1"
        e.id        = con + id

        document.getElementById(con).appendChild(e)
      },

      /**
       * Check if column exists
       * @param {string} id - The column ID
       * @returns {boolean} Column existence status
       */

      check = id => (document.getElementById(id) == null)

      for (let i = 0, l = ent.length; i < l; i++) {
        if (ent[i].e == "undefined") continue

        let es  = Log.time.parse(ent[i].s),
            ee  = Log.time.parse(ent[i].e),

            dt  = Log.time.date(es),
            end = Log.time.date(ee),

            id  = con + dt

        // Split entries that span through midnight
        if (dt !== end) {
          check(id) && nr(dt)

          let aa = Log.time.convert(es),
              aae = Log.time.parse((+new Date(aa.getFullYear(), aa.getMonth(), aa.getDate(), 23, 59).getTime() / 1E3).toString(16)),
              awi = Log.utils.calcWidth(aae, es),
              adp = Log.utils.calcDP(es),
              amr = Log.utils.calcMargin(adp, lw, lp)

          addEntry(ent[i], awi, adp, amr)

          check(con + end) && nr(end)

          let ea = Log.time.convert(ee),
              eas = Log.time.parse((+new Date(ea.getFullYear(), ea.getMonth(), ea.getDate(), 0, 0).getTime() / 1E3).toString(16)),
              ewi = Log.utils.calcWidth(ee, eas),
              edp = Log.utils.calcDP(eas),
              emr = Log.utils.calcMargin(edp, lw, lp)

          addEntry(ent[i], ewi, edp, emr)
        } else {
          check(id) && nr(dt)

          let wi = Log.utils.calcWidth(ee, es),
              dp = Log.utils.calcDP(es),
              mr = Log.utils.calcMargin(dp, lw, lp)

          addEntry(ent[i], wi, dp, mr)
        }
      }
    },

    /**
     * Display a bar visualisation
     * @param {Object[]=} ent - Log entries
     * @param {string}    con - The container
     */

    bar(ent = Log.log, con) {
      let lw = 0, // the width of the last data element

      /**
       * Add a data element to the chart
       * @param {Object} e - A Log entry
       * @param {Object} r - A width
       */

      addEntry = (e, w) => {
        let d = document.createElement("div"),
            b = "PHO" == e.c ? "bg-blu" :
                "RES" == e.c ? "bg-grn" :
                "DSG" == e.c ? "bg-red" :
                "ACA" == e.c ? "bg-ylw" : "bg-blanc"

        d.className    = `psa sw1 ${b}`
        d.style.height = `${w}%`
        d.style.bottom = `${lw}%`

        let id = Log.time.date(Log.time.parse(e.s))
        document.getElementById(id).appendChild(d)

        lw += w
      },

      /**
       * Create a new column
       * @param {string} id - The new column's ID
       */

      nc = id => {
        lw = 0

        let dy = document.createElement("div"),
            e = document.createElement("div")

        dy.className   = "dib hf psr"
        dy.style.width = "3.57143%" // 100 / 28

        e.className = `sw1 hf cn`
        e.id = id

        dy.appendChild(e)

        document.getElementById(con).appendChild(dy)
      }

      for (let i = 0, l = ent.length; i < l; i++) {
        if (ent[i].e == "undefined") continue

        let s = Log.time.parse(ent[i].s),
            e = Log.time.parse(ent[i].e),
            d = Log.time.date(s)

        document.getElementById(d) == null && nc(d)

        addEntry(ent[i], Log.utils.calcWidth(e, s))
      }
    },

    /**
     * Display a day chart
     * @param {Object=} d - A date
     */

    day(d = new Date(), con = "dayChart") {
      let en = Log.data.getEntries(d),

          lw = 0, // the width of the last data element
          lp = 0, // the percentage of the last data element

      add = (e, width, dp, margin) => {
        let d = document.createElement("div"),
            b = e.c == "PHO" ? "bg-blu" :
                e.c == "RES" ? "bg-grn" :
                e.c == "DSG" ? "bg-red" :
                e.c == "ACA" ? "bg-ylw" : "bg-blanc"

        d.className    = `psr t0 hf mb2 lf ${b}`
        d.style.width  = `${width}%`
        d.style.margin = `0 0 0 ${margin}%`

        document.getElementById(con).appendChild(d)

        lw = width
        lp = dp
      }

      for (let i = 0, l = en.length; i < l; i++) {
        if (en[i].e == "undefined") continue

        let es = Log.time.parse(en[i].s),
            ee = Log.time.parse(en[i].e),

            wd = Log.utils.calcWidth(ee, es),
            dp = Log.utils.calcDP(es),
            mr = Log.utils.calcMargin(dp, lw, lp)

        add(en[i], wd, dp, mr)
      }
    },

    /**
     * Display peak hours chart
     * @param {Object[]=} ent - Log entries
     * @param {string=}   con - The container
     */

    peakH(ent = Log.log, con = "phc") {
      let h = Log.data.peakHours(ent),
          m = Log.utils.getMax(h),

      add = i => {
        let d = document.createElement("div"),
            e = document.createElement("div"),
            n = document.createElement("div"),
            t = `${con}-${i}`,
            b = i == (new Date).getHours() ? "bg-blanc" : "bg-5"

        d.className = "dib hf psr"
        d.style.width = `4.166666666666667%`
        d.id = t

        n.className = `sw1 hf cn ${b}`

        e.className = "psa b0 wf"
        e.style.height = `${h[i] / m * 100}%`

        e.appendChild(n)

        document.getElementById(con).appendChild(d)
        document.getElementById(t).appendChild(e)
      }

      for (let i = 0, l = h.length; i < l; i++) add(i)
    },

    /**
     * Display peak days chart
     * @param {Object[]=} ent - Log entries
     * @param {string=}   con - The container
     */

    peakD(ent = Log.log, con = "pdc") {
      let d = Log.data.peakDays(ent),
          m = Log.utils.getMax(d),

      add = i => {
        let v = document.createElement("div"),
            e = document.createElement("div"),
            n = document.createElement("div"),
            t = `${con}-${i}`,
            b = i == (new Date).getDay() ? "bg-blanc" : "bg-5"

        v.className    = "dib hf psr"
        v.style.width  = "14.285714285714286%" // 100 / 7
        v.id           = t

        n.className    = `sw1 hf cn ${b}`

        e.className    = "psa b0 wf"
        e.style.height = `${d[i] / m * 100}%`

        e.appendChild(n)

        document.getElementById(con).appendChild(v)
        document.getElementById(t).appendChild(e)
      }

      for (let i = 0, l = d.length; i < l; i++) add(i)
    },

    /**
     * Display sector bar
     * @param {Object[]=} ent - Log entries
     * @param {string=}   con - The container
     */

    sectorBar(ent = Log.log, con = "sectorBar") {
      let s = Log.data.listSectors(ent).sort(),

      /**
       * Add a partition to the sector bar
       * @param {Object} sec - A sector
       */

      add = sec => {
        let d = document.createElement("div"),
            v = Log.data.sp(ent, sec),
            b = s == "PHO" ? "blu" :
                s == "RES" ? "grn" :
                s == "DSG" ? "red" :
                s == "ACA" ? "ylw" : "blanc"

        d.className   = `psr t0 hf mb2 lf bg-${b}`
        d.style.width = `${v}%`
        d.title       = `${sec} (${v.toFixed(2)}%)`

        document.getElementById(con).appendChild(d)
      }

      for (let i = 0, l = s.length; i < l; i++) add(s[i])
    },

    /**
     * Display sector bars
     * @param {Object[]=} ent - Log entries
     * @param {string=}   con - The container
     */

    sectorBars(ent = Log.log, con = "sectorBars") {
      let s = Log.data.listSectors(ent).sort(),

      /**
       * Add an item to the sector bar list
       * @param {string} sec - A sector
       */

      add = sec => {

        /*
          ------------------------
          SECTOR           LH 2.34
          ++++++++++==============
          ------------------------
        */

        let sh = Log.data.sh(ent, sec),

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
        dt.style.width = `${(Log.data.sp(ent, sec))}%`

        tl.innerHTML = sec
        st.innerHTML = `LH ${sh.toFixed(2)}`

        br.appendChild(dt)
        li.appendChild(tl)
        li.appendChild(st)
        li.appendChild(br)

        document.getElementById(con).appendChild(li)
      }

      for (let i = 0, l = s.length; i < l; i++) add(s[i])
    },

    /**
     * Display project bars
     * @param {Object[]=} ent - Log entries
     * @param {string=}   con - The container
     */

    projectBars(ent = Log.log, con = "projectBars") {
      let s = Log.data.listProjects(ent).sort(),

      /**
       * Add an item to the project bars list
       * @param {string} pro - A project
       */

      add = pro => {

        /*
          ------------------------
          PROJECT          LH 2.34
          ++++++++++==============
          ------------------------
        */

        let sh = Log.data.ph(ent, pro),

            li = document.createElement("li"),
            tl = document.createElement("span"),
            st = document.createElement("span"),
            br = document.createElement("div"),
            dt = document.createElement("div")

        li.className   = "mb4 f6"

        tl.className   = "f6 mb2 mon upc tk"
        tl.innerHTML   = pro

        st.className   = "f6 rf"
        st.innerHTML   = `LH ${sh.toFixed(2)}`

        br.className   = "wf sh1 mb3 bg-noir bsia"
        dt.className   = "psr t0 hf lf bg-blanc"
        dt.style.width = `${(Log.data.pp(ent, pro))}%`

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

      if (d == undefined) return Log.log
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
     * Get entries from a certain period
     * @param {Object} ps - Period start
     * @param {Object} pe - Period end
     * @returns {Object[]} - Log entries
     */

    getEntriesByPeriod(ps, pe = new Date()) {
      Date.prototype.addDays = function(days) {
        let date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
      }

      function getDates(startDate, stopDate) {
        let dateArray = [],
            currentDate = startDate

        while (currentDate <= stopDate) {
          dateArray.push(new Date(currentDate))
          currentDate = currentDate.addDays(1)
        }

        return dateArray
      }

      let span = getDates(ps, pe),
          ent = []

      for (let i = 0, l = span.length; i < l; i++) {
        let a = Log.data.getEntries(span[i])
        for (let o = 0, ol = a.length; o < ol; o++) ent.push(a[o])
      }

      return ent
    },

    /**
     * Get entries from the last n days
     * @param {number} n - The number of days
     * @returns {Object[]} Log entries
     */

    getRecentEntries(n) {

      Date.prototype.subtractDays = function(days) {
        let date = new Date(this.valueOf())
        date.setDate(date.getDate() - days)
        return date
      }

      let today = new Date(),
          past = today.subtractDays(n)

      return Log.data.getEntriesByPeriod(past)

      // return today.subtractDays(n)

    },

    /**
     * Get entries of a specific day of the week
     * @param {number} d - A day of the week (0 - 6)
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
     * @param {string} p - A project
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
     * @param {Object[]=} ent - Log entries
     * @returns {Object[]} A list of sectors
     */

    listSectors(ent = Log.log) {
      let s = []

      for (let i = 0, l = ent.length; i < l; i++) {
        let e = ent[i], t = e.c
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
      let d = new Array(7).fill(0),

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
      let h = new Array(24).fill(0),

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

      let m,

      check = e => {
        let n = Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e))
        if (n < m || m == undefined) m = n
      }

      for (let i = 0, l = a.length; i < l; i++) check(a[i])

      return m
    },

    /**
     * Calculate longest log session
     * @param {Object[]=} ent - Log entries
     * @returns {number} Longest log session
     */

    lsmax(ent = Log.log) {
      if (ent.length == 0) return 0

      let m,

      check = e => {
        let n = Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))
        if (n > m || m == undefined) m = n
      }

      for (let i = 0, l = ent.length; i < l; i++) check(ent[i])

      return m
    },

    /**
     * Calculate average session duration (ASD)
     * @param {Object[]=} ent - Log entries
     * @returns {number} Average session duration
     */

    asd(ent = Log.log) {
      if (ent.length == 0) return 0

      let avg = 0, c = 0,

      count = e => {
        avg += Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))
        c++
      }

      for (let i = 0, l = ent.length; i < l; i++)
        ent[i].e != "undefined" && count(ent[i])

      return avg / c
    },

    /**
     * Calculate the total number of logged hours
     * @param {Object[]=} ent - Log entries
     * @returns {number} Total logged hours
     */

    lh(ent = Log.log) {
      if (ent.length == 0) return 0

      let h = 0,

      count = e => {
        h += Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))
      }

      for (let i = 0, l = ent.length; i < l; i++)
        ent[i].e != "undefined" && count(ent[i])

      return h
    },

    /**
     * Calculate how much of a time period was logged
     * @param {Object[]=} ent - Log entries
     * @returns {number} Log percentage
     */

    lp(ent = Log.log) {
      if (ent.length == 0) return 0

      let e = Log.time.convert(Log.time.parse(ent[0].s)),
          d = Log.time.convert(Log.time.parse(ent[ent.length - 1].s)),
          h = Number(Log.data.lh(ent)),
          n = Math.ceil((
            new Date(d.getFullYear(), d.getMonth(), d.getDate()) -
            new Date(e.getFullYear(), e.getMonth(), e.getDate())
          ) / 8.64e7)

      return h / (24 * (n + 1)) * 100
    },

    /**
     * Calculate sector hours
     * @param {Object[]=} ent - Log entries
     * @param {string}    sec - Sector
     * @returns {number} Sector hours
     */

    sh(ent = Log.log, sec) {
      let h = 0,

      count = e => {
        h += Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))
      }

      for (let i = 0, l = ent.length; i < l; i++)
        ent[i].e != "undefined" && ent[i].c == sec && count(ent[i])

      return h
    },

    /**
     * Calculate sector percentage
     * @param {Object[]=} ent - Log entries
     * @param {string}    sec - Sector
     * @returns {number} Sector percentage
     */

    sp(ent = Log.log, sec) {
      return Log.data.sh(ent, sec) / Log.data.lh(ent) * 100
    },

    /**
     * Calculate project hours
     * @param {Object[]=} ent - Log entries
     * @param {string}    pro - Project
     * @returns {number} Project hours
     */

    ph(ent, pro) {
      let h = 0,

      duration = e => Number(Log.time.duration(Log.time.parse(e.s), Log.time.parse(e.e)))

      for (let i = 0, l = ent.length; i < l; i++)
        ent[i].e != "undefined" && ent[i].t == pro && (h += duration(ent[i]))

      return h
    },

    /**
     * Calculate project percentage
     * @param {Object[]=} ent - Log entries
     * @param {string}    pro - Project
     * @returns {number} Project percentage
     */

    pp(ent = Log.log, pro) {
      return Log.data.ph(ent, pro) / Log.data.lh(ent) * 100
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
     * @returns {Object} Forecasts
     */

    forecast() {
      let ent = Log.data.getEntriesByDay(new Date().getDay())

      // Sector Focus

      let s = Log.data.listSectors(ent), sf = 0, sfs = ""

      for (let i = 0, l = s.length; i < l; i++) {
        let x = Log.data.sp(ent, s[i])
        x > sf && (sf = x, sfs = s[i])
      }

      // Peak Time

      let eph = Log.data.peakHours(ent), mph = 0, mpht = 0

      for (let i = 0, l = eph.length; i < l; i++)
        eph[i] > mph && (mph = eph[i], mpht = i)

      // Project Focus

      let p = Log.data.listProjects(ent), pf = 0, pfp = ""

      for (let i = 0, l = p.length; i < l; i++) {
        let x = Log.data.pp(ent, p[i])
        x > pf && (pf = x, pfp = p[i])
      }

      return {
        sf: sfs,
        pf: pfp,
        pt: `${mpht}:00`,
        sd: Log.data.asd(ent)
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
    },

    calcWidth(a, b) {
      return (a - b) / 86400 * 100
    },

    calcDP(a) {
      let s = Log.time.convert(a),
          y = s.getFullYear(),
          m = s.getMonth(),
          d = s.getDate()

      return (new Date(y, m, d, s.getHours(), s.getMinutes(), s.getSeconds()).getTime() / 1E3 - (new Date(y, m, d).getTime() / 1E3)) / 86400 * 100
    },

    calcMargin(a, lw, lp) {
      return a - (lw + lp)
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
        ey = Log.data.getEntries(y),
        mn = Log.data.getRecentEntries(27)

    Log.vis.bar(mn, "weekChart")
    Log.vis.peakH(Log.data.getEntriesByDay(n.getDay()))
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
    Log.vis.sectorBar(en)
    Log.vis.projectBars(en)

    Log.vis.sectorBars(undefined, "sectorsList")
    Log.vis.projectBars(undefined, "projectsList")

    Log.vis.line(mn, "vis")
    Log.display(Log.log, 50, "logbook")
  }
}
