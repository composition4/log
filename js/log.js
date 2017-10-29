/**
 * Log
 * A log and time-tracking system
 *
 * @author Josh Avanier
 * @version 0.0.1
 * @license MIT
 */

"use strict";

var shell = require("shelljs")

shell.cd()
const HOME = shell.pwd()
shell.cd(__dirname)

var Log = {

  log: [], // holds user's logs
  config: {}, // holds user's preferences
  clock: {}, // holds timer interval

  /**
   * Save
   */

  save: {

    /**
     * Save log file
     */

    log() {
      shell.cp(`${__dirname}/data/log.js`, `${HOME}/.log-data/log.js`)
    },

    /**
     * Save config file
     */

    config() {
      shell.cp(`${__dirname}/data/config.js`, `${HOME}/.log-data/config.js`)
    }
  },

  options: {

    /**
     * Set background colour
     * @param {string} colour - The colour
     */

    setBG(colour) {
      shell.sed("-i", /^.*bg:.*$/, `\t\tbg: "${colour}",`, "data/config.js")
      Log.config.ui.bg = colour
      document.getElementById("app").style.backgroundColor = colour
    },

    /**
     * Set text colour
     * @param {string} colour - The colour
     */

    setColour(colour) {
      shell.sed("-i", /^.*colour:.*$/, `\t\tcolour: "${colour}",`, "data/config.js")
      Log.config.ui.colour = colour
      document.getElementById("app").style.color = colour
    },

    /**
     * Set interface font family
     * @param {string} font - The font family (sans-serif, serif, monospace)
     */

    setFont(font) {
      shell.sed("-i", /^.*font:.*$/, `\t\tfont: "${font}",`, "data/config.js")
      Log.config.ui.font = font
      document.getElementById("app").style.fontFamily = font
    },

    setIcons(a) {
      shell.sed("-i", /^.*icons:.*$/, `\t\ticons: ${a},`, "data/config.js")
      Log.config.ui.icons = a
      Log.refresh()
    },

    setView(n) {
      shell.sed("-i", /^.*view:.*$/, `\t\tview: ${n},`, "data/config.js")
      Log.config.ui.view = n
      Log.refresh()
    },

    /**
     * Set calendrical system
     * @param {string} cal - The calendrical system
     */

    setCalendar(cal) {
      shell.sed("-i", /^.*calendar:.*$/, `\t\tcalendar: "${cal}",`, "data/config.js")
      Log.config.system.calendar = cal
      Log.refresh()
    },

    setTimeFormat(format) {
      shell.sed("-i", /^.*timeFormat:.*$/, `\t\ttimeFormat: "${format}",`, "data/config.js")
      Log.config.system.timeFormat = format
      Log.refresh()
    },

    setWeekStart(start) {
      shell.sed("-i", /^.*weekStart:.*$/, `\t\tweekStart: "${start}",`, "data/config.js")
      Log.config.system.weekStart = start
      Log.refresh()
    }
  },

  console: {

    commands: [
      "start", "end", "delete", "set", "import"
    ],

    parse(input) {
      let i = Log.console.commands.indexOf(input.split(" ")[0].toLowerCase())

      if (i != -1) {
        switch (i) {
          case 0:
            Log.console.startLog(input);
            break;
          case 1:
            Log.console.endLog();
            break;
          case 2:
            console.log("delete");
            break;
          case 3:
            Log.console.set(input);
            break;
          case 4:
            Log.console.importUser(input);
            break;
        }
      } else return
    },

    importUser: {

      log(loc) {
        shell.cat(loc).to(`${__dirname}/data/config.js`)
      },

      config(loc) {
        shell.cat(loc).to(`${__dirname}/data/config.js`)
      }

    },

    importUser(input) {
      let s = input.split(" ")

      if (s[1].substr(-1) === '/') s[1].substr(0, s[1].length - 1)

      if (shell.test("-f", `${s[1]}/config.js`))
        shell.cat(`${s[1]}/config.js`).to(`${__dirname}/data/config.js`)

      if (shell.test("-f", `${s[1]}/log.js`))
        shell.cat(`${s[1]}/log.js`).to(`${__dirname}/data/log.js`)
    },

    /**
     * Start a log entry
     * @param {Object[]} s - Input array
     */

    startLog(s) {
      let ch = s.split(""),
          indices = []

      for (let i = 0, l = ch.length; i < l; i++)
        if (ch[i] === "\"") indices.push(i)

      let time = new Date(),
          start = (new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()).getTime() / 1E3).toString(16),
          sect = "",
          proj = "",
          desc = ""

      for (let i = indices[0] + 1, l = indices[1]; i < l; i++) sect += ch[i]
      for (let i = indices[2] + 1, l = indices[3]; i < l; i++) proj += ch[i]
      for (let i = indices[4] + 1, l = indices[5]; i < l; i++) desc += ch[i]

      let entry = `{s:"${start}",e:"undefined",c:"${sect}",t:"${proj}",d:"${desc}"},\n]`

      shell.sed('-i', ']', `${entry}`, (__dirname + "/data/log.js"))
      shell.cd()
      shell.sed('-i', ']', entry, ".log-data/log.js")
      shell.cd(__dirname)

      log.push({
        s: start,
        e: "undefined",
        c: sect,
        t: proj,
        d: desc
      })

      Log.refresh()
    },

    endLog() {
      let time = new Date(),
          end = (new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()).getTime() / 1E3).toString(16)

      // sed -i -e "s/undefined/$D/g" $1
      shell.sed('-i', 'undefined', end, (__dirname + "/data/log.js"))
      shell.cd()
      shell.sed('-i', 'undefined', end, ".log-data/log.js")
      shell.cd(__dirname)

      log[log.length - 1].e = `${end}`

      clearInterval(timer)
      Log.refresh()
    },

    set(s) {
      let c = s.split(" "),
          a = c[1].toLowerCase()

      if (a == "background" || a == "bg") {
        Log.options.setBG(c[2])
      } else if (a == "color" || a == "colour" || a == "text") {
        Log.options.setColour(c[2])
      } else if (a == "font" || a == "typeface" || a == "type") {
        Log.options.setFont(c[2])
      } else if (a == "icons" || a == "icon") {
        if (c[2] == "true" || c[2] == "false")
          Log.options.setIcons(c[2])
      } else if (a == "view") {
        Log.options.setView(c[2])
      } else if (a == "cal" || a == "calendar") {
        Log.options.setCalendar(c[2])
      } else if (a == "timeformat" || a == "time") {
        Log.options.setTimeFormat(c[2])
      } else if (a == "dateformat" || a == "date") {
        Log.options.setDateFormat(c[2])
      } else if (a == "weekstart") {
        Log.options.setWeekStart(c[2])
      }
    },

    /**
     * Import logs
     * @param {string=} loc - File location
     */

    importLog(loc = `${HOME}/.log-data/log.js`) {
      shell.cat(loc).to(`${__dirname}/data/log.js`)
    },

    /**
     * Import user preferences
     * @param {string=} config - File location
     */

    importConfig(config = `${HOME}/.log-data/config.js`) {
      shell.cat(config).to(`${__dirname}/data/config.js`)
    },
  },

  /**
   * Get log status; true means a session is in progress
   * @returns {boolean} Log status
   */

  status() {
    if (Log.log.length == 0) return
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
      }

      Log.clock = setInterval(function() { tick() }, 1E3)
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

      c1.innerHTML = Log.time.displayDate(es)
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
        v.style.backgroundColor = Log.config.ui.colour

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

        e.className = "db wf sh1 mt2 mb3"
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
        d.style.backgroundColor = Log.config.ui.colour

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
        dy.style.width = `${100 / Log.config.ui.view}%` // 100 / 28

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
        d.style.backgroundColor = Log.config.ui.colour

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
            b = i == (new Date).getHours() ? "of" : "o5"

        d.className = "dib hf psr"
        d.style.width = `4.166666666666667%`
        d.id = t

        n.className = `sw1 hf cn ${b}`
        n.style.backgroundColor = Log.config.ui.colour

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
            b = i == (new Date).getDay() ? "of" : "o5"

        v.className    = "dib hf psr"
        v.style.width  = "14.285714285714286%" // 100 / 7
        v.id           = t

        n.className    = `sw1 hf cn ${b}`
        n.style.backgroundColor = Log.config.ui.colour

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
        br.className = "wf sh1 mb3"

        dt.className   = "psr t0 hf lf"
        dt.style.backgroundColor = Log.config.ui.colour
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

        br.className   = "wf sh1 mb3"
        dt.className   = "psr t0 hf lf"
        dt.style.backgroundColor = Log.config.ui.colour
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
          f = Log.config.system.timeFormat,
          h = `0${d.getHours()}`,
          m = `0${d.getMinutes()}`,
          s = `0${d.getSeconds()}`

      if (f == "24")
        return `${h.substr(-2)}:${m.substr(-2)}:${s.substr(-2)}`
      else if (f == "12")
        return Log.time.twelveHours(d)
    },

    /**
     * Convert to 12-hour time
     * @param {Object} d - Date and time
     * @returns {string} 12-hour format
     */

    twelveHours(d) {
      let h = d.getHours(),
          m = d.getMinutes(),
          s = d.getSeconds(),
          x = h >= 12 ? "PM" : "AM"

      h = h % 12
      h = h ? h : 12
      h = (`0${h}`).slice(-2)
      m = (`0${m}`).slice(-2)
      s = (`0${s}`).slice(-2)

      return `${h}:${m}:${s} ${x}`
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
     * Display a date
     * @param {number} t - Unix time
     */

    displayDate(t) {
      let a = Log.time.convert(t),
          f = Log.config.system.calendar

      if (f == "gregorian") {
        return `${a.getFullYear()} ${a.getMonth()} ${a.getDate()}`
      } else if (f == "monocal") {
        return MONO.short(MONO.convert(a))
      } else if (f == "aequirys") {
        return Aequirys.display(Aequirys.convert(a))
      }

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
     * Get a summary of Log data
     * @returns {Object} A summary
     */

    summary() {

      Log.log = log

      let today = Log.data.getEntries(new Date()),
          lh = Log.data.lh(today),
          status = Log.status()

      return {
        lh: lh,
        status: status
      }

    },

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

  tab(s) {
    let x = document.getElementsByClassName("sect"),
        b = document.getElementsByClassName("tab")

    for (let i = 0, l = x.length; i < l; i++)
      x[i].style.display = "none"

    for (let i = 0, l = b.length; i < l; i++)
      b[i].className = "pv1 tab on bg-cl o5 mr3"

    document.getElementById(s).style.display = "block"
    document.getElementById(`b-${s}`).className = "pv1 tab on bg-cl of mr3"
  },

  build() {

    let icon = Log.config.ui.icons

    document.getElementById("b-ovw").innerHTML = icon ? "&#128902;" : "Overview"
    document.getElementById("b-lis").innerHTML = icon ? "&#9783;" : "Details"
    document.getElementById("b-vis").innerHTML = icon ? "&#9781;" : "Visualisation"
    document.getElementById("b-tab").innerHTML = icon ? "&#128911;" : "Table"
    document.getElementById("b-set").innerHTML = icon ? "?" : "Guide"

    document.getElementById("peakTimesTitle").innerHTML = icon ? "&#9650;" : "Peak Times"
    document.getElementById("forecastTitle").innerHTML = icon ? "&#9670;" : "Forecast"
    document.getElementById("overviewTitle").innerHTML = icon ? "&#128902;" : "Overview"
    document.getElementById("sectorsTodayTitle").innerHTML = icon ? "&#11206;" : "Sectors"
    document.getElementById("sectorsTitle").innerHTML = icon ? "&#11206;" : "Sectors"
    document.getElementById("statsTitle").innerHTML = icon ? "&#9650;" : "Statistics"
    document.getElementById("projectsTitle").innerHTML = icon ? "&#9964;" : "Projects"

    document.getElementById("tableDate").innerHTML = icon ? "&#128710;" : "Date"
    document.getElementById("tableStart").innerHTML = icon ? "&#9210;" : "Start"
    document.getElementById("tableEnd").innerHTML = icon ? "&#9209;" : "End"
    document.getElementById("tableDuration").innerHTML = icon ? "&#11118;" : "Duration"
    document.getElementById("tableSector").innerHTML = icon ? "&#11206;" : "Sector"
    document.getElementById("tableProject").innerHTML = icon ? "&#9964;" : "Project"
    document.getElementById("tableActivity").innerHTML = icon ? "&#11042;" : "Activity"


    // document.getElementById("")


  },

  refresh() {
    Log.reset()
    Log.init()
  },

  res: {

    timer() {
      clearInterval(Log.clock)
      document.getElementById("timer").innerHTML = "00:00:00"
    },

    chart(con) {
      document.getElementById(con).innerHTML = ""
    },

    forecast() {
      document.getElementById("fsf").innerHTML = "???"
      document.getElementById("fpf").innerHTML = "???"
      document.getElementById("fpt").innerHTML = "00:00"
      document.getElementById("fsd").innerHTML = "0.00 h"
    },

    stats() {
      let e = "LHH LHT LPH LPT ASD ASDT LSN LSX LSNH LSXH".split(" "),
          r = e => { document.getElementById(e).innerHTML = "0.00" }

      for (let i = 0, l = e.length; i < l; i++) r(e[i])
    },

  },

  reset() {

    Log.res.timer()

    Log.res.forecast()

    Log.res.chart("phc")
    Log.res.chart("pdc")
    Log.res.chart("dayChart")
    Log.res.chart("weekChart")

    Log.res.stats()

    Log.res.chart("peakTimesHistory")

    document.getElementById("projectBars").innerHTML = ""
    document.getElementById("sectorsList").innerHTML = ""
    document.getElementById("projectsList").innerHTML = ""
    document.getElementById("vis").innerHTML = ""
    document.getElementById("logbook").innerHTML = ""
  },

  /**
   * Initialise
   */

  init() {
    Log.config = config
    Log.log = log

    document.getElementById("app").style.backgroundColor = Log.config.ui.bg
    document.getElementById("app").style.color = Log.config.ui.colour
    document.getElementById("app").style.fontFamily = Log.config.ui.font

    Log.build()

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

      c > 0 ? (s = `+${c.toFixed(2)}%`) :
        (s = `${c.toFixed(2)}%`)

      d.innerHTML = s
    }

    y.setDate(n.getDate() - 1)

    let en = Log.data.getEntries(n),
        ey = Log.data.getEntries(y),
        mn = Log.data.getRecentEntries(Log.config.ui.view - 1)

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

    document.getElementById("status").className = status ? "rf mb4 f6 pulse" : "rf mb4 f6"

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

    document.getElementById("cmd").addEventListener("submit", function() {
      Log.console.parse(document.getElementById("console").value)
      document.getElementById("console").value = ""
    })

    document.addEventListener("keydown", function(e) {
      if (e.which >= 65 && e.which <= 90) {
        document.getElementById("cmd").style.display = "block"
        document.getElementById("console").focus()
      } else if (e.key == "Escape") {
        document.getElementById("console").value = ""
        document.getElementById("cmd").style.display = "none"
      }
      return
    })

    Log.vis.peakH(undefined, "peakTimesHistory")
    // Log.vis.sectorBar(en)
    Log.vis.sectorBars(en)
    Log.vis.projectBars(en)

    Log.vis.sectorBars(undefined, "sectorsList")
    Log.vis.projectBars(undefined, "projectsList")

    Log.vis.line(mn, "vis")
    Log.display(Log.log, 50, "logbook")
  }
}
