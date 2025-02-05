exports.beginsWith = beginsWith; 
exports.endsWith = endsWith;
exports.stringCountFields = stringCountFields;
exports.stringDelete = stringDelete;
exports.stringMid = stringMid;
exports.padWithZeros = padWithZeros;
exports.getDatePath = getDatePath;
exports.secondsSince = secondsSince;
exports.bumpUrlString = bumpUrlString;
exports.stringContains = stringContains;
exports.sameDay = sameDay;
exports.jsonStringify = jsonStringify;
exports.stringNthField = stringNthField;
exports.getBoolean = getBoolean;

function sameDay (d1, d2) { 
	//returns true if the two dates are on the same day
	d1 = new Date (d1);
	d2 = new Date (d2);
	return ((d1.getFullYear () == d2.getFullYear ()) && (d1.getMonth () == d2.getMonth ()) && (d1.getDate () == d2.getDate ()));
	}
function dayGreaterThanOrEqual (d1, d2) { //9/2/14 by DW
	d1 = new Date (d1);
	d1.setHours (0);
	d1.setMinutes (0);
	d1.setSeconds (0);
	
	d2 = new Date (d2);
	d2.setHours (0);
	d2.setMinutes (0);
	d2.setSeconds (0);
	
	return (d1 >= d2);
	}
function stringLower (s) {
	return (s.toLowerCase ());
	}
function secondsSince (when) { 
	var now = new Date ();
	when = new Date (when);
	return ((now - when) / 1000);
	}
function padWithZeros (num, ctplaces) { 
	var s = num.toString ();
	while (s.length < ctplaces) {
		s = "0" + s;
		}
	return (s);
	}
function getDatePath (theDate, flLastSeparator) {
	if (theDate === undefined) {
		theDate = new Date ();
		}
	else {
		theDate = new Date (theDate); //8/12/14 by DW -- make sure it's a date type
		}
	if (flLastSeparator === undefined) {
		flLastSeparator = true;
		}
	
	var month = padWithZeros (theDate.getMonth () + 1, 2);
	var day = padWithZeros (theDate.getDate (), 2);
	var year = theDate.getFullYear ();
	
	if (flLastSeparator) {
		return (year + "/" + month + "/" + day + "/");
		}
	else {
		return (year + "/" + month + "/" + day);
		}
	}
function multipleReplaceAll (s, adrTable, flCaseSensitive, startCharacters, endCharacters) { 
	if(flCaseSensitive===undefined){
		flCaseSensitive = false;
		}
	if(startCharacters===undefined){
		startCharacters="";
		}
	if(endCharacters===undefined){
		endCharacters="";
		}
	for( var item in adrTable){
		var replacementValue = adrTable[item];
		var regularExpressionModifier = "g";
		if(!flCaseSensitive){
			regularExpressionModifier = "gi";
			}
		var regularExpressionString = (startCharacters+item+endCharacters).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
		var regularExpression = new RegExp(regularExpressionString, regularExpressionModifier);
		s = s.replace(regularExpression, replacementValue);
		}
	return s;
	}
function endsWith (s, possibleEnding, flUnicase) {
	if ((s === undefined) || (s.length == 0)) { 
		return (false);
		}
	var ixstring = s.length - 1;
	if (flUnicase === undefined) {
		flUnicase = true;
		}
	if (flUnicase) {
		for (var i = possibleEnding.length - 1; i >= 0; i--) {
			if (stringLower (s [ixstring--]) != stringLower (possibleEnding [i])) {
				return (false);
				}
			}
		}
	else {
		for (var i = possibleEnding.length - 1; i >= 0; i--) {
			if (s [ixstring--] != possibleEnding [i]) {
				return (false);
				}
			}
		}
	return (true);
	}
function stringContains (s, whatItMightContain, flUnicase) { //11/9/14 by DW
	if (flUnicase === undefined) {
		flUnicase = true;
		}
	if (flUnicase) {
		s = s.toLowerCase ();
		whatItMightContain = whatItMightContain.toLowerCase ();
		}
	return (s.indexOf (whatItMightContain) != -1);
	}
function beginsWith (s, possibleBeginning, flUnicase) { 
	if (s.length == 0) { //1/1/14 by DW
		return (false);
		}
	if (flUnicase === undefined) {
		flUnicase = true;
		}
	if (flUnicase) {
		for (var i = 0; i < possibleBeginning.length; i++) {
			if (stringLower (s [i]) != stringLower (possibleBeginning [i])) {
				return (false);
				}
			}
		}
	else {
		for (var i = 0; i < possibleBeginning.length; i++) {
			if (s [i] != possibleBeginning [i]) {
				return (false);
				}
			}
		}
	return (true);
	}
