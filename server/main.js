import { Meteor } from 'meteor/meteor';
import { request } from 'meteor/froatsnook:request';
Meteor.startup(() => {
  // code to run on server at startup
  var connectHandler = WebApp.connectHandlers;

});

SearchSource.defineSource('Images', function(searchText, options) {
  console.log("options:"+typeof options);
  console.log("searchtext:"+typeof searchText);
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    console.log(searchText);
    var res = searchText.split(" ");
    var hash = []; //the label searches with '#'
    var search = searchText; //string to be searched overall without label keys '#'
    for (i=0;i<res.length;i++){
    	if(res[i].charAt(0) === "#"){
        	  //hash += " " + res[i].replace("#","").trim();
        	  hash.push(res[i].replace("#","").trim());
            console.log("hash:",hash);
            var rip = search;
            search = rip.replace(res[i],"");
        }
    }

    var regExp = buildRegExp(search);
    var ida = Meteor.userId();
    var id = this.userId;
    var selectorHead = {};

    //var selectorHead = (hash === "")? "{'userId': id},{'meta.labels': hash}" :

    if(hash.length > 0){
      selectorHead = {'meta.labels':{$all:hash}};
      console.log("hashed??");
      console.log("selectorHead:", selectorHead);
    }
    // else{
    //   //var hashregExp = buildRegExp(hash);
    //   //selectorHead = {'userId': id},{'meta.labels': hashregExp};
    //   //selectorHead = "{userId:" + id + "},{meta.labels:" + hash + "}";
    //   selectorHead = {'userId': id};
    //   console.log("hashed??");
    //   console.log("selectorHead:", selectorHead);
    // }
    // //{$and :[{'meta.labels': 'hash'},{$or: [ {'name': regExp},{'meta.text': regExp}]}]}
    var selector = {$and :[{'userId': id},
                          selectorHead,
                          {$or: [ {'name': regExp},{'meta.text': regExp}]}
                  ]};
    console.log("selector:", selector);
  //  selector.push({'userId':Meteor.userId()});
    console.log("fetch" + Images.find(selector, options).fetch());
    console.log("my userid" + Meteor.userId());
    return Images.find(selector, options).fetch();
  } else {
    return Images.find({'userId': 'balabla'}, options).fetch();
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
