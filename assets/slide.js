var slides = {};
var path = "contents" + "/";
var presentation;
var slides1;
var current = 0;
var pathh;
var autoplay;
var duration = 0;
var isLast = false;
let ispaused = true;
let playing = false;
let myVar = "";
let ptth = "";
$(document).ready(function () {
  m = getUrlVars()["m"];
  path = path + m + "/";
  $("#modal").hide();
  presentation = getUrlVars()["presentation"] + "/";
  pathh = path + "songlist/" + presentation; //+ "/";

  $.getJSON(path + "songlist/" + presentation + "slides.json", function (json) {
    slides = json;
    preloadResources(slides);
    // load();
  });
  // setTimeout(() => {
  //   $("#loading").hide();
  // }, 500);
  // $("#page").show();
});

function preloadResources(slides) {
  let resources = [];
  let resources1 = [];
  slides.data.slides.forEach((element) => {
    if (element.content.substring(0, 4) == "http") {
      if (element.voiceover !== "") {
        resources.push({
          uri: element.voiceover,
          type: "audio",
        });
      }
      switch (element.type) {
        case "image":
          resources.push({
            uri: element.content,
            type: "img",
          });
          break;
        case "video":
          resources.push({
            uri: element.content,
            type: "video",
          });
          break;

        default:
          break;
      }
    }
    if (element.content.substring(0, 4) !== "http") {
      if (element.voiceover !== "") {
        resources.push({
          uri: path + "songlist/" + presentation + element.voiceover,
          type: "audio",
        });
      }
      switch (element.type) {
        case "image":
          resources.push({
            uri: path + "songlist/" + presentation + element.content,
            type: "img",
          });
          break;
        case "video":
          resources.push({
            uri: path + "songlist/" + presentation + element.content,
            type: "video",
          });
          break;

        default:
          break;
      }
    }
  });
  startloadResources(resources).then((result) => {
    let loaded = 0;
    let assets = document.querySelectorAll(".preload").length;
    $(".preload")
      .on("load", function () {
        loaded += 1;
        console.log(loaded + "/" + assets);
        $("#prog").html(Math.floor((loaded / assets) * 100));
        if (loaded == assets) runScript();
      })
      .on("loadeddata", function () {
        loaded += 1;
        console.log(loaded + "/" + assets);
        $("#prog").html(Math.floor((loaded / assets) * 100));
        if (loaded == assets) runScript();
      })
      .on("error", function () {
        console.log("error loading image");
        loaded += 1;
        console.log(loaded + "/" + assets);
        $("#prog").html(Math.floor((loaded / assets) * 100));
        if (loaded == assets) runScript();
      });
  });
}
function runScript() {
  load();
  $("#loading").hide();
  $("#page").show();
}
async function startloadResources(resources) {
  let preloaded = document.querySelector("#preloaded");
  resources.forEach((t) => {
    if ("img" === t.type) {
      var i = document.createElement("img");
      i.decoding && (i.decoding = "async");
      i.className = "preload";
      i.src = t.uri;
      preloaded.appendChild(i);
    } else if ("video" === t.type) {
      var i = document.createElement("video");
      i.src = t.uri;
      i.className = "preload";
      preloaded.appendChild(i);
    } else if ("audio" === t.type) {
      var i = document.createElement("audio");
      i.src = t.uri;
      i.className = "preload";
      preloaded.appendChild(i);
    }
  });
  return resources;
}
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}
function back() {
  window.location.href = "index.html?m=" + m;
}

// function pdfBtn() {
//   pauseplay();
//   console.log(slides["data"]["pdf"]);
//   // window.open(slides["data"]["pdf"], "_blank", "nodeIntegration=yes");
// }
// function videoBtn() {
//   pauseplay();
//   window.open(
//     "videoDemo.html?video=" + pathh + slides["data"]["video"],
//     "_blank",
//     "nodeIntegration=yes"
//   );
// }
function videoBtn() {
  //   console.log("a");

  // if(lyrics["data"]["vsource"] == "online"){
  //     $("#modal iframe").attr('src', lyrics["data"]["video"]);
  //     $("#modal video").hide();
  // }else{
  $("#modal iframe").hide();
  $("#modal video").attr("src", pathh + slides["data"]["video"]);
  $("#modal").show();
  document.getElementById("lc").play();
  // }
}
function close() {
  $("#modal").hide();
  $("#modal video").attr("src", "");
  $("#modal iframe").attr("src", "");
  // var vid = document.getElementById("lc");
  // vid.pause();
}