function isAlpha (ch) {
	return (((ch >= 'a') && (ch <= 'z')) || ((ch >= 'A') && (ch <= 'Z')));
	}
function isNumeric (ch) {
	return ((ch >= '0') && (ch <= '9'));
	}
function trimLeading (s, ch) {
	while (s.charAt (0) === ch) {
		s = s.substr (1);
		}
	return (s);
	}
function trimTrailing (s, ch) { 
	while (s.charAt (s.length - 1) === ch) {
		s = s.substr (0, s.length - 1);
		}
	return (s);
	}
function trimWhitespace (s) { //rewrite -- 5/30/14 by DW
	function isWhite (ch) {
		switch (ch) {
			case " ": case "\r": case "\n": case "\t":
				return (true);
			}
		return (false);
		}
	if (s === undefined) { //9/10/14 by DW
		return ("");
		}
	while (isWhite (s.charAt (0))) {
		s = s.substr (1);
		}
	while (s.length > 0) {
		if (!isWhite (s.charAt (0))) {
			break;
			}
		s = s.substr (1);
		}
	while (s.length > 0) {
		if (!isWhite (s.charAt (s.length - 1))) {
			break;
			}
		s = s.substr (0, s.length - 1);
		}
	return (s);
	}
function addPeriodAtEnd (s) {
	s = trimWhitespace (s);
	if (s.length == 0) {
		return (s);
		}
	switch (s [s.length - 1]) {
		case ".":
		case ",":
		case "?":
		case "\"":
		case "'":
		case ":":
		case ";":
		case "!":
			return (s);
		default:
			return (s + ".");
		}
	}
function getBoolean (val) { //12/5/13 by DW
	switch (typeof (val)) {
		case "string":
			if (val.toLowerCase () == "true") {
				return (true);
				}
			break;
		case "boolean":
			return (val);
			break;
		case "number":
			if (val == 1) {
				return (true);
				}
			break;
		}
	return (false);
	}
function bumpUrlString (s) { //5/10/14 by DW
	if (s === undefined) {
		s = "0";
		}
	function bumpChar (ch) {
		function num (ch) {
			return (ch.charCodeAt (0));
			}
		if ((ch >= "0") && (ch <= "8")) {
			ch = String.fromCharCode (num (ch) + 1);
			}
		else {
			if (ch == "9") {
				ch = "a";
				}
			else {
				if ((ch >= "a") && (ch <= "y")) {
					ch = String.fromCharCode (num (ch) + 1);
					}
				else {
					throw "rollover!";
					}
				}
			}
		return (ch);
		}
	try {
		var chlast = bumpChar (s [s.length - 1]);
		s = s.substr (0, s.length - 1) + chlast;
		return (s);
		}
	catch (tryError) {
		if (s.length == 1) {
			return ("00");
			}
		else {
			s = s.substr (0, s.length - 1);
			s = bumpUrlString (s) + "0";
			return (s);
			}
		}
	}
function stringDelete (s, ix, ct) {
	var start = ix - 1;
	var end = (ix + ct) - 1;
	var s1 = s.substr (0, start);
	var s2 = s.substr (end);
	return (s1 + s2);
	}
function replaceAll (s, searchfor, replacewith) {
	function escapeRegExp (string) {
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}
	return (s.replace (new RegExp (escapeRegExp (searchfor), 'g'), replacewith));
	}
function stringCountFields (s, chdelim) {
	var ct = 1;
	if (s.length == 0) {
		return (0);
		}
	for (var i = 0; i < s.length; i++) {
		if (s [i] == chdelim) {
			ct++;
			}
		}
	return (ct)
	}
function stringNthField (s, chdelim, n) {
	var splits = s.split (chdelim);
	if (splits.length >= n) {
		return splits [n-1];
		}
	return ("");
	}
function dateYesterday (d) {
	return (new Date (new Date (d) - (24 * 60 * 60 * 1000)));
	}
function stripMarkup (s) { //5/24/14 by DW
	if ((s === undefined) || (s == null) || (s.length == 0)) {
		return ("");
		}
	return (s.replace (/(<([^>]+)>)/ig, ""));
	}
