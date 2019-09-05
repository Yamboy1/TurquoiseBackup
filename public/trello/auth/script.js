const qs = (function(a) {
  if (a == "") return {};

  var b = {};

  for (var i = 0; i < a.length; ++i) {

    var p=a[i].split('=', 2);

    if (p.length == 1)

      b[p[0]] = "";

    else

      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));

  }

  return b;

})(window.location.search.substr(1).split('&'))

history.pushState(null, "", location.href.split("?")[0])


if(qs.t && qs.tk) {

  localStorage.setItem('token', qs.t)

  localStorage.setItem('ticket', qs.tk)

}


let token = qs.t || localStorage.token || '';

let ticket = qs.tk || localStorage.ticket || '';

if(!token || !ticket) window.location.href = `http://74.208.18.206:81/connect/trello#${window.location.href.replace(/((#|\?).+)/g, '')}`

if(!localStorage.token) localStorage.token = token

if(!localStorage.ticket) localStorage.ticket = ticket


window.discordRequest = async e => {

  try {

    let r = await fetch(`https://discordapp.com/api/users/${e}`, { headers: {

      'authorization': `Bearer ${token}`

    }})

    let json = await r.json()

    return json

  } catch (e) {

    localStorage.removeItem('token')

    localStorage.removeItem('ticket')

    window.location.href = `http://74.208.18.206:81/connect/trello#${window.location.href.replace(/((#|\?).+)/g, '')}`

  }

}


window.logout = () => {

  localStorage.removeItem('token')

  localStorage.removeItem('ticket')

  window.location.href = `https://74.208.18.206:81/connect/trello#${window.location.href.replace(/((#|\?).+)/g, '')}`

}


window.onload = () => {

  console.log('loaded')

  Trello.authorize({

    persist: false,

    scope: {

      read: true,

      write: true,

      account: true

    },

    expiration: 'never',

    success: async () => {

      console.log('yay we got things done!')
      console.log(Trello.token());
      try{

        let res = await Snekfetch.get(`http://74.208.18.206:81/trello/post/${Trello.token()}`).set('Authorization', localStorage.ticket)

        console.log(res)

        document.querySelector('h1').innerText = "Hell yeah! It's done!"

      } catch (e) {

        if(e.statusCode === 401) return window.logout();

        console.log({e})

        document.querySelector('h1').innerText = "Oh no! Check console!"

      }

    },

    error: console.log,

    name: 'Trello Discord Bot'

  })

}

