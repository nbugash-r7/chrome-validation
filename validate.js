/**
 * Created by nbugash on 16/10/15.
 */

/* HTML TEMPLATE  */
var attackRequestTemplate =
    "<div class='form-group'>"+
    "<label>Attack Request</label>" +
    "<textarea rows='5' id='attack-request-headers' class='form-control'>{{attack_request_header}}</textarea>" +
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
    "<button id='proxy-btn' type='button' class='btn btn-default'>Proxy</button>" +
    "<button id='edit-cookies-btn' type='button' class='btn btn-default'>Edit Cookie</button>" +
    "<button id='reset-request-btn' type='button' class='btn btn-default'>Reset Request</button>" +
    "<button id='send-request-btn' type='button' class='btn btn-default'>Send Request</button>" +
    "<button id='compare-btn' type='button' class='btn btn-default'>Compare</button>" +
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

/* Restricted Chrome Headers */
var restrictedChromeHeaders = [
    "ACCEPT-CHARSET",
    "ACCEPT-ENCODING",
    "ACCESS-CONTROL-REQUEST-HEADERS",
    "ACCESS-CONTROL-REQUEST-METHOD",
    "CONTENT-LENGTHNECTION",
    "CONTENT-LENGTH",
    "COOKIE",
    "CONTENT-TRANSFER-ENCODING",
    "DATE",
    "EXPECT",
    "HOST",
    "KEEP-ALIVE",
    "ORIGIN",
    "REFERER",
    "TE",
    "TRAILER",
    "TRANSFER-ENCODING",
    "UPGRADE",
    "USER-AGENT",
    "VIA"
];

