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

Router.route("/admin", {
	name: "homeAdmin",
});

Router.route("/search", {
	name: "homeSearch",
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



Router.route("/detail", {
  name : "docShow",

  data: function(){
  var image = Images.findOne({
      '_id':this.params.query.id});
  var remove ;
  var action = this.params.query.action;
  console.log("params: " + action);
  switch(action){
    case "remove":
      console.log("removing");
      var labelIndex = this.params.query.labelIndex;
      var newLabels = image.meta.labels;
      newLabels[labelIndex] = "";
      Images.update({'_id':this.params.query.id}, {$set:{"meta.labels":newLabels }});
      this.params.query.action = "";
      this.params.query.labelIndex = "";
      break;
    case "deleteDoc" :
        console.log("deleteDoc" + image._id);
        Images.remove({_id:image._id});
        Router.go('homeIndex');
        break;
    default:
        console.log("show image");
  };

  return {
      image:image
    }
  } /*,
    */
});
