// var pth = "contents" + "/";
// var url = "sing.html";
// var url1 = "video.html";
// var url2 = "slide.html";
// $(document).ready(function () {
//   var m = getUrlVars()["m"];
//   pth = pth + m + "/";
//   function getUrlVars() {
//     var vars = {};
//     var parts = window.location.href.replace(
//       /[?&]+([^=&]+)=([^&]*)/gi,
//       function (m, key, value) {
//         vars[key] = value;
//       }
//     );
//     return vars;
//   }
//   $.getJSON(pth + "settings/settings.json", function (json) {
//     // console.log(json);
//     $("#appName").html(json.appName);
//     $("#slogan").html(json.slogan);
//     if (json.logo !== "") {
//       $("#footer img").attr("src", pth + json.logo);
//     }
//     if (json.graphic !== "") {
//       $("#graphic").css(
//         "background-image",
//         'url("' + (pth + json.graphic).replace(/\\/g, "/") + '")'
//       );
//     } else if (json.video !== "") {
//       $("#video").attr("src", pth + json.video);
//     }

//     $.getJSON(pth + json.songList, function (data) {
//       setTimeout(() => {
//         $("#loading").hide();
//       }, 500);
//       $("#list").html("");
//       data.forEach((element) => {
//         if (element.type === "lyrics") {
//           $("#list").append(
//             '<a href="' +
//               url +
//               "?m=" +
//               m +
//               "&song=" +
//               element.url +
//               '"><h2> ' +
//               element.name +
//               "</h2></a><br>"
//           );
//         } else if (element.type === "video") {
//           $("#list").append(
//             '<a href="' +
//               url1 +
//               "?m=" +
//               m +
//               "&song=" +
//               element.url +
//               '"><h2> ' +
//               element.name +
//               "</h2></a><br>"
//           );
//         } else if (element.type === "slides") {
//           $("#list").append(
//             '<a href="' +
//               url2 +
//               "?m=" +
//               m +
//               "&presentation=" +
//               element.url +
//               '"><h2> ' +
//               element.name +
//               "</h2></a><br>"
//           );
//         } else if (element.type === "page") {
//           $("#list").append(
//             '<a href="' +
//               "page.html" +
//               "?m=" +
//               m +
//               "&iframe=" +
//               encodeURIComponent(pth + element.url) +
//               '"><h2> ' +
//               element.name +
//               "</h2></a><br>"
//           );
//         }
//       });

//       $("#list a").click((e) => {
//         e.preventDefault();
//         document.getElementById("click").play();
//         setTimeout(() => {
//           window.location.href = e.currentTarget.href;
//         }, 200);
//       });
//     });
//   });
// });










var pth = "contents"+"/";
var url = "sing.html";
var url1 = "video.html";
var url2 = "slide.html";
$(document).ready(function() {
    var m = getUrlVars()["m"];
    pth = pth+m+"/";
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }
    
    $.getJSON( pth+"settings/settings.json", function( json ) {
        // console.log(json);
        $("#appName").html("<p>"+json.appName+"</p>");
        $("#slogan").html("<p>"+json.slogan+"</p>");
        $("#appName").css({"font-size" : json.titleSize, "text-align" : json.titleAlign, "height" : json.titleHeight, "color" : json.titleColor, "font-family" : json.titleFont });
        $("#appName p").css({"font-size" : json.titleSize, "text-align" : json.titleAlign, "color" : json.titleColor, "font-family" : json.titleFont });
        $("#slogan").css({"font-size" : json.sloganSize, "text-align" : json.sloganAlign, "height" : json.sloganHeight , "color" : json.sloganColor, "font-family" : json.titleFont  });
        $("#slogan p").css({"font-size" : json.sloganSize, "text-align" : json.sloganAlign, "color" : json.sloganColor, "font-family" : json.titleFont  });
        if(json.logo !== ""){
            $("#footer img").attr("src",pth+json.logo);
        }
        if(json.graphic !== ""){
            $("#graphic").css({'background-image':'url("'+(pth+json.graphic).replace(/\\/g, "/")+'")', "opacity": json.backgroundOpacity, "background-size" : "cover", "background-repeat" : "no-repeat", "background-position" :json.backgroundPosition, "background-color" : json.backgroundColor});
        }
        $.getJSON( pth+json.songList, function( data ) {
            setTimeout(() => {
                $("#loading").hide();
            }, 500);
            $("#list").html("");
            data.forEach(element => {
                if(element.type === "lyrics"){
                    $("#list").append('<a href="'+url+'?m='+m+'&song='+element.url+'"  style="margin-top:'+element.marginTop+';margin-bottom:'+element.marginBottom+';"><h2> '+element.name+'</h2></a><br>');
                }else if(element.type === "video"){
                    $("#list").append('<a href="'+url1+'?m='+m+'&song='+element.url+'"  style="margin-top:'+element.marginTop+';margin-bottom:'+element.marginBottom+';"><h2> '+element.name+'</h2></a><br>');
                }else if(element.type === "slides"){
                    $("#list").append('<a href="'+url2+'?m='+m+'&presentation='+element.url+'"  style="margin-top:'+element.marginTop+';margin-bottom:'+element.marginBottom+';"><h2> '+element.name+'</h2></a><br>');
                } else if (element.type == "extrenal_url") {
                    $("#list").append(
                    `<a 
                        href="${element.url}" 
                        style="margin-top:${element.marginTop};margin-bottom:${element.marginBottom};"
                    >
                        <h2>${element.name}</h2>
                    </a>
                    <br>`
                    );
                } else if (element.type === "page") {
          $("#list").append(
            '<a href="' +
              "page.html" +
              "?m=" +
              m +
              "&iframe=" +
              encodeURIComponent(pth + element.url) +
              '"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        }
            });
             $("#list").addClass(json.listAlign);
             $("#list h2").css({"font-size" : json.listSize, "text-align" : json.listAlign, "height" : json.listHeight, "color" : json.listColor, "font-family" : json.listFont });
              document.getElementById("click1").volume = 0.05;
              
             $("#list a").hover(()=>{
                 console.log(document.getElementById("click1").volume);
                document.getElementById("click1").play(); 
             })
              $("#list a").click((e) => {
                e.preventDefault();
                document.getElementById("click").play();
        		elem = document.documentElement;
        		console.log(elem)
                if (elem.requestFullscreen) {
                  elem.requestFullscreen();
                } else if (elem.msRequestFullscreen) {
                  elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                  elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                  elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
                setTimeout(() => {
                  window.location.href = e.currentTarget.href;
                }, 200);
              });
        });
    });
});


