import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg:"#F7F4EF", surface:"#FFFFFF", border:"#EDEBE5",
  text:"#1C1714", sub:"#847870", faint:"#C2B9B0",
  blush:"#B96E64", warm:"#A07840", sage:"#5A8866", sky:"#527A9A",
  coral:"#C4724A",
  sh:"0 1px 3px rgba(28,23,20,.05),0 4px 20px rgba(28,23,20,.07)",
  sh2:"0 8px 48px rgba(28,23,20,.18)",
};
const F = "'Lora','Georgia',serif";
const M = "'SF Mono','Menlo',monospace";
const uid = () => Math.random().toString(36).slice(2,9);
const fmtDate = s => { try { return new Date(s).toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"}); } catch { return ""; }};
const daysTo = s => { try { return Math.ceil((new Date(s)-new Date())/86400000); } catch { return 0; }};

const PD = {
  4:{s:"seme di papavero",dim:"0.4cm",peso:"<1g",tri:1,headline:"Il cuore comincia a formarsi.",dev:"L'embrione si è appena annidato nell'utero. Il tubo neurale inizia a formarsi — diventerà cervello e midollo spinale.",highlights:["HCG già prodotto — il test è positivo","DNA unico già definito","Pesa meno di un granello di sale"],mamma:["Seno gonfio e sensibile","Stanchezza insolita","Possibile nausea precoce"],urgente:"Inizia l'acido folico 400mcg/die — riduce del 70% il rischio di difetti del tubo neurale.",esami:[],medicine:[{nome:"Acido folico",dose:"400mcg/die",motivo:"Riduce del 70% i difetti del tubo neurale",quando:"Prima colazione",link:"https://www.amazon.it/s?k=acido+folico+400mcg&tag=nido-21"},{nome:"Vitamina D3",dose:"1000 UI/die",motivo:"Essenziale per ossa e sistema immunitario",quando:"Con il pasto",link:"https://www.amazon.it/s?k=vitamina+d3+gravidanza&tag=nido-21"}]},
  8:{s:"lampone",dim:"1.6cm",peso:"1g",tri:1,headline:"Il cuore batte 150 volte al minuto.",dev:"Tutti gli organi principali sono abbozzati. Il cuore batte a 150–170 bpm. Il cervello sviluppa 250.000 neuroni ogni minuto.",highlights:["250.000 neuroni nuovi ogni minuto","Dita visibili ma ancora unite","Può girare la testa"],mamma:["Nausea intensa","Stanchezza fuori dal normale","Avversione a certi cibi"],urgente:"Prima ecografia: conferma gestazione, battito e data.",esami:["Prima ecografia ostetrica","Emocromo completo","Toxoplasmosi e rubella","Gruppo sanguigno e Rh"],medicine:[{nome:"Acido folico",dose:"400mcg/die",motivo:"Ancora fondamentale nel primo trimestre",quando:"Prima colazione",link:"https://www.amazon.it/s?k=acido+folico+400mcg&tag=nido-21"},{nome:"Omega-3 DHA",dose:"200mg/die",motivo:"Sviluppo neurologico e visivo",quando:"Con i pasti",link:"https://www.amazon.it/s?k=omega+3+dha+gravidanza&tag=nido-21"}]},
  12:{s:"lime",dim:"5.4cm",peso:"14g",tri:1,headline:"Fine del primo trimestre. Il pericolo maggiore è passato.",dev:"Il rischio di aborto scende drasticamente. Tutti gli organi sono formati. Il viso è riconoscibilmente umano.",highlights:["Riflessi di suzione già attivi","Unghie già in crescita","Respira liquido amniotico"],mamma:["La nausea inizia a diminuire","Energia in ripresa","Il pancino si mostra"],urgente:"Translucenza nucale (TNL) + bitest: da fare entro la settimana 13+6.",esami:["Translucenza nucale (TNL)","Bitest PAPP-A + β-HCG"],medicine:[{nome:"Ferro",dose:"30mg/die",motivo:"Previene l'anemia da gravidanza",quando:"A stomaco vuoto con succo d'arancia",link:"https://www.amazon.it/s?k=ferro+gravidanza+integratore&tag=nido-21"},{nome:"Iodio",dose:"150mcg/die",motivo:"Sviluppo tiroide e cervello del feto",quando:"Con i pasti",link:"https://www.amazon.it/s?k=iodio+gravidanza&tag=nido-21"}]},
  16:{s:"avocado",dim:"11.6cm",peso:"100g",tri:2,headline:"Sente i suoni. Sente la vostra voce.",dev:"Il sistema nervoso è in piena esplosione. Il cuore pompa 25 litri di sangue al giorno. Il bebè si allena con movimenti coordinati.",highlights:["Reagisce ai suoni forti","Si gira se illumini la pancia","Prime espressioni facciali"],mamma:["Potresti sentire i primi movimenti","La pancia è visibile","Energia tornata"],urgente:"Prenota ora l'ecografia morfologica: si fa tra 18 e 21 settimane.",esami:["Esame urine","Pressione arteriosa"],medicine:[{nome:"Ferro",dose:"30mg/die",motivo:"Il fabbisogno aumenta nel secondo trimestre",quando:"A stomaco vuoto",link:"https://www.amazon.it/s?k=ferro+gravidanza&tag=nido-21"},{nome:"Calcio",dose:"1000mg/die",motivo:"Lo scheletro del bebè si sta formando",quando:"Distribuito nei pasti",link:"https://www.amazon.it/s?k=calcio+gravidanza+integratore&tag=nido-21"}]},
  20:{s:"banana",dim:"25.6cm",peso:"300g",tri:2,headline:"Metà percorso. Il bebè sogna.",dev:"Dorme e si sveglia a cicli regolari. Sentirà le canzoni che ascoltate e le ricorderà dopo la nascita.",highlights:["Impronte digitali già uniche","Sente dolce e amaro","Ricorda le melodie"],mamma:["Movimenti chiari e frequenti","Possibile bruciore di stomaco","Gonfiore alle caviglie"],urgente:"Ecografia morfologica 2° livello — l'esame più importante del 2° trimestre.",esami:["Ecografia morfologica (18–21 sett.)"],medicine:[{nome:"Ferro",dose:"30mg/die",motivo:"Anemia frequente a metà gravidanza",quando:"Mattina a stomaco vuoto",link:"https://www.amazon.it/s?k=ferro+gravidanza&tag=nido-21"},{nome:"Magnesio",dose:"300mg/die",motivo:"Riduce crampi notturni",quando:"Sera prima di dormire",link:"https://www.amazon.it/s?k=magnesio+gravidanza+crampi&tag=nido-21"}]},
  24:{s:"spiga di mais",dim:"30cm",peso:"600g",tri:2,headline:"Vi sente perfettamente. Parlatele.",dev:"Sente la tua voce, il battito del tuo cuore. I polmoni iniziano a produrre surfattante. Se nascesse oggi avrebbe concrete possibilità.",highlights:["Riconosce già la voce della mamma","Ha periodi di sonno REM","Sorride e fa le boccacce"],mamma:["Movimenti forti e visibili","Crampi alle gambe di notte","Braxton-Hicks possono iniziare"],urgente:"Test di tolleranza al glucosio (OGTT 75g): OBBLIGATORIO tra 24 e 28 settimane.",esami:["Curva da carico glucosio OGTT 75g","Emocromo completo","Esame urine"],medicine:[{nome:"Ferro",dose:"30-60mg/die",motivo:"Il fabbisogno aumenta ulteriormente",quando:"A stomaco vuoto con vitamina C",link:"https://www.amazon.it/s?k=ferro+gravidanza+60mg&tag=nido-21"},{nome:"Magnesio",dose:"300mg/die",motivo:"Crampi notturni e Braxton-Hicks",quando:"Sera",link:"https://www.amazon.it/s?k=magnesio+350mg&tag=nido-21"}]},
  28:{s:"melone",dim:"37.6cm",peso:"1kg",tri:3,headline:"Sogna. Le onde cerebrali mostrano attività REM.",dev:"Gli occhi si aprono e chiudono. Capisce già la differenza tra voci familiari e straniere. I polmoni sono quasi maturi.",highlights:["Occhi blu-grigio (il colore arriva dopo)","Distingue musica classica da rock","Ha il singhiozzo"],mamma:["Difficoltà a respirare","Insonnia frequente","Movimenti visibili dall'esterno"],urgente:"Le visite diventano ogni 2 settimane. Conta i movimenti ogni sera: 10 in 2 ore.",esami:["Visita ostetrica","Ecografia di accrescimento","Emocromo"],medicine:[{nome:"Ferro",dose:"60mg/die",motivo:"Anemia terzo trimestre — quasi universale",quando:"Mattina a stomaco vuoto",link:"https://www.amazon.it/s?k=ferro+60mg+gravidanza&tag=nido-21"},{nome:"Omega-3 DHA",dose:"300mg/die",motivo:"Maturazione sistema nervoso centrale",quando:"Con i pasti",link:"https://www.amazon.it/s?k=omega3+dha&tag=nido-21"}]},
  32:{s:"zucchino",dim:"42.4cm",peso:"1.7kg",tri:3,headline:"Si posiziona a testa in giù. Si prepara.",dev:"I movimenti sono molto forti. Il sistema immunitario riceve anticorpi materni. Accumula 14 grammi di grasso al giorno.",highlights:["Potrebbe avere già i capelli","Unghie alla punta delle dita","Riconosce la routine della mamma"],mamma:["Stanchezza intensa","Difficoltà a dormire","Pressione forte sul bacino"],urgente:"Ecografia di accrescimento: crescita, posizione e liquido amniotico.",esami:["Ecografia accrescimento","Visita ostetrica bisettimanale"],medicine:[{nome:"Ferro",dose:"60mg/die",motivo:"Scorte per il parto",quando:"A stomaco vuoto",link:"https://www.amazon.it/s?k=ferro+gravidanza&tag=nido-21"},{nome:"Magnesio",dose:"350mg/die",motivo:"Sonno e riduzione contrazioni precoci",quando:"Sera",link:"https://www.amazon.it/s?k=magnesio+gravidanza&tag=nido-21"}]},
  36:{s:"papaia",dim:"47.4cm",peso:"2.6kg",tri:3,headline:"Quasi pronto. Ogni giorno ora conta.",dev:"Si abbassa nel bacino. I polmoni producono abbastanza surfattante. Il lanugo scompare.",highlights:["Ha già la forza di presa","Conosce la vostra musica","600ml di urina al giorno"],mamma:["Intensa pressione pelvica","Respiro più facile","Perdita del tappo mucoso possibile"],urgente:"URGENTE: tampone vaginale per streptococco B (35-37 sett.). Borsa ospedale pronta.",esami:["Tampone vaginale streptococco B — OBBLIGATORIO","Visita ostetrica settimanale"],medicine:[{nome:"Vitamina D3",dose:"2000 UI/die",motivo:"Scorte per il neonato",quando:"Con il pasto",link:"https://www.amazon.it/s?k=vitamina+d3+neonato&tag=nido-21"},{nome:"Ferro",dose:"60mg/die",motivo:"Scorte per il parto",quando:"Mattina",link:"https://www.amazon.it/s?k=ferro+gravidanza&tag=nido-21"}]},
  40:{s:"zucca piccola",dim:"51.2cm",peso:"3.4kg",tri:3,headline:"Termine ufficiale. Aspetta il suo segnale.",dev:"Il bebè è completamente pronto. Sarà lui a dare il via al travaglio con un segnale ormonale.",highlights:["Il bebè dà il via al travaglio","Riflessi di suzione già attivi","Riconosce la voce della mamma"],mamma:["Contrazioni irregolari frequenti","Pressione pelvica costante","Nidificazione al massimo"],urgente:"Al PS se: contrazioni ogni 5 min per 1 ora, rottura acque, movimenti ridotti.",esami:["CTG bisettimanale","Visita ostetrica"],medicine:[{nome:"Ferro + Vitamina D",dose:"Come da routine",motivo:"Continua fino al parto",quando:"Come sempre",link:"https://www.amazon.it/s?k=integratori+gravidanza&tag=nido-21"}]},
};
function getPD(w){const keys=Object.keys(PD).map(Number).sort((a,b)=>a-b);return PD[keys.reduce((acc,k)=>w>=k?k:acc,4)];}

const MARKET=[
  {id:"m1",cat:"Carrozzina",nome:"Passeggino Chicco Bravo",prezzo:"€349",sconto:"20%",badge:"Best seller",desc:"Leggero, pieghevole con una mano, compatibile con ovetto.",link:"https://www.amazon.it/s?k=passeggino+chicco+bravo&tag=nido-21",emoji:"🛻"},
  {id:"m2",cat:"Sicurezza",nome:"Seggiolino auto i-Size",prezzo:"€199",sconto:"15%",badge:"Sicurezza 5★",desc:"Gruppo 0+/1, i-Size, installazione ISOFIX.",link:"https://www.amazon.it/s?k=seggiolino+auto+isize&tag=nido-21",emoji:"🚗"},
  {id:"m3",cat:"Integratori",nome:"Acido folico 400mcg",prezzo:"€8.90",sconto:"",badge:"Raccomandato",desc:"Formulazione ottimale per la gravidanza.",link:"https://www.amazon.it/s?k=acido+folico+400mcg&tag=nido-21",emoji:"💊"},
  {id:"m4",cat:"Integratori",nome:"Omega-3 DHA gravidanza",prezzo:"€22.50",sconto:"10%",badge:"Clinicamente testato",desc:"200mg DHA+EPA, certificato per la gravidanza.",link:"https://www.amazon.it/s?k=omega3+dha+gravidanza&tag=nido-21",emoji:"🐟"},
  {id:"m5",cat:"Nursery",nome:"Baby monitor video WiFi",prezzo:"€89",sconto:"25%",badge:"App iPhone/Android",desc:"Visione notturna, audio bidirezionale, sensore temperatura.",link:"https://www.amazon.it/s?k=baby+monitor+video+wifi&tag=nido-21",emoji:"📷"},
  {id:"m6",cat:"Nursery",nome:"Lettino co-sleeping 3in1",prezzo:"€149",sconto:"",badge:"Consigliato pediatri",desc:"Si aggancia al letto dei genitori. Convertibile.",link:"https://www.amazon.it/s?k=lettino+cosleeping&tag=nido-21",emoji:"🛏️"},
  {id:"m7",cat:"Allattamento",nome:"Tiralatte elettrico doppio",prezzo:"€159",sconto:"30%",badge:"Offerta",desc:"Doppio diaframma, 9 livelli intensità.",link:"https://www.amazon.it/s?k=tiralatte+elettrico+doppio&tag=nido-21",emoji:"🍼"},
  {id:"m8",cat:"Cura",nome:"Crema smagliature",prezzo:"€18",sconto:"",badge:"Naturale",desc:"Olio di rosa mosqueta + vitamina E. Dal primo trimestre.",link:"https://www.amazon.it/s?k=crema+smagliature+gravidanza&tag=nido-21",emoji:"✨"},
  {id:"m9",cat:"Libri",nome:"Aspettando un bambino",prezzo:"€24",sconto:"",badge:"Il più venduto",desc:"La guida settimana per settimana più completa in italiano.",link:"https://www.amazon.it/s?k=aspettando+un+bambino&tag=nido-21",emoji:"📚"},
  {id:"m10",cat:"Cura",nome:"Cuscino gravidanza a C",prezzo:"€45",sconto:"15%",badge:"Bestseller",desc:"Supporto lombare e pancia. Lavabile in lavatrice.",link:"https://www.amazon.it/s?k=cuscino+gravidanza&tag=nido-21",emoji:"🌙"},
];
const NOTIZIE=[
  {id:"n1",titolo:"Gravidanza e caldo estivo: come proteggersi",fonte:"TuttoBebè",data:"2025-06-15",url:"https://www.tuttobebe.it",emoji:"☀️"},
  {id:"n2",titolo:"Bonus bebè 2026: tutte le novità INPS",fonte:"INPS.gov.it",data:"2025-06-10",url:"https://www.inps.it",emoji:"💶"},
  {id:"n3",titolo:"Ecografia morfologica: cosa vedere e come prepararsi",fonte:"Nostrofiglio",data:"2025-06-08",url:"https://www.nostrofiglio.it",emoji:"👶"},
  {id:"n4",titolo:"Congedo paternità 2026: 10 giorni obbligatori",fonte:"Il Sole 24 Ore",data:"2025-06-05",url:"https://www.ilsole24ore.com",emoji:"👨"},
  {id:"n5",titolo:"Alimentazione in gravidanza: i 10 alimenti da evitare",fonte:"Uppa Magazine",data:"2025-06-03",url:"https://www.uppa.it",emoji:"🥗"},
  {id:"n6",titolo:"Quanto dormire in gravidanza",fonte:"Corriere Salute",data:"2025-06-01",url:"https://www.corriere.it",emoji:"🌙"},
];

const SB_URL="https://qjjhyvdnclujyebrhudu.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqamh5dmRuY2x1anllYnJodWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMDMzODMsImV4cCI6MjA5OTY3OTM4M30.BdxSOot_0Jyh4xn0Csh8MURXdFi0X8QMKsK7cfny2dE";
const SBH={"Content-Type":"application/json","apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Prefer":"return=representation"};
const sbGet=async(t,f="")=>{try{const r=await fetch(SB_URL+"/rest/v1/"+t+"?"+f,{headers:SBH});return r.json();}catch{return[];}};
const sbPost=async(t,b)=>{try{const r=await fetch(SB_URL+"/rest/v1/"+t,{method:"POST",headers:SBH,body:JSON.stringify(b)});return r.json();}catch{return[];}};
const sbPatch=async(t,f,b)=>{try{const r=await fetch(SB_URL+"/rest/v1/"+t+"?"+f,{method:"PATCH",headers:{...SBH},body:JSON.stringify(b)});return r.json();}catch{return[];}};
function getFamilyCode(){let c=localStorage.getItem("nido_family_code");if(!c){c=Math.random().toString(36).slice(2,8).toUpperCase();localStorage.setItem("nido_family_code",c);}return c;}
function makeMember(id,role,color){return{id,role,color,nome:role==="papà"?"Papà":"Mamma",lavoro:"",salute:{acqua:0,acquaObiettivo:8,peso:0,benessere:0,integratori:role==="mamma"?["Acido folico 400mcg","Ferro 30mg","Vitamina D3 1000UI"]:["Vitamina D3 1000UI"],integratoriPresi:{}}};}

const INIT={
  onboardingDone:false,
  members:[makeMember("papa","papà",C.warm),makeMember("mamma","mamma",C.blush)],
  baby:{settimane:24,nome:"",dataPresunta:"2026-09-15",sesso:"sconosciuto",check:[{id:"c1",item:"Lettino",fatto:true},{id:"c2",item:"Fasciatoio",fatto:true},{id:"c3",item:"Carrozzina",fatto:false},{id:"c4",item:"Seggiolino auto",fatto:false},{id:"c5",item:"Baby monitor",fatto:false}]},
  appuntamenti:[{id:"a1",titolo:"Visita ostetrica",data:"2026-08-05",ora:"10:00",chi:"entrambi",tipo:"bebè",note:""},{id:"a2",titolo:"Corso preparto",data:"2026-08-12",ora:"09:00",chi:"entrambi",tipo:"bebè",note:""}],
  tasks:[{id:"t1",testo:"Acquistare la carrozzina",fatto:false,chi:"entrambi",cat:"bebè"},{id:"t2",testo:"Richiedere bonus bebè INPS",fatto:false,chi:"entrambi",cat:"famiglia"},{id:"t3",testo:"Scegliere il pediatra",fatto:false,chi:"entrambi",cat:"bebè"}],
  contrazioni:{attivo:false,lista:[],inizio:null},
};

function useStore(){
  const [d,set]=useState(()=>{try{const s=localStorage.getItem("nido_v6");return s?JSON.parse(s):INIT;}catch{return INIT;}});
  const [syncOk,setSyncOk]=useState(false);
  const [syncing,setSyncing]=useState(false);
  const recRef=useRef(null);
  const familyCode=getFamilyCode();
  useEffect(()=>{
    let cancelled=false;
    async function load(){
      setSyncing(true);
      try{
        let fam=await sbGet("famiglie","codice=eq."+familyCode+"&select=id");
        let famId;
        if(!fam||fam.length===0){const c=await sbPost("famiglie",{codice:familyCode});famId=c[0]?.id;}
        else famId=fam[0].id;
        if(!famId||cancelled)return;
        localStorage.setItem("nido_famiglia_id",famId);
        const rows=await sbGet("nido_data","famiglia_id=eq."+famId+"&select=id,data&order=updated_at.desc&limit=1");
        if(rows&&rows.length>0&&!cancelled){recRef.current=rows[0].id;const r=rows[0].data;if(r&&typeof r==="object"){set(r);localStorage.setItem("nido_v6",JSON.stringify(r));}}
        setSyncOk(true);
      }catch{}finally{if(!cancelled)setSyncing(false);}
    }
    load();
    const iv=setInterval(async()=>{
      try{
        const famId=localStorage.getItem("nido_famiglia_id");if(!famId)return;
        const rows=await sbGet("nido_data","famiglia_id=eq."+famId+"&select=id,data,updated_at&order=updated_at.desc&limit=1");
        if(rows&&rows.length>0&&rows[0].id!==recRef.current){recRef.current=rows[0].id;const r=rows[0].data;if(r&&typeof r==="object"){set(r);localStorage.setItem("nido_v6",JSON.stringify(r));}}
      }catch{}
    },8000);
    return()=>{cancelled=true;clearInterval(iv);};
  },[]);
  const setD=useCallback(fn=>set(prev=>{
    const next=typeof fn==="function"?fn(prev):fn;
    try{localStorage.setItem("nido_v6",JSON.stringify(next));}catch{}
    const famId=localStorage.getItem("nido_famiglia_id");
    if(famId){(async()=>{try{if(recRef.current){await sbPatch("nido_data","famiglia_id=eq."+famId,{data:next,updated_at:new Date().toISOString()});}else{const rows=await sbPost("nido_data",{famiglia_id:famId,data:next});if(rows&&rows[0])recRef.current=rows[0].id;}}catch{}})();}
    return next;
  }),[]);
  return [d,setD,{syncOk,syncing,familyCode}];
}

function useGrillo(data,userId,tab){
  const [bubble,setBubble]=useState(null);
  const [loading,setLoading]=useState(false);
  const seenRef=useRef(new Set());
  const timerRef=useRef(null);
  useEffect(()=>{
    if(!userId||!data)return;
    const key=tab+"-"+Math.floor(Date.now()/300000);
    if(seenRef.current.has(key))return;
    clearTimeout(timerRef.current);
    setBubble(null);
    timerRef.current=setTimeout(async()=>{
      if(seenRef.current.has(key))return;
      seenRef.current.add(key);
      setLoading(true);
      const me=data.members.find(m=>m.id===userId);
      const sw=data.baby.settimane;
      const info=getPD(sw);
      const prox=[...data.appuntamenti].filter(a=>new Date(a.data)>=new Date()).sort((a,b)=>new Date(a.data)-new Date(b.data));
      const sys="Sei il Grillo Parlante di NIDO. Dati: settimana "+sw+"/40. "+me?.nome+" e nella sezione '"+tab+"'. Acqua: "+(me?.salute?.acqua||0)+"/"+(me?.salute?.acquaObiettivo||8)+". Prossimo appuntamento: "+(prox[0]?prox[0].titolo+" il "+prox[0].data:"nessuno")+". Ora: "+new Date().getHours()+":00. "+info.headline+" "+info.urgente+". Genera UN SOLO suggerimento proattivo, max 2 frasi, pertinente alla sezione. Solo il testo.";
      try{
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:120,system:sys,messages:[{role:"user",content:"Suggerimento"}]})});
        const d2=await r.json();
        const txt=d2.content?.[0]?.text;
        if(txt)setBubble(txt);
      }catch{}
      setLoading(false);
    },3500);
    return()=>clearTimeout(timerRef.current);
  },[tab,userId]);
  return {bubble,loading,dismiss:()=>setBubble(null)};
}

