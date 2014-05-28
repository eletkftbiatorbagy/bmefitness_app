const StartPage=null;      ///  DEVELOPMENT......................................................................................
const AJAX_URL = "http://fajlbank.hu/";
const OldalSzam = 14;   //  ennyi lap van definiálva a .html fájlban
var LOGIN = false;
var REGISZTRALVA = false;
var EMAIL;
var EMAIL_hash;
var NEV;
var AVATAR;

var SzazalekH;  			// az oldal magasságának az 1%-a (px)
var SzazalekW;  			// az oldal szélességének az 1%-a (px)

var BodyHeight;
var OldalMost;
var LablecMost;

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var Elozmenyek = Array();
const ElozmenyekMAX = 25;
var EHistory = Array();
var ELOZMENYEK=Array('csak a mai','utolsó 5','utolsó 10');

var PS3; var PS4; var PS5; var PS6; var PS8;
        var RM1; var RM2; var RM3;

var RHatterH;
var RCsikH;
var RNevH;
var RNevT;  var RNevT2;	
var RNevLH;
var RIdoH;
var RIdoT;  var RIdoT2;
var RCsiH;
var RCsiT;  var RCsiT2;
var GombH;

var ErtekelesProba;
var ErtekelesOK = false;
var Ertekelesek = Array();
var callback;                   // ajax hívás visszatérő függvénye


var Scrolls = Array();			// article gördítő váltzók gyűjteménye

var NavMost;					// aktuálisan megjelenített elmenű

