const OldalSzam = 11;   //  ennyi lap van definiálva a .html fájlban
var ReceptMost;      // aktuálisan mutatott recept ID-ja
var ReceptAZONOSITO;    // megosztáshoz ...
var ReceptIMG;
var ReceptIMG2;
var ReceptNEV;
var ReceptADAG;
var ReceptHOZZAVALOK;
var ReceptLEIRAS;
var ReceptIDO;

var EVSZAK;
var EVSZAKnr;

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

var Kereses_Ido=5;
var Kereses_Idok = Array(10,20,30,60,120,999);
var Kereses_Fok=5;

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
                
        Lablec(0,0);
        		
		document.getElementById("WIFI_ONLY").src="img/bme/beki"+((Preferences(1)==0)?0:1)+".png";			  // DEFAULT : bekapcsolva
    	document.getElementById("WIFI_ONLY").className=((Preferences(1)==0)?"setting":"setting on");
		
		
		Hammer(document.getElementById("SETTINGS0")).on("tap", function(event){ Oldal(10,0); });
		
		Hammer(document.getElementById("F1")).on("tap", function(event){ Oldal(5,0); });
		Hammer(document.getElementById("F2")).on("tap", function(event){ Oldal(6,0); });
		Hammer(document.getElementById("F3")).on("tap", function(event){ Oldal(7,0); });
		Hammer(document.getElementById("F4")).on("tap", function(event){ Oldal(8,0); });
		Hammer(document.getElementById("F5")).on("tap", function(event){ Oldal(9,0); });
		
		for (var v=1;v<=OldalSzam; v++)
		{
			Hammer(document.getElementById("VISSZA"+v)).on("tap", function(event){ Vissza(); }); 
			Hammer(document.getElementById("LOGO"+v)).on("tap", function(event){ Oldal(0,0); });
		}	
    	   	   	
		document.addEventListener("backbutton", Vissza, false);
		
		
			
		if (window.device) {   	FB.init({ appId: "298154397003522", nativeInterface: CDV.FB, useCachedDialogs: false });  }
    	
    	
    	
    }};
   //   ooDeviceReady vége ================================================================================================================================================= 
    
   
var LastPage=[0];			// első oldal száma
var LastLablec=[0];			// első oldal lábléce



function Oldal(oldal,lablec)
{
	//if (!oldal) { return; }
	if (oldal<0)        // vissza
	{
		oldal = Math.abs(oldal);
	}
	else
	{
		LastPage.push(oldal);
		LastLablec.push(lablec);
	}
	if (oldal==3 || oldal==4 || oldal==5 || oldal==6)	
	{
		var Porond = document.getElementById("POROND"+oldal);
		var Kerek  = document.getElementById("WHEEL"+oldal);
		Porond.style.display="none";
		//Kerek.style.display="block";				// Forgó logo kikapcsolva ...
		//Wheel(true,oldal);
	}
	for (var n=0;n<=OldalSzam;n++)
	{
		document.getElementById("Oldal"+n).style.display=(oldal==n)?"block":"none";
	}
	if (!lablec) { lablec=0; }
	Lablec(oldal,lablec);
	setTimeout(function(){ Oldal2(oldal,lablec); },1000);
	// if (oldal==7)
// 	{ window.plugins.orientationchanger.lockOrientation('default'); }
// 	else
// 	{ window.plugins.orientationchanger.lockOrientation('portrait'); }
}	