function GrilloBubble({bubble,loading,onDismiss,onExpandAI}){
  if(!loading&&!bubble)return null;
  return (
    <div style={{position:"fixed",bottom:88,left:16,right:16,zIndex:500,maxWidth:398,margin:"0 auto",animation:"slideUp .3s cubic-bezier(.4,0,.2,1)"}}>
      <div style={{background:C.text,borderRadius:22,padding:"14px 16px",boxShadow:C.sh2,display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{width:28,height:28,borderRadius:10,background:C.warm,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>✦</div>
        <div style={{flex:1,minWidth:0}}>
          {loading
            ? <div style={{display:"flex",gap:4,padding:"6px 0"}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:3,background:C.faint,animation:"pulse 1.2s ease "+(i*.2)+"s infinite"}}/>)}</div>
            : <div style={{fontSize:13.5,color:C.surface,lineHeight:1.55}}>{bubble}</div>}
          {bubble&&(
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button onClick={onExpandAI} style={{padding:"6px 14px",background:C.warm,color:C.surface,border:"none",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:F,fontWeight:500}}>Dimmi di più</button>
              <button onClick={onDismiss} style={{padding:"6px 14px",background:"rgba(255,255,255,.12)",color:C.surface,border:"none",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:F}}>OK grazie</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CAT_C={bebè:C.blush,lavoro:C.warm,salute:C.sage,famiglia:C.sage};
const mEmoji=id=>id==="papa"?"👨":id==="mamma"?"👩":"👤";
const mColor=(id,members)=>members.find(m=>m.id===id)?.color||C.sub;
const mLabel=(id,members)=>{if(id==="entrambi")return "👫 Entrambi";const m=members.find(x=>x.id===id);return m?mEmoji(m.id)+" "+m.nome:id;};

function Bar({pct,color,h=5}){return(<div style={{height:h,borderRadius:h,background:C.border,overflow:"hidden"}}><div style={{height:"100%",width:Math.min(Math.max(Number(pct)||0,0),100)+"%",background:color,borderRadius:h,transition:"width .4s ease"}}/></div>);}
function Chip({color,children,sm}){return(<span style={{display:"inline-block",padding:sm?"2px 8px":"3px 11px",borderRadius:20,fontSize:sm?10:11,fontFamily:M,background:color+"15",color,border:"1px solid "+color+"25"}}>{children}</span>);}
function SLabel({children,color}){return(<div style={{fontSize:10.5,fontFamily:M,letterSpacing:.9,textTransform:"uppercase",color:color||C.sub,marginBottom:12}}>{children}</div>);}
function Hr(){return <div style={{height:1,background:C.border,margin:"12px -20px"}}/>;}
function Card({children,style,accent}){return(<div style={{background:C.surface,borderRadius:24,padding:"20px",marginBottom:12,boxShadow:C.sh,border:accent?"none":"1px solid "+C.border,borderLeft:accent?"3px solid "+accent:"1px solid "+C.border,...style}}>{children}</div>);}
function SRow({children,style}){return <div style={{display:"flex",alignItems:"center",gap:12,...style}}>{children}</div>;}

function Toast({msg,onClose}){
  useEffect(()=>{if(!msg)return;const t=setTimeout(onClose,4500);return()=>clearTimeout(t);},[msg]);
  if(!msg)return null;
  return(<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,width:"88%",maxWidth:400,background:C.surface,borderRadius:22,padding:"14px 18px",boxShadow:C.sh2,display:"flex",gap:12,alignItems:"center",border:"1px solid "+C.border,animation:"toastIn .28s ease"}}><span style={{fontSize:22}}>{msg.icon}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:C.text,fontFamily:F}}>{msg.title}</div>{msg.body&&<div style={{fontSize:13,color:C.sub,marginTop:1}}>{msg.body}</div>}</div><button onClick={onClose} style={{background:"none",border:"none",color:C.faint,fontSize:22,cursor:"pointer",padding:0,lineHeight:1}}>×</button></div>);
}

