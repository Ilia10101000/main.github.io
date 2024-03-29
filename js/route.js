"use strict";

function Route(name, htmlName, defaultRoute) {
  try {
    if (!name || !htmlName) {
      throw "error: name and htmlName params are mandatories";
    }
    this.constructor(name, htmlName, defaultRoute);
  } catch (e) {
    console.error(e);
  }
}

Route.prototype = {
  name: undefined,
  htmlName: undefined,
  default: undefined,
  constructor: function (name, htmlName, defaultRoute) {
    this.name = name;
    this.htmlName = htmlName;
    this.default = defaultRoute;
  },
  isActiveRoute: function (hashedPath) {
    return hashedPath.replace("#", "") === this.name;
  },
};

/* --------- */

function Router(routes) {
  try {
    if (!routes) {
      throw "error: routes param is mandatory";
    }
    this.constructor(routes);
    this.init();
  } catch (e) {
    console.error(e);
  }
}

Router.prototype = {
  routes: undefined,
  rootElem: undefined,
  constructor: function (routes) {
    this.routes = routes;
    this.rootElem = document.querySelector(".main-container");
  },
  init: function () {
    let r = this.routes;
    (function (scope, r) {
      window.addEventListener("hashchange", function (e) {
        scope.hasChanged(scope, r);
      });
    })(this, r);
    this.hasChanged(this, r);
  },
  hasChanged: function (scope, r) {
    if (window.location.hash.length > 0) {
      for (let i = 0, length = r.length; i < length; i++) {
        let route = r[i];
        if (route.isActiveRoute(window.location.hash.substr(1))) {
          scope.goToRoute(route.htmlName);
        }
      }
    } else {
      for (let i = 0, length = r.length; i < length; i++) {
        let route = r[i];
        if (route.default) {
          scope.goToRoute(route.htmlName);
        }
      }
    }
  },
  goToRoute: function (htmlName) {
    (function (scope) {
      let url = "views/" + htmlName,
        xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          scope.rootElem.innerHTML = this.responseText;
        }
      };
      xhttp.open("GET", url, true);
      xhttp.send();
    })(this);
  },
};

/* ----- */

(function () {
  function init() {
    let router = new Router([
      new Route("home", "home.html", true),
      new Route("list", "list.html"),
      new Route("stack", "stack.html"),
    ]);
  }
  init();
})();

document.addEventListener("DOMContentLoaded", function () {
  function updateActiveClass() {
    let links = document.querySelectorAll("a");

    links.forEach(function (link) {
      if (link.getAttribute("href") === window.location.hash) {
        link.classList.add("active-link");
      } else {
        link.classList.remove("active-link");
      }
    });
  }
  updateActiveClass();

  window.addEventListener("hashchange", function () {
    updateActiveClass();
  });
});

const toogleButton = document.querySelector(".toogleThemeButton");

const setTheme = (themeName) => {
  localStorage.setItem("theme", themeName);
  document.documentElement.className = themeName;
};

const toogleTheme = () => {
  if (
    localStorage.getItem("theme") &&
    localStorage.getItem("theme") === "theme-light"
  ) {
    setTheme("theme-dark");
  } else {
    setTheme("theme-light");
  }
};
(function () {
  if (localStorage.getItem("theme")) {
    setTheme(localStorage.getItem("theme"));
  } else {
    setTheme("theme-light");
  }
})();

toogleButton.addEventListener("click", toogleTheme);