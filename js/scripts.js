$(function(){

'use strict';

function marvelApiCall({ url="", name="", id="", offset="", limit=""}){

    var marvelApiUrl = 'https://gateway.marvel.com/v1/public/'+url;
    var ts = new Date().getTime();
    //var PRIV_KEY = "xxxxxxxxxxxxxxxxxxxxx";
    var API_KEY = "2b142d0763b80052595b67bb8088260f";
    var hash = CryptoJS.MD5(ts + PRIV_KEY + API_KEY).toString();

    var data = {};
        data['ts'] = ts;
        data['apikey'] = API_KEY;
        data['hash'] = hash;

        /*Dynamic data*/
        if(name != "")
            data['name'] = name;
        if(id != "")
            data['id'] = id;
        if(offset != "")
            data['offset'] = offset;
        if(limit != "")
            data['limit'] = limit;


    return $.getJSON( marvelApiUrl, data);

}

function displayCharacter(response, target){

    if(response.status == "Ok" && response.code==200 ){

        var results = response.data.results;
        var resultsLen = results.length;

        if(target =='main'){
            mainCharacterHTML(results[0]);
        }else{
            for(var i=0; i<resultsLen; i++){
                featuresCharactersHTML(results[i], i);
            }
        }

    }
}

function mainCharacterHTML(results){

    if(results.thumbnail.path) {
        var img_size = "";
        var imgPath = results.thumbnail.path + '/detail.' + results.thumbnail.extension;
        $('.mainImg').append('<img class="circleImg" src="' + imgPath + '"/>');
    }

    var output = '';
    output += '<h2>'+results.name +'</h2>';
    output += results.description;
    output += '<style>.'+results.name.replace(/\s/g,'')+'{display:none;}</style>';

    $('.mainDesc').append(output);
}

function featuresCharactersHTML(results, counter){
    var output = '';
    if(results.thumbnail.path) {
        var img_size = "";
        var imgPath = results.thumbnail.path + '/standard_xlarge.' + results.thumbnail.extension;
        output += '<div class="'+results.name.replace(/\s/g,'')+' col-sm-3" >'
            output += '<img class="circleImg" src="' + imgPath + '"/>';
            output += '<h4>'+results.name +'</h4>';
        output += '</div>'
    }
    $('.features_characters').append(output);
}

function storyHTML(response){

    //console.log(response);

    if(response.status == "Ok" && response.code==200 ){
        var results = response.data.results;
        var resultsLen = results.length;

        var output = '';

        output += '<h2>Story title: '+results[0].title+'</h2>';

        if(results[0].description)
            output += '<div>Description: '+results[0].description+'</div>';

        output += '<div class="attributionText"><i>'+response.attributionText+'</i></div>';

        $('.storyDesc').append(output);
    }
}


/**
 * getRandomStoryByCharacterId function will fetch story by story_ID
 */
 function getRandomStoryByCharacterId(c_id, random_story_offset){

    marvelApiCall({url:"characters/"+c_id+"/stories", offset:random_story_offset, limit:1})
    .done(function( response ) {
        storyHTML(response);
        getCharactersByStoryId(response.data.results[0].id);
    }) //done
    .fail(function(err){
        console.log(err);
    }); //fail

}

/**
 * getCharacterAndStoryByName function will fectch characters by of their name
 */
function getCharacterAndStoryByName(p_name){

    marvelApiCall({url:"characters", name:p_name, id:""})
    .done(function( response ) {
        $('#overlay').fadeOut();
        displayCharacter(response, 'main');
        var random_story_offset = getRandomNumber(1, response.data.results[0].stories.available);
        getRandomStoryByCharacterId(response.data.results[0].id, random_story_offset);

    }) //done
    .fail(function(err){
        console.log(err);
    }); //fail
}

/**
 * getCharactersByStoryId function will fetch story by story_ID
 */
 function getCharactersByStoryId(s_id){

    marvelApiCall({url:"stories/"+s_id+"/characters"})
    .done(function(response) {
        displayCharacter(response, 'features');
    }) //done
    .fail(function(err){
        console.log(err);
    }); //fail

}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1))/2 + min;
}

getCharacterAndStoryByName("Iron Man");

}); //end $ function