function load() {
  slides1 = slides.data.slides;
  playing = slides.data.autoplay;
  if (playing == true) {
    $("#ps").show();
    $("#pl").hide();
  } else {
    $("#ps").hide();
    $("#pl").show();
  }
  changeSlide();
  var v1 = document.getElementById("voiceover");
  $("#volume").val(v1.volume * 100);
  $("#uv").hide();
}

function changeSlide() {
  let slide = slides1[current];
  let type = slide.type;
  let content;
  pxc = slide.duration;
  px = pxc.split(":");
  p = 0;
  if (parseInt(px[0]) >= 1) {
    p = p + parseInt(px[0]) * 60;
    p = p + parseFloat(px[1]);
  } else {
    p = p + parseFloat(px[1]);
  }
  curretduration = p;
  $("#duration").html(pxc);
  voiceDuration = p;

  if (slides.data.pdf === "") {
    $("#pd").prop("disabled", true);
    $("#pd").css({ opacity: 0.5 });
  } else {
    $("#pd").prop("disabled", false);
    $("#pd").css({ opacity: 1 });
  }

  if (slides.data.video === "") {
    $("#vd").hide();
  } else {
    $("#vd").show();
  }

  if (current === 0) {
    $("#gp").prop("disabled", true);
    $("#gp").css({ opacity: 0.5 });
  } else {
    $("#gp").prop("disabled", false);
    $("#gp").css({ opacity: 1 });
  }
  if (slides1.length <= current + 1) {
    $("#gn").prop("disabled", true);
    $("#pl").prop("disabled", true);
    $("#ps").prop("disabled", true);
    $("#gn").css({ opacity: 0.5 });
    $("#pl").css({ opacity: 0.5 });
    $("#ps").css({ opacity: 0.5 });
  } else {
    $("#gn").prop("disabled", false);
    $("#pl").prop("disabled", false);
    $("#ps").prop("disabled", false);
    $("#gn").css({ opacity: 1 });
    $("#pl").css({ opacity: 1 });
    $("#ps").css({ opacity: 1 });
  }

  if (pxc === "") {
    $("#seeker").prop("disabled", true);
    $("#pl").prop("disabled", true);
    $("#ps").prop("disabled", true);
    $("#seeker").css({ opacity: 0 });
    $("#pl").css({ opacity: 0.5 });
    $("#ps").css({ opacity: 0.5 });
  } else {
    $("#seeker").prop("disabled", false);
    $("#pl").prop("disabled", false);
    $("#ps").prop("disabled", false);
    $("#seeker").css({ opacity: 1 });
    $("#pl").css({ opacity: 1 });
    $("#ps").css({ opacity: 1 });
  }
  if (voiceDuration <= 20 || pxc === "") {
    $("#seeker").prop("disabled", true);
    $("#seeker").css({ opacity: 0 });
  } else {
    $("#seeker").prop("disabled", false);
    $("#seeker").css({ opacity: 1 });
  }
  currentime = 0;
  if (slide.content.substring(0, 4) !== "http") {
    ptth = "/reverse/" + pathh;
    // ptth = "/" + pathh;
  }
  let transition = "w3-animate-right";
  if (slide.entryTransition !== "") {
    transition = slide.entryTransition;
  }
  $(".youtube-info").hide();
  if (type === "youtube") {
    content = `<div  class="${transition}"><iframe id="yt" style="width:100%;height:100%" src="${slide.content}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    $(".youtube-info").show().delay(3000).fadeOut();
  } else if (type === "video") {
    content = `<div  class="${transition}"><video id="vid" disablePictureInPicture ><source src="${ptth}${slide.content}" type="video/mp4"></video></div>`;
  } else if (type === "image") {
    content = `<div id="img" style="background:url('${ptth}${slide.content}');background-size:contain;background-position:center center;background-repeat:no-repeat"  class="${transition}"/></div>`;
  } else if (type === "text") {
    content = `<div id="text"  class="${transition}">${slide.content}</div>`;
  } else {
    content = `<div id="html"  class="${transition}">${slide.content}</div>`;
  }
  $("#content").html(content);
  if (slide["background-color"] === "") {
    $("#content").css("background", "#FFFFFF");
  } else {
    $("#content").css("background", slide["background-color"]);
  }
  if (slide.voiceover !== "") {
    $("#voiceover").attr("src", ptth + slide.voiceover);
  } else {
    $("#voiceover").attr("src", "");
  }
  // if (slides1.length <= current + 1) {
  //   playing = false;
  // }
  // console.log(playing);
  if (playing === true) {
    ispaused = false;
    $("#ps").show();
    $("#pl").hide();
    resumeCounter();
    if (slide.voiceover !== "") {
      setTimeout(() => {
        if ($("#voiceover").attr("src") !== "") {
          document.getElementById("voiceover").play();
        }
        if ($("#vid").length > 0) {
          document.getElementById("vid").play();
        }
      }, 1000);
    }
  } else {
    $("#ps").hide();
    $("#pl").show();
  }
}
function runCounter() {
  if (playing === true && curretduration >= currentime) {
    if ($("#vid").length > 0) {
      document.getElementById("vid").play();
    }
    myVar = setTimeout(() => {
      currentime = currentime + 0.1;
      // console.log(currentime)
      var cu = currentime;
      var c = "";
      if (cu / 60 >= 1) {
        cf = parseInt(cu / 60) + ":";
        if (cf >= 10) {
          c += cf;
        } else {
          c += "0" + cf;
        }
        var cc = (cu - parseInt(cu / 60) * 60).toFixed(0);
        if (cc >= 10) {
          c += cc;
        } else {
          c += "0" + cc;
        }
      } else {
        c += "00:";
        var cc = (cu - parseInt(cu / 60) * 60).toFixed(0);
        if (cc >= 10) {
          c += cc;
        } else {
          c += "0" + cc;
        }
      }
      $("#myRange").val((cu / voiceDuration) * 1000);
      $("#time").html(c);
      runCounter();
    }, 100);
  }
  if (playing === true && curretduration <= currentime) {
    setTimeout(() => {
      next();
    }, 100);
  }
}
function resumeCounter() {
  playing = true;
  runCounter();
}
function pauseCounter() {
  playing = false;
  clearInterval(myVar);
}

$("#myRange").on("input", () => {
  currentime = ($("#myRange").val() / 1000) * voiceDuration;
  document.getElementById("voiceover").currentTime =
    ($("#myRange").val() / 1000) * voiceDuration;
  document.getElementById("vid").currentTime =
    ($("#myRange").val() / 1000) * voiceDuration;
});
function next() {
  if (myVar == "") {
    runCounter();
  }
  if (current < slides1.length - 1) {
    pauseCounter();
    current += 1;
    playing = true;
    changeSlide();

    $("#bottombar").addClass("onplay");
  }
}
function prev() {
  if (current > 0) {
    pauseCounter();
    playing = true;
    current -= 1;
    changeSlide();
    if (slides1[current].exitTransition == "") {
      $("#content div").removeClass(slides1[current].entryTransition);
      $("#content>div").addClass(slides1[current].exitTransition);
    } else {
      $("#content div").removeClass("w3-animate-right	");
      $("#content>div").addClass("w3-animate-left	");
    }

    $("#bottombar").addClass("onplay");
  }
}
$("#volume").on("input", function () {
  var v = $("#volume").val();
  var v1 = document.getElementById("voiceover");
  v1.volume = v / 100;

  var v2 = document.getElementById("vid");
  v2.volume = v / 100;
});
function pdfBtn() {
  //   const { BrowserWindow } = require("electron").remote;
  //   const PDFWindow = require("gr-pdf-window");
  //   const win = new BrowserWindow({ width: 800, height: 600 });
  //   PDFWindow.addSupport(win);
  //   win.loadURL(app.app.getAppPath() + "/" + pathh + slides["data"]["pdf"]);
  let p = "";
  if (slides["data"]["pdf"].substring(0, 4) !== "http") {
    p = "/reverse/" + pathh;
    // p = ptth;
  }

  window.open(
    p + slides["data"]["pdf"],
    "_blank",
    "height=570,width=520,scrollbars=yes"
  );
}

function resumeplay() {
  ispaused = false;
  if (slides1.length <= current + 1) {
    playing = false;
    $("#ps").hide();
    $("#pl").show();
  } else {
    playing = true;
    $("#ps").show();
    $("#pl").hide();
    $("#bottombar").addClass("onplay");
  }
  resumeCounter();

  if ($("#voiceover").attr("src") !== "") {
    document.getElementById("voiceover").play();
  }
  if ($("#vid").length > 0) {
    document.getElementById("vid").play();
  }
}
function toggleFullScreen() {
  if (
    (document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen)
  ) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
function pauseplay() {
  playing = false;
  ispaused = true;
  $("#ps").hide();
  $("#pl").show();
  pauseCounter();

  if ($("#voiceover").attr("src") !== "") {
    document.getElementById("voiceover").pause();
  }
  if ($("#vid").length > 0) {
    document.getElementById("vid").pause();
  }
  $("#bottombar").removeClass("onplay");
}

$(window).keypress(function (e) {
  if (e.which == 32) {
    if (ispaused == true) resumeplay();
    else pauseplay();
  }
});
$(document).keydown(function (e) {
  if (e.keyCode == 37) {
    prev();
  }
  if (e.keyCode == 39) {
    next();
  }
});
