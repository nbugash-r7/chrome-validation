/**
 * Created by nbugash on 16/10/15.
 */

/* HTML TEMPLATE  */
var attackRequestTemplate =
    "<div class='form-group'>"+
    "<label>Attack Request</label>" +
    "<textarea rows='5' class='form-control'>{{attack_request_header}}</textarea>" +
    "</div>";

var viewTemplate =
    "<div class='form-group'>" +
    "<label>View</label>" +
    "<textarea rows='5' class='form-control'>{{view_data}}</textarea>" +
    "</div>";

var headerButtonsTemplate =
    "<div class='container-fluid'>" +
    "<div class='row'>" +
    "<div class='col-xs-2 text-center'>" +
    "<div class='dropdown'>" +
    "<button class='btn btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>Select View" +
    "<span class='caret'></span>" +
    "</button>" +
    "<ul class='dropdown-menu'>" +
    "<li><a href='#'>Raw View</a></li>" +
    "<li><a href='#'>Tabular View</a></li>" +
    "</ul>" +
    "</div>" +
    "</div>" +
    "<div class='col-xs-2 text-center'>" +
    "<div class='dropdown'>" +
    "<button class='btn btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>Protocol" +
    "<span class='caret'></span>" +
    "</button>" +
    "<ul class='dropdown-menu'>" +
    "<li><a href='#'>http</a></li>" +
    "<li><a href='#'>https</a></li>" +
    "</ul>" +
    "</div>" +
    "</div>" +
    "<div class='col-xs-8 text-center'>" +
    "<button type='button' class='btn btn-default'>Proxy</button>" +
    "<button type='button' class='btn btn-default'>Edit Cookie</button>" +
    "<button type='button' class='btn btn-default'>Reset Request</button>" +
    "<button type='button' class='btn btn-default'>Send Request</button>" +
    "<button type='button' class='btn btn-default'>Compare</button>" +
    "</div>" +
    "</div>" +
    "</div>";

var attackResponseTemplate =
    "<div class='form-group'>" +
    "<label>Attack Response</label>" +
    "<textarea rows='5' class='form-control'>{{attack_response_data}}" +
    "</textarea>" +
    "</div>";

var contentResponseTemplate =
    "<div class='form-group'>" +
    "<label>Content Response</label>" +
    "<textarea rows='5' class='form-control'>{{content_response_data}}" +
    "</textarea>" +
    "</div>";

var buttonTemplate =
    "<button type='button' class='btn btn-default'>Highlight Vulnerability</button>" +
    "<button type='button' class='btn btn-default'>Show Response in a Browser</button>" +
    "<button type='button' class='btn btn-default'>Help</button>";

var stepTemplate =
    "<h3>{{step_num}}</h3>" +
    attackRequestTemplate +
    viewTemplate +
    headerButtonsTemplate +
    attackResponseTemplate +
    contentResponseTemplate +
    buttonTemplate;

var AppSpiderValidate = {

    decodeHeader: function(sHTTPHeader) {
        var decodedHeader = window.atob(sHTTPHeader);
        return decodedHeader;
    },

    parseHeader: function(requests) {
        var header = [];
        var arry_requests = requests.split(/(#H#G#F#E#D#C#B#A#)/);
        for (var i = 0; i < arry_requests.length; i++ ) {
            var step = {};
            if (arry_requests[i].indexOf("#A#B#C#D#E#F#G#H#") > -1) {
                var arry = arry_requests[i].split(/(#A#B#C#D#E#F#G#H#)/);
                var request = arry[0].trim();
                var desc = arry[arry.length -1].trim();
                /* Debugging */
                step['step' + i] = {
                    step_num: "Step " + i,
                    attack_request_header: AppSpiderValidate.parseRequest(request)
                };
                header.push(step)
            }
        }
    },

    makeRequest: function(request) {
        var headers = request.split("\n");
        headers;
    },

    /* For Debugging purposes only */
    parseRequest: function(request) {
        var headers = request.split("\n");
        return headers
    },

    hidePage: function(pageId) {
        var div = document.getElementById(pageId);
        if (div.style.display !== 'none') {
            div.style.display = 'none'
        } else {
            div.style.display = 'block'
        }
    },

    renderTemplate: function(template,id_tag,data) {
        if (template == 'stepTemplate') {
            template = stepTemplate;
        }
        for (var step in data) {
            var output = Mustache.to_html(template,data[step]);
            var stephtml = document.getElementById(id_tag);
            var div = document.createElement('div');
            div.setAttribute('id', step);
            if (step == 'step1') {
                div.setAttribute('class','tab-pane fade in active');
            } else {
                div.setAttribute('class','tab-pane fade');
            }
            div.innerHTML = output;
            stephtml.appendChild(div);
        };
    },
    renderNavTemplate: function(data) {
        var navhtml = document.getElementById('appspider-nav');
        for (var step in data) {
            var li = document.createElement('li');
            if (step == 'step1') {
                li.setAttribute('class','active');
            } else {
                li.setAttribute('class', '');
            }
            var a = document.createElement('a');
            a.setAttribute('data-toggle','pill');
            a.setAttribute('href','#'+step);
            a.innerHTML = data[step].step_num;
            li.appendChild(a);
            navhtml.appendChild(li);
        };

    }

};


