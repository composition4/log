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
    var table = document.getElementById("logbook"),
        arr = takeRight(Dash.log, 7),
        l = arr.length,
        i

    table.className="bn"

    console.log(arr)

    for (i = 0; i < l; i++) {
      var row = table.insertRow(i + 1),
          c1 = row.insertCell(0), // date
          // c2 = row.insertCell(1), // time
          c3 = row.insertCell(1), // duration
          c4 = row.insertCell(2), // category
          c5 = row.insertCell(3), // title
          c6 = row.insertCell(4), // description

          entry = arr[i]

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
    function takeRight(array, n=1) {
      const length = array == null ? 0 : array.length
      if (!length) return []
      n = length - n
      return slice(array, n < 0 ? 0 : n, length)

      function slice(array, start, end) {
        let length = array == null ? 0 : array.length
        if (!length) return []
        start = start == null ? 0 : start
        end = end === undefined ? length : end

        if (start < 0) start = -start > length ? 0 : (length + start)
        end = end > length ? length : end
        if (end < 0) end += length
        length = start > end ? 0 : ((end - start) >>> 0)
        start >>>= 0

        let index = -1
        const result = new Array(length)
        while (++index < length) result[index] = array[index + start]
        return result
      }
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

      if (thisday !== undefined) {
        document.getElementById("entryCountToday").innerHTML = Dash.analytics.entryCount(thisday)

        document.getElementById("hoursLoggedToday").innerHTML = Dash.analytics.hoursLogged(thisday)
      }

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
    var mA = parseInt((a.toString().slice(-2)), 10),
        mB = parseInt((b.toString().slice(-2)), 10),
        hA = parseInt((a.toString().slice(0, -2)), 10),
        hB = parseInt((b.toString().slice(0, -2)), 10),

        hC = hB - hA,
        mC = parseFloat(((mB  - mA) / 60).toFixed(2))

    if (mC < 0) {
      mC = parseFloat(((mC + 60) / 60).toFixed(2))
    }

    return parseFloat(hC + mC)
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

  init() {
    Dash.log = log
    Dash.analytics.display()
    Dash.displayLog()
    Dash.list()

    Dash.groupByDay()
  }
}
