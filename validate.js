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
    "<textarea rows='5' class='form-control'>{{data}}</textarea>" +
    "</div>";

var headerButtonsTemplate =
    "<div class='row'>" +
    "<div class='col-md-2 text-center'>" +
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
    "<div class='col-md-2 text-center'>" +
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
    "<div class='col-md-8 text-center'>" +
    "<button type='button' class='btn btn-default'>Proxy</button>" +
    "<button type='button' class='btn btn-default'>Edit Cookie</button>" +
    "<button type='button' class='btn btn-default'>Reset Request</button>" +
    "<button type='button' class='btn btn-default'>Send Request</button>" +
    "<button type='button' class='btn btn-default'>Compare</button>" +
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
    "<div id=\'{{step_num}}\' class='tab-pane fade'>" +
    "<h3>{{step_num}}</h3>" +
    "<div id='attack-request-template'></div>" +
    "<script>AppSpiderValidate.renderTemplate('attackRequestTemplate','attack-request-template', attackRequestData);</script>" +
    "<div id='view-template'></div>" +
    "<script>AppSpiderValidate.renderTemplate('viewTemplate','view-template',viewData);</script>" +
    "<div id='header-buttons-template'></div>" +
    "<script>AppSpiderValidate.renderTemplate('headerButtonsTemplate','header-button-template',null);</script>" +
    "<div id='attack-response-template'></div>" +
    "<script>AppSpiderValidate.renderTemplate('attackResponseTemplate','attack-response-template',attackResponseData);</script>" +
    "<div id='content-response-template'></div>" +
    "<script>AppSpiderValidate.renderTemplate('contentResponseTemplate','content-response-template',contentResponseData);</script>" +
    "<div id='content-response-template'></div>" +
    "<script>AppSpiderValidate.renderTemplate('contentResponseTemplate','content-response-template',contentResponseData);</script>" +
    "<div id='button-template'></div>" +
    "<script>AppSpiderValidate.renderTemplate('buttonTemplate','button-template');</script>" +
    "</div>";

var AppSpiderValidate = {

    decodeHeader: function(sHTTPHeader) {
        var requests = window.atob(sHTTPHeader);
        return parseHeader(requests);
    },

    parseHeader: function(requests) {
        var arry_requests = requests.split(/(#H#G#F#E#D#C#B#A#)/);
        for (var i = 0; i < arry_requests.length; i++ ) {
            if (arry_requests[i].indexOf("#A#B#C#D#E#F#G#H#") > -1) {
                var arry = arry_requests[i].split(/(#A#B#C#D#E#F#G#H#)/);
                var request = arry[0].trim();
                var desc = arry[arry.length -1].trim();
                /* Debugging */
                return parseRequest(request);
                //makeRequest(request);
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

    renderTemplate: function(template,tag,data) {
        if (template == 'attackRequestTemplate') {
            template = attackRequestTemplate;
        }else if (template == 'viewTemplate') {
            template = viewTemplate;
        }else if (template == 'headerButtonsTemplate') {
            template = headerButtonsTemplate;
        }else if (template == 'attackResponseTemplate') {
            template = attackResponseTemplate;
        }else if (template == 'contentResponseTemplate') {
            template = contentResponseTemplate;
        }else if (template == 'buttonTemplate') {
            template = buttonTemplate;
        }else if (template == 'stepTemplate') {
            template = stepTemplate;
        }
        var output = Mustache.render(template,data);
        document.getElementById(tag).innerHTML = output;
    }

};


