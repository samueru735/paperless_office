Router.configure({
  layoutTemplate : 'layout',
  loadingTemplate : 'loading',
  notFoundTemplate: 'notFound'


});

Router.route("/", {
  name : "homeIndex",
  data : function () {
    return {message : "Welcome to home page."}
  }
});

Router.route("/about", {
  name : "homeAbout"
});

Router.route("/contact", {
  name : "homeContact"
});

Router.route("/login", {
  name : "homeLogin"
});

Router.route("/register", {
  name : "homeRegister"
});