var app = {
    initialize: function() {
        this.bindEvents();
         
        function loaded() 
		{
			
		}
		window.addEventListener('load', loaded, false);
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        //  itt kezdődik a buli ==============================================================================================================================================
        
        var args = {};   // email pluginnek kell 
        
        OrientationReCalc();
        
        setTimeout(function () 
			{
				for (var p=1;p<=OldalSzam;p++)
				{
					Scrolls['POROND'+p] = new iScroll('POROND'+p,{ hScrollbar: false, vScrollbar: false, hScroll: false });
				}
				var S = document.getElementsByTagName('article');
				for (var s=0;s<S.length;s++)
				{
					Scrolls[S[s].id]= new iScroll(S[s],{ hScrollbar: false, vScrollbar: false, hScroll: false });
				}
			}, 100);
        
        
        
        if (StartPage) 
        { Oldal(StartPage,0); }
        else 
        {  Lablec(0,0);  Hint("Bevezetes");}
       
        		
		document.getElementById("WIFI_ONLY").src="img/bme/beki"+((Preferences(1)==0)?0:1)+".png";			  // DEFAULT : bekapcsolva
    	document.getElementById("WIFI_ONLY").className=((Preferences(1)==0)?"setting":"setting on");
    	
    	document.getElementById("TIPPEK").src="img/bme/beki"+((Preferences(2)==0)?0:1)+".png";			  // DEFAULT : bekapcsolva
    	document.getElementById("TIPPEK").className=((Preferences(2)==0)?"setting":"setting on");
		
		//Hammer.defaults.tap_always = false;
		
		Hammer(document.getElementById("SETTINGS0")).on("tap", function(event){ Oldal(10,0); });
		
		Hammer(document.getElementById("F1")).on("tap", function(event){ Oldal(5,0); });
		Hammer(document.getElementById("F2")).on("tap", function(event){ Oldal(6,0); });
		Hammer(document.getElementById("F3")).on("tap", function(event){ Oldal(7,0); });
		Hammer(document.getElementById("F4")).on("tap", function(event){ Oldal(8,0); });
		Hammer(document.getElementById("F5")).on("tap", function(event){ Szinkron(); Oldal(9,0); }); 
		//Hammer(document.getElementById("F5")).on("click", function(event){ event.preventDefault(); });
		
		
		var V = document.getElementsByTagName("input");
		for (var v=0;v<V.length; v++)
		{
			V[v].addEventListener('focus', function(e){ keyboard(false,e); } ,false);
			V[v].addEventListener('blur', function(e){ keyboard(true,e); } ,false);
		}	
		
		for (var v=1;v<=OldalSzam; v++)
		{
			Hammer(document.getElementById("VISSZA"+v)).on("tap", function(event){ Vissza(); }); 
			Hammer(document.getElementById("LOGO"+v)).on("tap", function(event){ Oldal(0,0); });
		}	
		Hammer(document.getElementById("PopUp_x")).on("tap", function(event){ PopUp_HTML(null); });
		Hammer(document.getElementById("PopUp")).on("tap", function(event){ PopUp_HTML(null); });
		
		
		var NAV = document.getElementsByTagName("nav");
		for (n in NAV)
		{
			if (NAV[n].tagName=="NAV")
			{
				Hammer(NAV[n]).on("tap", function(event){ Nav(this.id); } );
				if (NAV[n].parentNode.parentNode.tagName=="ARTICLE") { NAV[n].classList.add("subnav"); }
			}
		}	
    	 
    	var HEA = document.getElementsByTagName("header");
		for (h in HEA)
		{
			if (HEA[h].tagName=="HEADER" && HEA[h].getAttribute("alt")!="") { Hammer(HEA[h]).on("tap", function(event){ Help(this); } );  }
		} 
    	 
		document.addEventListener("backbutton", Vissza, false);
		
		Hammer(document.getElementById("LOGINBUTTON")).on("tap", function(event){ LoginButton();  });
		
		Hammer(document.getElementById("CHAVATAR")).on("tap", function(event)	{  if (AVATAR) { Oldal(14,0); } else { Oldal(12,0);}  });
		Hammer(document.getElementById("MODAVATAR")).on("tap", function(event)	{  if (AVATAR) { Oldal(14,0); } else { Oldal(12,0);}  });
		Hammer(document.getElementById("DATAAVATAR")).on("tap", function(event)	{  if (AVATAR) { Oldal(14,0); } else { Oldal(12,0);}  });
		
		
				
		var EAV = Hammer(document.getElementById('EAVATAR'), 
		{
			transform_always_block: true,
			transform_min_scale: 1,
			drag_block_horizontal: true,
			drag_block_vertical: true,
			drag_min_distance: 0
		});
		
		EAV.on("touch transform drag dragend", function(ev)		{  elemRect = document.getElementById('EDITAVATAR'); Avatar_mozgat(ev);  });
		
		
		
		Hammer(document.getElementById("KAMERA_FOTO")).on("tap", function(event){ 
					navigator.camera.getPicture(onPhotoDataSuccess, onCameraFail, 
					{ 	quality: 70, allowEdit: true,
						destinationType: destinationType.DATA_URL, 
						encodingType: Camera.EncodingType.JPEG,
						targetWidth: 400,
						targetHeight: 400,
						MediaType: 0,
						popoverOptions: CameraPopoverOptions,
						cameraDirection: Camera.Direction.FRONT,
						saveToPhotoAlbum: true
					} ); 
				});
		Hammer(document.getElementById("ALBUM_FOTO")).on("tap", function(event){ 
					navigator.camera.getPicture(onPhotoDataSuccess, onCameraFail, 
					{ 	
						quality: 70,
						targetWidth: 400,
						targetHeight: 400,
						destinationType: destinationType.DATA_URL,
						MediaType: 0,
						sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
					} );
				});
	
		Hammer(document.getElementById("HT1")).on("tap", function(event){ Hint(null); });
		Hammer(document.getElementById("HT2")).on("tap", function(event){ Hint(null); });
		Hammer(document.getElementById("HT3")).on("tap", function(event){ Hint(null); });
		Hammer(document.getElementById("HT4")).on("tap", function(event){ Hint(null); });
		Hammer(document.getElementById("HintTXT")).on("tap", function(event){ Hint(null); });
		Hammer(document.getElementById("HintBezar")).on("tap", function(event){ Hint("bezaras"); });
		Hammer(document.getElementById("HintKikapcs")).on("tap", function(event){ Hint(-1); });
		
		
		
		if (window.device) 
		{   	
			FB.init({ appId: "298154397003522", nativeInterface: CDV.FB, useCachedDialogs: false });
			pictureSource=navigator.camera.PictureSourceType.CAMERA;
        	destinationType=navigator.camera.DestinationType;
		}
		
		console.log('OnDeviceReady fut');    return;
    
		EMAIL = window.localStorage.getItem("email");
		if (!EMAIL) { document.getElementById("LOGINTXT").innerHTML="Tovább >>>"; }
		
		callback = function(response) { Login_adatok('AJAX_LOGIN',response); }; 
		ajax_hivas(AJAX_URL +'get_server_dir.php','', 'callback' ,'AJAX_LOGIN',0); 
		
		
		
		
		
    }};
   //   ooDeviceReady vége ================================================================================================================================================= 
    
   
var LastPage=[0];			// első oldal száma
var LastLablec=[0];			// első oldal lábléce
var LastNav=[0];			// első oldal kiválasztott menűje

function Login_adatok(DOM,response)
{
	var obj = eval(response);
	for(var name in obj) 
	{
    	console.log(name+" = "+ JSON.parse(obj[name])[0]);
	}
	
}


