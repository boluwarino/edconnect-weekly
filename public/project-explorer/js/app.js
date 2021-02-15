function checkCookie(key) {
  if(document.cookie.split(';')
  .some(cookie => cookie.trim().startsWith(`${key}=`))){
    let ck = document.cookie.split(';')
    .filter(cookie => cookie.trim().startsWith(`${key}=`));
    let val = ck[0].split('=')[1];
    if (val){
      return true;
    }
  }
  return false;
}

function cookieVal(key) {
  let ck = document.cookie.split(';')
  .filter(cookie => cookie.trim().startsWith(`${key}=`));
  return ck[0].split('=')[1];
}

function setNavLinks() {
  if(checkCookie('uid')){
    let anonSessionLinks = document.querySelectorAll('.anon-session-link');
    let logout = document.querySelector('#logout');
    let greeting = document.querySelector('#username');

    fetch(`/api/users/${cookieVal('uid')}`).then(response => response.json())
    .then(data => {
      greeting.textContent = `Hi, ${data.firstname}`;
      anonSessionLinks.forEach((item) => {
        item.classList.add('d-none');
      });
      logout.classList.remove('d-none');
      greeting.classList.remove('d-none');
    }).catch(e => console.log(e));
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  setNavLinks();
})

function populateSelects() {
  fetch(`/api/programs`)
  .then(response => response.json()).then(data => {
    const opts = data.map((program) => {
      let opt = document.createElement('option');
      opt.textContent = program;
      opt.value = program;
      document.querySelector('[name="program"]').appendChild(opt);
    })
  });

  fetch(`/api/graduationYears`)
  .then(response => response.json()).then(data => {
    const opts = data.map((program) => {
      let opt = document.createElement('option');
      opt.textContent = program;
      opt.value = program;
      document.querySelector('[name="graduationYear"]').appendChild(opt);
    })
  });
}

function getProjects() {
  return fetch('/api/projects')
  .then(response => { return response.json();}).catch(e => console.log(e));
}

const createProjectCard = (project) => {
  const card = document.createElement('div');
  card.className = "col-lg-3 mb-3";
  card.innerHTML = `
    <div class='min-text-line border border-muted rounded p-3 mb-3 hoverable h-100'>
      <h5 class='text-primary text-capitalize'>${project.name}</h5>
      <h6 class='text-secondary text-capitalize'>${project.authors.join(', ')}</h6>
      <p class='small'>${project.abstract}</p>
      <p class='small font-weight-bold text-primary'>${project.tags.join(', ')}</p>
    </div>`;
  card.addEventListener('click', () => {
    window.location.href = `${window.location.origin}/project-explorer/viewProject.html?id=${project.id}`
  })
  return card;
}

if (window.location.pathname.includes("/index")){
  let hoverStyle = document.createElement('style');
  hoverStyle.type = 'text/css';
  hoverStyle.innerText =  `
    .hoverable:hover, .hoverable:focus {
      cursor: pointer;
      opacity: 0.7;
      -webkit-box-shadow: -1px 0px 10px -3px;
      -moz-box-shadow: -1px 0px 10px -3px;
      box-shadow: -1px 0px 10px -3px;
    }
  `;
  document.head.appendChild(hoverStyle);

  const projectCards = document.querySelector('#projectCardContainer');
  getProjects().then(projects => {
    projects.slice(0,4).map( project => {
      let item = createProjectCard(project);
      projectCards.appendChild(item);
    });
  });
}

