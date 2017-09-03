/*

  Dashboard script

  Josh Avanier

*/

var Dash = {

  log: [],

  codes: [
    "COD", "VIS", "AUD", "ACA", "RES", "MNT", "LEI", "DIY", "ART", "MUS"
  ],

  displayLog() {
    let t = document.getElementById("logbook"),
        a = takeRight(Dash.log, 30)

    t.className = "bn"

    // console.log(a)

    for (let i = 0, l = a.length; i < l; i++) {
      let r = t.insertRow(i + 1),
          c1 = r.insertCell(0), // date
          // c2 = row.insertCell(1), // time
          c3 = r.insertCell(1), // duration
          c4 = r.insertCell(2), // category
          c5 = r.insertCell(3), // title
          c6 = r.insertCell(4), // description

        entry = a[i]

      c1.innerHTML = Dash.convertDate(Dash.convertHex(entry.n))
      // c1.className = "ar"
      // c2.innerHTML = entry.s + " " + entry.e
      // c2.className = "ar"
      c3.innerHTML = Dash.duration(entry.s, entry.e)
      c3.className = "ar"
      c4.innerHTML = entry.c
      c5.innerHTML = entry.t
      c6.innerHTML = entry.d
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

  groupByDay: function() {
    let days = {}

    for (let i = 0, l = log.length; i < l; i++) {
      let date = Dash.convertDate(Dash.convertHex(log[i].n))
      days[date] = []
      days[date].push(log[i])
    }

    return days
  },

  analytics: {

    entryCount: function(a) {
      return a.length
    },

    hoursLogged: function(a) {
      let h = 0.00

      for (let i = 0, l = a.length; i < l; i++)
        h += Dash.duration(a[i].s, a[i].e)

      return h.toFixed(2)
    },

    display: function() {
      let today = Dash.groupByDay(),
           date = new Date(),
              y = date.getFullYear(),
              m = date.getMonth() + 1,
              d = date.getDate()

      if (m <= 9) m = "0" + m
      if (d <= 9) d = "0" + d

      let thisday = today[parseInt(y + m + d)]

      if (thisday !== undefined) {
        document.getElementById("entryCountToday").innerHTML = Dash.analytics.entryCount(thisday)

        document.getElementById("hoursLoggedToday").innerHTML = Dash.analytics.hoursLogged(thisday)
      }

      document.getElementById("entryCount").innerHTML = Dash.analytics.entryCount(log)
      document.getElementById("hoursLogged").innerHTML = Dash.analytics.hoursLogged(log)
    }
  },

  list: function() {
    let tally = {},
        dl = Dash.codes.length

    for (let i = 0; i < dl; i++)
      tally[Dash.codes[i]] = 0

    for (let e = 0, l = log.length; e < l; e++) {
      for (let o = 0; o < dl; o++) {
        if (log[e].c === Dash.codes[o])
          tally[Dash.codes[o]] += 1
      }
    }

    return tally
  },

  duration: function(a, b) {
    let mA = parseInt((a.toString().slice(   -2)), 10),
        mB = parseInt((b.toString().slice(   -2)), 10),
        hA = parseInt((a.toString().slice(0, -2)), 10),
        hB = parseInt((b.toString().slice(0, -2)), 10),

        hC = hB - hA,
        mC = parseFloat(((mB - mA) / 60).toFixed(2))

    if (mC < 0) mC = parseFloat(((mC + 60) / 60).toFixed(2))

    return parseFloat(hC + mC)
  },

  convertDate: function(n) {
    n = n.toString()

    let y = "20" + n.slice(0, 3),
        m = n.slice(3, 4),
        d = n.slice(4, 6)

    return y + m + d
  },

  convertHex: function(n) {
    return parseInt(n, 16)
  },

  openSect: function(sect) {
    let x = document.getElementsByClassName("sect")

    for (let i = 0, l = x.length; i < l; i++)
      x[i].style.display = "none"

    document.getElementById(sect).style.display = "block"
  },

  init() {
    Dash.log = log
    Dash.analytics.display()
    Dash.displayLog()
    Dash.list()

    Dash.groupByDay()
  }
}
