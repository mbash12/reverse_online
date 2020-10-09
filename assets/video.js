var path = "contents"+"/";
var song = "";
var lyrics;
var m;
$(document).ready(function() {
    
    m = getUrlVars()["m"];
    path = path+m+"/";

    song = getUrlVars()["song"]+"/";

    $.getJSON( path+"songlist/"+song+"song.json", function( json ) {
        lyrics = json;
        if(lyrics != {}){
            if(lyrics["data"]["vsource"] == "online"){
                $("#video iframe").attr('src', lyrics["data"]["video"]);
                $("#video video").hide();
            }else{
                $("#video iframe").hide();
                $("#video video").attr('src', lyrics["data"]["video"]);
            }
        }
    });
    setTimeout(() => {
        $("#loading").hide();
    }, 500);
    $("#page").show();
    
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }
});
function back(){
    window.location.href = "index.html?m="+m;
}



// var timedelay = 1;
// var _delay = setInterval(delayCheck, 500);
// $(document).on('mousemove','#video',function(e){
//     // $("span").text(event.pageX + ", " + event.pageY);
//     clearInterval(_delay);
//     $('.btn3').fadeIn();
//     timedelay = 1;
//     _delay = setInterval(delayCheck, 500);
// });

// function delayCheck() {
//     if (timedelay == 3) {
//         $('.btn3').fadeOut();
//         timedelay = 1;
//     }
//     timedelay = timedelay + 1;
// }
