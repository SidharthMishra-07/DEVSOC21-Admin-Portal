const base = 'https://devsoc-test.herokuapp.com'

//index
function load (token) {
  const xhr1 = new XMLHttpRequest()
  xhr1.withCredentials = false
  xhr1.responseType = 'json'

  xhr1.addEventListener('readystatechange', function () {
    if (this.readyState === 4) {
      main.console.log(this.response.teams)
      const teamlist = this.response.teams
      window.localStorage.setItem('teams', JSON.stringify(teamlist))
      main.document.getElementById('count').innerHTML = teamlist.length
  let htmlString = ''
  let i
  for (i = 0; i < teamlist.length; i++) {
    let memlist = ''
    let j
    for (j = 0; j < teamlist[i].users.length; j++) {
      memlist = memlist + ' ' + teamlist[i].users[j].name
    }
    const id = teamlist[i].leader._id
    htmlString = htmlString +
      `
      <div class="summary">

      <div class="text">
          <h1 class="team">Team ${teamlist[i].name}</h1>
          <h1 class="members"> Members - ${teamlist[i].users.length} </h1>
          <h1 class="submitted"> ${teamlist[i].submission.status}</h1>
      </div>
      <p class="names">${memlist}</p>
      <div class="lrow">
      <div class="lrow1">
      <select name="qualifiedstatus" class="dropdown">
          <option>Shortlisted For DEVSOC'21</option>
          <option>Not Shortlisted For DEVSOC'21</option>
          <option>Shortlisted For Round 2</option>
          <option>Not Shortlisted For Round 2</option>
          <option>Selected For Final Round</option>
      </select>

      <!--<button type="submit" class="zip">
          <img src="zip.png" alt="Save icon" />
      </button>-->
      </div>
      <a class="submit1" onclick="myfunction('${teamlist[i]._id}')">Submission details > </a>
      </div>
  </div>
      `
  }
  main.document.getElementsByClassName('cont')[0].innerHTML = htmlString
      
    }
  })

  xhr1.open('GET', 'https://devsoc-test.herokuapp.com/admin/all')
  xhr1.setRequestHeader('Authorization', 'Bearer ' + token)

  xhr1.send()
}

function display (teamlist) {
  document.getElementById('count').innerHTML = teamlist.length
  let htmlString = ''
  let i
  for (i = 0; i < teamlist.length; i++) {
    let memlist = ''
    let j
    for (j = 0; j < teamlist[i].users.length; j++) {
      memlist = memlist + ' ' + teamlist[i].users[j].name
    }
    const id = teamlist[i].leader._id
    htmlString = htmlString +
      `
      <div class="summary">

      <div class="text">
          <h1 class="team">Team ${teamlist[i].name}</h1>
          <h1 class="members"> Members - ${teamlist[i].users.length} </h1>
          <h1 class="submitted"> ${teamlist[i].submission.status}</h1>
      </div>
      <p class="names">${memlist}</p>
      <div class="lrow">
      <div class="lrow1">
      <select name="qualifiedstatus" class="dropdown">
          <option>Shortlisted For DEVSOC'21</option>
          <option>Not Shortlisted For DEVSOC'21</option>
          <option>Shortlisted For Round 2</option>
          <option>Not Shortlisted For Round 2</option>
          <option>Selected For Final Round</option>
      </select>

      <!--<button type="submit" class="zip">
          <img src="zip.png" alt="Save icon" />
      </button>-->
      </div>
      <a class="submit1" onclick="myfunction('${teamlist[i]._id}')">Submission details > </a>
      </div>
  </div>
      `
  }
  document.getElementsByClassName('cont')[0].innerHTML = htmlString
}
//index
const searchBar = document.getElementById('search')
searchBar.addEventListener('keyup', (e) => {
  document.getElementById('filterteams').selectedIndex=0
  const teamnames = JSON.parse(window.localStorage.getItem('teams'))
  const searchString = e.target.value.toLowerCase()

  const filteredCharacters = teamnames.filter((character) => {
    return (
      character.name.toLowerCase().includes(searchString)
    )
  })
  if (filteredCharacters.length === 0) {
    document.getElementsByClassName('cont')[0].innerHTML = 'No Results Found'
  } else {
    document.getElementsByClassName('cont')[0].innerHTML = ''
    display(filteredCharacters)
  }
})
//team_details
function myfunction (a) {
  const jwttoken = window.localStorage.getItem('jwttoken')
  const xhr = new XMLHttpRequest()
  xhr.withCredentials = false
  xhr.responseType = 'json'

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === 4) {
      console.log(this.response.team)
      window.localStorage.setItem('teaminfo', JSON.stringify(this.response.team))
      const newWindow = window.open('team_details.html')
      const teaminfo = JSON.parse(window.localStorage.getItem('teaminfo'))
      newWindow.onload = function () {
        newWindow.console.log(teaminfo)
        newWindow.document.getElementById('team').innerHTML = 'Team ' + teaminfo.name
        let i
        let memname = ''
        for (i = 0; i < teaminfo.users.length; i++) {
          memname += teaminfo.users[i].name + ' '
        }
        newWindow.document.getElementById('names').innerHTML = memname
        newWindow.document.getElementById('submitted').innerHTML = '| ' + teaminfo.submission.status
        newWindow.document.getElementById('members').innerHTML = '| Members- ' + teaminfo.users.length
        if (teaminfo.submission.status != 'Not Submitted') {
          newWindow.document.getElementById('name').value = teaminfo.submission.name
          newWindow.document.getElementById('msg').value = teaminfo.submission.videolink
          newWindow.document.getElementById('repolink').value = teaminfo.submission.githubLink
          newWindow.document.getElementById('projdesc').innerHTML = marked(teaminfo.submission.description)
        }
      }
    }
  })

  xhr.open('GET', 'https://devsoc-test.herokuapp.com/admin/team/' + a.toString())
  xhr.setRequestHeader('Authorization', 'Bearer ' + jwttoken)
  xhr.send()
}
//index
const a = document.getElementById('filterteams')

a.addEventListener('click', function () {
  const teamnames = JSON.parse(window.localStorage.getItem('teams'))
  const optiontext = a.options[a.selectedIndex].text
  const filteredCharacters = teamnames.filter((character) => {
    return (
      character.submission.status == optiontext
    )
  })
  if (filteredCharacters.length === 0 && optiontext != 'All') {
    document.getElementsByClassName('cont')[0].innerHTML = 'No Results Found'
  } else if (filteredCharacters.length === 0 && optiontext == 'All') {
    display(teamnames)
  } else {
    document.getElementsByClassName('cont')[0].innerHTML = ''
    display(filteredCharacters)
  }
})
