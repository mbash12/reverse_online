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
    slides = json.data;

    $("body").css({ "font-family": json.font });
    preloadResources(slides);
    load();
  });
});

function preloadResources(slides) {
  startloadResources(slides).then((s) => {
    // runScript();
    let loaded = 0;
    let assets = document.querySelectorAll(".slid");
    let vo = document.querySelectorAll(".vo");

    // console.log($(".slid"));
    let res = [];
    assets.forEach((e) => {
      let x = e.querySelector("video") != null;
      let y = e.querySelector("img") != null;
      if (x) {
        res.push(e.querySelector("video"));
      }
      if (y) {
        res.push(e.querySelector("img"));
      }
    });
    vo.forEach((e) => {
      res.push(e);
    });
    res.forEach((e) => {
      e.load();
      if (e.tagName == "VIDEO") {
        e.addEventListener("canplaythrough", () => {
          loaded += 1;
          $("#prog").html(Math.floor((loaded / res.length) * 100));
          if (loaded == res.length) runScript();
        });
      }
      // if (e.tagName == "IMG") {
      //   e.addEventListener("load", () => {
      //     loaded += 1;
      //     $("#prog").html(Math.floor((loaded / res.length) * 100));
      //     if (loaded == res.length) runScript();
      //   });
      // }
      if (e.tagName == "AUDIO") {
        e.addEventListener("canplaythrough", () => {
          loaded += 1;
          $("#prog").html(Math.floor((loaded / res.length) * 100));
          if (loaded == res.length) runScript();
        });
      }
      e.addEventListener("error", () => {
        loaded += 1;
        $("#prog").html(Math.floor((loaded / res.length) * 100));
        if (loaded == res.length) runScript();
      });
    });
  });
}
async function insight() {
  await document.querySelectorAll("video").forEach((e) => {
    e.muted = true;
    e.play();
    e.addEventListener("play", function stopp() {
      setTimeout(() => {
        e.pause();
        e.currentTime = 0;
        e.muted = false;
        e.removeEventListener("play", stopp);
      }, 2000);
    });
  });
  await document.querySelectorAll("audio").forEach((e) => {
    e.muted = true;
    e.play();
    e.addEventListener("play", function stopp() {
      setTimeout(() => {
        e.pause();
        e.currentTime = 0;
        e.muted = false;
        e.removeEventListener("play", stopp);
      }, 2000);
    });
  });
  return;
}
async function runScript() {
  // await insight();
  // setTimeout(() => {
  load();
  $("#loading").hide();
  $("#page").show();
  // }, 2000);
}
async function startloadResources(slides) {
  let ctn = "";
  slides.slides.forEach((e, i) => {
    let type = e.type;
    let transition = e.entryTransition;
    let content = e.content;
    if (content.substring(0, 4) !== "http") {
      ptth = "/reverse/" + pathh;
      // ptth = "/" + pathh;
    }
    if (type === "youtube") {
      content = `<div class="slid slide${i} ${transition}"><iframe style="width:100%;height:100%" src="${content}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    } else if (type === "video") {
      content = `<div class="slid slide${i} ${transition}"><video disablePictureInPicture preload="auto"><source src="${ptth}${content}" type="video/mp4"></video></div>`;
    } else if (type === "image") {
      content = `<div style="background:url('${ptth}${content}');background-size:contain;background-position:center center;background-repeat:no-repeat"  class="slid slide${i} ${transition}"/></div>`;
    } else if (type === "text") {
      content = `<div class="slid slide${i} ${transition}">${content}</div>`;
    } else {
      content = `<div class="slid slide${i} ${transition}">${content}</div>`;
    }
    if (e.voiceover != "") {
      let vo = document.createElement("audio");
      vo.src = ptth + e.voiceover;
      vo.className = `vo vo${i}`;
      document.querySelector("#vo").append(vo);
    }
    ctn = ctn + content;
    $("#content").append(content);
  });
  return ctn;
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

function videoBtn() {
  $("#modal iframe").hide();
  $("#modal video").attr("src", pathh + slides["video"]);
  $("#modal").show();
  document.getElementById("lc").play();
}
function close() {
  $("#modal").hide();
  $("#modal video").attr("src", "");
  $("#modal iframe").attr("src", "");
}

function load() {
  slides1 = slides.slides;
  playing = slides.autoplay;
  if (playing == true) {
    $("#ps").show();
    $("#pl").hide();
  } else {
    $("#ps").hide();
    $("#pl").show();
  }
  changeSlide();
  // var v1 = document.getElementById("voiceover");

  $("#volume").val(60);
  var v = $("#volume").val();
  var v1 = document.querySelectorAll("audio");
  v1.forEach((e) => {
    e.volume = v / 100;
  });
  var v2 = document.querySelectorAll("video");
  v2.forEach((e) => {
    e.volume = v / 100;
  });
  $("#uv").hide();
  $("#close").click(() => {
    close();
  });
}

function changeSlide() {
  // console.log(current);
  if ($(".active video").length > 0) {
    $(".active video").get(0).currentTime = 0;
  }
  if ($(".vo" + current).length > 0) {
    $(".vo" + current).get(0).currentTime = 0;
  }
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
  $(".slid").removeClass("active");
  $(".slid").hide();
  $(".slide" + current).show();
  $(".slide" + current).addClass("active");
  if (slides.pdf === "") {
    $("#pd").prop("disabled", true);
    $("#pd").css({ opacity: 0.5 });
  } else {
    $("#pd").prop("disabled", false);
    $("#pd").css({ opacity: 1 });
  }

  if (slides.video === "") {
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
  $(".youtube-nav").hide();
  $("#bottombar").show();
  if (type === "youtube") {
    $(".youtube-info").show().delay(3000).fadeOut();
    $(".youtube-nav").show();
    $("#bottombar").hide();
  }
  if (slide["background-color"] === "") {
    $("#content").css("background", "#FFFFFF");
  } else {
    $("#content").css("background", slide["background-color"]);
  }
  // if (slide.voiceover !== "") {
  //   $("#voiceover").attr("src", ptth + slide.voiceover);
  // } else {
  //   $("#voiceover").attr("src", "");
  // }

  if (playing === true) {
    ispaused = false;
    $("#ps").show();
    $("#pl").hide();
    resumeCounter();
    if (slide.voiceover !== "") {
      setTimeout(() => {
        // if ($("#voiceover").attr("src") !== "") {
        //   document.getElementById("voiceover").play();
        // }
        if ($(".vo" + current).length > 0) {
          $(".vo" + current)
            .get(0)
            .play();
        }
        if ($(".active video").length > 0) {
          $(".active video").get(0).play();
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
    if ($(".active video").length > 0) {
      $(".active video").get(0).play();
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
    pauseplay();
    current += 1;
    playing = true;
    changeSlide();

    $("#bottombar").addClass("onplay");
  }
}
function prev() {
  if (current > 0) {
    pauseplay();
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
  // var v1 = document.getElementById("voiceover");
  // v1.volume = v / 100;

  var v1 = document.querySelectorAll("audio");
  v1.forEach((e) => {
    e.volume = v / 100;
  });
  var v2 = document.querySelectorAll("video");
  v2.forEach((e) => {
    e.volume = v / 100;
  });
});
function pdfBtn() {
  let p = "";
  if (slides["pdf"].substring(0, 4) !== "http") {
    p = "/reverse/" + pathh;
    // p = ptth;
  }

  window.open(
    p + slides["pdf"],
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

  // if ($("#voiceover").attr("src") !== "") {
  //   document.getElementById("voiceover").play();
  // }
  if ($(".vo" + current).length > 0) {
    $(".vo" + current)
      .get(0)
      .play();
  }
  if ($(".active video").length > 0) {
    $(".active video").get(0).play();
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

  // if ($("#voiceover").attr("src") !== "") {
  //   document.getElementById("voiceover").pause();
  // }
  if ($(".vo" + current).length > 0) {
    $(".vo" + current)
      .get(0)
      .pause();
  }
  if ($(".active video").length > 0) {
    $(".active video").get(0).pause();
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
