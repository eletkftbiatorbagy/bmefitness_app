const StartPage=14;      ///  DEVELOPMENT......................................................................................
const AJAX_URL = "http://e-let.hu/fitness/";
const OldalSzam = 14;   //  ennyi lap van definiálva a .html fájlban
var LOGIN = false;
var REGISZTRALVA = false;
var EMAIL;
var EMAIL_hash;
var NEV;
var AVATAR;

var BodyHeight;
var OldalMost;

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

var ErtekelesProba;
var ErtekelesOK = false;
var Ertekelesek = Array();
var callback;                   // ajax hívás visszatérő függvénye

var app = {
    initialize: function() {
        this.bindEvents();
         
        function loaded() 
		{
			setTimeout(function () 
			{
				/// PS3 = new iScroll('POROND3',{ hScrollbar: false, vScrollbar: false, hScroll: false });
			}, 100);
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
                
        if (StartPage) 
        { Oldal(StartPage,0); }
        else 
        {  Lablec(0,0); }
        		
		document.getElementById("WIFI_ONLY").src="img/bme/beki"+((Preferences(1)==0)?0:1)+".png";			  // DEFAULT : bekapcsolva
    	document.getElementById("WIFI_ONLY").className=((Preferences(1)==0)?"setting":"setting on");
		
		
		Hammer(document.getElementById("SETTINGS0")).on("tap", function(event){ Oldal(10,0); });
		
		Hammer(document.getElementById("F1")).on("tap", function(event){ Oldal(5,0); });
		Hammer(document.getElementById("F2")).on("tap", function(event){ Oldal(6,0); });
		Hammer(document.getElementById("F3")).on("tap", function(event){ Oldal(7,0); });
		Hammer(document.getElementById("F4")).on("tap", function(event){ Oldal(8,0); });
		Hammer(document.getElementById("F5")).on("tap", function(event){ Oldal(9,0); });
		
		
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
					{ 	quality: 50, allowEdit: true,
						destinationType: destinationType.DATA_URL, 
						encodingType: Camera.EncodingType.JPEG,
						targetWidth: 150,
						targetHeight: 150,
						MediaType: 0,
						popoverOptions: CameraPopoverOptions,
						cameraDirection: Camera.Direction.FRONT,
						saveToPhotoAlbum: true
					} ); 
				});
		Hammer(document.getElementById("ALBUM_FOTO")).on("tap", function(event){ 
					navigator.camera.getPicture(onPhotoDataSuccess, onCameraFail, 
					{ 	
						quality: 50,
						targetWidth: 150,
						targetHeight: 150,
						destinationType: destinationType.DATA_URL,
						MediaType: 0,
						sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
					} );
				});
	
		if (window.device) 
		{   	
			FB.init({ appId: "298154397003522", nativeInterface: CDV.FB, useCachedDialogs: false });
			pictureSource=navigator.camera.PictureSourceType.CAMERA;
        	destinationType=navigator.camera.DestinationType;
		}
		
			
		EMAIL = window.localStorage.getItem("email");
		if (!EMAIL) { document.getElementById("LOGINTXT").innerHTML="Tovább >>>"; }
		callback = function(response) { Login_adatok('AJAX_LOGIN',response); } 
		ajax_hivas(AJAX_URL +'login_get.php','', 'callback' ,'AJAX_LOGIN'); 
		
    }};
   //   ooDeviceReady vége ================================================================================================================================================= 
    
   
var LastPage=[0];			// első oldal száma
var LastLablec=[0];			// első oldal lábléce



function Oldal(oldal,lablec)
{
	if (!oldal && oldal!=0) { return; }
	if (oldal<0)        // vissza
	{
		oldal = Math.abs(oldal);
	}
	else
	{
		LastPage.push(oldal);
		LastLablec.push(lablec);  
	}
	if (oldal==1 && !LOGIN) { oldal=11; }
	if (oldal==3 || oldal==4 || oldal==5 || oldal==6)	
	{
		var Porond = document.getElementById("POROND"+oldal);
		Porond.style.display="none";
	}
	for (var n=0;n<=OldalSzam;n++)
	{
		document.getElementById("Oldal"+n).style.display=(oldal==n)?"block":"none";
	}
	if (!lablec) { lablec=0; }
	Lablec(oldal,lablec);
	setTimeout(function(){ Oldal2(oldal,lablec); },1000);
	OldalMost = oldal;
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
	if (LastPage.length==1) { return; }    // utolsó oldalon vagyunk
	var LP=LastPage.pop();	  if (!LP){ return; }
	var LL=LastLablec.pop();
	Oldal(-1*LastPage[parseInt(LastPage.length-1)],LastLablec[parseInt(LastLablec.length-1)]);
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
}





function Enter(e)
{
	if (e.keyCode == 13)
	{
		
	}
}

function hideKeyboard(element) 
{
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
	}
	
	ScrollRefresh();
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


function ScrollRefresh(oldal)
{
	if (oldal)
	{
		/// if (oldal==3) { setTimeout(function () { PS3.refresh();},100); }
	}
	else
	{
		setTimeout(function () 
		{ 
			/// PS3.refresh();
			
		},100);
	}
}


function onCameraFail(message) {
      console.log('Kamera hiba : ' + message);
    }


function onPhotoDataSuccess(imageData) {
	document.getElementById("MODAVATAR").src = "data:image/jpeg;base64," + imageData;
	document.getElementById("CHAVATAR").src = "data:image/jpeg;base64," + imageData;
	document.getElementById("DATAAVATAR").src = "data:image/jpeg;base64," + imageData;
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
	switch(ev.type) 
	{
            case 'touch':
                last_scale = scale;
                last_rotation = rotation;
 
                break;
 
            case 'drag':
                    posX = ev.gesture.deltaX + lastPosX;
                    posY = ev.gesture.deltaY + lastPosY;
                break;
 
            case 'transform':
                rotation = last_rotation + ev.gesture.rotation;
                scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
                break;
 
            case 'dragend':
                lastPosX = posX;
                lastPosY = posY;
                break;
    }
 
 	elemRect.style.marginLeft = posX+"px";
 	elemRect.style.marginTop  = posY+"px";
 	elemRect.style.width  = 105*scale+"%";
 
	// var transform =
// 			"translate3d("+posX+"px,"+posY+"px, 0) " +
// 			"scale3d("+scale+","+scale+", 0) " +
// 			"rotate("+rotation+"deg) ";
// 
// 	elemRect.style.transform = transform;
// 	elemRect.style.oTransform = transform;
// 	elemRect.style.msTransform = transform;
// 	elemRect.style.mozTransform = transform;
// 	elemRect.style.webkitTransform = transform;
}