function Sheet({title,onClose,children}){
  return(<div style={{position:"fixed",inset:0,background:"rgba(28,23,20,.42)",zIndex:600,display:"flex",alignItems:"flex-end",animation:"bgIn .2s ease"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div style={{background:C.surface,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:430,margin:"0 auto",maxHeight:"92vh",overflowY:"auto",boxShadow:C.sh2,animation:"sheetUp .24s cubic-bezier(.4,0,.2,1)"}}><div style={{position:"sticky",top:0,background:C.surface,zIndex:1,padding:"14px 24px 0"}}><div style={{width:36,height:4,borderRadius:2,background:C.border,margin:"0 auto 18px"}}/>{title&&<div style={{fontSize:20,fontWeight:500,color:C.text,fontFamily:F,marginBottom:18,paddingBottom:14,borderBottom:"1px solid "+C.border}}>{title}</div>}</div><div style={{padding:"4px 24px 48px"}}>{children}</div></div></div>);
}

function PageFade({children,tabKey}){
  const [vis,setVis]=useState(false);const [cnt,setCnt]=useState(children);const [k,setK]=useState(tabKey);
  useEffect(()=>{if(tabKey===k){setVis(true);return;}setVis(false);const t=setTimeout(()=>{setCnt(children);setK(tabKey);setVis(true);},110);return()=>clearTimeout(t);},[tabKey]);
  useEffect(()=>{setCnt(children);},[children]);
  return <div style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(5px)",transition:"opacity .15s ease,transform .15s ease"}}>{cnt}</div>;
}

const iS={width:"100%",padding:"13px 15px",borderRadius:14,border:"1.5px solid "+C.border,background:C.bg,color:C.text,fontSize:15,outline:"none",fontFamily:F,marginBottom:12};
function FRow({label,children}){return(<div style={{marginBottom:4}}>{label&&<div style={{fontSize:10.5,color:C.sub,fontFamily:M,letterSpacing:.7,textTransform:"uppercase",marginBottom:6}}>{label}</div>}{children}</div>);}
function Seg({value,onChange,opts}){return(<div style={{display:"flex",background:C.bg,borderRadius:12,padding:3,marginBottom:12,border:"1px solid "+C.border}}>{opts.map(o=><button key={o.v} onClick={()=>onChange(o.v)} style={{flex:1,padding:"9px 4px",borderRadius:10,border:"none",cursor:"pointer",background:value===o.v?C.surface:"transparent",color:value===o.v?C.text:C.sub,fontSize:12.5,fontFamily:F,fontWeight:value===o.v?500:400,boxShadow:value===o.v?C.sh:"none",transition:"all .14s",whiteSpace:"nowrap"}}>{o.l}</button>)}</div>);}
function PBtn({children,onPress,color,danger,full,sm,outline}){const bg=danger?"#C0392B":outline?"transparent":(color||C.warm);const cl=(danger||!outline)?C.surface:(color||C.warm);const bd=(outline||danger)?"1.5px solid "+((danger?"#C0392B":color)||C.warm)+"40":"none";return(<button onClick={onPress} style={{width:full?"100%":undefined,padding:sm?"9px 16px":"14px 20px",borderRadius:14,border:bd,background:bg,color:cl,fontSize:sm?13:15,fontFamily:F,fontWeight:500,cursor:"pointer"}}>{children}</button>);}

function TaskRow({t,members,setData,openSheet}){
  const cc=CAT_C[t.cat]||C.warm;
  return(<SRow><div onClick={()=>setData(d=>({...d,tasks:d.tasks.map(x=>x.id===t.id?{...x,fatto:!x.fatto}:x)}))} style={{width:24,height:24,borderRadius:8,flexShrink:0,cursor:"pointer",border:"2px solid "+(t.fatto?cc:C.border),background:t.fatto?cc+"15":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .14s"}}>{t.fatto&&<svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 3.8L4 6.5L10 1" stroke={cc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,color:t.fatto?C.faint:C.text,textDecoration:t.fatto?"line-through":"none",marginBottom:4}}>{t.testo}</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}><Chip color={cc} sm>{t.cat}</Chip><Chip color={t.chi==="entrambi"?C.sage:mColor(t.chi,members)} sm>{mLabel(t.chi,members)}</Chip></div></div><button onClick={()=>openSheet("editTask",t)} style={{background:"none",border:"none",color:C.faint,fontSize:22,cursor:"pointer",padding:"4px 6px",lineHeight:1}}>›</button></SRow>);
}

function Home({data,setData,userId,openSheet,fire}){
  const me=data.members.find(m=>m.id===userId);
  const sw=data.baby.settimane;
  const info=getPD(sw);
  const prox=[...data.appuntamenti].filter(a=>new Date(a.data)>=new Date()).sort((a,b)=>new Date(a.data)-new Date(b.data)).slice(0,3);
  const open=data.tasks.filter(t=>!t.fatto);
  const today=new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"});
  return (
    <div>
      <div style={{marginBottom:18}}><div style={{fontSize:11,color:C.faint,fontFamily:M,marginBottom:4}}>{today}</div><div style={{fontSize:26,fontWeight:300,color:C.text,lineHeight:1.2}}>Ciao, <span style={{color:me?.color||C.warm,fontWeight:500}}>{me?.nome||""}</span> 👋</div></div>
      <Card accent={C.blush} style={{background:"linear-gradient(135deg,#FFFFFF 55%,"+C.blush+"08)"}}>
        <SRow style={{justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div><SLabel color={C.blush}>🤱 Il vostro bebè</SLabel><div style={{fontSize:48,fontWeight:200,color:C.blush,lineHeight:1}}>{sw}</div><div style={{fontSize:13,color:C.sub,marginTop:2}}>settimane · {info.tri}° trimestre</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.faint,marginBottom:4}}>Grande come</div><div style={{fontSize:15,fontWeight:500,color:C.text}}>{info.s}</div><div style={{fontSize:12,color:C.sub,marginTop:2}}>{info.dim} · {info.peso}</div><div style={{marginTop:8}}><Chip color={C.blush}>{40-sw} sett. 🎉</Chip></div></div>
        </SRow>
        <Bar pct={Math.round(sw/40*100)} color={C.blush} h={6}/>
        <div style={{marginTop:10,padding:"10px 14px",background:C.blush+"08",borderRadius:12,border:"1px solid "+C.blush+"15"}}><div style={{fontSize:13,color:C.blush,fontWeight:600,marginBottom:3}}>{info.headline}</div><div style={{fontSize:13,color:C.sub,lineHeight:1.55}}>{info.dev.slice(0,130)}…</div></div>
        {info.urgente&&<div style={{marginTop:8,padding:"8px 12px",background:C.warm+"12",borderRadius:10}}><div style={{fontSize:12,color:C.warm,lineHeight:1.5}}>💡 {info.urgente}</div></div>}
      </Card>
      <Card>
        <SRow style={{justifyContent:"space-between",marginBottom:12}}><SLabel>💧 Acqua oggi</SLabel><button onClick={()=>setData(d=>({...d,members:d.members.map(m=>m.id===userId?{...m,salute:{...m.salute,acqua:Math.min((m.salute.acqua||0)+1,m.salute.acquaObiettivo)}}:m)}))} style={{width:34,height:34,borderRadius:10,background:C.sky+"14",border:"1.5px solid "+C.sky+"22",fontSize:20,cursor:"pointer",color:C.sky,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></SRow>
        <div style={{display:"flex",gap:10}}>{data.members.slice(0,2).map(m=>(<div key={m.id} style={{flex:1,padding:"10px 12px",background:C.bg,borderRadius:14,border:"1px solid "+(m.id===userId?C.sky+"40":C.border)}}><div style={{fontSize:11,color:C.sub,marginBottom:4}}>{mEmoji(m.id)} {m.nome}</div><div style={{fontSize:20,fontWeight:300,color:C.sky}}>{m.salute?.acqua||0}<span style={{fontSize:12,color:C.faint}}>/{m.salute?.acquaObiettivo||8}</span></div><Bar pct={((m.salute?.acqua||0)/(m.salute?.acquaObiettivo||8))*100} color={C.sky} h={4}/></div>))}</div>
      </Card>
      <Card>
        <SRow style={{justifyContent:"space-between",marginBottom:14}}><SLabel>📅 In agenda</SLabel><button onClick={()=>openSheet("appt")} style={{background:"none",border:"none",color:C.warm,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:500}}>+ Aggiungi</button></SRow>
        {prox.length===0&&<div style={{fontSize:14,color:C.faint,textAlign:"center",padding:"10px 0"}}>Niente in programma</div>}
        {prox.map((a,i)=>(<div key={a.id}>{i>0&&<Hr/>}<SRow><div style={{width:46,textAlign:"center",background:(CAT_C[a.tipo]||C.warm)+"10",borderRadius:14,padding:"8px 4px",flexShrink:0}}><div style={{fontSize:19,fontWeight:600,color:CAT_C[a.tipo]||C.warm,lineHeight:1}}>{new Date(a.data).getDate()}</div><div style={{fontSize:9,color:C.sub,fontFamily:M,textTransform:"uppercase",marginTop:2}}>{new Date(a.data).toLocaleString("it-IT",{month:"short"})}</div></div><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,color:C.text,fontWeight:500,marginBottom:4}}>{a.titolo}</div><div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>{a.ora&&<span style={{fontSize:12,color:C.sub,fontFamily:M}}>{a.ora}</span>}<Chip color={CAT_C[a.tipo]||C.warm} sm>{a.tipo}</Chip><Chip color={a.chi==="entrambi"?C.sage:mColor(a.chi,data.members)} sm>{mLabel(a.chi,data.members)}</Chip>{daysTo(a.data)===0&&<Chip color={C.blush} sm>oggi</Chip>}{daysTo(a.data)===1&&<Chip color={C.warm} sm>domani</Chip>}{daysTo(a.data)>1&&<span style={{fontSize:11,color:C.faint}}>tra {daysTo(a.data)}g</span>}</div></div><button onClick={()=>openSheet("editAppt",a)} style={{background:"none",border:"none",color:C.faint,fontSize:22,cursor:"pointer",padding:"4px 6px"}}>›</button></SRow></div>))}
      </Card>
      <Card>
        <SRow style={{justifyContent:"space-between",marginBottom:14}}><SLabel>{"✓ Da fare ("+open.length+")"}</SLabel><button onClick={()=>openSheet("task")} style={{background:"none",border:"none",color:C.warm,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:500}}>+ Aggiungi</button></SRow>
        {open.length===0&&<div style={{fontSize:14,color:C.faint,textAlign:"center",padding:"10px 0"}}>Tutto fatto 🎉</div>}
        {open.map((t,i)=><div key={t.id}>{i>0&&<Hr/>}<TaskRow t={t} members={data.members} setData={setData} openSheet={openSheet}/></div>)}
      </Card>
    </div>
  );
}

function Baby({data,setData,openSheet}){
  const sw=data.baby.settimane;
  const info=getPD(sw);
  const done=data.baby.check.filter(c=>c.fatto).length;
  const [exSw,setExSw]=useState(sw);
  const exInfo=getPD(exSw);
  return (
    <div>
      <Card accent={C.blush} style={{background:"linear-gradient(135deg,#FFFFFF 50%,"+C.blush+"08)"}}>
        <SRow style={{justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div><SLabel color={C.blush}>Gravidanza</SLabel><div style={{fontSize:58,fontWeight:200,color:C.blush,lineHeight:1}}>{sw}</div><div style={{fontSize:14,color:C.sub,marginTop:4}}>{info.tri}° trimestre · {40-sw} settimane</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.faint,marginBottom:5}}>Grande come</div><div style={{fontSize:17,fontWeight:500,color:C.text}}>{info.s}</div><div style={{fontSize:13,color:C.sub,marginTop:3}}>{info.dim} · {info.peso}</div><button onClick={()=>openSheet("editBaby")} style={{marginTop:10,background:"none",border:"1px solid "+C.blush+"30",borderRadius:10,color:C.blush,fontSize:12,padding:"5px 12px",cursor:"pointer",fontFamily:F}}>Modifica</button></div>
        </SRow>
        <Bar pct={Math.round(sw/40*100)} color={C.blush} h={8}/>
        {data.baby.dataPresunta&&<div style={{marginTop:10,padding:"8px 14px",background:C.blush+"08",borderRadius:10,border:"1px solid "+C.blush+"15"}}><span style={{fontSize:13,color:C.sub}}>Data presunta: </span><span style={{fontSize:13,color:C.blush,fontWeight:500}}>{fmtDate(data.baby.dataPresunta)}</span>{data.baby.nome&&<span style={{fontSize:13,color:C.blush}}> · {data.baby.nome}</span>}</div>}
      </Card>
      <Card>
        <div style={{fontSize:20,fontWeight:500,color:C.text,lineHeight:1.25,marginBottom:12}}>{info.headline}</div>
        <div style={{fontSize:15,color:C.text,lineHeight:1.75,marginBottom:16}}>{info.dev}</div>
        <div style={{marginBottom:16}}><div style={{fontSize:11,color:C.sky,fontFamily:M,letterSpacing:.7,marginBottom:8}}>QUESTA SETTIMANA</div>{info.highlights.map((h,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"8px 12px",background:C.sky+"07",borderRadius:10,marginBottom:6}}><span style={{color:C.sky,fontWeight:700,fontSize:14,flexShrink:0}}>✦</span><span style={{fontSize:13,color:C.sub,lineHeight:1.5,fontStyle:"italic"}}>{h}</span></div>))}</div>
        {info.mamma&&info.mamma.length>0&&(<div style={{marginBottom:16}}><div style={{fontSize:11,color:C.blush,fontFamily:M,letterSpacing:.7,marginBottom:8}}>COME STA LA MAMMA</div>{info.mamma.map((s,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"8px 12px",background:C.blush+"07",borderRadius:10,marginBottom:6}}><span style={{color:C.blush,flexShrink:0}}>·</span><span style={{fontSize:13,color:C.sub,lineHeight:1.5}}>{s}</span></div>))}</div>)}
        {info.urgente&&(<div style={{padding:"12px 14px",background:C.warm+"10",borderRadius:12,border:"1px solid "+C.warm+"25",marginBottom:16}}><div style={{fontSize:11,color:C.warm,fontFamily:M,letterSpacing:.7,marginBottom:4}}>DA FARE ORA</div><div style={{fontSize:14,color:C.text,lineHeight:1.55}}>{info.urgente}</div></div>)}
        {info.esami&&info.esami.length>0&&(<div><div style={{fontSize:11,color:C.sage,fontFamily:M,letterSpacing:.7,marginBottom:8}}>ESAMI DI QUESTA SETTIMANA</div>{info.esami.map((e,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"8px 12px",background:C.sage+"07",borderRadius:10,marginBottom:6}}><span style={{fontSize:13}}>🔬</span><span style={{fontSize:13,color:C.text,lineHeight:1.5}}>{e}</span></div>))}</div>)}
      </Card>
      <Card>
        <SLabel>🔭 Esplora le settimane</SLabel>
        <SRow style={{marginBottom:14}}>
          <button onClick={()=>setExSw(w=>Math.max(4,w-1))} style={{width:40,height:40,borderRadius:12,background:C.bg,border:"1px solid "+C.border,fontSize:18,cursor:"pointer",color:C.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:11,color:C.faint,marginBottom:2,fontFamily:M}}>SETTIMANA</div><div style={{fontSize:32,fontWeight:200,color:exSw===sw?C.blush:C.text}}>{exSw}</div>{exSw===sw&&<div style={{fontSize:10,color:C.blush,fontFamily:M}}>ATTUALE</div>}</div>
          <button onClick={()=>setExSw(w=>Math.min(40,w+1))} style={{width:40,height:40,borderRadius:12,background:C.bg,border:"1px solid "+C.border,fontSize:18,cursor:"pointer",color:C.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        </SRow>
        <div style={{padding:"14px",background:C.bg,borderRadius:14}}><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:4}}>{exInfo.headline}</div><div style={{fontSize:12,color:C.blush,fontFamily:M,marginBottom:8}}>{exInfo.s+" · "+exInfo.dim+" · "+exInfo.peso}</div><div style={{fontSize:14,color:C.sub,lineHeight:1.65}}>{exInfo.dev.slice(0,180)}…</div></div>
      </Card>
      <Card>
        <SRow style={{justifyContent:"space-between",marginBottom:14}}><SLabel>{"🏠 Nursery ("+done+"/"+data.baby.check.length+")"}</SLabel><button onClick={()=>openSheet("addCheck")} style={{background:"none",border:"none",color:C.warm,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:500}}>+ Aggiungi</button></SRow>
        {data.baby.check.map((c,i)=>(<div key={c.id}>{i>0&&<Hr/>}<SRow><div onClick={()=>setData(d=>({...d,baby:{...d.baby,check:d.baby.check.map((x,j)=>j===i?{...x,fatto:!x.fatto}:x)}}))} style={{width:24,height:24,borderRadius:8,flexShrink:0,cursor:"pointer",border:"2px solid "+(c.fatto?C.blush:C.border),background:c.fatto?C.blush+"15":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .14s"}}>{c.fatto&&<svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 3.8L4 6.5L10 1" stroke={C.blush} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div><span style={{flex:1,fontSize:15,color:c.fatto?C.faint:C.text,textDecoration:c.fatto?"line-through":"none"}}>{c.item}</span><button onClick={()=>setData(d=>({...d,baby:{...d.baby,check:d.baby.check.filter(x=>x.id!==c.id)}}))} style={{background:"none",border:"none",color:C.faint,fontSize:18,cursor:"pointer",padding:"4px 8px"}}>×</button></SRow></div>))}
        <div style={{marginTop:16}}><Bar pct={Math.round(done/Math.max(data.baby.check.length,1)*100)} color={C.blush} h={5}/></div>
      </Card>
      <ContrazioniTimer data={data} setData={setData}/>
    </div>
  );
}