function maxStringLength (s, len, flWholeWordAtEnd, flAddElipses) {
	if (flWholeWordAtEnd === undefined) {
		flWholeWordAtEnd = true;
		}
	if (flAddElipses === undefined) { //6/2/14 by DW
		flAddElipses = true;
		}
	if (s.length > len) {
		s = s.substr (0, len);
		if (flWholeWordAtEnd) {
			while (s.length > 0) {
				if (s [s.length - 1] == " ") {
					if (flAddElipses) {
						s += "...";
						}
					break;
					}
				s = s.substr (0, s.length - 1); //pop last char
				}
			}
		}
	return (s);
	}
function random (lower, upper) {
	var range = upper - lower + 1;
	return (Math.floor ((Math.random () * range) + lower));
	}
function removeMultipleBlanks (s) { //7/30/14 by DW
	return (s.toString().replace (/ +/g, " "));
	}
function stringAddCommas (x) { //5/27/14 by DW
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
function readHttpFile (url, callback, timeoutInMilliseconds) { //5/27/14 by DW
	if (timeoutInMilliseconds === undefined) {
		timeoutInMilliseconds = 30000;
		}
	var jxhr = $.ajax ({ 
		url: url,
		dataType: "text" , 
		timeout: timeoutInMilliseconds 
		}) 
	.success (function (data, status) { 
		callback (data);
		}) 
	.error (function (status) { 
		console.log ("readHttpFile: url == " + url + ", error == " + jsonStringify (status));
		callback (undefined);
		});
	}
function readHttpFileThruProxy (url, type, callback) { //10/25/14 by DW
	var urlReadFileApi = "http://pub.fargo.io/httpReadUrl";
	if (type === undefined) {
		type = "text/plain";
		}
	var jxhr = $.ajax ({ 
		url: urlReadFileApi + "?url=" + encodeURIComponent (url) + "&type=" + encodeURIComponent (type),
		dataType: "text" , 
		timeout: 30000 
		}) 
	.success (function (data, status) { 
		if (callback != undefined) {
			callback (data);
			}
		}) 
	.error (function (status) { 
		console.log ("readHttpFileThruProxy: url == " + url + ", error == " + status.statusText + ".");
		if (callback != undefined) {
			callback (undefined);
			}
		});
	}
function stringPopLastField (s, chdelim) { //5/28/14 by DW
	if (s.length == 0) {
		return (s);
		}
	if (endsWith (s, chdelim)) {
		s = stringDelete (s, s.length, 1);
		}
	while (s.length > 0) {
		if (endsWith (s, chdelim)) {
			return (stringDelete (s, s.length, 1));
			}
		s = stringDelete (s, s.length, 1);
		}
	return (s);
	}
function filledString (ch, ct) { //6/4/14 by DW
	var s = "";
	for (var i = 0; i < ct; i++) {
		s += ch;
		}
	return (s);
	}
function encodeXml (s) { //7/15/14 by DW
	var charMap = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		'"': '&'+'quot;'
		};
	s = s.toString();
	s = s.replace(/\u00A0/g, " ");
	var escaped = s.replace(/[<>&"]/g, function(ch) {
		return charMap [ch];
		});
	return escaped;
	}
