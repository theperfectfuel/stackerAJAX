// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showInspiration = function(users) {
	
	// clone our result template code
	var result = $('.templates .user').clone();
	
	// Set the user name properties in result
	var userElem = result.find('.user-name a');
	userElem.attr('href', users.user.link);
	userElem.text(users.user.display_name);

	// set the reputation property in result
	var rep = result.find('.reputation');
	rep.text(users.user.reputation);

	// set the accept rate property in result
	var accept_rate = result.find('.accept-rate');
	if (!users.user.accept_rate) {
		accept_rate.text("N/A");
	} else {
		accept_rate.text(users.user.accept_rate);
	}

	// set the score property in result
	var score = result.find('.score');
	score.text(users.score);

	// set the profile image in result
	var profile_image = result.find('.profile-image');
	profile_image.html("<img src='" + users.user.profile_image + "'>");

	return result;
};


// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getInspiration = function(tag) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tag: tag,
		site: 'stackoverflow',
		//period: 'all_time'
	};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/tags/"+tag+"/top-answerers/all_time",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tag, result.items.length);
		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var users = showInspiration(item);
			$('.results').append(users);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};