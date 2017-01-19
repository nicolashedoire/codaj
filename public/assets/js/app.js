var lang = {
	en : {
  	welcome : 'Welcome'
  } , 
  fr : {
  	welcome : 'Bonjour'
  } , 
  es : {
  	welcome : 'Hola'
  }
};

// this function is a factory
function factoryBonjour(language){
	var hello = document.getElementById('hello');
  // the closure is here
	return function(name , lastname){
  			// we get language to apply good language in the string 
        /*hello.innerHTML = lang[language].welcome + ' ' + name + ' ' + lastname;*/
      if(hello !== null){
        hello.innerHTML = lang[language].welcome + ' ' + name ;
      }
  }
}

function sayHello(language , name , lastname) {
  var bonjour = factoryBonjour(language); // build factory with fr
  bonjour(name , lastname); // call closure
};

var selectLanguage = document.getElementById('language');
selectLanguage.onchange = function(){
  sayHello(this.options[this.selectedIndex].value , 'nicolas' , 'hedoire');
}

/*sayHello('en' , 'nicolas' , 'hedoire');
*/