var map;
function initializeMap() {
        var mapOptions = {
          center: new google.maps.LatLng(47.4796413,19.0573835),
          zoom: 17	,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
      }

function Oldal(oldal,lablec,nav)
{
	if (!oldal && oldal!=0) { return; }
	
	NavMost = null;
	clearInterval(Anim_Timer1); Anim_Timer1="";
	clearInterval(Anim_Timer2); Anim_Timer2="";
	
	if (oldal<0)        // vissza
	{
		oldal = Math.abs(oldal);
	}
	else
	{
		LastPage.push(oldal);
		LastLablec.push(lablec);
		//LastNav.push(nav);
	}
	if (oldal==1 && !LOGIN) { oldal=11; }
	
		var I = document.getElementsByTagName("nav");   
		for (var i=0; i<I.length;i++)
		{
			I[i].setAttribute("style","height:"+GombH+"px");
			I[i].style.display = "block";
			I[i].style.visibility = "visible";
		}
		
	var A = document.getElementsByTagName("article");
	for (var a=0; a<A.length;a++)
	{
		A[a].style.display="none";
		A[a].style.paddingTop="20%";
		if (Scrolls[A[a].id]!=null) { Scrolls[A[a].id].enable();}
	}
	
	for (var n=0;n<=OldalSzam;n++)
	{
		document.getElementById("Oldal"+n).style.display=(oldal==n)?"block":"none";
	}
	if (!lablec) { lablec=0; }
	Lablec(oldal,lablec);
	setTimeout(function(){ Oldal2(oldal,lablec); },1000);
	OldalMost = oldal;
	if (nav!=null && nav!="null") { Nav(nav); } else  { LastNav.push(null); }
	if (window.localStorage.getItem("Hint0")==null)
	{ Hint("OldalX"); }
	else {	Hint("Oldal"+oldal); }
}	

function Oldal2(oldal,lablec)
{
	if (oldal==11) 
	{
		document.getElementById("NETWORKSTATUS").innerHTML=network_status();
	}
}

function Vissza()
{
	if (Anim_Timer2!="") { return;}         // a gombok animációja még nem ért véget
	if (LastPage.length==1) { return; }    // utolsó oldalon vagyunk
	var LP=LastPage.pop();	  if (!LP){ return; }
	var LL=LastLablec.pop();
	var LN=LastNav.pop(); LV=(LastNav[parseInt(LastNav.length-1)])?"-":"";
	Oldal(-1*LastPage[parseInt(LastPage.length-1)],LastLablec[parseInt(LastLablec.length-1)],LV+LastNav[parseInt(LastNav.length-1)]);
}


function Lablec(oldal,NR)
{
	var LL = document.getElementById("LABLEC"+oldal);
	LL.innerHTML="";
	for (var n=0;n<4;n++)
	{
		var tabletSize = "";
		
		
		var MENU = document.createElement("div");
			MENU.className = "menu";
			
			if (window.innerWidth > 628)
				tabletSize += "_tablet";
			
			//MENU.style.background="url('img/menu_hatter"+tabletSize+((parseInt(n+1)==NR)?"1":"0")+".jpg') no-repeat";
			
		var IMG = document.createElement("img");
			IMG.className="ikon";
			IMG.src="img/bme/menu"+parseInt(n+1)+((n+1==NR)?"1":"0")+".png";
		IMG.setAttribute("nr",n+1);
		MENU.appendChild(IMG);
		LL.appendChild(MENU);
		//var OLF = ;
		var hammertime = Hammer(MENU).on("tap", function(event){ Oldal(parseInt(event.target.getAttribute('nr')),parseInt(event.target.getAttribute('nr'))); });
		
	}
	LablecMost = NR;
}


function Nav(ID)
{
		if (ID == NavMost ) { return; }
		if (ID=="TIPPEK_RESET") { Tippek_Reset(); return; }
		NavMost = ID;
		var gyors=false;
		if (ID.substr(0,1)=="-")
		{
			ID=ID.substr(1);
			gyors=true;
		}
		else
		{
			LastPage.push(OldalMost);
			LastLablec.push(LablecMost);
			LastNav.push(ID);
		}		
		var gomb=1;
		//var NR = ID.substr(ID.search(/\d/));
		//var NEV = ID.substr(0,ID.search(/\d/));
		var elems = new Array();
		var delays = new Array();
		var ChildNodes = document.getElementById(ID).parentNode.childNodes;
		var gombX = 0;
		var gombC = 0;
		for (c in ChildNodes)
		{
			if (ChildNodes[c].tagName=="NAV") 
			{ 
				if (ChildNodes[c].id==ID) 
				{ 
					gombX = gomb;  gombC = c;
					if (!gyors)
					{
						setTimeout( function() {  document.getElementById(ID).style.position="absolute";animate(document.getElementById(ID),'top','px',parseInt((gombX-1)*GombH),parseInt(0*SzazalekH),80*gombX);},800	);
					}
					else
					{
						document.getElementById(ID).style.position="absolute"; document.getElementById(ID).style.top=parseInt(0*SzazalekH)+"px";
					}
					if (ChildNodes[c].classList.contains("subnav")) 
					{
						document.getElementById(ChildNodes[gombC].parentNode.parentNode.id.toLowerCase()).style.visibility="hidden";
						setTimeout( function() 
						{
							document.getElementById(ChildNodes[gombC].parentNode.parentNode.id.toLowerCase()).style.display="none";
							ChildNodes[gombC].parentNode.parentNode.style.paddingTop=0;
						},(gyors)?0:800);
					}
				}
				else 
				{ 
						elems.push (ChildNodes[c]);
						delays.push (gomb*10);
				}
				gomb++;
			}	
		}
		if (!gyors)
		{
			animate2(elems,'marginLeft','%',0,100,500,delays); 
			setTimeout(function() {document.getElementById(ID.toUpperCase()).style.display="block";  },parseInt(800+80*gombX));  //600*(1+Math.max.apply(Math, delays)/100));
		}
		else
		{
			for (e in elems)
			{
				elems[e].style.marginLeft="500%";
				document.getElementById(ID.toUpperCase()).style.display="block";
			}
		}
		if (ID=='info8') {  setTimeout( function() { initializeMap();},2000); }
		Scrolls['POROND'+OldalMost].scrollTo(0,0,100);
		Scrolls['POROND'+OldalMost].disable();
}


function Nav_OLD(NR)			// hagyományos animáció
{
		LastPage.push(OldalMost);
		LastLablec.push(LablecMost);
		var gomb=1;
		while (gomb<=7)
		{
			if (NR==gomb) { gomb++; }
			animate(document.getElementById("i"+gomb),'opacity','',1,0,500);
			gomb++;
		}
		
}

var Anim_Timer1="", Anim_Timer2="";

function animate(elem,style,unit,from,to,time) {
    if( !elem) return;
    var start = new Date().getTime(),
        Anim_Timer1 = setInterval(function() {
            var step = Math.min(1,(new Date().getTime()-start)/time);
            elem.style[style] = (from+step*(to-from))+unit;
            if( step == 1) { clearInterval(Anim_Timer1); Anim_Timer1=""; }
        },25);
    elem.style[style] = from+unit;
}

function animate2(elems,style,unit,from,to,time,delays) {
    if( !elems) return;
    var start = new Date().getTime();
    var delay_plussz = (1+Math.max.apply(Math, delays)/100);
    time = time * delay_plussz;
    to  = to * delay_plussz;
        Anim_Timer2 = setInterval(function() {
            var step = (new Date().getTime()-start)/time;
            for (var e=0; e<elems.length;e++)
            {
            	if (step>time*delays[e]/100000) {  	elems[e].style[style] = (from+(step-delays[e]/100)*(to-from))+unit;  }
            }	
            if( step >= delay_plussz) { clearInterval(Anim_Timer2); Anim_Timer2=""; }
        },30);
    for (var e=0; e<elems.length;e++)
    {
    	elems[e].style[style] = from+unit;
    }	
}

function network_status() {
            if (!window.device) { return "PC"; }
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = '???';
            states[Connection.ETHERNET] = 'Vezetékes';
            states[Connection.WIFI]     = 'WiFi';
            states[Connection.CELL_2G]  = 'Mobil';
            states[Connection.CELL_3G]  = 'Mobil';
            states[Connection.CELL_4G]  = 'Mobil';
            states[Connection.CELL]     = 'Mobil';
            states[Connection.NONE]     = 'nincs';
            return states[networkState];
} 

function Enter(e)
{
	if (e.keyCode == 13)
	{
		
	}
}

function hideKeyboard(element) 
{	return;
    element.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
    element.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
    setTimeout(function() {
        element.blur();  //actually close the keyboard
        // Remove readonly attribute after keyboard is hidden.
        element.removeAttribute('readonly');
        element.removeAttribute('disabled');
    }, 100);
}

function substring_search(string, subString, allowOverlapping)
{
	string=string.toLowerCase();
	subString=subString.toLowerCase();
    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}



function Preferences(PrefNR,Ertek)
{
	var E = window.localStorage.getItem("pref"+PrefNR);
	if (Ertek!=null) { window.localStorage.setItem("pref"+PrefNR,Ertek); }
	if (E==null) { E=-1; }
	return E;
}



function Megoszt(MODE)
{
	var MSG_HTML  = "<html><head><meta http-equiv='Content-Type'  content='text/html charset=UTF-8' /></head>";
		MSG_HTML += "<body style='font:12px Arial;'>";
		
		ReceptLEIRAS = ReceptLEIRAS.replace(/&lt;/g,'<');
		ReceptLEIRAS = ReceptLEIRAS.replace(/&gt;/g,'>');
		
		MSG_HTML += "<h1 style='font:16px Arial;font-weight:bold;text-decoration:underline;'>"+ReceptNEV+"</h1><br>" + "<img src='http://koronascukor.hu/media/images/"+ReceptIMG+"'/><br><br>"+ ReceptLEIRAS;
	
		MSG_HTML += "<br><br><h2 style='font:13px Arial;font-weight:bold;text-decoration:underline;float:left;display:inline;'>Elkészítési idő :</h2>"+ ReceptIDO + ' perc<br><br>';
		MSG_HTML += "<h2 style='font:13px Arial;font-weight:bold;text-decoration:underline;'>Hozzávalók ("+ReceptADAG+" adagra) : </h2><br>";
		MSG_HTML += ReceptHOZZAVALOK + "<br>";
		MSG_HTML += "</body></html>";
	
	
	var MSG_FB = "Koronás Sütipédia mobiltelefonra és tabletre - Gyors segítség a kreatív és ínycsiklandó receptek világából ünnepekre és hétköznapokra.";
	switch (MODE)
	{
		case 0:	
				//window.plugins.socialsharing.share( MSG, 'Koronás Sütipédia : '+ReceptNEV, 'http://koronascukor.hu/media/images/'+ReceptIMG, 'http://sutipedia.hu');
				//window.plugins.emailComposer.showEmailComposerWithCallback(null,"Koronás Sütipédia : "+ReceptNEV,MSG,null,null,null,true,{ filePath: "http://koronascukor.hu/media/images/"+ReceptIMG },{ ReceptIMG });
				//setTimeout(function() { window.location.href = "mailto:?subject=Koronás Sütipédia : "+ReceptNEV+"&body="+MSG_HTML; },1000);
				window.plugins.EmailComposer.showEmailComposerWithCallback(null,"Koronás Sütipédia : "+ReceptNEV,MSG_HTML,[],[],[],true,[],[]);
				break;
		case 1: 
				var LINK = "http://koronascukor.hu/code/koronascukor.php?oldal=receptcsoport&param1=-1&param2="+ReceptAZONOSITO;
				
				var params = {
				    method: 'feed',
				    name: ReceptNEV,
				    caption: 'Koronás Sütipédia',
				    description: MSG_FB,
				    link: 'http://sutipedia.hu',
				    picture: 'http://koronascukor.hu/media/images/'+ReceptIMG,
				    actions: [ { name:'Recept a Koronás Cukor oldalán', link: LINK } ],
				    user_message_prompt: 'Ossza meg ismerőseivel ezt a receptet!'
				  };    
				FB.ui(params,  function(response){
							if(response){facebook.Dialog.remove(facebook.Dialog._active);}
							});		
				break;
		case 2: 
				window.plugins.socialsharing.shareViaTwitter('Koronás Sütipédia : '+ReceptNEV +'\n', 'http://koronascukor.hu/media/images/'+ReceptIMG, 'http://sutipedia.hu');
				break;		
	}
}


var oc_timer;

window.addEventListener("orientationchange", function() {   
	console.log("orientationchange");
	clearTimeout(oc_timer);
	var oc_delay = 0;
	if (device && device.platform=="Android") { oc_delay=500; }
  	oc_timer = setTimeout(OrientationReCalc,oc_delay); 
}, false);


window.addEventListener("resize", function(e) {
	var MT;
	if (window.device)
	{
		console.log("resize - clientHeight: ");
		MT = parseInt(document.documentElement.clientHeight - BodyHeight);
		console.log(parseInt(document.documentElement.clientHeight - BodyHeight));
	}
	else
	{
		MT = parseInt(window.innerHeight - BodyHeight);		
	}
    var Lp = document.getElementById("Oldal"+OldalMost);  
    if (Lp)
    {
    	Lp.style.height = BodyHeight + "px";
    	Lp.style.marginTop = MT + "px";
    	window.scrollTo(0,-MT); //alert(MT);
    	console.log(parseInt(window.innerHeight - BodyHeight) +"px");
    }	
},false);

function OrientationReCalc()
{
	
	var sW;
    var sH;
    var PORTRAIT = true;
    if (window.device)
    {
		//if (window.orientation!=0 && window.orientation!=180) { PORTRAIT = false; }  
		if (document.documentElement.clientWidth > document.documentElement.clientHeight ) { PORTRAIT=false; }
    } 
    else
    {
    	if (document.documentElement.clientWidth > document.documentElement.clientHeight) { PORTRAIT = false; } 
    }
    
	if (PORTRAIT) 
	{
        if (window.device)     // mobil eszközön fut 
        {
        	sW = document.documentElement.clientWidth;    		//console.log("PORTRAIT");
        	sH = document.documentElement.clientHeight;
        	BodyHeight = document.documentElement.clientHeight;
        }
        else					// PC-s bnöngészőn fut
        {
        	sW = window.innerWidth;
        	sH = window.innerHeight;
        	BodyHeight = window.innerHeight;
        }
        SzazalekH = BodyHeight*0.01;
        SzazalekW = sW*0.01;
		for (var n=0;n<=OldalSzam;n++)
		{
			document.getElementById("Oldal"+n).style.width = sW+"px";
			document.getElementById("Oldal"+n).style.height = sH+"px";
		}
		
        
        ScreenHeight = sH;
        RHatterH  = parseInt(ScreenHeight*0.1216);  
		RCsikH    = parseInt(ScreenHeight*0.1085);
		RNevH     = parseInt(ScreenHeight*0.036);
		RNevT     = parseInt(ScreenHeight*0.030);  RNevT2     = parseInt(ScreenHeight*0.015);	
		RNevLH    = parseInt(RNevH*0.85);
		RIdoH     = parseInt(ScreenHeight*0.025);
		RIdoT     = parseInt(ScreenHeight*0.075);  RIdoT2     = parseInt(ScreenHeight*0.080);
		RCsiH     = parseInt(ScreenHeight*0.027);
		RCsiT     = parseInt(ScreenHeight*0.063);  RCsiT2     = parseInt(ScreenHeight*0.078);
		
		GombH     = parseInt(ScreenHeight*0.11);
	}
	else		// landscape  ======================================================================
	{
        if (window.device)     // mobil eszközön fut? 
        {
        	sW = document.documentElement.clientWidth;        // <<< 
        	sH = document.documentElement.clientHeight;		//console.log("LANDSCAPE");
        							//console.log("Felbontás : "+sW+" x "+sH);
        	BodyHeight = document.documentElement.clientHeight;						
        }
        else					// PC-s bnöngészőn fut
        {
        	sW = window.innerWidth;
        	sH = window.innerHeight;
        }
        
		for (var n=0;n<=OldalSzam;n++)
		{
			document.getElementById("Oldal"+n).style.width = sW+"px";
			document.getElementById("Oldal"+n).style.height = sH+"px";
		}
        
        ScreenHeight = sH;
        RHatterH  = parseInt(ScreenHeight*0.22);  
		RCsikH    = parseInt(ScreenHeight*0.195);
		RNevH     = parseInt(ScreenHeight*0.057);
		RNevT     = parseInt(ScreenHeight*0.055);  RNevT2     = parseInt(ScreenHeight*0.01);	
		RNevLH    = parseInt(RNevH*0.95);
		RIdoH     = parseInt(ScreenHeight*0.045);
		RIdoT     = parseInt(ScreenHeight*0.135);  RIdoT2     = parseInt(ScreenHeight*0.13);
		RCsiH     = parseInt(ScreenHeight*0.055);
		RCsiT     = parseInt(ScreenHeight*0.12);  RCsiT2     = parseInt(ScreenHeight*0.16);
		
		GombH     = parseInt(ScreenHeight*0.10);
	}
	var N=document.getElementsByTagName('nav');
	for (var n=0;n<N.length;n++)
	{
		N[n].style.height = GombH + "px"; 
 	}
	ScrollRefresh();
}

function ScrollRefresh(oldal)
{
	setTimeout(function () 
		{ 
			/// PS3.refresh();
			
		},100);
	
}



function ertekeles(NUM)
{
	DrawErtekeles(NUM);
	var MODE = "&uj=true&id="+ReceptMost+"&diff="+NUM;
	var KorabbiErtekeles = window.localStorage.getItem("E"+ReceptMost);
	if (NUM == KorabbiErtekeles) { return; }     // az értékelés nem változott, nincs teendő
	if (KorabbiErtekeles!=null)  { MODE = "&uj=false&id="+ReceptMost+"&diff="+parseInt(NUM-KorabbiErtekeles); } 
	window.localStorage.setItem("E"+ReceptMost,NUM);
	callback = function(response) { Atlag_update('ATLAG',response); }
	ajax_hivas('http://koronascukor.hu/code/microsite/sutipedia/app/ertekeles.php?random='+Math.random()+MODE, 'callback' ,'ATLAG');
	//var upload = function() { AJAX_hivas('http://koronascukor.hu/code/modulok/app/ertekeles.php'+MODE, 'ERTEKELES'); }
}
function ShowErtekeles()
{
	var KorabbiErtekeles = window.localStorage.getItem("E"+ReceptMost);
	DrawErtekeles(KorabbiErtekeles);
	var E = Ertekeles_keres(ReceptMost);
	var szavazo = 0;
	if (E[1]>0)
	{
		var atlag=E[2].toFixed(1);
		szavazo=E[1];
	}
	else
	{
		atlag = "-";
	}
	document.getElementById("SZAV_ATLAG").innerHTML = atlag;
	document.getElementById("SZAV_SZAM").innerHTML = szavazo;
}
function DrawErtekeles(NUM)
{
	if (NUM==null) { NUM = 0; }  // üres értékelés
	for (var n=1;n<=5;n++)
		{
			document.getElementById("ECS"+n).className=(n<=NUM)?"ecsillag ecs_on":"ecsillag"; 
		}
}

function Atlag_update(CMEZO,response)
{
	if (!response) { return; }    // a callback kétszer is meghívja (bug), de addigra már lehet, hogy fel van szabadítva
	obj = eval( response );
	var szavazat = obj[0]['n'];
	var szavazo  = obj[0]['e'];
	var atlag=parseFloat(szavazat/szavazo);   
	document.getElementById("SZAV_ATLAG").innerHTML = atlag.toFixed(1);   Ertekelesek[ReceptMost]=Array();  Ertekelesek[ReceptMost][0]=szavazat;
	document.getElementById("SZAV_SZAM").innerHTML = szavazo;			  Ertekelesek[ReceptMost][1]=szavazo;
	Ertekelesek[ReceptMost][2]=atlag;
	FreeCallback(CMEZO);
}

function Ertekeles_keres(ID)
{
	if (Ertekelesek[ID])
	{
		return [Ertekelesek[ID][0],Ertekelesek[ID][1],Ertekelesek[ID][2]];
	}
	else
	{
		return [0,0,0];	
	}
}

function Ertekeles_letolt()
{	
	callback = function(response) { Ertekeles_feldolgoz('ERTEKELESEK',response); } 
	ajax_hivas('http://koronascukor.hu/code/microsite/sutipedia/app/ertekelesek.php?random='+Math.random(), 'callback' ,'ERTEKELESEK');
}


function Ertekeles_feldolgoz(CMEZO,response)
{
		if (!response) { return; }    // ha a callback kétszer is meghívja (bug), de addigra már lehet, hogy fel van szabadítva
		obj = eval( response );    
		for (var n=0; n<obj.length; n++)
		{
			var rid = obj[n]['i'];
			Ertekelesek[rid] = Array();
			Ertekelesek[rid][0] = obj[n]['n'];   // szavazatok száma
			Ertekelesek[rid][1] = obj[n]['e'];   // szavazók száma
			var atlag=parseFloat(obj[n]['n']/obj[n]['e']);
			Ertekelesek[rid][2] = atlag;
		}
		ErtekelesOK = true; 
		FreeCallback(CMEZO);
}



function onCameraFail(message) {
      console.log('Kamera hiba : ' + message);
    }


function onPhotoDataSuccess(imageData) {
	document.getElementById("MODAVATAR").src = "data:image/jpeg;base64," + imageData;
	document.getElementById("CHAVATAR").src = "data:image/jpeg;base64," + imageData;
	document.getElementById("DATAAVATAR").src = "data:image/jpeg;base64," + imageData;
	document.getElementById("EDITAVATAR").src = "data:image/jpeg;base64," + imageData;
	AVATAR = "data:image/jpeg;base64," + imageData;
}

function LoginButton()
{
	if (!EMAIL) { Oldal(13,0); }
}


function keyboard(OnFF,event)
{
    window.scrollTo(0,0);
}



var posX=0, posY=0,
        lastPosX=0, lastPosY=0,
        bufferX=0, bufferY=0,
        scale=1, last_scale,
        rotation= 1, last_rotation, dragReady=0;

function Avatar_mozgat(ev)
{
	var MinMax_x = elemRect.width;
	var MinMax_y = elemRect.height;  
	switch(ev.type) 
	{
            case 'touch':
                last_scale = scale;
                last_rotation = rotation;
 
                break;
 
            case 'drag':
                    posX = Math.max(-MinMax_x, Math.min(ev.gesture.deltaX + lastPosX,MinMax_x));
                    posY = Math.max(-MinMax_y, Math.min(ev.gesture.deltaY + lastPosY,MinMax_x));
                break;
 
            case 'transform':
                scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 5));    	// 1..5
                break;
 
            case 'dragend':
                lastPosX = posX;
                lastPosY = posY;
                break;
    }
 
 	elemRect.style.marginLeft = posX+"px";
 	elemRect.style.marginTop  = posY+"px";
 	elemRect.style.width  = 105*scale+"%";
 
	
}

