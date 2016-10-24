Router.configure({
	layoutTemplate: 'layout', 
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});

Router.route("/", {
	name: "homeIndex",
	data: function(){
		return {
			message : "Paperless Office"
		}
	}
});

Router.route("/about", {
	name: "homeAbout",
});

Router.route("/contact", {
	name: "homeContact",

});

Router.route("/admin", {
	name: "homeAdmin",

});

Router.route("/login", {
  name : "homeLogin"
});

Router.route("/register", {
  name : "homeRegister"
});
