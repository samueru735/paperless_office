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

Router.route('/blah', {
  name: 'blah'  
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

Router.route("/detail", {
  name : "docShow",  

  data: function(){  
  	var image = Images.findOne({
  		'_id':this.params.query.id});
  	  console.log("image: " + image.name);
  	var currentImage = this.params.query.id;
  	return {
  		image:image	
  	}  		  	
  		  
  }
});