var PopUpOn;

var HintMost=0;
var Hints = Array();
Hints.push( [ "OldalX"			,80,0,20,12,true,	"A logóra kattintva a főmenűbe visszaléphet bármely oldalról." ] );
Hints.push( [ "-OldalX"			,20,0,60,12,true,	"A fejlécre kattintva rövid leírás nyílik meg az adott oldal funkcióival kapcsolatban." ] );
Hints.push( [ "-OldalX"			,0,0,20,12,false,	"A visszagombbal az előző oldalra visszaléphet." ] );
Hints.push( [ "Bevezetes"		,0,100,0,0,true,	"<span style='color:#f5e7c3;'>Üdvözöljük a felhasználóink között!</span><br>Némi segítség a használathoz a következőkben.<br>A lapozáshoz érintse meg a képernyőt." ] );
Hints.push( [ "Oldal0"			,0,88,25,20,true,	"A teljes körű használathoz be kell jelentkeznie.<br>A bejelentkezés és az ehhez szükséges regisztráció végezhető el a 'Személyes' oldalon."  ] );
Hints.push( [ "-Oldal0"			,25,88,25,20,true,	"A foglalkozások órarendje érhető el itt.<br>Lehet külön foglalkozás típusra, teremre vagy edzőre leválogatni az időpontokat.<br>Itt tekinthetjük meg a foglalásainkat is." ] );
Hints.push( [ "-Oldal0"			,50,88,25,20,true,	"Csapatsportoknál - ha nincs ki a létszám - itt lehet társakat toborozni, a csapattagokat a jelentkezők közül kiválogatni.<br>Mások csapatába is itt lehet jelentkezni." ] );
Hints.push( [ "-Oldal0"			,75,88,25,20,false,	"Az általunk indított foglalások listája időponttal és a viszaigazolás jelzésével." ] );