if (window.location.pathname.includes("/login")){
  var loginForm = document.querySelector("#loginForm");

  const handleLogin = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const credentials = {
      email: document.querySelector('[name="email"]').value,
      password: document.querySelector('[name="password"]').value
    }

    fetch(`/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(async (response) => {
      if (response.status === 200){
        let body = await response.json();
        let key = 'uid';
        let val = encodeURIComponent(body.data.id);
        document.cookie = `${key}=${val};path=/;max-age=${60*60*24*30};`;
        window.location.pathname = `/project-explorer/index.html`;
      } else {
        let prevAlerts = document.getElementsByClassName('alert alert-danger');
        let errAlert = document.createElement('div');
        errAlert.className = 'alert alert-danger';
        errAlert.textContent = "Invalid email/password";
        if(prevAlerts[0]){
          prevAlerts[0] = errAlert;
        } else {
          loginForm.prepend(errAlert);
        }
        document.querySelector('[name="password"]').value = ''
      }
    }).catch(e => console.log(e));
  }

  loginForm.addEventListener('submit', handleLogin);
}

function handleLogout() {
  document.cookie = `uid=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  window.location.pathname = `/project-explorer/index.html`;
}

document.querySelector('#logout').addEventListener('click', (event) => {
  event.preventDefault();
  handleLogout();
});

if (window.location.pathname.includes("/viewProject")){
    const params = new URLSearchParams(window.location.search);
    let projectId = params.get('id');
    let creatorId;

    fetch(`/api/projects/${projectId}`)
    .then(response => response.json()).then(data => {

      $('#project_name').text(data.name);
      $('#project_abstract').text(data.abstract);
      data.authors.forEach( author => {
        var $author = $(document.createElement('li'));
        $author.addClass('list-group-item text-capitalize');
        $author.text(author);
        $author.appendTo('#project_authors');
      })
      $('#project_tags').text(data.tags.join(' '));

      creatorId = data.createdBy;
      fetch(`/api/users/${creatorId}`).then(response => response.json()).then(creator => {
        $('#project_author').text(creator.firstname + " " + creator.lastname);
      });
    }).catch(e=>console.log(e))
}

if (window.location.pathname.includes("/createProject")){
    if(!checkCookie('uid')){
      window.location.pathname = '/project-explorer/login.html';
    }

    const createProjectForm = $('#createProjectForm');

    const handleSubmit = (event) => {
      event.preventDefault();
      event.stopPropagation();

      let authors = $('input[name=authors]').val();
      let tags = $('input[name=tags]').val();

      const project = {
        name: $('input[name=name]').val(),
        abstract: $('textarea[name=abstract]').val() || '',
        authors: (authors? authors.split(',')/*.map(x => x.trim())*/: undefined),
        tags: (tags? tags.split(',').join('').split('#').filter(x => x.trim().length).map(x => '#'+x.trim()): undefined)
      }

      fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(project)
      }).then(async (response) => {
        if (response.status === 200){
          window.location.pathname = `/project-explorer/index.html`;
        } else {
          let prevAlerts = document.getElementsByClassName('alert alert-danger');
          let errAlert = document.createElement('div');
          errAlert.className = 'alert alert-danger';
          let data = await response.json();
          data.errors.map(err => errAlert.innerHTML += err + '<br>');
          if(prevAlerts[0]){
            prevAlerts[0] = errAlert;
          } else {
            createProjectForm.prepend(errAlert);
          }
        }
      }).catch(e => console.log(e));
    }

    createProjectForm.on('submit', handleSubmit);
}

if (window.location.pathname.includes("/register")){
  populateSelects();

  var signupForm = document.querySelector("#signupForm");

  const handleSignUp = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const user = {
      firstname: document.querySelector('[name="firstName"]').value,
      lastname: document.querySelector('[name="lastName"]').value,
      email: document.querySelector('[name="email"]').value,
      password: document.querySelector('[name="password"]').value,
      matricNumber: document.querySelector('[name="matricNumber"]').value,
      program: document.querySelector('[name="program"]').value,
      graduationYear: document.querySelector('[name="graduationYear"]').value
    }

    fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(user)
    }).then(async (response) => {
      if (response.status === 200){
        let body = await response.json();
        let key = 'uid';
        let val = encodeURIComponent(body.data.id);
        document.cookie = `${key}=${val};path=/;max-age=${60*60*24*30};`;
        window.location.pathname = `/project-explorer/index.html`;
      } else {
        let prevAlerts = document.getElementsByClassName('alert alert-danger');
        let errAlert = document.createElement('div');
        errAlert.className = 'alert alert-danger';
        let data = await response.json();
        data.errors.map(err => errAlert.innerHTML += err + '<br>');
        if(prevAlerts[0]){
          prevAlerts[0] = errAlert;
        } else {
          signupForm.prepend(errAlert);
        }
      }
    }).catch(e => console.log(e));
  }

  signupForm.addEventListener('submit', handleSignUp);
}