function ContrazioniTimer({data,setData}){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id);},[]);
  const c=data.contrazioni||{attivo:false,lista:[],inizio:null};
  const elapsed=c.attivo&&c.inizio?Math.floor((now-c.inizio)/1000):0;
  const fmt=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
  const avg=c.lista.length>1?Math.round(c.lista.slice(-5).reduce((a,x,i,arr)=>i===0?0:a+(x.inizio-arr[i-1].inizio),0)/Math.max(c.lista.slice(-5).length-1,1)/1000):null;
  const isAlert=avg&&avg<300;
  return (
    <Card accent={isAlert?C.blush:C.border}>
      <SRow style={{justifyContent:"space-between",marginBottom:14}}><SLabel color={isAlert?C.blush:undefined}>⏱ Timer contrazioni</SLabel>{c.lista.length>0&&<button onClick={()=>setData(d=>({...d,contrazioni:{attivo:false,lista:[],inizio:null}}))} style={{background:"none",border:"none",color:C.faint,fontSize:12,cursor:"pointer",fontFamily:F}}>Reset</button>}</SRow>
      {isAlert&&<div style={{padding:"10px 14px",background:C.blush+"12",borderRadius:12,border:"1px solid "+C.blush+"30",marginBottom:14}}><div style={{fontSize:14,color:C.blush,fontWeight:600}}>⚠️ Contrazioni frequenti!</div><div style={{fontSize:13,color:C.sub,marginTop:2}}>Media ogni {Math.floor(avg/60)} min — considera di andare al punto nascita.</div></div>}
      <div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:52,fontWeight:200,color:c.attivo?C.blush:C.faint,fontFamily:M,lineHeight:1,transition:"color .3s"}}>{fmt(elapsed)}</div><div style={{fontSize:12,color:C.faint,marginTop:6,fontFamily:M}}>{c.attivo?"IN CORSO":"IN ATTESA"}</div></div>
      <SRow style={{justifyContent:"center",gap:12,marginBottom:c.lista.length>0?16:0}}>
        {!c.attivo
          ? <button onClick={()=>setData(d=>({...d,contrazioni:{...d.contrazioni,attivo:true,inizio:Date.now()}}))} style={{padding:"12px 32px",background:C.blush,color:C.surface,border:"none",borderRadius:14,fontSize:16,cursor:"pointer",fontFamily:F,fontWeight:500}}>Inizia</button>
          : <button onClick={()=>setData(d=>{const dur=Math.floor((Date.now()-(d.contrazioni.inizio||Date.now()))/1000);return{...d,contrazioni:{...d.contrazioni,attivo:false,inizio:null,lista:[...d.contrazioni.lista,{inizio:d.contrazioni.inizio,durata:dur,id:uid()}]}};})} style={{padding:"12px 32px",background:C.text,color:C.surface,border:"none",borderRadius:14,fontSize:16,cursor:"pointer",fontFamily:F,fontWeight:500}}>Fine</button>}
      </SRow>
      {c.lista.length>0&&(<div><div style={{fontSize:11,color:C.faint,fontFamily:M,letterSpacing:.8,textTransform:"uppercase",marginBottom:8}}>Ultime ({c.lista.length})</div>{avg&&<div style={{fontSize:13,color:C.sub,marginBottom:8}}>Intervallo medio: <span style={{color:avg<300?C.blush:C.sage,fontWeight:500}}>{Math.floor(avg/60)}m {avg%60}s</span></div>}{c.lista.slice(-4).reverse().map((x,i)=>(<div key={x.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<3?"1px solid "+C.border:"none"}}><span style={{fontSize:13,color:C.sub}}>{new Date(x.inizio).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})}</span><span style={{fontSize:13,color:C.text,fontFamily:M}}>{fmt(x.durata)}</span></div>))}</div>)}
    </Card>
  );
}

