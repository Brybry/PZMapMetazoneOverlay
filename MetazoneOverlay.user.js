// ==UserScript==
// @name         PZ Map Metazone Overlay
// @namespace    https://github.com/Brybry/PZMapMetazoneOverlay
// @version      0.1
// @description  Project Zomboid Map Metazone Overlay
// @author       Brybry
// @match        *://pzmap.crash-override.net/*
// @grant        none
// ==/UserScript==

(function(w) {
    
    // Inject needed scripts and load when done
    var d3Script = document.createElement('script');
    d3Script.src = "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js";
    d3Script.addEventListener('load', function() {
        console.log("d3.js loaded");
        injectAndLoadSvgOverlay(
            function() { $(w.document).ready(load); }
        );
        
    });
    w.document.getElementsByTagName('head')[0].appendChild(d3Script);

    function injectAndLoadSvgOverlay(callback)
    {
		// TODO: use an actual host for this
        var svgScript = document.createElement('script');
        svgScript.src = "//openseadragon.github.io/svg-overlay/openseadragon-svg-overlay.js";
        svgScript.addEventListener('load', function() {
            console.log("openseadragon-svg-overlay loaded");
            callback();
        });
        w.document.getElementsByTagName('head')[0].appendChild(svgScript);
    }

    // Because SVG.
    function pixelToPercent(coord) { coord.x = coord.x / viewer.viewport.contentSize.x; coord.y = coord.y / viewer.viewport.contentSize.x; return coord; }

    var viewer,
        d3,
        tileToPixel;
    //var maxTries = 20;
    
    function load() {
        viewer = w.viewer;
        d3 = w.d3;
        tileToPixel = w.tileToPixel;
        
        /*if (!viewer || !d3 || !tileToPixel || !viewer.viewport)
        {
            console.log("Status: ", (!viewer) ? "No viewer": "viewer", (!d3) ? "No d3" : "d3", (!tileToPixel) ? "No tToP" : "tToP");
            maxTries--;
            if (maxTries <= 0)
                return;
            setTimeout(load,1000);
            return;
        }*/
        
        // Load/grab d3 svg object
        var overlay = viewer.svgOverlay();
        
        // d3 setup
        var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear-closed");
        
        // create metazone d3 polygons
        for (var i = 0; i < metazones.length; i++)
        {
            var poly = [];
            poly.push(pixelToPercent(tileToPixel(metazones[i].x, metazones[i].y)));
            poly.push(pixelToPercent(tileToPixel(metazones[i].x, metazones[i].y + metazones[i].height)));
            poly.push(pixelToPercent(tileToPixel(metazones[i].x + metazones[i].width, metazones[i].y + metazones[i].height)));
            poly.push(pixelToPercent(tileToPixel(metazones[i].x + metazones[i].width, metazones[i].y)));

            var d3Poly = d3.select(overlay.node()).append("path")
            .attr("id", "metazone_"+i)
            .attr("class", "metazone")
            .attr("d", lineFunction(poly))
            .attr("stroke", "steelblue")
            .attr("stroke-width", 0.00005)
            .attr("fill", "steelblue").attr("opacity", "0.6")
            .attr("border-radius", "25px");
        }
        
        // create toggle button
        var $btnToggleMetazones = $('<button id="btnToggleMetazones">Toggle Zones</button>').hide();
        $btnToggleMetazones.click(function() { $(".metazone").toggle(); });
        
        $("#btnTogglePOI").parent().before($btnToggleMetazones);
        $btnToggleMetazones.wrap("<li></li>").show();
        
        $("svg").insertBefore($("svg").prev());
       
        // resize svg overlay on window resize
        $(w).resize(function() { overlay.resize(); });
    }
        
    // old
    // grep -ihPr "((townzone)|(trailerpark))" media\lua\server\metazones\*.lua
    // new
    // win32: find2 media/maps -name objects.lua -exec grep -ihPr "((townzone)|(trailerpark))" \"{}\" ; > newzones.txt
    // linux: find media/maps -name objects.lua -exec grep -ihPr "((townzone)|(trailerpark))" {} \; > newzones.txt
    // replace '=' with ';', replace /}$/ with /}/, and wrap in an array.
    var metazones = [
        { name : "", type : "TownZone", x : 11658, y : 8291, z : 0, width : 20, height : 26 },
        { name : "", type : "TownZone", x : 11676, y : 8286, z : 0, width : 2, height : 5 },
        { name : "", type : "TownZone", x : 11683, y : 8290, z : 0, width : 2, height : 20 },
        { name : "", type : "TownZone", x : 11685, y : 8309, z : 0, width : 4, height : 1 },
        { name : "", type : "TownZone", x : 11685, y : 8290, z : 0, width : 4, height : 1 },
        { name : "", type : "TownZone", x : 11690, y : 8270, z : 0, width : 9, height : 11 },
        { name : "", type : "TownZone", x : 11592, y : 8298, z : 0, width : 26, height : 19 },
        { name : "", type : "TownZone", x : 11592, y : 8243, z : 0, width : 29, height : 27 },
        { name : "", type : "TownZone", x : 8528, y : 8478, z : 0, width : 80, height : 80 },
        { name : "", type : "TownZone", x : 8539, y : 8588, z : 0, width : 46, height : 29 },
        { name : "", type : "TownZone", x : 8534, y : 8623, z : 0, width : 38, height : 42 },
        { name : "", type : "TownZone", x : 8400, y : 8603, z : 0, width : 46, height : 29 },
        { name : "", type : "TownZone", x : 8446, y : 8623, z : 0, width : 38, height : 42 },
        { name : "", type : "TownZone", x : 8452, y : 8566, z : 0, width : 26, height : 37 },
        { name : "", type : "TownZone", x : 8400, y : 8505, z : 0, width : 50, height : 53 },
        { name : "", type : "TownZone", x : 8487, y : 8537, z : 0, width : 24, height : 21 },
        { name : "", type : "TownZone", x : 8572, y : 8623, z : 0, width : 13, height : 17 },
        { name : "", type : "TownZone", x : 8585, y : 8588, z : 0, width : 20, height : 52 },
        { name : "", type : "TownZone", x : 8589, y : 8870, z : 0, width : 50, height : 15 },
        { name : "", type : "TownZone", x : 8582, y : 8809, z : 0, width : 26, height : 30 },
        { name : "", type : "TownZone", x : 8608, y : 8816, z : 0, width : 28, height : 23 },
        { name : "", type : "TownZone", x : 10244, y : 8724, z : 0, width : 18, height : 43 },
        { name : "", type : "TownZone", x : 10829, y : 8933, z : 0, width : 40, height : 51 },
        { name : "", type : "TownZone", x : 11452, y : 8796, z : 0, width : 28, height : 39 },
        { name : "", type : "TownZone", x : 11499, y : 8835, z : 0, width : 27, height : 15 },
        { name : "", type : "TrailerPark", x : 11428, y : 8850, z : 0, width : 35, height : 123 },
        { name : "", type : "TrailerPark", x : 11463, y : 8946, z : 0, width : 59, height : 27 },
        { name : "", type : "TrailerPark", x : 11469, y : 8885, z : 0, width : 53, height : 55 },
        { name : "", type : "TrailerPark", x : 11528, y : 8907, z : 0, width : 29, height : 66 },
        { name : "", type : "TownZone", x : 11542, y : 8850, z : 0, width : 25, height : 25 },
        { name : "", type : "TrailerPark", x : 11618, y : 8850, z : 0, width : 24, height : 52 },
        { name : "", type : "TownZone", x : 11652, y : 8768, z : 0, width : 26, height : 34 },
        { name : "", type : "TownZone", x : 11683, y : 8765, z : 0, width : 17, height : 41 },
        { name : "", type : "TownZone", x : 11678, y : 8811, z : 0, width : 22, height : 16 },
        { name : "", type : "TrailerPark", x : 11728, y : 8852, z : 0, width : 30, height : 28 },
        { name : "", type : "TrailerPark", x : 11700, y : 8811, z : 0, width : 39, height : 33 },
        { name : "", type : "TrailerPark", x : 11728, y : 8844, z : 0, width : 11, height : 8 },
        { name : "", type : "TrailerPark", x : 11700, y : 8756, z : 0, width : 39, height : 50 },
        { name : "", type : "TrailerPark", x : 11739, y : 8756, z : 0, width : 155, height : 35 },
        { name : "", type : "TrailerPark", x : 11854, y : 8791, z : 0, width : 40, height : 93 },
        { name : "", type : "TrailerPark", x : 11764, y : 8852, z : 0, width : 90, height : 32 },
        { name : "", type : "TrailerPark", x : 11744, y : 8797, z : 0, width : 104, height : 50 },
        { name : "", type : "TownZone", x : 8521, y : 9026, z : 0, width : 23, height : 16 },
        { name : "", type : "TownZone", x : 10261, y : 9243, z : 0, width : 111, height : 57 },
        { name : "", type : "TownZone", x : 10770, y : 9064, z : 0, width : 30, height : 29 },
        { name : "", type : "TownZone", x : 10814, y : 9058, z : 0, width : 45, height : 43 },
        { name : "", type : "TownZone", x : 11079, y : 9207, z : 0, width : 21, height : 47 },
        { name : "", type : "TownZone", x : 11575, y : 9282, z : 0, width : 52, height : 18 },
        { name : "", type : "TownZone", x : 10114, y : 9528, z : 0, width : 62, height : 43 },
        { name : "", type : "TownZone", x : 10050, y : 9544, z : 0, width : 57, height : 56 },
        { name : "", type : "TownZone", x : 10274, y : 9507, z : 0, width : 103, height : 93 },
        { name : "", type : "TownZone", x : 10268, y : 9382, z : 0, width : 69, height : 66 },
        { name : "", type : "TownZone", x : 10337, y : 9300, z : 0, width : 20, height : 117 },
        { name : "", type : "TownZone", x : 10357, y : 9300, z : 0, width : 15, height : 31 },
        { name : "", type : "TownZone", x : 10261, y : 9300, z : 0, width : 76, height : 82 },
        { name : "", type : "TownZone", x : 10600, y : 9359, z : 0, width : 41, height : 32 },
        { name : "", type : "TownZone", x : 10600, y : 9402, z : 0, width : 13, height : 12 },
        { name : "", type : "TownZone", x : 10600, y : 9428, z : 0, width : 38, height : 115 },
        { name : "", type : "TownZone", x : 10639, y : 9402, z : 0, width : 8, height : 6 },
        { name : "", type : "TownZone", x : 10609, y : 9304, z : 0, width : 18, height : 19 },
        { name : "", type : "TownZone", x : 10691, y : 9344, z : 0, width : 21, height : 9 },
        { name : "", type : "TownZone", x : 10712, y : 9399, z : 0, width : 88, height : 37 },
        { name : "", type : "TownZone", x : 10765, y : 9441, z : 0, width : 17, height : 66 },
        { name : "", type : "TownZone", x : 10752, y : 9441, z : 0, width : 13, height : 50 },
        { name : "", type : "TownZone", x : 10725, y : 9491, z : 0, width : 36, height : 16 },
        { name : "", type : "TownZone", x : 10725, y : 9456, z : 0, width : 27, height : 35 },
        { name : "", type : "TownZone", x : 10724, y : 9441, z : 0, width : 24, height : 15 },
        { name : "", type : "TownZone", x : 10645, y : 9456, z : 0, width : 80, height : 28 },
        { name : "", type : "TownZone", x : 10697, y : 9484, z : 0, width : 28, height : 5 },
        { name : "", type : "TownZone", x : 10697, y : 9489, z : 0, width : 24, height : 18 },
        { name : "", type : "TownZone", x : 10675, y : 9484, z : 0, width : 19, height : 23 },
        { name : "", type : "TownZone", x : 10645, y : 9484, z : 0, width : 30, height : 5 },
        { name : "", type : "TownZone", x : 10645, y : 9493, z : 0, width : 26, height : 14 },
        { name : "", type : "TownZone", x : 10645, y : 9489, z : 0, width : 18, height : 4 },
        { name : "", type : "TownZone", x : 10645, y : 9441, z : 0, width : 45, height : 15 },
        { name : "", type : "TownZone", x : 10693, y : 9441, z : 0, width : 22, height : 15 },
        { name : "", type : "TownZone", x : 10661, y : 9414, z : 0, width : 11, height : 22 },
        { name : "", type : "TownZone", x : 10647, y : 9419, z : 0, width : 14, height : 17 },
        { name : "", type : "TownZone", x : 10647, y : 9377, z : 0, width : 10, height : 42 },
        { name : "", type : "TownZone", x : 10641, y : 9359, z : 0, width : 6, height : 43 },
        { name : "", type : "TownZone", x : 10647, y : 9359, z : 0, width : 8, height : 18 },
        { name : "", type : "TownZone", x : 10655, y : 9359, z : 0, width : 17, height : 13 },
        { name : "", type : "TownZone", x : 10661, y : 9377, z : 0, width : 11, height : 32 },
        { name : "", type : "TownZone", x : 10657, y : 9377, z : 0, width : 4, height : 18 },
        { name : "", type : "TownZone", x : 10678, y : 9353, z : 0, width : 34, height : 11 },
        { name : "", type : "TownZone", x : 10705, y : 9364, z : 0, width : 7, height : 72 },
        { name : "", type : "TownZone", x : 10692, y : 9369, z : 0, width : 13, height : 8 },
        { name : "TownTest", type : "TownZone", x : 10695, y : 9377, z : 0, width : 10, height : 31 },
        { name : "", type : "TownZone", x : 10678, y : 9364, z : 0, width : 9, height : 13 },
        { name : "", type : "TownZone", x : 10678, y : 9381, z : 0, width : 17, height : 15 },
        { name : "", type : "TownZone", x : 10678, y : 9406, z : 0, width : 17, height : 2 },
        { name : "", type : "TownZone", x : 10678, y : 9417, z : 0, width : 27, height : 19 },
        { name : "", type : "TownZone", x : 10701, y : 9408, z : 0, width : 4, height : 9 },
        { name : "", type : "TownZone", x : 10645, y : 9512, z : 0, width : 85, height : 49 },
        { name : "", type : "TownZone", x : 10645, y : 9561, z : 0, width : 29, height : 39 },
        { name : "", type : "TownZone", x : 10674, y : 9568, z : 0, width : 89, height : 32 },
        { name : "", type : "TownZone", x : 10736, y : 9512, z : 0, width : 27, height : 56 },
        { name : "", type : "TownZone", x : 10763, y : 9512, z : 0, width : 37, height : 27 },
        { name : "", type : "TrailerPark", x : 10800, y : 9466, z : 0, width : 173, height : 41 },
        { name : "", type : "TrailerPark", x : 10911, y : 9512, z : 0, width : 63, height : 30 },
        { name : "", type : "TownZone", x : 10824, y : 9523, z : 0, width : 21, height : 27 },
        { name : "", type : "TownZone", x : 10800, y : 9387, z : 0, width : 138, height : 74 },
        { name : "", type : "TownZone", x : 10943, y : 9424, z : 0, width : 51, height : 42 },
        { name : "", type : "TownZone", x : 11003, y : 9402, z : 0, width : 43, height : 42 },
        { name : "", type : "TownZone", x : 10938, y : 9362, z : 0, width : 38, height : 35 },
        { name : "", type : "TownZone", x : 10924, y : 9362, z : 0, width : 14, height : 25 },
        { name : "", type : "TownZone", x : 10043, y : 9600, z : 0, width : 96, height : 46 },
        { name : "", type : "TownZone", x : 10292, y : 9600, z : 0, width : 85, height : 109 },
        { name : "", type : "TownZone", x : 10274, y : 9600, z : 0, width : 18, height : 45 },
        { name : "", type : "TownZone", x : 10529, y : 9690, z : 0, width : 37, height : 17 },
        { name : "", type : "TownZone", x : 10599, y : 9600, z : 0, width : 14, height : 23 },
        { name : "", type : "TownZone", x : 10613, y : 9600, z : 0, width : 12, height : 16 },
        { name : "", type : "TownZone", x : 10625, y : 9600, z : 0, width : 14, height : 3 },
        { name : "", type : "TownZone", x : 10636, y : 9603, z : 0, width : 3, height : 20 },
        { name : "", type : "TownZone", x : 10599, y : 9631, z : 0, width : 5, height : 26 },
        { name : "", type : "TownZone", x : 10604, y : 9655, z : 0, width : 4, height : 2 },
        { name : "", type : "TownZone", x : 10617, y : 9631, z : 0, width : 17, height : 4 },
        { name : "", type : "TownZone", x : 10617, y : 9645, z : 0, width : 17, height : 18 },
        { name : "", type : "TownZone", x : 10599, y : 9663, z : 0, width : 6, height : 25 },
        { name : "", type : "TownZone", x : 10605, y : 9670, z : 0, width : 6, height : 18 },
        { name : "", type : "TownZone", x : 10611, y : 9670, z : 0, width : 21, height : 5 },
        { name : "", type : "TownZone", x : 10632, y : 9670, z : 0, width : 6, height : 11 },
        { name : "", type : "TownZone", x : 10638, y : 9631, z : 0, width : 22, height : 50 },
        { name : "", type : "TownZone", x : 10622, y : 9684, z : 0, width : 38, height : 49 },
        { name : "", type : "TownZone", x : 10660, y : 9698, z : 0, width : 7, height : 35 },
        { name : "", type : "TownZone", x : 10599, y : 9741, z : 0, width : 18, height : 12 },
        { name : "", type : "TownZone", x : 10599, y : 9753, z : 0, width : 7, height : 10 },
        { name : "", type : "TownZone", x : 10626, y : 9741, z : 0, width : 50, height : 29 },
        { name : "", type : "TownZone", x : 10651, y : 9770, z : 0, width : 25, height : 86 },
        { name : "", type : "TownZone", x : 10608, y : 9794, z : 0, width : 43, height : 41 },
        { name : "", type : "TownZone", x : 10609, y : 9873, z : 0, width : 17, height : 27 },
        { name : "", type : "TownZone", x : 10626, y : 9895, z : 0, width : 23, height : 5 },
        { name : "", type : "TownZone", x : 10669, y : 9864, z : 0, width : 67, height : 36 },
        { name : "", type : "TownZone", x : 10676, y : 9792, z : 0, width : 36, height : 64 },
        { name : "", type : "TownZone", x : 10679, y : 9741, z : 0, width : 33, height : 47 },
        { name : "", type : "TownZone", x : 10665, y : 9631, z : 0, width : 38, height : 62 },
        { name : "", type : "TownZone", x : 10671, y : 9693, z : 0, width : 76, height : 40 },
        { name : "", type : "TownZone", x : 10703, y : 9675, z : 0, width : 44, height : 18 },
        { name : "", type : "TownZone", x : 10646, y : 9600, z : 0, width : 154, height : 23 },
        { name : "", type : "TownZone", x : 10711, y : 9623, z : 0, width : 89, height : 44 },
        { name : "", type : "TownZone", x : 10755, y : 9667, z : 0, width : 45, height : 112 },
        { name : "", type : "TownZone", x : 10717, y : 9741, z : 0, width : 30, height : 115 },
        { name : "", type : "TownZone", x : 10747, y : 9787, z : 0, width : 53, height : 69 },
        { name : "", type : "TownZone", x : 10742, y : 9864, z : 0, width : 58, height : 36 },
        { name : "", type : "TownZone", x : 10617, y : 9837, z : 0, width : 12, height : 5 },
        { name : "", type : "TownZone", x : 10608, y : 9835, z : 0, width : 21, height : 2 },
        { name : "", type : "TownZone", x : 10845, y : 9872, z : 0, width : 23, height : 28 },
        { name : "", type : "TownZone", x : 10872, y : 9872, z : 0, width : 29, height : 28 },
        { name : "", type : "TownZone", x : 10823, y : 9779, z : 0, width : 44, height : 88 },
        { name : "", type : "TownZone", x : 10867, y : 9833, z : 0, width : 29, height : 34 },
        { name : "", type : "TownZone", x : 10843, y : 9759, z : 0, width : 6, height : 11 },
        { name : "", type : "TownZone", x : 10849, y : 9759, z : 0, width : 7, height : 8 },
        { name : "", type : "TownZone", x : 10819, y : 9737, z : 0, width : 24, height : 33 },
        { name : "", type : "TownZone", x : 10811, y : 9737, z : 0, width : 8, height : 23 },
        { name : "", type : "TrailerPark", x : 10876, y : 9632, z : 0, width : 20, height : 138 },
        { name : "", type : "TrailerPark", x : 10900, y : 9632, z : 0, width : 23, height : 130 },
        { name : "", type : "TrailerPark", x : 10927, y : 9774, z : 0, width : 64, height : 37 },
        { name : "", type : "TrailerPark", x : 10927, y : 9746, z : 0, width : 60, height : 24 },
        { name : "", type : "TrailerPark", x : 10927, y : 9718, z : 0, width : 73, height : 24 },
        { name : "", type : "TrailerPark", x : 10927, y : 9690, z : 0, width : 80, height : 24 },
        { name : "", type : "TrailerPark", x : 10927, y : 9662, z : 0, width : 80, height : 24 },
        { name : "", type : "TrailerPark", x : 10984, y : 9633, z : 0, width : 29, height : 25 },
        { name : "", type : "TownZone", x : 10914, y : 9828, z : 0, width : 9, height : 25 },
        { name : "", type : "TownZone", x : 11515, y : 9637, z : 0, width : 30, height : 49 },
        { name : "", type : "TownZone", x : 11596, y : 9784, z : 0, width : 20, height : 61 },
        { name : "", type : "TownZone", x : 11616, y : 9838, z : 0, width : 22, height : 12 },
        { name : "", type : "TownZone", x : 11607, y : 9845, z : 0, width : 9, height : 5 },
        { name : "", type : "TownZone", x : 11607, y : 9850, z : 0, width : 19, height : 7 },
        { name : "", type : "TownZone", x : 11679, y : 9796, z : 0, width : 8, height : 54 },
        { name : "", type : "TownZone", x : 11690, y : 9796, z : 0, width : 9, height : 54 },
        { name : "", type : "TrailerPark", x : 9631, y : 10149, z : 0, width : 28, height : 15 },
        { name : "", type : "TownZone", x : 10372, y : 10077, z : 0, width : 30, height : 25 },
        { name : "", type : "TownZone", x : 10742, y : 9900, z : 0, width : 58, height : 40 },
        { name : "", type : "TownZone", x : 10669, y : 9900, z : 0, width : 67, height : 40 },
        { name : "", type : "TownZone", x : 10599, y : 9900, z : 0, width : 64, height : 40 },
        { name : "", type : "TownZone", x : 10613, y : 9948, z : 0, width : 25, height : 45 },
        { name : "", type : "TownZone", x : 10599, y : 9948, z : 0, width : 7, height : 45 },
        { name : "", type : "TownZone", x : 10622, y : 10034, z : 0, width : 11, height : 28 },
        { name : "", type : "TownZone", x : 10615, y : 10034, z : 0, width : 7, height : 11 },
        { name : "", type : "TownZone", x : 10599, y : 10100, z : 0, width : 20, height : 25 },
        { name : "", type : "TownZone", x : 10644, y : 10071, z : 0, width : 89, height : 82 },
        { name : "", type : "TownZone", x : 10624, y : 10129, z : 0, width : 10, height : 35 },
        { name : "", type : "TownZone", x : 10619, y : 10152, z : 0, width : 5, height : 12 },
        { name : "", type : "TownZone", x : 10701, y : 9948, z : 0, width : 51, height : 55 },
        { name : "", type : "TownZone", x : 10693, y : 10002, z : 0, width : 8, height : 7 },
        { name : "", type : "TownZone", x : 10701, y : 10003, z : 0, width : 13, height : 6 },
        { name : "", type : "TownZone", x : 10693, y : 10039, z : 0, width : 21, height : 26 },
        { name : "", type : "TownZone", x : 10714, y : 10045, z : 0, width : 15, height : 20 },
        { name : "", type : "TownZone", x : 10644, y : 10159, z : 0, width : 89, height : 41 },
        { name : "", type : "TownZone", x : 10627, y : 10170, z : 0, width : 17, height : 30 },
        { name : "", type : "TownZone", x : 10741, y : 10073, z : 0, width : 59, height : 127 },
        { name : "", type : "TownZone", x : 10760, y : 10059, z : 0, width : 40, height : 14 },
        { name : "", type : "TownZone", x : 10760, y : 9948, z : 0, width : 40, height : 55 },
        { name : "", type : "TownZone", x : 10776, y : 10008, z : 0, width : 24, height : 43 },
        { name : "", type : "TownZone", x : 10800, y : 9980, z : 0, width : 23, height : 23 },
        { name : "", type : "TownZone", x : 10800, y : 10008, z : 0, width : 18, height : 43 },
        { name : "", type : "TownZone", x : 10818, y : 10019, z : 0, width : 36, height : 32 },
        { name : "", type : "TownZone", x : 10859, y : 9980, z : 0, width : 33, height : 70 },
        { name : "", type : "TownZone", x : 10827, y : 10059, z : 0, width : 27, height : 141 },
        { name : "", type : "TownZone", x : 10859, y : 10059, z : 0, width : 33, height : 78 },
        { name : "testTown", type : "TownZone", x : 10897, y : 10059, z : 0, width : 42, height : 122 },
        { name : "", type : "TownZone", x : 10859, y : 10142, z : 0, width : 38, height : 58 },
        { name : "", type : "TownZone", x : 10800, y : 10059, z : 0, width : 19, height : 28 },
        { name : "", type : "TownZone", x : 10845, y : 9900, z : 0, width : 23, height : 72 },
        { name : "", type : "TownZone", x : 10872, y : 9900, z : 0, width : 29, height : 72 },
        { name : "", type : "TownZone", x : 10897, y : 9980, z : 0, width : 34, height : 71 },
        { name : "", type : "TownZone", x : 11516, y : 10003, z : 0, width : 22, height : 35 },
        { name : "", type : "TownZone", x : 11573, y : 10032, z : 0, width : 37, height : 46 },
        { name : "", type : "TownZone", x : 11573, y : 10106, z : 0, width : 37, height : 46 },
        { name : "", type : "TownZone", x : 11647, y : 10081, z : 0, width : 45, height : 46 },
        { name : "", type : "TownZone", x : 11647, y : 10006, z : 0, width : 45, height : 46 },
        { name : "", type : "TownZone", x : 11625, y : 9909, z : 0, width : 13, height : 24 },
        { name : "", type : "TownZone", x : 11551, y : 9900, z : 0, width : 29, height : 60 },
        { name : "", type : "TownZone", x : 11498, y : 10036, z : 0, width : 18, height : 2 },
        { name : "", type : "TownZone", x : 11498, y : 10038, z : 0, width : 1, height : 27 },
        { name : "", type : "TownZone", x : 11498, y : 10065, z : 0, width : 47, height : 1 },
        { name : "", type : "TownZone", x : 11551, y : 9960, z : 0, width : 10, height : 28 },
        { name : "", type : "TownZone", x : 11597, y : 9976, z : 0, width : 20, height : 21 },
        { name : "", type : "TownZone", x : 10599, y : 10233, z : 0, width : 22, height : 49 },
        { name : "", type : "TownZone", x : 10599, y : 10287, z : 0, width : 22, height : 113 },
        { name : "", type : "TownZone", x : 10627, y : 10200, z : 0, width : 106, height : 59 },
        { name : "", type : "TownZone", x : 10669, y : 10310, z : 0, width : 38, height : 13 },
        { name : "", type : "TownZone", x : 10669, y : 10323, z : 0, width : 19, height : 24 },
        { name : "", type : "TownZone", x : 10688, y : 10355, z : 0, width : 19, height : 26 },
        { name : "", type : "TownZone", x : 10669, y : 10352, z : 0, width : 19, height : 13 },
        { name : "", type : "TownZone", x : 10627, y : 10398, z : 0, width : 20, height : 26 },
        { name : "", type : "TownZone", x : 10696, y : 10442, z : 0, width : 15, height : 23 },
        { name : "", type : "TownZone", x : 10705, y : 10417, z : 0, width : 28, height : 17 },
        { name : "", type : "TownZone", x : 10741, y : 10200, z : 0, width : 45, height : 24 },
        { name : "", type : "TownZone", x : 10741, y : 10228, z : 0, width : 45, height : 31 },
        { name : "", type : "TownZone", x : 10741, y : 10309, z : 0, width : 45, height : 9 },
        { name : "", type : "TownZone", x : 10745, y : 10331, z : 0, width : 18, height : 37 },
        { name : "", type : "TrailerPark", x : 10741, y : 10381, z : 0, width : 45, height : 73 },
        { name : "", type : "TrailerPark", x : 10800, y : 10357, z : 0, width : 55, height : 70 },
        { name : "", type : "TownZone", x : 10800, y : 10230, z : 0, width : 55, height : 87 },
        { name : "", type : "TownZone", x : 10855, y : 10229, z : 0, width : 34, height : 75 },
        { name : "", type : "TownZone", x : 10611, y : 10516, z : 0, width : 19, height : 25 },
        { name : "", type : "TownZone", x : 10609, y : 10554, z : 0, width : 20, height : 14 },
        { name : "", type : "TownZone", x : 10654, y : 10612, z : 0, width : 23, height : 26 },
        { name : "", type : "TownZone", x : 10636, y : 10612, z : 0, width : 10, height : 26 },
        { name : "", type : "TownZone", x : 10750, y : 10545, z : 0, width : 25, height : 15 },
        { name : "", type : "TownZone", x : 11054, y : 10630, z : 0, width : 21, height : 20 },
        { name : "", type : "TownZone", x : 10200, y : 10989, z : 0, width : 50, height : 50 },
        { name : "", type : "TownZone", x : 12600, y : 4676, z : 0, width : 45, height : 70 },
        { name : "", type : "TrailerPark", x : 12485, y : 5036, z : 0, width : 53, height : 64 },
        { name : "", type : "TrailerPark", x : 12733, y : 4967, z : 0, width : 29, height : 46 },
        { name : "", type : "TownZone", x : 12726, y : 5020, z : 0, width : 36, height : 31 },
        { name : "", type : "TownZone", x : 12836, y : 4832, z : 0, width : 41, height : 55 },
        { name : "", type : "TownZone", x : 12839, y : 4946, z : 0, width : 33, height : 20 },
        { name : "", type : "TownZone", x : 13010, y : 5075, z : 0, width : 26, height : 23 },
        { name : "", type : "TownZone", x : 12489, y : 5130, z : 0, width : 44, height : 27 },
        { name : "", type : "TownZone", x : 12489, y : 5163, z : 0, width : 71, height : 28 },
        { name : "", type : "TownZone", x : 12522, y : 5191, z : 0, width : 38, height : 54 },
        { name : "", type : "TownZone", x : 12529, y : 5245, z : 0, width : 31, height : 63 },
        { name : "", type : "TownZone", x : 12568, y : 5234, z : 0, width : 32, height : 115 },
        { name : "", type : "TownZone", x : 12568, y : 5163, z : 0, width : 32, height : 65 },
        { name : "", type : "TownZone", x : 12538, y : 5130, z : 0, width : 62, height : 27 },
        { name : "", type : "TownZone", x : 12563, y : 5357, z : 0, width : 37, height : 43 },
        { name : "", type : "TownZone", x : 12624, y : 5357, z : 0, width : 38, height : 43 },
        { name : "", type : "TownZone", x : 12622, y : 5310, z : 0, width : 40, height : 39 },
        { name : "", type : "TownZone", x : 12600, y : 5357, z : 0, width : 4, height : 43 },
        { name : "", type : "TownZone", x : 12600, y : 5130, z : 0, width : 27, height : 27 },
        { name : "", type : "TownZone", x : 12600, y : 5163, z : 0, width : 39, height : 65 },
        { name : "", type : "TownZone", x : 12600, y : 5234, z : 0, width : 39, height : 36 },
        { name : "", type : "TownZone", x : 12627, y : 5228, z : 0, width : 12, height : 6 },
        { name : "", type : "TownZone", x : 12612, y : 5157, z : 0, width : 27, height : 6 },
        { name : "", type : "TownZone", x : 13093, y : 5290, z : 0, width : 55, height : 31 },
        { name : "", type : "TownZone", x : 13000, y : 5255, z : 0, width : 30, height : 87 },
        { name : "", type : "TownZone", x : 13036, y : 5124, z : 0, width : 32, height : 33 },
        { name : "", type : "TownZone", x : 13044, y : 5162, z : 0, width : 19, height : 86 },
        { name : "", type : "TownZone", x : 13055, y : 5248, z : 0, width : 8, height : 5 },
        { name : "", type : "TownZone", x : 13036, y : 5253, z : 0, width : 27, height : 58 },
        { name : "", type : "TownZone", x : 12551, y : 5612, z : 0, width : 39, height : 77 },
        { name : "", type : "TownZone", x : 12567, y : 5558, z : 0, width : 33, height : 27 },
        { name : "", type : "TownZone", x : 12567, y : 5518, z : 0, width : 33, height : 27 },
        { name : "", type : "TownZone", x : 12567, y : 5443, z : 0, width : 33, height : 48 },
        { name : "", type : "TownZone", x : 12563, y : 5400, z : 0, width : 37, height : 19 },
        { name : "", type : "TownZone", x : 12600, y : 5620, z : 0, width : 49, height : 80 },
        { name : "", type : "TownZone", x : 12624, y : 5598, z : 0, width : 39, height : 22 },
        { name : "", type : "TownZone", x : 12624, y : 5562, z : 0, width : 39, height : 16 },
        { name : "", type : "TownZone", x : 12624, y : 5503, z : 0, width : 39, height : 23 },
        { name : "", type : "TownZone", x : 12624, y : 5427, z : 0, width : 39, height : 25 },
        { name : "", type : "TownZone", x : 13085, y : 5443, z : 0, width : 19, height : 14 },
        { name : "", type : "TownZone", x : 13250, y : 5420, z : 0, width : 105, height : 42 },
        { name : "", type : "TownZone", x : 13729, y : 5661, z : 0, width : 3, height : 12 },
        { name : "", type : "TownZone", x : 13743, y : 5661, z : 0, width : 3, height : 12 },
        { name : "", type : "TownZone", x : 13733, y : 5649, z : 0, width : 7, height : 5 },
        { name : "", type : "TownZone", x : 13718, y : 5637, z : 0, width : 64, height : 12 },
        { name : "", type : "TownZone", x : 13752, y : 5649, z : 0, width : 30, height : 5 },
        { name : "", type : "TownZone", x : 12571, y : 5951, z : 0, width : 19, height : 34 },
        { name : "", type : "TownZone", x : 12564, y : 5874, z : 0, width : 26, height : 64 },
        { name : "", type : "TownZone", x : 12558, y : 5826, z : 0, width : 32, height : 32 },
        { name : "", type : "TownZone", x : 12559, y : 5717, z : 0, width : 31, height : 38 },
        { name : "", type : "TownZone", x : 12600, y : 5766, z : 0, width : 34, height : 70 },
        { name : "", type : "TownZone", x : 12634, y : 5766, z : 0, width : 20, height : 45 },
        { name : "", type : "TownZone", x : 12600, y : 5700, z : 0, width : 62, height : 58 },
        { name : "", type : "TownZone", x : 12721, y : 5762, z : 0, width : 31, height : 20 },
        { name : "", type : "TownZone", x : 12737, y : 5704, z : 0, width : 15, height : 24 },
        { name : "", type : "TownZone", x : 13558, y : 5742, z : 0, width : 73, height : 31 },
        { name : "", type : "TownZone", x : 13642, y : 5724, z : 0, width : 30, height : 70 },
        { name : "", type : "TownZone", x : 13561, y : 5849, z : 0, width : 112, height : 79 },
        { name : "", type : "TownZone", x : 13905, y : 5895, z : 0, width : 65, height : 33 },
        { name : "", type : "TownZone", x : 13970, y : 5895, z : 0, width : 32, height : 8 },
        { name : "", type : "TownZone", x : 13867, y : 5771, z : 0, width : 121, height : 124 },
        { name : "", type : "TownZone", x : 13988, y : 5796, z : 0, width : 14, height : 99 },
        { name : "", type : "TownZone", x : 13867, y : 5741, z : 0, width : 98, height : 30 },
        { name : "", type : "TownZone", x : 12600, y : 6000, z : 0, width : 10, height : 23 },
        { name : "", type : "TownZone", x : 12824, y : 6419, z : 0, width : 17, height : 19 },
        { name : "", type : "TownZone", x : 12841, y : 6395, z : 0, width : 20, height : 15 },
        { name : "", type : "TownZone", x : 12820, y : 6325, z : 0, width : 21, height : 22 },
        { name : "", type : "TownZone", x : 10178, y : 6759, z : 0, width : 14, height : 14 },
        { name : "", type : "TownZone", x : 10875, y : 6706, z : 0, width : 83, height : 49 },
        { name : "", type : "TownZone", x : 10965, y : 6694, z : 0, width : 135, height : 53 },
        { name : "", type : "TownZone", x : 10883, y : 6667, z : 0, width : 33, height : 26 },
        { name : "", type : "TownZone", x : 11266, y : 6695, z : 0, width : 100, height : 52 },
        { name : "", type : "TownZone", x : 11295, y : 6755, z : 0, width : 101, height : 89 },
        { name : "", type : "TownZone", x : 11266, y : 6852, z : 0, width : 130, height : 44 },
        { name : "", type : "TownZone", x : 11213, y : 6755, z : 0, width : 45, height : 141 },
        { name : "", type : "TownZone", x : 11100, y : 6701, z : 0, width : 158, height : 46 },
        { name : "", type : "TownZone", x : 11263, y : 6643, z : 0, width : 101, height : 44 },
        { name : "", type : "TownZone", x : 11123, y : 6847, z : 0, width : 22, height : 20 },
        { name : "", type : "TownZone", x : 11556, y : 6841, z : 0, width : 140, height : 55 },
        { name : "", type : "TownZone", x : 11556, y : 6777, z : 0, width : 140, height : 55 },
        { name : "", type : "TownZone", x : 11556, y : 6755, z : 0, width : 66, height : 22 },
        { name : "", type : "TownZone", x : 11628, y : 6678, z : 0, width : 42, height : 90 },
        { name : "", type : "TownZone", x : 11561, y : 6709, z : 0, width : 62, height : 38 },
        { name : "", type : "TownZone", x : 11582, y : 6678, z : 0, width : 41, height : 31 },
        { name : "", type : "TownZone", x : 11474, y : 6755, z : 0, width : 74, height : 64 },
        { name : "", type : "TownZone", x : 11404, y : 6828, z : 0, width : 144, height : 68 },
        { name : "", type : "TownZone", x : 11374, y : 6695, z : 0, width : 97, height : 52 },
        { name : "", type : "TownZone", x : 11400, y : 6652, z : 0, width : 57, height : 35 },
        { name : "", type : "TownZone", x : 11479, y : 6687, z : 0, width : 42, height : 60 },
        { name : "", type : "TownZone", x : 11704, y : 6840, z : 0, width : 65, height : 56 },
        { name : "", type : "TownZone", x : 11704, y : 6777, z : 0, width : 65, height : 55 },
        { name : "", type : "TownZone", x : 11777, y : 6840, z : 0, width : 67, height : 56 },
        { name : "", type : "TownZone", x : 11777, y : 6777, z : 0, width : 67, height : 55 },
        { name : "", type : "TownZone", x : 11852, y : 6840, z : 0, width : 65, height : 56 },
        { name : "", type : "TownZone", x : 11852, y : 6777, z : 0, width : 65, height : 55 },
        { name : "", type : "TownZone", x : 11925, y : 6840, z : 0, width : 71, height : 56 },
        { name : "", type : "TownZone", x : 11925, y : 6777, z : 0, width : 71, height : 55 },
        { name : "", type : "TownZone", x : 11704, y : 6712, z : 0, width : 140, height : 57 },
        { name : "", type : "TownZone", x : 11696, y : 6674, z : 0, width : 148, height : 30 },
        { name : "", type : "TownZone", x : 11852, y : 6674, z : 0, width : 73, height : 30 },
        { name : "", type : "TownZone", x : 11852, y : 6712, z : 0, width : 65, height : 57 },
        { name : "", type : "TownZone", x : 12004, y : 6840, z : 0, width : 97, height : 56 },
        { name : "", type : "TownZone", x : 12056, y : 6752, z : 0, width : 40, height : 80 },
        { name : "", type : "TownZone", x : 11350, y : 7010, z : 0, width : 46, height : 44 },
        { name : "", type : "TownZone", x : 11338, y : 6948, z : 0, width : 58, height : 44 },
        { name : "", type : "TownZone", x : 11288, y : 6904, z : 0, width : 39, height : 55 },
        { name : "", type : "TownZone", x : 11400, y : 7049, z : 0, width : 36, height : 35 },
        { name : "", type : "TownZone", x : 11475, y : 7003, z : 0, width : 32, height : 57 },
        { name : "", type : "TownZone", x : 11464, y : 7003, z : 0, width : 11, height : 46 },
        { name : "", type : "TownZone", x : 11513, y : 7003, z : 0, width : 86, height : 39 },
        { name : "", type : "TownZone", x : 11555, y : 6953, z : 0, width : 44, height : 50 },
        { name : "", type : "TownZone", x : 11605, y : 6953, z : 0, width : 35, height : 76 },
        { name : "", type : "TownZone", x : 11649, y : 7029, z : 0, width : 47, height : 80 },
        { name : "", type : "TownZone", x : 11464, y : 6953, z : 0, width : 85, height : 44 },
        { name : "", type : "TownZone", x : 11404, y : 6992, z : 0, width : 52, height : 49 },
        { name : "", type : "TownZone", x : 11404, y : 6904, z : 0, width : 144, height : 41 },
        { name : "", type : "TownZone", x : 11556, y : 6904, z : 0, width : 66, height : 41 },
        { name : "", type : "TownZone", x : 11630, y : 6904, z : 0, width : 66, height : 41 },
        { name : "", type : "TownZone", x : 11878, y : 7052, z : 0, width : 47, height : 33 },
        { name : "", type : "TownZone", x : 11878, y : 6967, z : 0, width : 39, height : 77 },
        { name : "", type : "TownZone", x : 11825, y : 6967, z : 0, width : 53, height : 85 },
        { name : "", type : "TownZone", x : 11775, y : 6967, z : 0, width : 50, height : 37 },
        { name : "", type : "TownZone", x : 11704, y : 6904, z : 0, width : 65, height : 63 },
        { name : "", type : "TownZone", x : 11777, y : 6904, z : 0, width : 67, height : 55 },
        { name : "", type : "TownZone", x : 11852, y : 6904, z : 0, width : 65, height : 55 },
        { name : "", type : "TownZone", x : 11925, y : 6904, z : 0, width : 71, height : 55 },
        { name : "", type : "TownZone", x : 11925, y : 6967, z : 0, width : 71, height : 105 },
        { name : "", type : "TownZone", x : 12067, y : 7062, z : 0, width : 35, height : 114 },
        { name : "", type : "TownZone", x : 12110, y : 6978, z : 0, width : 64, height : 169 },
        { name : "", type : "TownZone", x : 12004, y : 6967, z : 0, width : 38, height : 105 },
        { name : "", type : "TownZone", x : 12004, y : 6904, z : 0, width : 98, height : 55 },
    ];
}(window));