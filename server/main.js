import { Meteor } from 'meteor/meteor';
import { request } from 'meteor/froatsnook:request';
Meteor.startup(() => {
  // code to run on server at startup
  var connectHandler = WebApp.connectHandlers;

});

SearchSource.defineSource('Images', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var ida = Meteor.userId();
    var id = this.userId;
    var selector = {$and :[
                    {'userId': id},
                    {$or: [ {'name': regExp},{'meta.labels': regExp},{'meta.text': regExp}]}
                  ]};
  //  selector.push({'userId':Meteor.userId()});
    return Images.find(selector, options).fetch();
    console.log("fetch" + Images.find({"userId": Meteor.userId()}, options).fetch());
    console.log("my userid" + Meteor.userId());
  } else {
    //return Images.find({'userId': Meteor.userId()}, options).fetch();
  }

});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}