function Salute({data,setData,userId}){
  const me=data.members.find(m=>m.id===userId);
  const partner=data.members.find(m=>m.id!==userId);
  if(!me)return null;
  const s=me.salute;
  const sw=data.baby.settimane;
  const info=getPD(sw);
  const upd=fn=>setData(d=>({...d,members:d.members.map(m=>m.id===userId?{...m,salute:fn(m.salute)}:m)}));
  const STAR=["😔","😐","🙂","😊","🌟"];
  return (
    <div>
      <Card>
        <SLabel>✨ Come stai oggi?</SLabel>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:8}}>{STAR.map((e,i)=>(<button key={i} onClick={()=>upd(sl=>({...sl,benessere:i+1}))} style={{fontSize:i+1===(s.benessere||0)?32:24,background:"none",border:"none",cursor:"pointer",transition:"font-size .15s",padding:"4px"}}>{e}</button>))}</div>
        {s.benessere>0&&<div style={{textAlign:"center",fontSize:13,color:C.sub,marginBottom:4}}>{["Una giornata difficile.","Abbastanza bene.","Bene.","Molto bene!","Giornata meravigliosa! 🌟"][s.benessere-1]}</div>}
        {partner?.salute?.benessere>0&&(<div style={{marginTop:10,padding:"8px 12px",background:C.bg,borderRadius:10,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{mEmoji(partner.id)}</span><span style={{fontSize:13,color:C.sub}}>{partner.nome}: </span><span style={{fontSize:18}}>{STAR[(partner.salute.benessere||1)-1]}</span></div>)}
      </Card>
      <Card>
        <SRow style={{justifyContent:"space-between",marginBottom:14}}><SLabel>💧 Acqua oggi</SLabel><button onClick={()=>upd(sl=>({...sl,acqua:Math.min((sl.acqua||0)+1,sl.acquaObiettivo)}))} style={{width:36,height:36,borderRadius:10,background:C.sky+"14",border:"1.5px solid "+C.sky+"22",fontSize:22,cursor:"pointer",color:C.sky,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></SRow>
        <div style={{fontSize:26,fontWeight:300,color:C.sky,marginBottom:8}}>{s.acqua||0}<span style={{fontSize:14,color:C.faint}}>/{s.acquaObiettivo} bicchieri</span></div>
        <Bar pct={((s.acqua||0)/s.acquaObiettivo)*100} color={C.sky} h={7}/>
        <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>{Array.from({length:s.acquaObiettivo},(_,i)=>(<div key={i} style={{width:28,height:28,borderRadius:8,background:i<(s.acqua||0)?C.sky+"20":C.bg,border:"1.5px solid "+(i<(s.acqua||0)?C.sky+"50":C.border),display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{i<(s.acqua||0)?"💧":"·"}</div>))}</div>
      </Card>
      <Card>
        <SLabel>⚖️ Peso questa settimana</SLabel>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><input type="number" style={{...iS,flex:1,marginBottom:0,fontSize:22,fontWeight:300,color:C.warm}} placeholder="es. 78.5" value={s.peso||""} onChange={e=>upd(sl=>({...sl,peso:+e.target.value}))} step="0.1"/><span style={{fontSize:15,color:C.sub,flexShrink:0}}>kg</span></div>
      </Card>
      <Card accent={C.sage}>
        <SLabel color={C.sage}>💊 Medicine raccomandate — settimana {sw}</SLabel>
        <div style={{fontSize:12,color:C.sub,marginBottom:14,lineHeight:1.5}}>Basate sulle linee guida italiane per la settimana {sw}. Consulta sempre il tuo ginecologo prima di iniziare.</div>
        {(info.medicine||[]).map((m,i)=>(<div key={i}>{i>0&&<Hr/>}<div style={{padding:"4px 0"}}><SRow style={{justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:15,fontWeight:500,color:C.text}}>{m.nome}</div><Chip color={C.sage} sm>{m.dose}</Chip></SRow><div style={{fontSize:13,color:C.sub,marginBottom:4,lineHeight:1.5}}>{m.motivo}</div><div style={{fontSize:12,color:C.faint,marginBottom:8}}>🕐 {m.quando}</div><a href={m.link} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",background:C.warm+"12",border:"1px solid "+C.warm+"25",borderRadius:10,color:C.warm,fontSize:12,textDecoration:"none",fontFamily:F,fontWeight:500}}>🛒 Acquista su Amazon →</a></div></div>))}
      </Card>
      <Card>
        <SRow style={{justifyContent:"space-between",marginBottom:14}}><SLabel>📋 I tuoi integratori</SLabel><button onClick={()=>upd(sl=>({...sl,integratori:[...(sl.integratori||[]),""]}))} style={{background:"none",border:"none",color:C.warm,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:500}}>+ Aggiungi</button></SRow>
        {(s.integratori||[]).length===0&&<div style={{fontSize:14,color:C.faint}}>Nessun integratore</div>}
        {(s.integratori||[]).map((item,i)=>(<div key={i}>{i>0&&<Hr/>}<SRow><div onClick={()=>upd(sl=>({...sl,integratoriPresi:{...(sl.integratoriPresi||{}),[i]:!(sl.integratoriPresi||{})[i]}}))} style={{width:24,height:24,borderRadius:8,flexShrink:0,cursor:"pointer",border:"2px solid "+((s.integratoriPresi||{})[i]?C.sage:C.border),background:(s.integratoriPresi||{})[i]?C.sage+"15":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .14s"}}>{(s.integratoriPresi||{})[i]&&<svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 3.8L4 6.5L10 1" stroke={C.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div><input style={{...iS,flex:1,marginBottom:0}} value={item} onChange={e=>{const n=[...s.integratori];n[i]=e.target.value;upd(sl=>({...sl,integratori:n}));}}/><button onClick={()=>upd(sl=>({...sl,integratori:sl.integratori.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:C.faint,fontSize:18,cursor:"pointer",padding:"4px 8px"}}>×</button></SRow></div>))}
      </Card>
    </div>
  );
}

function Market(){
  const [cat,setCat]=useState("Tutti");
  const [newsTab,setNewsTab]=useState(false);
  const cats=["Tutti",...[...new Set(MARKET.map(m=>m.cat))]];
  const filtered=cat==="Tutti"?MARKET:MARKET.filter(m=>m.cat===cat);
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16}}><button onClick={()=>setNewsTab(false)} style={{flex:1,padding:"12px",borderRadius:14,border:"none",background:!newsTab?C.warm:C.bg,color:!newsTab?C.surface:C.sub,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:!newsTab?500:400}}>🛍️ Prodotti</button><button onClick={()=>setNewsTab(true)} style={{flex:1,padding:"12px",borderRadius:14,border:"none",background:newsTab?C.warm:C.bg,color:newsTab?C.surface:C.sub,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:newsTab?500:400}}>📰 Notizie</button></div>
      {!newsTab&&(<div><div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:16,paddingBottom:4}}>{cats.map(c=>(<button key={c} onClick={()=>setCat(c)} style={{whiteSpace:"nowrap",padding:"7px 14px",borderRadius:20,border:"1px solid "+(cat===c?C.warm+"50":C.border),background:cat===c?C.warm+"12":"transparent",color:cat===c?C.warm:C.sub,fontSize:12.5,cursor:"pointer",fontFamily:F,fontWeight:cat===c?500:400}}>{c}</button>))}</div>{filtered.map(m=>(<Card key={m.id}><SRow style={{justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{display:"flex",gap:10,flex:1,minWidth:0}}><div style={{width:44,height:44,borderRadius:14,background:C.bg,border:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{m.emoji}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:4}}>{m.nome}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{m.badge&&<Chip color={C.warm} sm>{m.badge}</Chip>}{m.sconto&&<Chip color={C.sage} sm>{"-"+m.sconto}</Chip>}</div></div></div><div style={{fontSize:16,fontWeight:600,color:C.warm,flexShrink:0,marginLeft:8}}>{m.prezzo}</div></SRow><div style={{fontSize:13,color:C.sub,lineHeight:1.55,marginBottom:12}}>{m.desc}</div><a href={m.link} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px",background:C.text,color:C.surface,borderRadius:12,fontSize:14,textDecoration:"none",fontFamily:F,fontWeight:500}}>🛒 Vedi su Amazon</a></Card>))}</div>)}
      {newsTab&&(<div><div style={{fontSize:13,color:C.sub,marginBottom:16,lineHeight:1.6}}>Notizie per famiglie in attesa — da fonti italiane affidabili.</div>{NOTIZIE.map(n=>(<Card key={n.id}><div style={{display:"flex",gap:12,alignItems:"flex-start"}}><div style={{fontSize:28,flexShrink:0}}>{n.emoji}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:500,color:C.text,lineHeight:1.35,marginBottom:6}}>{n.titolo}</div><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}><Chip color={C.sky} sm>{n.fonte}</Chip><span style={{fontSize:11,color:C.faint}}>{new Date(n.data).toLocaleDateString("it-IT",{day:"numeric",month:"long"})}</span></div><a href={n.url} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:C.warm,textDecoration:"none",fontFamily:F,fontWeight:500}}>Leggi l'articolo →</a></div></div></Card>))}</div>)}
    </div>
  );
}

function Agenda({data,setData,openSheet}){
  const today=new Date();
  const [month,setMonth]=useState(new Date(today.getFullYear(),today.getMonth(),1));
  const daysInMonth=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  const firstDay=(new Date(month.getFullYear(),month.getMonth(),1).getDay()+6)%7;
  const mesi=["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
  const giorni=["L","M","M","G","V","S","D"];
  const eventsForDay=day=>{const ds=new Date(month.getFullYear(),month.getMonth(),day).toISOString().slice(0,10);return data.appuntamenti.filter(a=>a.data===ds);};
  const isToday_=day=>today.getFullYear()===month.getFullYear()&&today.getMonth()===month.getMonth()&&today.getDate()===day;
  const upcoming=[...data.appuntamenti].filter(a=>new Date(a.data)>=today).sort((a,b)=>new Date(a.data)-new Date(b.data));
  return (
    <div>
      <Card>
        <SRow style={{justifyContent:"space-between",alignItems:"center",marginBottom:16}}><button onClick={()=>setMonth(m=>new Date(m.getFullYear(),m.getMonth()-1,1))} style={{width:34,height:34,borderRadius:10,background:C.bg,border:"1px solid "+C.border,fontSize:16,cursor:"pointer",color:C.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button><div style={{fontSize:16,fontWeight:500,color:C.text}}>{mesi[month.getMonth()]} {month.getFullYear()}</div><button onClick={()=>setMonth(m=>new Date(m.getFullYear(),m.getMonth()+1,1))} style={{width:34,height:34,borderRadius:10,background:C.bg,border:"1px solid "+C.border,fontSize:16,cursor:"pointer",color:C.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button></SRow>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>{giorni.map(g=><div key={g} style={{textAlign:"center",fontSize:10,color:C.faint,fontFamily:M,padding:"4px 0"}}>{g}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
          {Array.from({length:firstDay},(_,i)=><div key={"e"+i}/>)}
          {Array.from({length:daysInMonth},(_,i)=>{const day=i+1;const events=eventsForDay(day);const tod=isToday_(day);return(<div key={day} onClick={()=>openSheet("appt")} style={{padding:"6px 2px",textAlign:"center",cursor:"pointer",borderRadius:8,background:tod?C.warm+"15":"transparent",border:tod?"1.5px solid "+C.warm+"40":"1px solid transparent"}}><div style={{fontSize:13,fontWeight:tod?600:400,color:tod?C.warm:C.text}}>{day}</div>{events.length>0&&<div style={{display:"flex",justifyContent:"center",gap:2,marginTop:2}}>{events.slice(0,3).map((e,ei)=><div key={ei} style={{width:4,height:4,borderRadius:2,background:CAT_C[e.tipo]||C.warm}}/>)}</div>}</div>);})}
        </div>
      </Card>
      <button onClick={()=>openSheet("appt")} style={{width:"100%",padding:"14px",background:C.warm,color:C.surface,border:"none",borderRadius:16,fontSize:15,cursor:"pointer",fontFamily:F,fontWeight:500,marginBottom:12}}>+ Aggiungi evento</button>
      <Card>
        <SLabel>{"📋 Prossimi eventi ("+upcoming.length+")"}</SLabel>
        {upcoming.length===0&&<div style={{fontSize:14,color:C.faint,textAlign:"center",padding:"10px 0"}}>Niente in programma</div>}
        {upcoming.map((a,i)=>(<div key={a.id}>{i>0&&<Hr/>}<SRow><div style={{width:52,background:(CAT_C[a.tipo]||C.warm)+"10",borderRadius:14,padding:"8px 4px",textAlign:"center",flexShrink:0}}><div style={{fontSize:18,fontWeight:600,color:CAT_C[a.tipo]||C.warm,lineHeight:1}}>{new Date(a.data).getDate()}</div><div style={{fontSize:9,color:C.sub,fontFamily:M,textTransform:"uppercase",marginTop:2}}>{mesi[new Date(a.data).getMonth()]}</div></div><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,color:C.text,fontWeight:500,marginBottom:4}}>{a.titolo}</div><div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>{a.ora&&<span style={{fontSize:12,color:C.sub,fontFamily:M}}>{a.ora}</span>}<Chip color={CAT_C[a.tipo]||C.warm} sm>{a.tipo}</Chip><Chip color={a.chi==="entrambi"?C.sage:mColor(a.chi,data.members)} sm>{mLabel(a.chi,data.members)}</Chip></div>{a.note&&<div style={{fontSize:12,color:C.faint,marginTop:3}}>{a.note}</div>}</div><button onClick={()=>openSheet("editAppt",a)} style={{background:"none",border:"none",color:C.faint,fontSize:22,cursor:"pointer",padding:"4px 6px"}}>›</button></SRow></div>))}
      </Card>
    </div>
  );
}

function JoinCard(){
  const [code,setCode]=useState("");
  const [status,setStatus]=useState("idle");
  const join=async()=>{const c=code.trim().toUpperCase();if(c.length<4)return;setStatus("loading");try{const fam=await sbGet("famiglie","codice=eq."+c+"&select=id");if(!fam||fam.length===0){setStatus("error");return;}localStorage.setItem("nido_family_code",c);localStorage.setItem("nido_famiglia_id",fam[0].id);localStorage.removeItem("nido_v6");setStatus("ok");setTimeout(()=>window.location.reload(),1200);}catch{setStatus("error");}};
  return(<Card><SLabel>🔑 Entra con codice famiglia</SLabel><div style={{fontSize:13,color:C.sub,marginBottom:12}}>Hai già una famiglia su Nido? Inserisci il codice per sincronizzarti.</div><div style={{display:"flex",gap:8}}><input style={{...iS,flex:1,marginBottom:0,fontFamily:M,fontSize:18,letterSpacing:4,textTransform:"uppercase"}} maxLength={8} placeholder="CODICE" value={code} onChange={e=>setCode(e.target.value.toUpperCase())}/><button onClick={join} disabled={status==="loading"||status==="ok"} style={{padding:"13px 18px",background:C.warm,color:C.surface,border:"none",borderRadius:14,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:500,flexShrink:0,opacity:status==="loading"?.6:1}}>{status==="loading"?"…":status==="ok"?"✓":"Entra"}</button></div>{status==="error"&&<div style={{fontSize:13,color:C.blush,marginTop:8}}>Codice non trovato. Riprova.</div>}{status==="ok"&&<div style={{fontSize:13,color:C.sage,marginTop:8}}>✓ Connesso! Ricarico…</div>}</Card>);
}

function Famiglia({data,setData,openSheet,familyCode}){
  const buro=[{t:"Assegno unico universale",d:"Dal 7° mese di gravidanza tramite CAF o portale INPS.",c:C.warm},{t:"Bonus bebè INPS 2026",d:"Fino a €1.000/anno per ISEE ≤ €25.182. Richiedibile dopo la nascita.",c:C.sage},{t:"Congedo di paternità",d:"10 giorni obbligatori + 1 facoltativo entro 5 mesi dalla nascita. Retribuiti al 100%.",c:C.sky},{t:"Congedo di maternità",d:"5 mesi totali (2+3 o 1+4). Indennità INPS all'80%.",c:C.blush},{t:"Scelta pediatra ASL",d:"Entro 30 giorni dalla nascita presso la propria ASL.",c:C.coral},{t:"Esenzione ticket gravidanza",d:"Tutti gli esami correlati alla gravidanza sono esenti fino a 3 mesi dal parto.",c:C.sage}];
  return (
    <div>
      <Card accent={C.sage}>
        <SLabel color={C.sage}>🔗 Codice famiglia</SLabel>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><div style={{flex:1,padding:"14px 16px",background:C.bg,borderRadius:14,border:"1px solid "+C.border}}><div style={{fontSize:28,fontWeight:300,color:C.warm,fontFamily:M,letterSpacing:6}}>{familyCode}</div><div style={{fontSize:11,color:C.faint,marginTop:4,fontFamily:M}}>CODICE FAMIGLIA</div></div><button onClick={()=>{try{navigator.clipboard.writeText(familyCode);}catch{}}} style={{padding:"14px 16px",background:C.sage+"14",border:"1px solid "+C.sage+"30",borderRadius:14,color:C.sage,fontSize:13,cursor:"pointer",fontFamily:F,fontWeight:500,flexShrink:0}}>Copia</button></div>
        <div style={{padding:"10px 14px",background:C.sage+"08",borderRadius:12,fontSize:12,color:C.sub,lineHeight:1.6}}>Il tuo partner apre Nido → Famiglia → "Entra con codice" → inserisce <strong style={{color:C.sage,fontFamily:M}}>{familyCode}</strong></div>
      </Card>
      <JoinCard/>
      <Card>
        <SRow style={{justifyContent:"space-between",marginBottom:14}}><SLabel>👨‍👩‍👶 La vostra famiglia</SLabel><button onClick={()=>openSheet("addMember")} style={{background:"none",border:"none",color:C.warm,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:500}}>+ Aggiungi</button></SRow>
        {data.members.map((m,i)=>(<div key={m.id}>{i>0&&<Hr/>}<SRow><div style={{width:46,height:46,borderRadius:16,background:m.color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{mEmoji(m.id)}</div><div style={{flex:1}}><div style={{fontSize:15,color:C.text,fontWeight:500}}>{m.nome}</div><div style={{fontSize:13,color:C.sub}}>{m.lavoro||m.role}</div></div><button onClick={()=>openSheet("editMember",m)} style={{background:"none",border:"none",color:C.faint,fontSize:22,cursor:"pointer",padding:"4px 6px"}}>›</button></SRow></div>))}
      </Card>
      <Card>
        <SRow style={{justifyContent:"space-between",marginBottom:14}}><SLabel>🏠 Task famiglia</SLabel><button onClick={()=>openSheet("task","famiglia")} style={{background:"none",border:"none",color:C.warm,fontSize:14,cursor:"pointer",fontFamily:F,fontWeight:500}}>+ Aggiungi</button></SRow>
        {data.tasks.filter(t=>t.cat==="famiglia").length===0&&<div style={{fontSize:14,color:C.faint,textAlign:"center",padding:"10px 0"}}>Nessuna task famiglia</div>}
        {data.tasks.filter(t=>t.cat==="famiglia").map((t,i)=><div key={t.id}>{i>0&&<Hr/>}<TaskRow t={t} members={data.members} setData={setData} openSheet={openSheet}/></div>)}
      </Card>
      <Card><SLabel>📋 Burocrazia & diritti</SLabel>{buro.map((b,i)=>(<div key={i}>{i>0&&<Hr/>}<div style={{padding:"4px 0"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}><div style={{width:3,height:16,borderRadius:2,background:b.c,flexShrink:0}}/><div style={{fontSize:14,color:C.text,fontWeight:500}}>{b.t}</div></div><div style={{fontSize:13,color:C.sub,lineHeight:1.6,paddingLeft:11}}>{b.d}</div></div></div>))}</Card>
    </div>
  );
}

function AI({data,userId,grilloMsg}){
  const me=data.members.find(m=>m.id===userId);
  const [msgs,setMsgs]=useState(()=>{const init=[{role:"assistant",text:"Ciao "+(me?.nome||"")+"! Sono il vostro assistente di famiglia. Gravidanza, medicine, INPS, ASL — chiedimi tutto. 👶"}];if(grilloMsg)init.push({role:"assistant",text:"📍 Dal Grillo: "+grilloMsg+"\n\nVuoi approfondire?"});return init;});
  const [inp,setInp]=useState("");const [loading,setLoading]=useState(false);const [catTab,setCatTab]=useState(0);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const info=getPD(data.baby.settimane);
  const cats=[{l:"🤱 Gravidanza",qs:["Cosa succede alla settimana "+data.baby.settimane+"?","Quando fare la morfologica?","Dolori normali in gravidanza?","Come dormire meglio?"]},{l:"💊 Medicine",qs:["Quali integratori alla settimana "+data.baby.settimane+"?","Posso prendere il paracetamolo?","Cosa fare per la nausea?","Integratori per il papà?"]},{l:"📋 Burocrazia",qs:["Come richiedere l'assegno unico?","Congedo paternità: come funziona?","Bonus bebè INPS 2026?","Come calcolare l'ISEE?"]},{l:"💼 Diritti",qs:["Quando comunicare la gravidanza al lavoro?","Diritti in gravidanza?","Congedo maternità: quanti mesi?","Quanti giorni di paternità ho?"]}];
  const sys="Sei un assistente familiare italiano esperto. Parli con "+(me?.nome||"un genitore")+" ("+me?.role+"). Gravidanza: settimana "+data.baby.settimane+"/40, "+info.tri+"° trimestre. "+info.headline+" Medicine raccomandate: "+((info.medicine||[]).map(m=>m.nome+" "+m.dose).join(", "))+". Rispondi in italiano, tono caldo. Max 4-5 frasi. Per medicine, indica sempre di consultare il ginecologo.";
  const send=async(txt)=>{const msg=txt||inp.trim();if(!msg||loading)return;setInp("");setMsgs(p=>[...p,{role:"user",text:msg}]);setLoading(true);try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...msgs.filter((_,i)=>i>0).map(m=>({role:m.role,content:m.text})),{role:"user",content:msg}]})});const d=await r.json();setMsgs(p=>[...p,{role:"assistant",text:d.content?.[0]?.text||"Non riesco a rispondere ora."}]);}catch{setMsgs(p=>[...p,{role:"assistant",text:"Connessione assente. Riprova."}]);}setLoading(false);};
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 160px)"}}>
      <div style={{flex:1,overflowY:"auto",paddingBottom:8}}>
        {msgs.map((m,i)=>(<div key={i} style={{marginBottom:14,display:"flex",flexDirection:m.role==="user"?"row-reverse":"row",gap:8,alignItems:"flex-end"}}>{m.role==="assistant"&&<div style={{width:30,height:30,borderRadius:10,background:C.bg,border:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,color:C.warm}}>✦</div>}<div style={{maxWidth:"82%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 4px 18px 18px":"4px 18px 18px 18px",background:m.role==="user"?C.text:C.surface,fontSize:14.5,lineHeight:1.6,color:m.role==="user"?C.surface:C.text,boxShadow:C.sh,whiteSpace:"pre-wrap"}}>{m.text}</div></div>))}
        {loading&&<div style={{display:"flex",gap:8,alignItems:"flex-end"}}><div style={{width:30,height:30,borderRadius:10,background:C.bg,border:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"center",color:C.warm}}>✦</div><div style={{padding:"14px 18px",background:C.surface,borderRadius:"4px 18px 18px 18px",boxShadow:C.sh}}><div style={{display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:4,background:C.faint,animation:"pulse 1.2s ease "+(i*.2)+"s infinite"}}/>)}</div></div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{background:C.surface,borderRadius:20,padding:14,boxShadow:C.sh,border:"1px solid "+C.border}}>
        <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto",paddingBottom:2}}>{cats.map((c,i)=><button key={i} onClick={()=>setCatTab(i)} style={{whiteSpace:"nowrap",padding:"6px 12px",borderRadius:20,border:"1px solid "+(catTab===i?C.warm+"40":C.border),background:catTab===i?C.warm+"10":C.bg,color:catTab===i?C.warm:C.sub,fontSize:12,cursor:"pointer",fontFamily:F,fontWeight:catTab===i?500:400}}>{c.l}</button>)}</div>
        <div style={{display:"flex",gap:6,marginBottom:10,overflowX:"auto",paddingBottom:2}}>{cats[catTab].qs.map(q=><button key={q} onClick={()=>send(q)} style={{whiteSpace:"nowrap",padding:"6px 12px",borderRadius:20,border:"1px solid "+C.border,background:C.bg,color:C.sub,fontSize:12,cursor:"pointer",fontFamily:F}}>{q}</button>)}</div>
        <div style={{display:"flex",gap:8}}><input style={{flex:1,padding:"13px 16px",borderRadius:14,border:"1.5px solid "+C.border,background:C.bg,color:C.text,fontSize:15,outline:"none",fontFamily:F}} placeholder="Chiedimi qualcosa…" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}}/><button onClick={()=>send()} style={{width:48,height:48,borderRadius:14,background:C.text,border:"none",color:C.surface,fontSize:20,cursor:"pointer",flexShrink:0}}>↑</button></div>
      </div>
    </div>
  );
}

const OWrap=({vis,children})=>(<div style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(8px)",transition:"opacity .2s ease,transform .2s ease"}}>{children}</div>);
const OH=({children})=>(<div style={{fontSize:30,fontWeight:300,color:C.text,lineHeight:1.2,letterSpacing:"-.5px",marginBottom:8}}>{children}</div>);
const OSub=({children})=>(<div style={{fontSize:15,color:C.sub,lineHeight:1.6,marginBottom:28}}>{children}</div>);
const TOTAL_ONB=4;
const OStepWrap=({step,children,onBack:ob})=>(<div style={{display:"flex",flexDirection:"column",minHeight:"100vh",padding:"0 28px",background:C.bg,fontFamily:F,maxWidth:430,margin:"0 auto"}}><div style={{paddingTop:20,paddingBottom:16,display:"flex",alignItems:"center",gap:12}}>{ob&&<button onClick={ob} style={{background:"none",border:"none",color:C.sub,fontSize:20,cursor:"pointer",padding:"4px 8px 4px 0"}}>‹</button>}<div style={{flex:1,height:3,background:C.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:(step/TOTAL_ONB*100)+"%",background:C.warm,borderRadius:3,transition:"width .4s ease"}}/></div><div style={{fontSize:11,color:C.faint,fontFamily:M,whiteSpace:"nowrap"}}>{step}/{TOTAL_ONB}</div></div><div style={{flex:1,overflowY:"auto",paddingBottom:40}}>{children}</div></div>);
const ORoleOpt=({label,value,current,onSelect,emoji})=>(<button onClick={()=>onSelect(value)} style={{flex:1,padding:"16px 8px",borderRadius:16,border:"1.5px solid "+(current===value?C.warm+"60":C.border),background:current===value?C.warm+"10":C.surface,color:current===value?C.warm:C.sub,fontSize:14,fontFamily:F,fontWeight:current===value?500:400,cursor:"pointer",transition:"all .15s",textAlign:"center"}}><div style={{fontSize:28,marginBottom:6}}>{emoji}</div>{label}</button>);

function Onboarding({data,setData,onComplete}){
  const [phase,setPhase]=useState("splash");
  const [vis,setVis]=useState(true);
  const [chi,setChi]=useState(null);
  const [personaA,setA]=useState({nome:"",eta:"",lavoro:"",role:"papà"});
  const [personaB,setB]=useState({nome:"",eta:"",lavoro:"",role:"mamma"});
  const [babyData,setBaby]=useState({nome:"",settimane:"24",dataPresunta:"",sesso:"sconosciuto"});
  useEffect(()=>{if(phase==="splash"){const t=setTimeout(()=>transTo("welcome"),2600);return()=>clearTimeout(t);}},[phase]);
  const transTo=next=>{setVis(false);setTimeout(()=>{setPhase(next);setVis(true);},200);};
  const order=["welcome","chi","persona_a","persona_b","baby","done"];
  const next=from=>{const i=order.indexOf(from);if(i<order.length-1)transTo(order[i+1]);};
  const back=from=>{const i=order.indexOf(from);if(i>0)transTo(order[i-1]);};
  const finish=enterAs=>{
    const membA={...makeMember("papa",personaA.role,personaA.role==="papà"?C.warm:C.blush),nome:personaA.nome||personaA.role,lavoro:personaA.lavoro,eta:+personaA.eta||null};
    const membB={...makeMember("mamma",personaB.role,personaB.role==="papà"?C.warm:C.blush),nome:personaB.nome||personaB.role,lavoro:personaB.lavoro,eta:+personaB.eta||null};
    setData(d=>({...d,onboardingDone:true,members:[membA,membB],baby:{...d.baby,nome:babyData.nome,settimane:Math.max(1,Math.min(42,+babyData.settimane||24)),dataPresunta:babyData.dataPresunta||d.baby.dataPresunta,sesso:babyData.sesso}}));
    onComplete(enterAs==="a"?"papa":"mamma");
  };
  if(phase==="splash")return(<OWrap vis={vis}><div style={{fontFamily:F,background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{animation:"fadeUp .9s ease .2s both",fontSize:11,color:C.faint,fontFamily:M,letterSpacing:4,marginBottom:20,textTransform:"uppercase"}}>Benvenuti in</div><div style={{animation:"fadeUp .9s ease .4s both",fontSize:84,color:C.warm,lineHeight:1,letterSpacing:"-3px",fontWeight:400,fontStyle:"italic"}}>Nido</div><div style={{animation:"fadeUp .9s ease .8s both",fontSize:15,color:C.sub,marginTop:20,textAlign:"center",lineHeight:1.7}}>The home your family<br/>always deserved.</div><div style={{animation:"fadeUp .9s ease 1.2s both",marginTop:48,display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:3,background:i===1?C.warm:C.border}}/>)}</div></div></OWrap>);
  if(phase==="welcome")return(<OWrap vis={vis}><div style={{fontFamily:F,background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto"}}><OStepWrap step={0}><div style={{paddingTop:32}}><div style={{fontSize:11,color:C.warm,fontFamily:M,letterSpacing:2,marginBottom:20,textTransform:"uppercase"}}>NIDO</div><OH>La vostra famiglia merita di più.</OH><OSub>Nido vi aiuta a vivere la gravidanza, organizzare la vita insieme e non perdere nulla. Ci vogliono 2 minuti.</OSub><div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>{[["🤱","Gravidanza settimana per settimana — dati clinici reali"],["💊","Medicine e integratori consigliati per ogni settimana"],["📅","Agenda condivisa e calendario famiglia"],["✦","Grillo Parlante AI — suggerimenti proattivi sempre"]].map(([e,t])=>(<div key={t} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",background:C.surface,borderRadius:16,boxShadow:C.sh,border:"1px solid "+C.border}}><span style={{fontSize:20}}>{e}</span><span style={{fontSize:14,color:C.sub,lineHeight:1.5}}>{t}</span></div>))}</div><button onClick={()=>transTo("chi")} style={{width:"100%",padding:"16px",background:C.warm,color:C.surface,border:"none",borderRadius:16,fontSize:17,fontFamily:F,fontWeight:500,cursor:"pointer"}}>Iniziamo →</button><div style={{textAlign:"center",fontSize:12,color:C.faint,marginTop:14}}>Nessun account richiesto · I dati restano sul dispositivo</div></div></OStepWrap></div></OWrap>);
  if(phase==="chi")return(<OWrap vis={vis}><div style={{fontFamily:F,background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto"}}><OStepWrap step={1} onBack={()=>back("chi")}><div style={{paddingTop:24}}><OH>Chi sta configurando l'app?</OH><OSub>Iniziamo da te. Il partner la configurerà dopo con il codice famiglia.</OSub><div style={{display:"flex",gap:10,marginBottom:24}}><ORoleOpt label="Sono il papà" value="papa" current={chi} onSelect={()=>{setChi("papa");setA(p=>({...p,role:"papà"}));setB(p=>({...p,role:"mamma"}));}} emoji="👨"/><ORoleOpt label="Sono la mamma" value="mamma" current={chi} onSelect={()=>{setChi("mamma");setA(p=>({...p,role:"mamma"}));setB(p=>({...p,role:"papà"}));}} emoji="👩"/></div><button onClick={()=>{if(!chi)return;next("chi");}} style={{width:"100%",padding:"16px",background:chi?C.warm:C.faint,color:C.surface,border:"none",borderRadius:16,fontSize:16,fontFamily:F,fontWeight:500,cursor:chi?"pointer":"default"}}>Continua →</button></div></OStepWrap></div></OWrap>);
  if(phase==="persona_a")return(<OWrap vis={vis}><div style={{fontFamily:F,background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto"}}><OStepWrap step={2} onBack={()=>back("persona_a")}><div style={{paddingTop:24}}><div style={{fontSize:32,marginBottom:8}}>{chi==="papa"?"👨":"👩"}</div><OH>Raccontaci di te</OH><OSub>Questi dati personalizzano l'esperienza per te.</OSub><FRow label="Il tuo nome *"><input style={iS} placeholder={chi==="papa"?"Es. Marco":"Es. Chiara"} value={personaA.nome} onChange={e=>setA(p=>({...p,nome:e.target.value}))}/></FRow><FRow label="Età"><input type="number" style={iS} placeholder="Es. 32" value={personaA.eta} onChange={e=>setA(p=>({...p,eta:e.target.value}))} min={18} max={80}/></FRow><FRow label="Lavoro"><input style={iS} placeholder="Es. Architetto, insegnante…" value={personaA.lavoro} onChange={e=>setA(p=>({...p,lavoro:e.target.value}))}/></FRow><button onClick={()=>{if(!personaA.nome.trim())return;next("persona_a");}} style={{width:"100%",padding:"16px",background:personaA.nome.trim()?C.warm:C.faint,color:C.surface,border:"none",borderRadius:16,fontSize:16,fontFamily:F,fontWeight:500,cursor:personaA.nome.trim()?"pointer":"default",marginTop:8}}>Continua →</button><button onClick={()=>next("persona_a")} style={{width:"100%",padding:"12px",background:"none",color:C.faint,border:"none",fontSize:13,fontFamily:F,cursor:"pointer",marginTop:8}}>Salta per ora</button></div></OStepWrap></div></OWrap>);
  if(phase==="persona_b")return(<OWrap vis={vis}><div style={{fontFamily:F,background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto"}}><OStepWrap step={3} onBack={()=>back("persona_b")}><div style={{paddingTop:24}}><div style={{fontSize:32,marginBottom:8}}>{chi==="papa"?"👩":"👨"}</div><OH>E il tuo partner?</OH><OSub>Potrà completare i suoi dati dal suo dispositivo.</OSub><FRow label="Nome"><input style={iS} placeholder={chi==="papa"?"Es. Chiara":"Es. Marco"} value={personaB.nome} onChange={e=>setB(p=>({...p,nome:e.target.value}))}/></FRow><FRow label="Età"><input type="number" style={iS} placeholder="Es. 30" value={personaB.eta} onChange={e=>setB(p=>({...p,eta:e.target.value}))} min={18} max={80}/></FRow><FRow label="Lavoro"><input style={iS} placeholder="Es. Medico, designer…" value={personaB.lavoro} onChange={e=>setB(p=>({...p,lavoro:e.target.value}))}/></FRow><button onClick={()=>next("persona_b")} style={{width:"100%",padding:"16px",background:C.warm,color:C.surface,border:"none",borderRadius:16,fontSize:16,fontFamily:F,fontWeight:500,cursor:"pointer",marginTop:8}}>Continua →</button><button onClick={()=>next("persona_b")} style={{width:"100%",padding:"12px",background:"none",color:C.faint,border:"none",fontSize:13,fontFamily:F,cursor:"pointer",marginTop:8}}>Salta per ora</button></div></OStepWrap></div></OWrap>);
  if(phase==="baby")return(<OWrap vis={vis}><div style={{fontFamily:F,background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto"}}><OStepWrap step={4} onBack={()=>back("baby")}><div style={{paddingTop:24}}><div style={{fontSize:32,marginBottom:8}}>👶</div><OH>Il vostro bebè</OH><OSub>Attiva il modulo gravidanza con dati clinici precisi per ogni settimana.</OSub><FRow label="Settimane di gravidanza *"><input type="number" style={iS} placeholder="Es. 24" value={babyData.settimane} onChange={e=>setBaby(p=>({...p,settimane:e.target.value}))} min={1} max={42}/></FRow>{babyData.settimane&&+babyData.settimane>=1&&+babyData.settimane<=42&&(<div style={{padding:"12px 14px",background:C.blush+"10",borderRadius:14,border:"1px solid "+C.blush+"25",marginBottom:12}}><div style={{fontSize:12,color:C.blush,fontFamily:M,marginBottom:4}}>SETTIMANA {babyData.settimane}</div><div style={{fontSize:13,color:C.sub}}>Grande come <strong style={{color:C.blush}}>{getPD(+babyData.settimane).s}</strong> · {getPD(+babyData.settimane).dim}</div><div style={{fontSize:13,color:C.text,marginTop:4,fontStyle:"italic"}}>{getPD(+babyData.settimane).headline}</div></div>)}<FRow label="Data presunta del parto"><input type="date" style={iS} value={babyData.dataPresunta} onChange={e=>setBaby(p=>({...p,dataPresunta:e.target.value}))}/></FRow><FRow label="Nome (facoltativo)"><input style={iS} placeholder="Es. Sofia, Luca… o ancora un segreto 🤫" value={babyData.nome} onChange={e=>setBaby(p=>({...p,nome:e.target.value}))}/></FRow><FRow label="Sesso"><div style={{display:"flex",gap:8}}>{[["🎀 Femmina","femmina"],["🔵 Maschio","maschio"],["🎁 Sorpresa","sconosciuto"]].map(([l,v])=>(<button key={v} onClick={()=>setBaby(p=>({...p,sesso:v}))} style={{flex:1,padding:"12px 8px",borderRadius:14,border:"1.5px solid "+(babyData.sesso===v?C.blush+"60":C.border),background:babyData.sesso===v?C.blush+"10":C.surface,color:babyData.sesso===v?C.blush:C.sub,fontSize:13,fontFamily:F,fontWeight:babyData.sesso===v?500:400,cursor:"pointer",transition:"all .15s"}}>{l}</button>))}</div></FRow><div style={{height:16}}/><button onClick={()=>next("baby")} style={{width:"100%",padding:"16px",background:C.blush,color:C.surface,border:"none",borderRadius:16,fontSize:16,fontFamily:F,fontWeight:500,cursor:"pointer"}}>Continua →</button></div></OStepWrap></div></OWrap>);
  if(phase==="done")return(<OWrap vis={vis}><div style={{fontFamily:F,background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 32px"}}><div style={{animation:"fadeUp .6s ease both",textAlign:"center",width:"100%"}}><div style={{fontSize:64,marginBottom:24}}>🎉</div><div style={{fontSize:30,fontWeight:300,color:C.text,lineHeight:1.2,marginBottom:12}}>{personaA.nome||"Benvenuto"} e {personaB.nome||"Benvenuta"},<br/><span style={{color:C.warm,fontStyle:"italic"}}>benvenuti in Nido.</span></div><div style={{fontSize:15,color:C.sub,lineHeight:1.7,marginBottom:20}}>Tutto è pronto per la vostra famiglia{babyData.nome?" e per "+babyData.nome:""}.</div>{babyData.settimane&&(<div style={{padding:"14px 18px",background:C.blush+"10",borderRadius:16,border:"1px solid "+C.blush+"20",marginBottom:32,textAlign:"left"}}><div style={{fontSize:12,color:C.blush,fontFamily:M,marginBottom:6}}>SETTIMANA {babyData.settimane}</div><div style={{fontSize:14,color:C.text,fontWeight:500,marginBottom:4}}>{getPD(+babyData.settimane).headline}</div><div style={{fontSize:13,color:C.sub,lineHeight:1.6}}>{getPD(+babyData.settimane).dev.slice(0,100)}…</div></div>)}<div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}><button onClick={()=>finish("a")} style={{width:"100%",padding:"17px",background:chi==="papa"?C.warm:C.blush,color:C.surface,border:"none",borderRadius:16,fontSize:17,fontFamily:F,fontWeight:500,cursor:"pointer"}}>{chi==="papa"?"👨":"👩"} Entra come {personaA.nome||(chi==="papa"?"Papà":"Mamma")}</button>{personaB.nome&&(<button onClick={()=>finish("b")} style={{width:"100%",padding:"15px",background:"transparent",color:chi==="papa"?C.blush:C.warm,border:"1.5px solid "+(chi==="papa"?C.blush:C.warm)+"40",borderRadius:16,fontSize:16,fontFamily:F,fontWeight:500,cursor:"pointer"}}>{chi==="papa"?"👩":"👨"} Entra come {personaB.nome}</button>)}</div></div></div></OWrap>);
  return null;
}

function ApptForm({initial,members,onSave,onDelete}){const def={titolo:"",data:"",ora:"",chi:"entrambi",tipo:"bebè",note:""};const [f,setF]=useState(initial?{...def,...initial}:def);const chiOpts=[{v:"entrambi",l:"👫 Entrambi"},...members.map(m=>({v:m.id,l:mEmoji(m.id)+" "+m.nome}))];return(<div><FRow label="Titolo"><input style={iS} placeholder="Es. Visita ostetrica" value={f.titolo} onChange={e=>setF(p=>({...p,titolo:e.target.value}))}/></FRow><div style={{display:"flex",gap:10}}><div style={{flex:1}}><FRow label="Data"><input type="date" style={iS} value={f.data} onChange={e=>setF(p=>({...p,data:e.target.value}))}/></FRow></div><div style={{flex:1}}><FRow label="Ora"><input type="time" style={iS} value={f.ora} onChange={e=>setF(p=>({...p,ora:e.target.value}))}/></FRow></div></div><FRow label="Categoria"><Seg value={f.tipo} onChange={v=>setF(p=>({...p,tipo:v}))} opts={[{v:"bebè",l:"👶"},{v:"lavoro",l:"💼"},{v:"salute",l:"🌿"},{v:"famiglia",l:"🏠"}]}/></FRow><FRow label="Chi"><Seg value={f.chi} onChange={v=>setF(p=>({...p,chi:v}))} opts={chiOpts}/></FRow><FRow label="Note"><input style={iS} placeholder="Note facoltative" value={f.note} onChange={e=>setF(p=>({...p,note:e.target.value}))}/></FRow><PBtn onPress={()=>onSave(f)} color={C.warm} full>{initial?"Salva modifiche":"Aggiungi evento"}</PBtn>{initial&&<div style={{marginTop:10}}><PBtn onPress={onDelete} danger full sm>Elimina evento</PBtn></div>}</div>);}
function TaskForm({initial,members,onSave,onDelete}){const def={testo:"",cat:"bebè",chi:"entrambi"};const [f,setF]=useState(initial?{...def,...initial}:def);const chiOpts=[{v:"entrambi",l:"👫 Entrambi"},...members.map(m=>({v:m.id,l:mEmoji(m.id)+" "+m.nome}))];return(<div><FRow label="Cosa fare?"><input style={iS} placeholder="Es. Acquistare la carrozzina" value={f.testo} onChange={e=>setF(p=>({...p,testo:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")onSave(f);}}/></FRow><FRow label="Categoria"><Seg value={f.cat} onChange={v=>setF(p=>({...p,cat:v}))} opts={[{v:"bebè",l:"👶 Bebè"},{v:"lavoro",l:"💼 Lavoro"},{v:"salute",l:"🌿 Salute"},{v:"famiglia",l:"🏠 Famiglia"}]}/></FRow><FRow label="Per chi"><Seg value={f.chi} onChange={v=>setF(p=>({...p,chi:v}))} opts={chiOpts}/></FRow><PBtn onPress={()=>onSave(f)} color={C.warm} full>{initial?"Salva modifiche":"Aggiungi"}</PBtn>{initial&&<div style={{marginTop:10}}><PBtn onPress={onDelete} danger full sm>Elimina</PBtn></div>}</div>);}
function MemberForm({initial,onSave,onDelete}){const [f,setF]=useState(initial?{nome:initial.nome,lavoro:initial.lavoro||"",role:initial.role}:{nome:"",lavoro:"",role:"altro"});const isCore=initial?.id==="papa"||initial?.id==="mamma";return(<div><FRow label="Nome"><input style={iS} placeholder="Es. Marco" value={f.nome} onChange={e=>setF(p=>({...p,nome:e.target.value}))}/></FRow><FRow label="Lavoro"><input style={iS} placeholder="Es. Medico, designer…" value={f.lavoro} onChange={e=>setF(p=>({...p,lavoro:e.target.value}))}/></FRow><FRow label="Ruolo"><Seg value={f.role} onChange={v=>setF(p=>({...p,role:v}))} opts={[{v:"papà",l:"👨 Papà"},{v:"mamma",l:"👩 Mamma"},{v:"altro",l:"👤 Altro"}]}/></FRow><PBtn onPress={()=>onSave(f)} color={C.warm} full>{initial?"Salva modifiche":"Aggiungi"}</PBtn>{initial&&!isCore&&<div style={{marginTop:10}}><PBtn onPress={onDelete} danger full sm>Rimuovi</PBtn></div>}</div>);}
function AddCheckForm({setData,onClose,fire}){const [v,setV]=useState("");const save=()=>{if(!v.trim())return;setData(d=>({...d,baby:{...d.baby,check:[...d.baby.check,{id:uid(),item:v.trim(),fatto:false}]}}));onClose();fire("✓","Aggiunto",v);};return(<div><FRow label="Cosa aggiungere?"><input style={iS} placeholder="Es. Pannolini, copertina…" value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")save();}}/></FRow><PBtn onPress={save} color={C.warm} full>Aggiungi</PBtn></div>);}

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes bgIn{from{background:rgba(28,23,20,0)}to{background:rgba(28,23,20,.42)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:#DDD8D0;border-radius:3px;}
  input::placeholder,textarea::placeholder{color:#C2B9B0;}
  input[type=date],input[type=time]{color-scheme:light;}
  button{font-family:'Lora','Georgia',serif;}
  textarea{font-family:'Lora','Georgia',serif;resize:none;}
  input[type=range]{accent-color:#A07840;}
  a{-webkit-tap-highlight-color:transparent;}
`;

export default function App(){
  const [data,setData,sync]=useStore();
  const [tab,setTab]=useState("home");
  const [userId,setUserId]=useState(null);
  const [toast,setToast]=useState(null);
  const [sheet,setSheet]=useState(null);
  const [grilloContext,setGrilloContext]=useState(null);
  const fire=(icon,title,body)=>setToast({icon,title,body});
  const openSheet=(type,payload)=>setSheet({type,payload:payload||null});
  const closeSheet=()=>setSheet(null);
  const grillo=useGrillo(data,userId,tab);

  useEffect(()=>{
    if(!userId)return;
    const R=[{hm:"08:00",icon:"☀️",title:"Buongiorno!",body:"Inizia con un bicchiere d'acqua."},{hm:"13:00",icon:"🥗",title:"Pranzo",body:"Ricordati degli integratori di oggi."},{hm:"15:30",icon:"💧",title:"Acqua",body:"Idratati nel pomeriggio!"},{hm:"20:00",icon:"❤️",title:"Famiglia",body:"Stacca. Godetevi questo tempo insieme."},{hm:"22:00",icon:"🌙",title:"Buonanotte",body:"Dormite bene."}];
    const id=setInterval(()=>{const now=new Date();const hm=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");const r=R.find(x=>x.hm===hm);if(r)setToast(r);},60000);
    setTimeout(()=>fire("👋","Bentornati!","Nido è pronto."),700);
    return()=>clearInterval(id);
  },[userId]);

  if(!data.onboardingDone)return(<><style>{CSS}</style><Onboarding data={data} setData={setData} onComplete={id=>{setUserId(id);setTab("home");}}/></>);

  if(!userId)return(
    <div style={{fontFamily:F,background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 0 60px"}}>
      <style>{CSS}</style>
      <div style={{padding:"0 32px"}}>
        <div style={{fontSize:11,color:C.faint,fontFamily:M,letterSpacing:4,marginBottom:16,textTransform:"uppercase"}}>NIDO</div>
        <div style={{fontSize:38,fontWeight:400,fontStyle:"italic",color:C.warm,lineHeight:1.1,marginBottom:8,letterSpacing:"-1px"}}>Nido</div>
        <div style={{fontSize:15,color:C.sub,lineHeight:1.7,marginBottom:40}}>Bentornati.<br/><span style={{fontSize:13,color:C.faint}}>Chi sei?</span></div>
        {data.members.map(m=>(<button key={m.id} onClick={()=>setUserId(m.id)} style={{display:"flex",alignItems:"center",gap:16,width:"100%",padding:"18px 22px",borderRadius:22,border:"1.5px solid "+m.color+"30",background:C.surface,cursor:"pointer",marginBottom:12,fontFamily:F,textAlign:"left",boxShadow:C.sh}}><div style={{width:52,height:52,borderRadius:18,background:m.color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{mEmoji(m.id)}</div><div><div style={{fontSize:17,fontWeight:500,color:C.text,marginBottom:3}}>{m.nome}</div><div style={{fontSize:13,color:C.sub}}>{m.lavoro||m.role}</div></div><div style={{marginLeft:"auto",fontSize:20,color:C.faint}}>›</div></button>))}
      </div>
    </div>
  );

  const me=data.members.find(m=>m.id===userId);

  const renderSheet=()=>{
    if(!sheet)return null;
    const {type,payload}=sheet;
    const w=(title,children)=><Sheet title={title} onClose={closeSheet}>{children}</Sheet>;
    if(type==="appt")return w("Nuovo evento",<ApptForm members={data.members} onSave={f=>{if(!f.titolo||!f.data)return;setData(d=>({...d,appuntamenti:[...d.appuntamenti,{...f,id:uid()}]}));closeSheet();fire("📅","Aggiunto",f.titolo);}}/>);
    if(type==="editAppt")return w("Modifica evento",<ApptForm initial={payload} members={data.members} onSave={f=>{setData(d=>({...d,appuntamenti:d.appuntamenti.map(a=>a.id===payload.id?{...a,...f}:a)}));closeSheet();fire("✓","Aggiornato",f.titolo);}} onDelete={()=>{setData(d=>({...d,appuntamenti:d.appuntamenti.filter(a=>a.id!==payload.id)}));closeSheet();fire("🗑","Eliminato",payload.titolo);}}/>);
    if(type==="task")return w("Nuova task",<TaskForm initial={payload?{cat:payload}:null} members={data.members} onSave={f=>{if(!f.testo.trim())return;setData(d=>({...d,tasks:[...d.tasks,{...f,id:uid(),fatto:false}]}));closeSheet();fire("✓","Aggiunta",f.testo);}}/>);
    if(type==="editTask")return w("Modifica task",<TaskForm initial={payload} members={data.members} onSave={f=>{setData(d=>({...d,tasks:d.tasks.map(t=>t.id===payload.id?{...t,...f}:t)}));closeSheet();fire("✓","Aggiornata",f.testo);}} onDelete={()=>{setData(d=>({...d,tasks:d.tasks.filter(t=>t.id!==payload.id)}));closeSheet();fire("🗑","Eliminata",payload.testo);}}/>);
    if(type==="editBaby")return w("Modifica gravidanza",<div><FRow label="Settimane"><input type="number" min={1} max={42} style={iS} value={data.baby.settimane} onChange={e=>setData(d=>({...d,baby:{...d.baby,settimane:Math.max(1,Math.min(42,+e.target.value))}}))} /></FRow><FRow label="Nome"><input style={iS} placeholder="Es. Sofia…" value={data.baby.nome||""} onChange={e=>setData(d=>({...d,baby:{...d.baby,nome:e.target.value}}))}/></FRow><FRow label="Data presunta"><input type="date" style={iS} value={data.baby.dataPresunta||""} onChange={e=>setData(d=>({...d,baby:{...d.baby,dataPresunta:e.target.value}}))}/></FRow><PBtn onPress={closeSheet} color={C.warm} full>Fatto</PBtn></div>);
    if(type==="addCheck")return w("Aggiungi alla nursery",<AddCheckForm setData={setData} onClose={closeSheet} fire={fire}/>);
    if(type==="addMember")return w("Aggiungi membro",<MemberForm onSave={f=>{if(!f.nome)return;setData(d=>({...d,members:[...d.members,{...makeMember(uid(),f.role,C.sage),...f}]}));closeSheet();fire("👋","Benvenuto!",f.nome);}}/>);
    if(type==="editMember")return w("Modifica",<MemberForm initial={payload} onSave={f=>{setData(d=>({...d,members:d.members.map(m=>m.id===payload.id?{...m,...f}:m)}));closeSheet();fire("✓","Aggiornato",f.nome);}} onDelete={()=>{setData(d=>({...d,members:d.members.filter(m=>m.id!==payload.id)}));closeSheet();fire("🗑","Rimosso",payload.nome);}}/>);
    return null;
  };

  const NAV=[{id:"home",icon:"⌂",label:"Home"},{id:"baby",icon:"👶",label:"Bebè"},{id:"salute",icon:"🌿",label:"Salute"},{id:"agenda",icon:"📅",label:"Agenda"},{id:"market",icon:"🛍️",label:"Market"},{id:"ai",icon:"✦",label:"AI"}];
  const PAGES={home:<Home data={data} setData={setData} userId={userId} openSheet={openSheet} fire={fire}/>,baby:<Baby data={data} setData={setData} openSheet={openSheet}/>,salute:<Salute data={data} setData={setData} userId={userId}/>,agenda:<Agenda data={data} setData={setData} openSheet={openSheet}/>,market:<Market/>,ai:<AI data={data} userId={userId} grilloMsg={grilloContext}/>};

  return(
    <div style={{fontFamily:F,background:C.bg,color:C.text,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative"}}>
      <style>{CSS}</style>
      <Toast msg={toast} onClose={()=>setToast(null)}/>
      {renderSheet()}
      <div style={{padding:"22px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
            <div style={{fontSize:10.5,color:C.faint,fontFamily:M,letterSpacing:1}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:6,height:6,borderRadius:3,background:sync.syncing?C.warm:sync.syncOk?C.sage:C.faint,transition:"background .4s"}}/>
              <span style={{fontSize:9,color:sync.syncOk?C.sage:C.faint,fontFamily:M}}>{sync.syncing?"sync…":sync.syncOk?"live":""}</span>
            </div>
          </div>
          <div style={{fontSize:19,fontWeight:300,color:C.text}}>The home <span style={{color:C.warm,fontWeight:500,fontStyle:"italic"}}>your family always deserved.</span></div>
        </div>
        <button onClick={()=>setUserId(null)} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",borderRadius:22,background:C.surface,border:"1.5px solid "+(me?.color||C.warm)+"28",color:me?.color||C.warm,fontSize:13,cursor:"pointer",fontWeight:500,boxShadow:C.sh}}>{mEmoji(userId)+" "+(me?.nome||"")}</button>
      </div>
      <div style={{padding:"18px 16px 110px",overflowY:"auto",height:"calc(100vh - 82px)"}}>
        <PageFade tabKey={tab}>{PAGES[tab]||PAGES.home}</PageFade>
      </div>
      {tab!=="ai"&&<GrilloBubble bubble={grillo.bubble} loading={grillo.loading} onDismiss={grillo.dismiss} onExpandAI={()=>{setGrilloContext(grillo.bubble);grillo.dismiss();setTab("ai");}}/>}
      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.surface+"F5",backdropFilter:"blur(30px)",borderTop:"1px solid "+C.border,display:"flex",padding:"10px 4px 22px"}}>
        {NAV.map(n=>(<div key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",opacity:tab===n.id?1:.3,transition:"opacity .15s"}}><span style={{fontSize:tab===n.id?21:19,transition:"font-size .12s"}}>{n.icon}</span><span style={{fontSize:8.5,fontFamily:M,letterSpacing:.9,textTransform:"uppercase",color:tab===n.id?C.warm:C.sub}}>{n.label}</span>{tab===n.id&&<div style={{width:18,height:2.5,borderRadius:2,background:C.warm}}/>}</div>))}
      </nav>
    </div>
  );
}
