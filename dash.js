/*

  Dashboard script

  Josh Avanier

*/

var Dash = {

  log: [],

  codes: [
    "COD", "VIS", "AUD", "ACA", "RES", "MNT", "LEI", "DIY", "ART"
  ],

  displayLog() {
    var table = document.getElementById("logbook"),
        l = Dash.log.length,
        i

    for (i = 0; i < l; i++) {
      var row = table.insertRow(i + 1),
          c1 = row.insertCell(0), // date
          c2 = row.insertCell(1), // time
          c3 = row.insertCell(2), // duration
          c4 = row.insertCell(3), // category
          c5 = row.insertCell(4), // title
          c6 = row.insertCell(5), // description

          entry = log[i]

      c1.innerHTML = Dash.convertDate(Dash.convertHex(entry.n))
      c1.className = "ar"
      c2.innerHTML = entry.s + " " + entry.e
      c2.className = "ar"
      c3.innerHTML = Dash.duration(entry.s, entry.e)
      c3.className = "ar"
      c4.innerHTML = entry.c
      c5.innerHTML = entry.t
      c6.innerHTML = entry.d
    }
  },

  groupByDay: function() {
    var days = {},
        l = log.length,
        i

    for (i = 0; i < l; i++) {
      var date = Dash.convertDate(Dash.convertHex(log[i].n))
      days[date] = []
    }

    for (i = 0; i < l; i++) {
      var date = Dash.convertDate(Dash.convertHex(log[i].n))
      days[date].push(log[i])
    }

    return days
  },

  analytics: {

    entryCount: function(a) {
      return a.length
    },

    hoursLogged: function(a) {
      var l = a.length,
          h = 0.00,
          i

      for (i = 0; i < l; i++) {
        h += Dash.duration(a[i].s, a[i].e)
      }

      return h.toFixed(2)
    },

    display: function() {
      var today = Dash.groupByDay()

      var d = new Date(),
          y = d.getFullYear(),
          m = d.getMonth() + 1,
          d = d.getDate()

      if (m <= 9) m = "0" + m
      if (d <= 9) d = "0" + d

      var thisday = today[parseInt(y + m + d)]

      document.getElementById("entryCountToday").innerHTML = Dash.analytics.entryCount(thisday)

      document.getElementById("hoursLoggedToday").innerHTML = Dash.analytics.hoursLogged(thisday)

      console.log(thisday)

      document.getElementById("entryCount").innerHTML = Dash.analytics.entryCount(log)
      document.getElementById("hoursLogged").innerHTML = Dash.analytics.hoursLogged(log)
    }

  },



  list: function() {
    var tally = {},
        dl = Dash.codes.length,
        i

    for (i = 0; i < dl; i++)
      tally[Dash.codes[i]] = 0

    var l = log.length,
        e

    for (e = 0; e < l; e++) {
      var o
      for (o = 0; o < dl; o++) {
        if (log[e].c === Dash.codes[o])
          tally[Dash.codes[o]] += 1
      }
    }

    return tally
  },

  duration: function(a, b) {
    return parseFloat(((b - a) / 60).toFixed(2))
  },

  convertDate: function(n) {
    n = n.toString()

    var y = "20" + n.slice(0, 3),
        m = n.slice(3, 4),
        d = n.slice(4, 6)

    return y + m + d
  },

  convertHex: function(n) {
    return parseInt(n, 16)
  },

  openSect: function(sect) {
    var x = document.getElementsByClassName("sect"),
        i
    for (i = 0; i < x.length; i++)
      x[i].style.display = "none"

    document.getElementById(sect).style.display = "block"
  },

  init(log) {
    Dash.log = log
    Dash.analytics.display()
    Dash.displayLog()
    Dash.list()

    Dash.groupByDay()
  }
}