var AppSpiderValidate = {

    decodeHeader: function(sHTTPHeader) {
        var decodedHeader = window.atob(sHTTPHeader);
        return decodedHeader;
    },

    parseHeader: function(requests) {
        var data = {};
        var step_num = 1;
        var array_request = requests.split(/(#H#G#F#E#D#C#B#A#)/);
        for (var i = 0; i < array_request.length; i++ ) {
            var step = {};
            if (array_request[i].indexOf("#A#B#C#D#E#F#G#H#") > -1) {
                var array = array_request[i].split(/(#A#B#C#D#E#F#G#H#)/);
                var request = array[0].trim();
                var desc = array[array.length -1].trim();
                /* Debugging */
                data['step' + step_num] = {
                    step_num: "Step " + step_num,
                    attack_request_header: request,
                    attack_description: desc
                };
                step_num++;
            }
        }
        return data;
    },

    makeRequest: function(request) {
        var headers = AppSpiderValidate.parseRequest(request);
        AppSpiderValidate.sendRequest(headers);
    },

    /* Private */
    parseRequest: function(unparse_request) {
        var array = unparse_request.split("\n");
        var headers = {}
        for (var i = 0; i < array.length; i++) {
            var header = array[i];
            if (header.match(/GET|POST/)) {
                headers['Initial-Request-Line'] = header;
            } else if (header.indexOf(':') > -1) {
                var a = header.split(':');
                headers[a[0].trim()] = a[a.length -1].trim();
            }
        }
        return headers
    },

    /* Private */
    sendRequest: function(headers) {
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.onreadystatechange = function() {
            if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) {
                callback(xmlHTTP.responseText);
            }
        };
        var method = "";
        var url = "";
        var http_version = "";

        var a = headers['Initial-Request-Line'].split(' ');
        if (a.length == 3) {
            method = a[0];
            url = a[1];
            http_version = a[2];
            if (!url.match(/http|https|www/i)){
                url = headers['Host'] + url;
            }

        }
        xmlHTTP.open(method, url, true); // true for asynchronous

        for (var header in headers) {
            if (header != 'Initial-Request-Line') {
                var found;
                if (found = restrictedChromeHeaders.indexOf(header.toUpperCase()) >= 0) {
                    header = 'AppSpider-' + header;
                }
                xmlHTTP.setRequestHeader(header,headers[header]);
            }
        }
        HTTPRequest.get(url, function(status, headers, content){
            console.log(status, headers, content);
        });
        xmlHTTP;
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

/* Temp data */
var encodedhttp = "R0VUIC9kYXRhc3RvcmUvZ2V0aW1hZ2VfYnlfaWQucGhwP2lkPTIgSFRUUC8xLjENCkFjY2VwdDogdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksKi8qO3E9MC44DQpBY2NlcHQtQ2hhcnNldDogKg0KQWNjZXB0LUVuY29kaW5nOiBnemlwLCBkZWZsYXRlDQpVc2VyLUFnZW50OiBNb3ppbGxhLzUuMCAoV2luZG93czsgVTsgV2luZG93cyBOVCA1LjI7IGVuLVVTOyBydjoxLjkuMS41KSBHZWNrby8yMDA5MTEwMiBGaXJlZm94LzMuNS41DQpIb3N0OiB3d3cud2Vic2NhbnRlc3QuY29tDQpSZWZlcmVyOiBodHRwOi8vd3d3LndlYnNjYW50ZXN0LmNvbS9kYXRhc3RvcmUvc2VhcmNoX2dldF9ieV9pZC5waHA/aWQ9NA0KQ29va2llOiBsYXN0X3NlYXJjaD0yOyBURVNUX1NFU1NJT05JRD1lMzJwOWM5bjN0OG5rdWpjYTlqMTZwcjRyMDsgTkJfU1JWSUQ9c3J2MTQwNzAwOyBsb2dpbl9lcnJvcj1CYWQrdXNlcituYW1lK29yK3Bhc3N3b3JkDQoNCiNBI0IjQyNEI0UjRiNHI0gjClRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyIHZhbHVlcyB3ZXJlIHN1Ym1pdHRlZCB0byB0ZXN0IGZvciB0aGlzIHZ1bG5lcmFiaWxpdHk6CiMxLCBQYXNzZWQ6IDIgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbC4gQWx0ZXJuYXRlIHZhbHVlLgojMiwgUGFzc2VkOiA5IE1PRCA1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgb3JpZ2luYWwuCiMzLCBQYXNzZWQ6IDcgTU9EIDUgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSByZXNwb25zZSBmcm9tIHRoZSBBbHRlcm5hdGUgdmFsdWUuCiM0LCBQYXNzZWQ6IDE0IE1PRCA1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgb3JpZ2luYWwuCiM1LCBQYXNzZWQ6IDkgTU9EIDcgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSByZXNwb25zZSBmcm9tIHRoZSBBbHRlcm5hdGUgdmFsdWUuCg0KVnVsbmVyYWJsZSBhcmVhcyBpbiB0aGUgcmVzcG9uc2VzIGFyZSBub3QgaGlnaGxpZ2h0ZWQ6IE9yaWdpbmFsIFJlc3BvbnNlIGlzIEJpbmFyeSAoZGVmaW5lZCBieSBjb250ZW50LXR5cGUpCiNII0cjRiNFI0QjQyNCI0EjCkdFVCAvZGF0YXN0b3JlL2dldGltYWdlX2J5X2lkLnBocD9pZD05JTIwTU9EJTIwNSBIVFRQLzEuMQ0KQWNjZXB0OiB0ZXh0L2h0bWwsYXBwbGljYXRpb24veGh0bWwreG1sLGFwcGxpY2F0aW9uL3htbDtxPTAuOSwqLyo7cT0wLjgNCkFjY2VwdC1DaGFyc2V0OiAqDQpBY2NlcHQtRW5jb2Rpbmc6IGd6aXAsIGRlZmxhdGUNClVzZXItQWdlbnQ6IE1vemlsbGEvNS4wIChXaW5kb3dzOyBVOyBXaW5kb3dzIE5UIDUuMjsgZW4tVVM7IHJ2OjEuOS4xLjUpIEdlY2tvLzIwMDkxMTAyIEZpcmVmb3gvMy41LjUNCkhvc3Q6IHd3dy53ZWJzY2FudGVzdC5jb20NClJlZmVyZXI6IGh0dHA6Ly93d3cud2Vic2NhbnRlc3QuY29tL2RhdGFzdG9yZS9zZWFyY2hfZ2V0X2J5X2lkLnBocD9pZD00DQpDb29raWU6IGxhc3Rfc2VhcmNoPTkrTU9EKzU7IFRFU1RfU0VTU0lPTklEPWUzMnA5YzluM3Q4bmt1amNhOWoxNnByNHIwOyBOQl9TUlZJRD1zcnYxNDA3MDA7IGxvZ2luX2Vycm9yPUJhZCt1c2VyK25hbWUrb3IrcGFzc3dvcmQNCg0KI0EjQiNDI0QjRSNGI0cjSCMKVGhlIGZvbGxvd2luZyBwYXJhbWV0ZXIgdmFsdWVzIHdlcmUgc3VibWl0dGVkIHRvIHRlc3QgZm9yIHRoaXMgdnVsbmVyYWJpbGl0eToKIzEsIFBhc3NlZDogMiAtIHRoZSByZXNwb25zZSBzaG91bGQgYmUgZGlmZmVyZW50IGZyb20gdGhlIG9yaWdpbmFsLiBBbHRlcm5hdGUgdmFsdWUuCiMyLCBQYXNzZWQ6IDkgTU9EIDUgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzMsIFBhc3NlZDogNyBNT0QgNSAtIHRoZSByZXNwb25zZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIHJlc3BvbnNlIGZyb20gdGhlIEFsdGVybmF0ZSB2YWx1ZS4KIzQsIFBhc3NlZDogMTQgTU9EIDUgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBvcmlnaW5hbC4KIzUsIFBhc3NlZDogOSBNT0QgNyAtIHRoZSByZXNwb25zZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIHJlc3BvbnNlIGZyb20gdGhlIEFsdGVybmF0ZSB2YWx1ZS4KDQpWdWxuZXJhYmxlIGFyZWFzIGluIHRoZSByZXNwb25zZXMgYXJlIG5vdCBoaWdobGlnaHRlZDogT3JpZ2luYWwgUmVzcG9uc2UgaXMgQmluYXJ5IChkZWZpbmVkIGJ5IGNvbnRlbnQtdHlwZSkKI0gjRyNGI0UjRCNDI0IjQSMKR0VUIC9kYXRhc3RvcmUvZ2V0aW1hZ2VfYnlfaWQucGhwP2lkPTclMjBNT0QlMjA1IEhUVFAvMS4xDQpBY2NlcHQ6IHRleHQvaHRtbCxhcHBsaWNhdGlvbi94aHRtbCt4bWwsYXBwbGljYXRpb24veG1sO3E9MC45LCovKjtxPTAuOA0KQWNjZXB0LUNoYXJzZXQ6ICoNCkFjY2VwdC1FbmNvZGluZzogZ3ppcCwgZGVmbGF0ZQ0KVXNlci1BZ2VudDogTW96aWxsYS81LjAgKFdpbmRvd3M7IFU7IFdpbmRvd3MgTlQgNS4yOyBlbi1VUzsgcnY6MS45LjEuNSkgR2Vja28vMjAwOTExMDIgRmlyZWZveC8zLjUuNQ0KSG9zdDogd3d3LndlYnNjYW50ZXN0LmNvbQ0KUmVmZXJlcjogaHR0cDovL3d3dy53ZWJzY2FudGVzdC5jb20vZGF0YXN0b3JlL3NlYXJjaF9nZXRfYnlfaWQucGhwP2lkPTQNCkNvb2tpZTogbGFzdF9zZWFyY2g9OStNT0QrNTsgVEVTVF9TRVNTSU9OSUQ9ZTMycDljOW4zdDhua3VqY2E5ajE2cHI0cjA7IE5CX1NSVklEPXNydjE0MDcwMDsgbG9naW5fZXJyb3I9QmFkK3VzZXIrbmFtZStvcitwYXNzd29yZA0KDQojQSNCI0MjRCNFI0YjRyNIIwpUaGUgZm9sbG93aW5nIHBhcmFtZXRlciB2YWx1ZXMgd2VyZSBzdWJtaXR0ZWQgdG8gdGVzdCBmb3IgdGhpcyB2dWxuZXJhYmlsaXR5OgojMSwgUGFzc2VkOiAyIC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgb3JpZ2luYWwuIEFsdGVybmF0ZSB2YWx1ZS4KIzIsIFBhc3NlZDogOSBNT0QgNSAtIHRoZSByZXNwb25zZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIG9yaWdpbmFsLgojMywgUGFzc2VkOiA3IE1PRCA1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgojNCwgUGFzc2VkOiAxNCBNT0QgNSAtIHRoZSByZXNwb25zZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIG9yaWdpbmFsLgojNSwgUGFzc2VkOiA5IE1PRCA3IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgoNClZ1bG5lcmFibGUgYXJlYXMgaW4gdGhlIHJlc3BvbnNlcyBhcmUgbm90IGhpZ2hsaWdodGVkOiBPcmlnaW5hbCBSZXNwb25zZSBpcyBCaW5hcnkgKGRlZmluZWQgYnkgY29udGVudC10eXBlKQojSCNHI0YjRSNEI0MjQiNBIwpHRVQgL2RhdGFzdG9yZS9nZXRpbWFnZV9ieV9pZC5waHA/aWQ9MTQlMjBNT0QlMjA1IEhUVFAvMS4xDQpBY2NlcHQ6IHRleHQvaHRtbCxhcHBsaWNhdGlvbi94aHRtbCt4bWwsYXBwbGljYXRpb24veG1sO3E9MC45LCovKjtxPTAuOA0KQWNjZXB0LUNoYXJzZXQ6ICoNCkFjY2VwdC1FbmNvZGluZzogZ3ppcCwgZGVmbGF0ZQ0KVXNlci1BZ2VudDogTW96aWxsYS81LjAgKFdpbmRvd3M7IFU7IFdpbmRvd3MgTlQgNS4yOyBlbi1VUzsgcnY6MS45LjEuNSkgR2Vja28vMjAwOTExMDIgRmlyZWZveC8zLjUuNQ0KSG9zdDogd3d3LndlYnNjYW50ZXN0LmNvbQ0KUmVmZXJlcjogaHR0cDovL3d3dy53ZWJzY2FudGVzdC5jb20vZGF0YXN0b3JlL3NlYXJjaF9nZXRfYnlfaWQucGhwP2lkPTQNCkNvb2tpZTogbGFzdF9zZWFyY2g9OStNT0QrNTsgVEVTVF9TRVNTSU9OSUQ9ZTMycDljOW4zdDhua3VqY2E5ajE2cHI0cjA7IE5CX1NSVklEPXNydjE0MDcwMDsgbG9naW5fZXJyb3I9QmFkK3VzZXIrbmFtZStvcitwYXNzd29yZA0KDQojQSNCI0MjRCNFI0YjRyNIIwpUaGUgZm9sbG93aW5nIHBhcmFtZXRlciB2YWx1ZXMgd2VyZSBzdWJtaXR0ZWQgdG8gdGVzdCBmb3IgdGhpcyB2dWxuZXJhYmlsaXR5OgojMSwgUGFzc2VkOiAyIC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgb3JpZ2luYWwuIEFsdGVybmF0ZSB2YWx1ZS4KIzIsIFBhc3NlZDogOSBNT0QgNSAtIHRoZSByZXNwb25zZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIG9yaWdpbmFsLgojMywgUGFzc2VkOiA3IE1PRCA1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgojNCwgUGFzc2VkOiAxNCBNT0QgNSAtIHRoZSByZXNwb25zZSBzaG91bGQgYmUgdGhlIHNhbWUgYXMgdGhlIG9yaWdpbmFsLgojNSwgUGFzc2VkOiA5IE1PRCA3IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQWx0ZXJuYXRlIHZhbHVlLgoNClZ1bG5lcmFibGUgYXJlYXMgaW4gdGhlIHJlc3BvbnNlcyBhcmUgbm90IGhpZ2hsaWdodGVkOiBPcmlnaW5hbCBSZXNwb25zZSBpcyBCaW5hcnkgKGRlZmluZWQgYnkgY29udGVudC10eXBlKQojSCNHI0YjRSNEI0MjQiNBIwpHRVQgL2RhdGFzdG9yZS9nZXRpbWFnZV9ieV9pZC5waHA/aWQ9OSUyME1PRCUyMDcgSFRUUC8xLjENCkFjY2VwdDogdGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksKi8qO3E9MC44DQpBY2NlcHQtQ2hhcnNldDogKg0KQWNjZXB0LUVuY29kaW5nOiBnemlwLCBkZWZsYXRlDQpVc2VyLUFnZW50OiBNb3ppbGxhLzUuMCAoV2luZG93czsgVTsgV2luZG93cyBOVCA1LjI7IGVuLVVTOyBydjoxLjkuMS41KSBHZWNrby8yMDA5MTEwMiBGaXJlZm94LzMuNS41DQpIb3N0OiB3d3cud2Vic2NhbnRlc3QuY29tDQpSZWZlcmVyOiBodHRwOi8vd3d3LndlYnNjYW50ZXN0LmNvbS9kYXRhc3RvcmUvc2VhcmNoX2dldF9ieV9pZC5waHA/aWQ9NA0KQ29va2llOiBsYXN0X3NlYXJjaD05K01PRCs1OyBURVNUX1NFU1NJT05JRD1lMzJwOWM5bjN0OG5rdWpjYTlqMTZwcjRyMDsgTkJfU1JWSUQ9c3J2MTQwNzAwOyBsb2dpbl9lcnJvcj1CYWQrdXNlcituYW1lK29yK3Bhc3N3b3JkDQoNCiNBI0IjQyNEI0UjRiNHI0gjClRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyIHZhbHVlcyB3ZXJlIHN1Ym1pdHRlZCB0byB0ZXN0IGZvciB0aGlzIHZ1bG5lcmFiaWxpdHk6CiMxLCBQYXNzZWQ6IDIgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbC4gQWx0ZXJuYXRlIHZhbHVlLgojMiwgUGFzc2VkOiA5IE1PRCA1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgb3JpZ2luYWwuCiMzLCBQYXNzZWQ6IDcgTU9EIDUgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSByZXNwb25zZSBmcm9tIHRoZSBBbHRlcm5hdGUgdmFsdWUuCiM0LCBQYXNzZWQ6IDE0IE1PRCA1IC0gdGhlIHJlc3BvbnNlIHNob3VsZCBiZSB0aGUgc2FtZSBhcyB0aGUgb3JpZ2luYWwuCiM1LCBQYXNzZWQ6IDkgTU9EIDcgLSB0aGUgcmVzcG9uc2Ugc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSByZXNwb25zZSBmcm9tIHRoZSBBbHRlcm5hdGUgdmFsdWUuCg0KVnVsbmVyYWJsZSBhcmVhcyBpbiB0aGUgcmVzcG9uc2VzIGFyZSBub3QgaGlnaGxpZ2h0ZWQ6IE9yaWdpbmFsIFJlc3BvbnNlIGlzIEJpbmFyeSAoZGVmaW5lZCBieSBjb250ZW50LXR5cGUp";
var decodedHeader = AppSpiderValidate.decodeHeader(encodedhttp);
var data = AppSpiderValidate.parseHeader(decodedHeader);

//chrome.webRequest.onBeforeSendHeaders.addListener(function (req) {
//    var customurl = req.url.substring(0, req.url.indexOf('/embed/'));
//    var customRefererObject = {
//        name: 'Referer',
//        value: customurl
//    };
//    $.grep(req.requestHeaders, function(header) {
//      if (header.name == 'Referer') {
//          header.value = customurl;
//      }
//    })
//});


/* Event Handler */
document.getElementById('appspider-nav').addEventListener('onload', AppSpiderValidate.renderNavTemplate(data));
document.getElementById('step-template').addEventListener('onload', AppSpiderValidate.renderTemplate('stepTemplate','step-template', data));
document.getElementById('send-request-btn').addEventListener('click', AppSpiderValidate.makeRequest($('textarea#attack-request-headers').val()));