function Oldal2(oldal,lablec)
{

			
	if (oldal==11) 
	{
		document.getElementById("RECNUMINFO").innerHTML=Receptek.length-1;
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

function ReceptBeolvasas(oldal,KAT,SEARCH) 
{
	var PS = document.getElementById("SCROLLER"+oldal);
	PS.innerHTML="<div id='POROND_TERKOZ"+oldal+"' class='porond_terkoz' style='height:"+parseInt(window.innerHeight*0.008)+"px'></div>";
	if (SEARCH=="*") { SEARCH=null; }
	if (SEARCH) { SEARCH = SEARCH.trim(); }
	if (SEARCH!=null && Preferences(2)==1 && LastPage[parseInt(LastPage.length-3)]==5)  { KAT=LastKat; }
	if (KAT>0) { LastKat=KAT; }
	var TALALAT = Array();
	var EREDMENY=0;					
	if (SEARCH!=null)
	{
		for (var x=0;x<Receptek.length-1;x++)
		{	
			var Recept = Receptek[x].split("|");
			var go = true;
			if (Kereses_Ido!=5)     // elkészítési idő szerinti szűrés
			{
				if (parseInt(Recept[5])>Kereses_Idok[Kereses_Ido]) { go = false; }
			}
			if (Kereses_Fok!=5)     // nehézségi fok szerinti szűrés
			{
				if (parseInt(Recept[4])>parseInt(Kereses_Fok+1)) { go = false; }
			}
											
			var Talalat=0;
			if (go==true)
			{
				var SZAVAK = SEARCH.split(" ");
				for (var t=0;t<SZAVAK.length;t++)
				{
					Talalat += substring_search(Recept[1],SZAVAK[t],true);
					Talalat += substring_search(Recept[2],SZAVAK[t],true);
					Talalat += substring_search(Recept[7],SZAVAK[t],true);
				}
			}
			
			TALALAT[x] = Array();
			TALALAT[x][0]=x;		   // recept sorszám	
			TALALAT[x][1]=Talalat;
			TALALAT[x][2]=Recept[0];       //  recept ID
		}
		TALALAT.sort(function(a,b){return ((b[1] < a[1]) ? -1 : ((b[1] > a[1]) ? 1 : 0));});
	}
	
	if (KAT==0)    //  Előzmények
	{
		for (var e=0;e<Receptek.length;e++)
		{
			if (e < EHistory.length)
			{
				TALALAT[e] = Array();
				TALALAT[e][0]=ReceptNum(EHistory[e][0]);			
				TALALAT[e][1]=EHistory[e][0];
				TALALAT[e][2]=EHistory[e][1];
			}
			else
			{
				TALALAT[e] = Array();
				TALALAT[e][0]=0;			
				TALALAT[e][1]=0;
				TALALAT[e][2]=0;
			}
		}	
	}
	
	Evszak_Init();
	
	var elso=null;
	
	for (var n=0;n<Receptek.length-1;n++)
	{
		if ((SEARCH==null && KAT!=0) || TALALAT[n][1]>0)
		{
			var R = n;
			if (SEARCH!=null || KAT==0) { R = TALALAT[n][0]; }
			var Recept = Receptek[R].split("|");
			ReceptMost=Recept[0];
			
			if (  !KAT || (KategoriaID[KAT]==parseInt(Recept[3])) || (KAT==-1 && Kedvenc()==1) || (KAT==0 && TALALAT[n][0]!=0 )  || (KAT==6 && EVSZAK==Recept[6])  )	
			{
				EREDMENY++;
				var RHAT = document.createElement("div");
					RHAT.className = "recept_hatter";
					RHAT.style.height = RHatterH+"px";
				var RCSI = document.createElement("div");
					RCSI.className = "recept_csik";
					RCSI.style.height = RCsikH+"px";
					
				var RKF = document.createElement("img");
					RKF.className = "recept_kisfoto";
					RKF.setAttribute("src","db/cache/"+Recept[8].substring(0,Recept[8].length-4)+".jpg");
					
				var REC = null; 
					if (Ertekelesek[Recept[0]])
					{
						REC= document.createElement("div");
						REC.className = "recept_csillag";
						var atlag;
						atlag = Ertekelesek[Recept[0]][2];
						for (var e=5; e>=1; e--)
						{
							var CS = document.createElement("div");
								CS.className = "cs";
								CS.style.background="";
								var ertek="0";
								if (parseFloat(atlag)>parseFloat(e-0.25)) { ertek="1"; } 
								else if (atlag>parseInt(e-0.75)) { ertek="f"; }
								else { ertek="0"; }
								CS.style.backgroundImage = "url('img/cs"+ertek+".png')";
								CS.style.backgroundSize="100% 100%";
								REC.appendChild(CS);
						}
						
					}	
				var RNEV = document.createElement("div");
					RNEV.className = "recept_nev";
					RNEV.style.fontSize=RNevH+"px";
					RNEV.style.marginTop=parseInt(RNevT/2)+"px";
					RNEV.style.height=RNevLH+"px";
					RNEV.style.lineHeight=RNevLH+"px";
					RNEV.innerHTML = Recept[1];
					
				var RIDO = document.createElement("div");
					RIDO.className = "recept_ido";
					RIDO.innerHTML = "Elkészítés: "+Recept[5]+" perc";
					RIDO.style.fontSize=RIdoH+"px";
					RIDO.style.marginTop=RIdoT+"px";
				var RCSL = document.createElement("div");
					RCSL.className = "recept_sipka";
					RCSL.style.height = RCsiH+"px";
					RCSL.style.marginTop= RCsiT+"px";
					for (var m=1;m<=3;m++)
					{
						var STR = document.createElement("img");
						STR.src="img/sipka"+((Recept[4]>=m)?"1":"0")+".png";
						STR.className="sipka";
						RCSL.appendChild(STR);
					}
				var RTOUCH = document.createElement("div");
					RTOUCH.className = "recept_touch";
					
					RCSI.setAttribute("receptid",Recept[0]);
								
				
				RCSI.appendChild(RKF);
				if (REC) { RCSI.appendChild(REC); }
				RCSI.appendChild(RNEV);
				RCSI.appendChild(RIDO);
				RCSI.appendChild(RCSL);
				RHAT.appendChild(RCSI);
				PS.appendChild(RHAT);
				
				
						
				Hammer(RCSI).on("tap", function(event){ Recept_mutat(parseInt(event.target.getAttribute('receptid'))); });
					Hammer(RCSI, {tap_max_touchtime : 300, tap_max_distance  : 5 });
				Hammer(RKF).on("tap", function(event){ Recept_mutat(parseInt(event.target.parentNode.getAttribute('receptid'))); });
					Hammer(RKF, {tap_max_touchtime : 300, tap_max_distance  : 5 });
				Hammer(RNEV).on("tap", function(event){ Recept_mutat(parseInt(event.target.parentNode.getAttribute('receptid'))); });
					Hammer(RNEV, {tap_max_touchtime : 300, tap_max_distance  : 5 });
				Hammer(RIDO).on("tap", function(event){ Recept_mutat(parseInt(event.target.parentNode.getAttribute('receptid'))); });
					Hammer(RIDO, {tap_max_touchtime : 300, tap_max_distance  : 5 });
				Hammer(RCSL).on("tap", function(event){ Recept_mutat(parseInt(event.target.parentNode.getAttribute('receptid'))); });
					Hammer(RCSL, {tap_max_touchtime : 300, tap_max_distance  : 5 });
					
				
					
					
			}
		}	
	}
	document.getElementById("POROND_TERKOZ"+oldal).scrollIntoView(true); 
	if (SEARCH!=null)
	{
		var Title = EREDMENY+" találat";
		if (KAT) { Title += " "+"<span style='font-size:0.6em;'>/ "+KategoriaNEV[KAT]+"</span>"; }
		document.getElementById("CSIKTXT"+oldal).innerHTML = Title;
	}
	else if (KAT)
	{
		var Title = "";
		if (KAT== -1) { Title="Kedvencek"; } else { Title = KategoriaNEV[KAT]; }
		document.getElementById("CSIKTXT"+oldal).innerHTML = Title;
	}
	
	ScrollRefresh(oldal);
	
	if (oldal==3 || oldal==4 || oldal==5 || oldal==6)	
	{
		setTimeout(function()
		{
			Wheel(false,oldal);
			var Porond = document.getElementById("POROND"+oldal);
			var Kerek  = document.getElementById("WHEEL"+oldal);
			Porond.style.display="block";
			Kerek.style.display="none";
		},0);	
	}
	
}


function Kereses(SEARCH)
{
	Oldal(6,2);
	setTimeout(function()
	{
		ReceptBeolvasas(6,null,SEARCH);
		hideKeyboard(document.getElementById('KERES'));
	},0);
}

function KeresesEnter(e)
{
	if (e.keyCode == 13)
	{
		Kereses(document.getElementById('KERES').value);
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


function Recalc_enter(e)
{
	if (e.keyCode == 13)
	{
		Recalc();
	}
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


function Kat(NR)
{
	Oldal(5,0);
	setTimeout(function() { ReceptBeolvasas(5,NR); },100);
}

function Recept_mutat(ID)
{
	if (ID) 
	{
		ReceptMost=ID;   ReceptAZONOSITO = ID;
		Oldal(7,0);
	} 
	else 
	{ 
		ID=ReceptMost; 
	}
	Elozmenyek_lementes();
	var NR=ReceptNum(ID);
	var Recept = Receptek[NR].split("|");
	var RNEV = document.getElementById("RNEV");
	RNEV.innerHTML=Recept[1];   ReceptNEV = Recept[1];
	var RIDO = document.getElementById("RIDO");
	RIDO.innerHTML="Elkészítés: "+Recept[5]+" perc";	ReceptIDO = Recept[5];
	var CS = document.getElementById("RSIPKA");
	CS.innerHTML="";
	for (var m=1;m<=3;m++)
				{
					var STR = document.createElement("img");
					STR.src="img/sipka"+((Recept[4]>=m)?"1":"0")+".png";
					STR.className = "kissipka";
					CS.appendChild(STR);
				}		
	document.getElementById("NAGYKEP").src="db/cache/"+Recept[8].substring(0,Recept[8].length-4)+".jpg";
	ReceptIMG  = Recept[8].substring(0,Recept[8].length-4)+".jpg";
	ReceptIMG2 = Recept[8].substring(0,Recept[8].length-4)+".THM";
	
	Recalc(ID);
	var Leiras = Recept[2];    ReceptLEIRAS = Leiras;
	// Leiras = Leiras.replace(/@@/gi,"&");  Leiras = Leiras.replace(/££/gi,";"); Leiras = Leiras.replace(/€€/gi,"#"); 
	var p1 = new RegExp("&lt;p&gt;", 'g');
	Leiras = Leiras.replace(p1,"");
	var p2 = new RegExp("&lt;/p&gt;", 'g');		
	Leiras = Leiras.replace(p2,"<br>");
	var p3 = new RegExp("&lt;sup&gt;", 'g');
	Leiras = Leiras.replace(p3,"<sup>");
	var p4 = new RegExp("&lt;/sup&gt;", 'g');
	Leiras = Leiras.replace(p4,"</sup>");
	var p5 = new RegExp("&lt;br&gt;", 'g');
	Leiras = Leiras.replace(p5,"<br>");
	var p6 = new RegExp("&lt;br/&gt;", 'g');
	Leiras = Leiras.replace(p6,"<br>");
	var p7 = new RegExp("&lt;br /&gt;", 'g');
	Leiras = Leiras.replace(p7,"<br>");
	var pX = new RegExp("&lt;\/?[^&gt;]+(&gt;|$)",'g');
	Leiras = Leiras.replace(pX, "");
	document.getElementById("ELKESZITES").innerHTML=Leiras;   
	document.getElementById("ELKESZITES").scrollIntoView (true);
	ReceptMenu(1);
	document.getElementById("RKEDVENC").src="img/kedvenc"+(Kedvenc())+".png";
	
	ShowErtekeles();
	
	if (RNEV.scrollHeight > RNevH) 
	{
		RNEV.style.marginTop = RNevT2+"px";
		RIDO.style.marginTop=parseInt(RIdoH/10)+"px";
		CS.style.marginTop="-"+parseInt(RCsiH*1.2)+"px";
	}
	else
	{
		RNEV.style.marginTop = RNevT+"px";
		RIDO.style.marginTop=parseInt(RIdoH/2)+"px";
		CS.style.marginTop="-"+parseInt(RCsiH*1.2)+"px";
	}
	
		setTimeout(function()
		{
			Wheel(false,7);
			var Porond = document.getElementById("POROND7");
			var Kerek  = document.getElementById("WHEEL7");
			Porond.style.display="block";
			Kerek.style.display="none";
		},0);
		
	
	setTimeout(function(){ RM1.refresh(); },0);
	setTimeout(function(){ RM3.refresh(); },0); 
}

function Recalc(ID)
{
	if (!ID) { ID=ReceptMost; }
	var NR=ReceptNum(ID);
	var R1OL = document.getElementById("SCROLLER_H");
	R1OL.innerHTML="";
	var SZEGMENSp = document.createElement("div");
		SZEGMENSp.setAttribute("style","width:100%;display:block;overflow:hidden;background-color:#faf3de;margin-bottom:2%;");
	var DIV1p = document.createElement("div");
		DIV1p.setAttribute("style","width:47%; float:left;background-color:#faf3de;padding:1%;");
	var DIV2p = document.createElement("div");	
		DIV2p.setAttribute("style","width:47%; float:left;background-color:#faf3de;margin-left:2%;padding:1%;");
	var SZEGMENS = SZEGMENSp.cloneNode(true); var elso=SZEGMENS;
	var DIV1 = DIV1p.cloneNode(true);
	var DIV2 = DIV2p.cloneNode(true);
	var ADAG = document.getElementById("ADAG").value/4;   ReceptADAG = document.getElementById("ADAG").value;
	if (ADAG)
	{
		if (Number(ADAG)<=0) { return; }
		var Recept = Receptek[NR].split("|");
		var SOR = Recept[7].split("∆");
		var paros=true;
		var ujsorba = false;
		ReceptHOZZAVALOK = "";
		for (var m=0; m<SOR.length; m++)
		{
			if (SOR[m]!="")
			{
			var LI1 = document.createElement("div");
				LI1.setAttribute("style","float:left; width:100%; text-align:left; cursor:default;");
				if (SOR[m].indexOf("=")!=-1)
				{
					var OSSZETEVO = SOR[m].split("=");
					var hsor="";
					var LD1 = document.createElement("div");
						LD1.setAttribute("style","width:32%;  float:left; text-align:left;padding-left:2%;");
						var R = OSSZETEVO[0];
						var RR = R.split(" ");
						RR[0]=RR[0].replace(/\,/gi,".");
						
						RR[0]=RR[0].replace(/fél/gi,"0.5");
						RR[0]=RR[0].replace(/negyed/gi,"0.25");
						RR[0]=RR[0].replace(/darab/gi,"db");
						
						if (RR[0].indexOf("-")!=-1)
						{
							var vagy=RR[0].split("-");
							hsor = Number(ADAG*Number(vagy[0]))+"-"+Number(ADAG*Number(vagy[1]));
						}
						else
						{
							hsor = Number(ADAG*Number(RR[0]));
						}	
						hsor=hsor+"";
						
						
						
						hsor=hsor.replace(/0.25/gi,"negyed");
						hsor=hsor.replace(/0.5/gi,"fél");
						//hsor=hsor.replace(/0.75/gi,"háromnegy.");
						//hsor=hsor.replace(/1.5/gi,"másfél");
						hsor=hsor.replace(/\./gi,",");
						
						LD1.innerHTML=hsor+" "+RR[1];   ReceptHOZZAVALOK += hsor+" "+RR[1];
					var LD2 = document.createElement("div");
						LD2.setAttribute("style","width:63%;   float:left; text-align:left; padding-left:2%;");
						var ossz = ""+OSSZETEVO[1];
						ossz = ossz.replace(/\s+$/,"");
						ossz = ossz.replace(/\,$/,"");
						ossz = ossz.replace(/\.$/,"");
						LD2.innerHTML=ossz;             ReceptHOZZAVALOK += " "+ossz+"<br>";
					LI1.appendChild(LD1);
					LI1.appendChild(LD2);
				}
				else
				{
					var LD=document.createElement("div");
					LD.setAttribute("style","width:98%; text-align:right;padding-left:2%;");
					if (SOR[m].indexOf(":")!=-1)
					{
						LD.innerHTML=SOR[m]; LD.style.textAlign="left"; LD.style.height="5%";     ReceptHOZZAVALOK += "<br>"+SOR[m]+"<br>";
					} else
					{
						LD.innerHTML=SOR[m];       ReceptHOZZAVALOK += SOR[m]+"<br>";
					}
					LI1.appendChild(LD);
					var kpont = SOR[m]+"";
					kpont=kpont.replace(/\s+$/,"");
					if (kpont.search(/:$/)!=-1)
					{
						ujsorba=true;
						LD.style.textDecoration="underline";
						LD.style.fontWeight="bold";
						SZEGMENS.appendChild(DIV1);
						SZEGMENS.appendChild(DIV2);
						R1OL.appendChild(SZEGMENS);
						if (DIV1.innerHTML==="" && DIV2.innerHTML==="") { SZEGMENS.style.display="none"; }
						SZEGMENS=SZEGMENSp.cloneNode(true);
						DIV1 = DIV1p.cloneNode(true);
						DIV2 = DIV2p.cloneNode(true);
					}	
				}
				if (paros)
				{
					DIV1.appendChild(LI1);
					paros=false;
					if (ujsorba)
					{
						var LIE  = document.createElement("div");
							LIE.setAttribute("style","width:100%;  float:left; text-align:left;padding-left:2%; ");
							LIE.innerHTML="&nbsp";
							DIV2.appendChild(LIE);
							paros=true;
							ujsorba=false;
					}
				}
				else
				{
					if (!ujsorba)
					{
						DIV2.appendChild(LI1);
						paros=true;
					}
					else
					{
						var LIE  = document.createElement("div");
							LIE.setAttribute("style","width:40%;  float:left; text-align:left;padding-left:2%; ");
							LIE.innerHTML="&nbsp";
							DIV2.appendChild(LIE);
						DIV1.appendChild(LI1);
						var LIE2  = document.createElement("div");
							LIE2.setAttribute("style","width:40%;  float:left; text-align:left;padding-left:2%; ");
							LIE2.innerHTML="&nbsp";
						DIV2.appendChild(LIE2);
						ujsorba=false;
						paros=true;
					}
				}
			}	
		}
		SZEGMENS.appendChild(DIV1);
		SZEGMENS.appendChild(DIV2);
		R1OL.appendChild(SZEGMENS);   //ReceptHOZZAVALOK = R1OL.innerHTML;
		var space=document.createElement("div");
		space.setAttribute("style","display:block;width:100%;height:20%;");
		R1OL.appendChild(space);
	}
	hideKeyboard(document.getElementById("ADAG"));  //.blur();
	setTimeout(function(){ RM2.refresh(); },0);	
}

function ReceptNum(ID)
{
	for (var n=0;n<Receptek.length;n++)
	{
		var Recept=Receptek[n].split("|");
		if (Recept[0]==ID) { return n; }		
	}
	return -1;
}

function ReceptMenu(NR)
{
	for(var n=1;n<=4;n++)
	{
		document.getElementById("RMENU"+n).className=(n==NR)?"recept_menu selected":"recept_menu";
		document.getElementById("RECEPT_MEZO"+n).style.display=(n==NR)?"block":"none";
		//if (NR==2) { document.getElementById("ADAG").focus();document.getElementById("ADAG").select(); }
		if (NR==1) { setTimeout(function(){ RM1.refresh(); },0); }
		if (NR==2) { setTimeout(function(){ RM2.refresh(); },0); }
		if (NR==3) { setTimeout(function(){ RM3.refresh(); },0); }
		//if (NR==4) { setTimeout(function(){ RM4.refresh(); },0); }     // nincs rá szükség
	}
}

function Kedvenc(BeKi)
{
	var K = window.localStorage.getItem("kedvenc"+ReceptMost);
	if (BeKi) { window.localStorage.setItem("kedvenc"+ReceptMost, (K==1)?0:1  );  K=(K==1)?0:1; document.getElementById("RKEDVENC").src="img/kedvenc"+K+".png"; }
	if (K==null) { K=0; }
	return K;
}

function Elozmenyek_beallitas()
{
	var ELO = document.getElementById("ELOZMENY");
	var UJ=parseInt(ELO.getAttribute("ertek"));
	UJ++;
	if (UJ>ELOZMENYEK.length-1){UJ=0;}
	ELO.setAttribute("ertek",UJ);
	ELO.innerHTML=ELOZMENYEK[UJ];
	Preferences(3,UJ);
}
function Elozmenyek_lementes()
{
	for (var n=0; n<Elozmenyek.length;n++)
	{
		if (Elozmenyek[n][0]==ReceptMost) 
		{  
			Elozmenyek[n][0]=0;
			Elozmenyek[n][1]="";
		}
	}
	var d=new Date();
	var EL = Elozmenyek.length;
	Elozmenyek[EL] = Array();
	Elozmenyek[EL][0]=ReceptMost;
	Elozmenyek[EL][1]=d.toDateString();
	
	EHistory.splice(0,EHistory.length);
	HPos = 0;
	for (var m=0;m<Elozmenyek.length;m++)
	{
		var EPos = Elozmenyek.length-m-1;
		if (Elozmenyek[EPos][0]!=0 && HPos<ElozmenyekMAX-1 )  
			{
				window.localStorage.setItem("erecept"+HPos,Elozmenyek[EPos][0]);
				window.localStorage.setItem("edatum"+HPos,Elozmenyek[EPos][1]); 
				EHistory[HPos] = Array();
				EHistory[HPos][0] = Elozmenyek[EPos][0];
				EHistory[HPos][1] = Elozmenyek[EPos][1];
				HPos++;
			}
	}
}

function Preferences(PrefNR,Ertek)
{
	var E = window.localStorage.getItem("pref"+PrefNR);
	if (Ertek!=null) { window.localStorage.setItem("pref"+PrefNR,Ertek); }
	if (E==null) { E=-1; }
	return E;
}

function network_status() {
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

// function shouldRotateToOrientation (rotation) {     // iOS-en elforgatás engedélyezése, tiltása
//     switch (rotation) {
//         //Portrait or PortraitUpsideDown
//         case 0:
//         case 180:
//             return true;
//         //LandscapeRight or LandscapeLeft
//         case 90:
//         case -90:
//              return false;
//     }
// }

var oc_timer;

window.addEventListener("orientationchange", function() {   
	clearTimeout(oc_timer);
	var oc_delay = 0;
	if (device && device.platform=="Android") { oc_delay=500; }
  	oc_timer = setTimeout(OrientationReCalc,oc_delay); 
}, false);

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
        	//console.log("Felbontás : "+sW+" x "+sH);
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

var PROBA =1;

function Ertekeles_feldolgoz(CMEZO,response)
{
		if (!response) { return; }    // a callback kétszer is meghívja (bug), de addigra már lehet, hogy fel van szabadítva
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

var SkalaPoz = Array();
SkalaPoz[1] = Array (-4,15,34,53,72,91);
SkalaPoz[2] = Array (-4,29,59,91);

function Skala(NR,NUM)
{
	var golyo = document.getElementById("GOLYO"+NR);
	golyo.style.left=SkalaPoz[NR][NUM]+"%";
	if (NR==1) { Kereses_Ido = NUM; }
	if (NR==2) { Kereses_Fok = NUM; }
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



function Evszak_Init()
{
		var D = new Date();
		var HO  = parseInt(D.getMonth()+1);					
		var NAP = D.getDate();				
		EVSZAK = EvszakID[EvszakID.length-1];				// ha végül nem talál, akkor = tél (év eleje átnyúlik)
		var keres = true;
		for (var n=1; n<EvszakID.length; n++)
		{
			EHO1  = EvszakD1[n].substr(5,2);
			ENAP1 = EvszakD1[n].substr(8,2);
			EHO2  = EvszakD2[n].substr(5,2);
			ENAP2 = EvszakD2[n].substr(8,2);
			if (keres)
			{
				if ( (HO>=EHO1 && NAP>=ENAP1) && (HO<=EHO2 && NAP<=ENAP2))
				{
					keres = false;
					EVSZAK = EvszakID[n];
					EVSZAKnr = n;
				}
			}
		}
		console.log(EVSZAK);
}