function Hint(hint)
{
	if (hint=="bezaras") { document.getElementById("Hint").style.display="none"; PopUpOn=false; return; }			// bezaras gomb
	if (Preferences(2)=="0" ) { return; }																			  // ha az összes ki van kapcsolva (preferences)
	if (window.localStorage.getItem("HintKi-"+hint)!=null) {  return; }    // ha az oldal ki van kapcsolva
	if (hint==-1)				// kikapcsolás ezen a belépési ponton
	{
		var Belepes = Hints[HintMost][0];
		if (Belepes.substr(0,1)=="-") { Belepes=Belepes.substr(1); }
		window.localStorage.setItem("HintKi-"+Belepes,true);
		if (HintMost==0) { window.localStorage.setItem("HintKi-Oldal0",true); }     // bevezetésnél a 0. oldalt is ki kell kapcsolni
		document.getElementById("Hint").style.display="none"; PopUpOn=false;
		return;
	}
	if (hint==null) 			// lapozás
	{
		if (Hints[HintMost][5]==false)			// ha nem kell folytatás
		{ 	document.getElementById("Hint").style.display="none"; PopUpOn=false; return;}
		else
		{	Hint(parseInt(HintMost+1)); return;}
	}
	else
	{
		HNR=hint;
		if (isNaN(hint))
		{
			var HNR=null;
			for (h in Hints)
			{
				if (Hints[h][0]==hint) { HNR=h; }
			}
			if (HNR==null)  { return; }                            // az oldalhoz nincs hint hozzárendelve
			HNR=parseInt(HNR);
		}
	}
	if (window.localStorage.getItem("Hint"+HNR)!=null)               // ha már volt ez a hint
	{
	if (Hints[HNR][5]==false)			// ha nem kell folytatás
		{ 	document.getElementById("Hint").style.display="none"; PopUpOn=false; return;}
		else
		{	Hint(parseInt(HNR+1)); return;}
	}
	
	HintMost = HNR;
	var AreaX = Hints[HNR][1];
	var AreaY = Hints[HNR][2];
	var AreaW = Hints[HNR][3];
	var AreaH = Hints[HNR][4];
	var HText = Hints[HNR][6];
	if (AreaY < 17 )                  // a gombokat alulra kell rakni
	{ 
		document.getElementById("HintBezar").style.top=""; document.getElementById("HintBezar").style.bottom=0;
		document.getElementById("HintKikapcs").style.top=""; document.getElementById("HintKikapcs").style.bottom=0;
	}
	else
	{
		document.getElementById("HintBezar").style.top=0; document.getElementById("HintBezar").style.bottom="";
		document.getElementById("HintKikapcs").style.top=0; document.getElementById("HintKikapcs").style.bottom="";
	}
	var T1 = document.getElementById("HT1");
		T1.style.top=0;  T1.style.left=0; T1.style.width="100%"; T1.style.height = parseInt(AreaY*SzazalekH)+"px";
	var T2 = document.getElementById("HT2");
		T2.style.top=parseInt(AreaY*SzazalekH)+"px";  T2.style.left=0; T2.style.width=parseInt(AreaX*SzazalekW)+"px"; T2.style.height = parseInt(AreaH*SzazalekH)+"px";
	var T3 = document.getElementById("HT3");
		T3.style.top=parseInt(AreaY*SzazalekH)+"px";  T3.style.left=parseInt((AreaX+AreaW)*SzazalekW)+"px"; T3.style.width=parseInt((100-AreaX-AreaW)*SzazalekW)+"px"; T3.style.height = parseInt(AreaH*SzazalekH)+"px";
	var T4 = document.getElementById("HT4");
		T4.style.bottom=0;  T4.style.left=0; T4.style.width="100%"; T4.style.height = parseInt((100-AreaY-AreaH)*SzazalekH)+"px";
	document.getElementById("HintTXT").innerHTML=HText;
	document.getElementById("Hint").style.display="block";
	window.localStorage.setItem("Hint"+HNR,true);
	PopUpOn = true;
}

function Tippek_Reset()
{
	for (h in Hints)
	{
		if (Hints[h][0].substr(0,1)!="-") { window.localStorage.removeItem("HintKi-"+Hints[h][0]);}    // kikapcsolások
		window.localStorage.removeItem("Hint"+h);														// megtekintések
	}
	Preferences(2,1);
	document.getElementById("TIPPEK").src="img/bme/beki1.png";			  // DEFAULT : bekapcsolva
    document.getElementById("TIPPEK").className="setting on";
}

function Help(obj)
{
	PopUp_HTML(obj.getAttribute("alt"));
}

function PopUp_HTML(txt,options)
{
	if (txt==null) { document.getElementById("PopUp").style.display="none"; PopUpOn=false; return;}
	PopUpOn = true;
	document.getElementById("PopUp_txt").innerHTML=txt;
	document.getElementById("PopUp").style.display="block";	
}