function decodeXml (s) { //11/7/14 by DW
	return (s.replace (/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
	}
function hotUpText (s, url) { //7/18/14 by DW
	
	if (url === undefined) { //makes it easier to call -- 3/14/14 by DW
		return (s);
		}
	
	function linkit (s) {
		return ("<a href=\"" + url + "\" target=\"_blank\">" + s + "</a>");
		}
	var ixleft = s.indexOf ("["), ixright = s.indexOf ("]");
	if ((ixleft == -1) || (ixright == -1)) {
		return (linkit (s));
		}
	if (ixright < ixleft) {
		return (linkit (s));
		}
	
	var linktext = s.substr (ixleft + 1, ixright - ixleft - 1); //string.mid (s, ixleft, ixright - ixleft + 1);
	linktext = "<a href=\"" + url + "\" target=\"_blank\">" + linktext + "</a>";
	
	var leftpart = s.substr (0, ixleft);
	var rightpart = s.substr (ixright + 1, s.length);
	s = leftpart + linktext + rightpart;
	return (s);
	}
function getFavicon (url) { //7/18/14 by DW
	function getDomain (url) {
		if (( url != null ) && (url != "")) {
			url = url.replace("www.","").replace("www2.", "").replace("feedproxy.", "").replace("feeds.", "");
			var root = url.split('?')[0]; // cleans urls of form http://domain.com?a=1&b=2
			var url = root.split('/')[2];
		}
		return (url);
		};
	var domain = getDomain (url);
	return ("http://www.google.com/s2/favicons?domain=" + domain);
	};
function jsonStringify (jstruct) { //7/19/14 by DW
	return (JSON.stringify (jstruct, undefined, 4));
	}
function getURLParameter (name) { //7/21/14 by DW
	return (decodeURI ((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]));
	}
function urlSplitter (url) { //7/15/14 by DW
	var pattern = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
	var result = pattern.exec (url);
	if (result == null) {
		result = [];
		result [5] = url;
		}
	var splitUrl = {
		scheme: result [1],
		host: result [3],
		port: result [4],
		path: result [5],
		query: result [6],
		hash: result [7]
		};
	return (splitUrl);
	}
function innerCaseName (text) { //8/12/14 by DW
	var s = "", ch, flNextUpper = false;
	text = stripMarkup (text); 
	for (var i = 0; i < text.length; i++) {
		ch = text [i];
		if (isAlpha (ch) || isNumeric (ch)) { 
			if (flNextUpper) {
				ch = ch.toUpperCase ();
				flNextUpper = false;
				}
			else {
				ch = ch.toLowerCase ();
				}
			s += ch;
			}
		else {
			if (ch == ' ') { 
				flNextUpper = true;
				}
			}
		}
	return (s);
	}
function hitCounter (counterGroup, counterServer) { //8/12/14 by DW
	var defaultCounterGroup = "scripting", defaultCounterServer = "http://counter.fargo.io/counter";
	var thispageurl = location.href;
	if (counterGroup === undefined) {
		counterGroup = defaultCounterGroup;
		}
	if (counterServer === undefined) {
		counterServer = defaultCounterServer;
		}
	if (thispageurl === undefined) {
		thispageurl = "";
		}
	if (endsWith (thispageurl, "#")) {
		thispageurl = thispageurl.substr (0, thispageurl.length - 1);
		}
	var jxhr = $.ajax ({
		url: counterServer + "?group=" + encodeURIComponent (counterGroup) + "&referer=" + encodeURIComponent (document.referrer) + "&url=" + encodeURIComponent (thispageurl),
		dataType: "jsonp",
		jsonpCallback : "getData",
		timeout: 30000
		})
	.success (function (data, status, xhr) {
		console.log ("hitCounter: counter ping accepted by server.");
		})
	.error (function (status, textStatus, errorThrown) {
		console.log ("hitCounter: counter ping error: " + textStatus);
		});
	}
function stringMid (s, ix, len) { //8/12/14 by DW
	return (s.substr (ix-1, len));
	}
function getCmdKeyPrefix () { //8/15/14 by DW
	if (navigator.platform.toLowerCase ().substr (0, 3) == "mac") {
		return ("&#8984;");
		}
	else {
		return ("Ctrl+"); 
		}
	}
function getRandomSnarkySlogan () { //8/15/14 by DW
	var snarkySlogans = [
		"Good for the environment.", 
		"All baking done on premises.", 
		"Still diggin!", 
		"It's even worse than it appears.", 
		"Ask not what the Internet can do for you...", 
		"You should never argue with a crazy man.", 
		"Welcome back my friends to the show that never ends.", 
		"Greetings, citizen of Planet Earth. We are your overlords. :-)", 
		"We don't need no stinkin rock stars.", 
		"This aggression will not stand.", 
		"Pay no attention to the man behind the curtain.", 
		"Only steal from the best.", 
		"Reallll soooon now...", 
		"What a long strange trip it's been.", 
		"Ask not what the Internet can do for you.", 
		"When in doubt, blog.",
		"Shut up and eat your vegetables.",
		"Don't slam the door on the way out.",
		"Yeah well, that's just, you know, like, your opinion, man.",
		"So, it has come to this."
		]
	return (snarkySlogans [random (0, snarkySlogans.length - 1)]);
	}
function dayOfWeekToString (theDay) { //8/23/14 by DW
	var weekday = [
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		];
	return (weekday[theDay]);
	}
function viewDate (when, flShortDayOfWeek)  {  //8/23/14 by DW
	var now = new Date ();
	when = new Date (when);
	if (sameDay (when, now))  { 
		return (timeString (when, false)) //2/9/13 by DW;
		}
	else  { 
		var oneweek = 1000 * 60 * 60 * 24 * 7;
		var cutoff = now - oneweek;
		if (when > cutoff)   { //within the last week
			var s = dayOfWeekToString (when.getDay ());
			if (flShortDayOfWeek)  { 
				s = s.substring (0, 3);
				}
			return (s);
			}
		else  { 
			return (when.toLocaleDateString ());
			}
		}
	}
function timeString (when, flIncludeSeconds) { //8/26/14 by DW
	var hour = when.getHours (), minutes = when.getMinutes (), ampm = "AM", s;
	if (hour >= 12) {
		ampm = "PM";
		}
	if (hour > 12) {
		hour -= 12;
		}
	if (hour == 0) {
		hour = 12;
		}
	if (minutes < 10) {
		minutes = "0" + minutes;
		}
	if (flIncludeSeconds) { 
		var seconds = when.getSeconds ();
		if (seconds < 10) {
			seconds = "0" + seconds;
			}
		s = hour + ":" + minutes + ":" + seconds + ampm;
		}
	else {
		s = hour + ":" + minutes + ampm;
		}
	return (s);
	}
function stringLastField (s, chdelim) { //8/27/14 by DW
	var ct = stringCountFields (s, chdelim);
	if (ct == 0) { //8/31/14 by DW
		return (s);
		}
	return (stringNthField (s, chdelim, ct));
	}
function maxLengthString (s, maxlength) { //8/27/14 by DW
	if (s.length > maxlength) {
		s = s.substr (0, maxlength);
		while (true) {
			var len = s.length; flbreak = false;
			if (len == 0) {
				break;
				}
			if (s [len - 1] == " ") {
				flbreak = true;
				}
			s = s.substr (0, len - 1);
			if (flbreak) {
				break;
				}
			}
		s = s + "...";
		}
	return (s);
	}
function formatDate (theDate, dateformat, timezone) { //8/28/14 by DW
	if (theDate === undefined) {
		theDate = new Date ();
		}
	if (dateformat === undefined) {
		dateformat = "%c";
		}
	if (timezone === undefined) {
		timezone =  - (new Date ().getTimezoneOffset () / 60);
		}
	try {
		var offset = new Number (timezone);
		var d = new Date (theDate);
		var localTime = d.getTime ();
		var localOffset = d.getTimezoneOffset () *  60000;
		var utc = localTime + localOffset;
		var newTime = utc + (3600000 * offset);
		return (new Date (newTime).strftime (dateformat));
		}
	catch (tryerror) {
		return (new Date (theDate).strftime (dateformat));
		}
	}
function addPeriodToSentence (s) { //8/29/14 by DW
	if (s.length > 0) {
		var fladd = true;
		var ch = s [s.length - 1];
		switch (ch) {
			case "!": case "?": case ":":
				fladd = false;
				break;
			default:
				if (endsWith (s, ".\"")) {
					fladd = false;
					}
				else {
					if (endsWith (s, ".'")) {
						fladd = false;
						}
					}
			}
		if (fladd) {
			s += ".";
			}
		}
	return (s);
	}
function copyScalars (source, dest) { //8/31/14 by DW
	for (var x in source) { 
		var type, val = source [x];
		if (val instanceof Date) { 
			val = val.toString ();
			}
		type = typeof (val);
		if ((type != "object") && (type != undefined)) {
			dest [x] = val;
			}
		}
	}
function linkToDomainFromUrl (url, flshort, maxlength) { //10/10/14 by DW
	var splitUrl = urlSplitter (url), host = splitUrl.host.toLowerCase ();
	if (flshort === undefined) {
		flshort = false;
		}
	if (flshort) {
		var splithost = host.split (".");
		if (splithost.length == 3) {
			host = splithost [1];
			}
		else {
			host = splithost [0];
			}
		}
	else {
		if (beginsWith (host, "www.")) {
			host = stringDelete (host, 1, 4);
			}
		}
	
	if (maxlength != undefined) { //10/10/14; 10:46:56 PM by DW
		if (host.length > maxlength) {
			host = stringMid (host, 1, maxlength) + "...";
			}
		}
	
	return ("<a class=\"aLinkToDomainFromUrl\" href=\"" + url + "\" target=\"blank\">" + host + "</a>");
	}
function getRandomPassword (ctchars) { //10/14/14 by DW
	var s= "", ch;
	while (s.length < ctchars)  {
		ch = String.fromCharCode (random (33, 122));
		if (isAlpha (ch) || isNumeric (ch)) {
			s += ch;
			}
		}
	return (s.toLowerCase ());
	}
function monthToString (theMonthNum) { //11/4/14 by DW
	
	
	var theDate;
	if (theMonthNum === undefined) {
		theDate = new Date ();
		}
	else {
		theDate = new Date ((theMonthNum + 1) + "/1/2014");
		}
	return (formatDate (theDate, "%B"));
	}
function getCanonicalName (text) { //11/4/14 by DW
	var s = "", ch, flNextUpper = false;
	text = stripMarkup (text); //6/30/13 by DW
	for (var i = 0; i < text.length; i++) {
		ch = text [i];
		if (isAlpha (ch) || isNumeric (ch)) {
			if (flNextUpper) {
				ch = ch.toUpperCase ();
				flNextUpper = false;
				}
			else {
				ch = ch.toLowerCase ();
				}
			s += ch;
			}
		else { 
			if (ch == ' ') {
				flNextUpper = true;
				}
			}
		}
	return (s);
	}
function clockNow () { //11/7/14 by DW
	return (new Date ());
	}
function sleepTillTopOfMinute (callback) { //11/22/14 by DW
	var ctseconds = Math.round (60 - (new Date ().getSeconds () + 60) % 60);
	if (ctseconds == 0) {
		ctseconds = 60;
		}
	setTimeout (everyMinute, ctseconds * 1000); 
	}
function scheduleNextRun (callback, ctMillisecsBetwRuns) { //11/27/14 by DW
	var ctmilliseconds = ctMillisecsBetwRuns - (Number (new Date ().getMilliseconds ()) + ctMillisecsBetwRuns) % ctMillisecsBetwRuns;
	setTimeout (callback, ctmilliseconds); 
	}
function urlEncode (s) { //12/4/14 by DW
	return (encodeURIComponent (s));
	}
function popTweetNameAtStart (s) { //12/8/14 by DW
	var ch;
	s = trimWhitespace (s);
	if (s.length > 0) {
		if (s.charAt (0) == "@") {
			while (s.charAt (0) != " ") {
				s = s.substr (1)
				}
			while (s.length > 0) {
				ch = s.charAt (0);
				if ((ch != " ") && (ch != "-")) {
					break;
					}
				s = s.substr (1)
				}
			}
		}
	return (s);
	}
function httpHeadRequest (url, callback) { //12/17/14 by DW
	var jxhr = $.ajax ({
		url: url,
		type: "HEAD",
		dataType: "text",
		timeout: 30000
		})
	.success (function (data, status, xhr) {
		callback (xhr); //you can do xhr.getResponseHeader to get one of the header elements
		})
	}
function httpExt2MIME (ext) { //12/24/14 by DW
	var lowerext = stringLower (ext);
	var map = {
		"au": "audio/basic",
		"avi": "application/x-msvideo",
		"bin": "application/x-macbinary",
		"css": "text/css",
		"dcr": "application/x-director",
		"dir": "application/x-director",
		"dll": "application/octet-stream",
		"doc": "application/msword",
		"dtd": "text/dtd",
		"dxr": "application/x-director",
		"exe": "application/octet-stream",
		"fatp": "text/html",
		"ftsc": "text/html",
		"fttb": "text/html",
		"gif": "image/gif",
		"gz": "application/x-gzip",
		"hqx": "application/mac-binhex40",
		"htm": "text/html",
		"html": "text/html",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"js": "application/javascript",
		"mid": "audio/x-midi",
		"midi": "audio/x-midi",
		"mov": "video/quicktime",
		"mp3": "audio/mpeg",
		"pdf": "application/pdf",
		"png": "image/png",
		"ppt": "application/mspowerpoint",
		"ps": "application/postscript",
		"ra": "audio/x-pn-realaudio",
		"ram": "audio/x-pn-realaudio",
		"sit": "application/x-stuffit",
		"sys": "application/octet-stream",
		"tar": "application/x-tar",
		"text": "text/plain",
		"txt": "text/plain",
		"wav": "audio/x-wav",
		"wrl": "x-world/x-vrml",
		"xml": "text/xml",
		"zip": "application/zip"
		};
	for (x in map) {
		if (stringLower (x) == lowerext) {
			return (map [x]);
			}
		}
	return ("text/plain");
	}

