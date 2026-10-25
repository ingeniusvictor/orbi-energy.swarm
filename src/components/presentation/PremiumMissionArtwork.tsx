import React, { useId } from "react";

/** UX11-F: independent, text-free SVG scenes. Entire screen UI remains native
 * accessible HTML; no image containing labels, buttons or fake progress.
 * ENERGY is gold; FOTON is a separate green solar-panel companion. */
export type PremiumScene =
  | "modes" | "hangar" | "tactics" | "codex" | "controls" | "settings" | "about"
  | "campaign" | "score" | "infinite" | "route";

const COLORS: Record<PremiumScene,string> = {
  modes:"#f8d27b", hangar:"#68e5f1", tactics:"#9fc4ff",
  codex:"#7af5a2", controls:"#71e7ef", settings:"#b7a5fc", about:"#7dc9f5",
  campaign:"#facd75", score:"#64eff5", infinite:"#b18af8", route:"#43f1df",
};
const SPARKS = [
  [31,40],[75,92],[105,32],[132,193],[165,53],[205,24],[237,186],
  [275,40],[312,202],[345,18],[385,68],[416,198],[452,39],[489,128],
] as const;

export const PremiumMissionArtwork = React.memo(function PremiumMissionArtwork({
  scene,
}: {scene:PremiumScene}) {
  const id=useId().replace(/:/g,"");
  const shade="ux11f-shade-"+id;
  const glow="ux11f-glow-"+id;
  const accent=COLORS[scene];
  const mode=scene==="campaign"||scene==="score"||scene==="infinite"||scene==="route";
  return (
    <svg viewBox="0 0 520 240" preserveAspectRatio="xMidYMid slice"
      className={"orbi-ux11f-scene orbi-ux11f-scene--"+scene}
      aria-hidden="true" focusable="false" data-scene={scene}>
      <defs>
        <linearGradient id={shade} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#0a2948"/><stop offset=".55" stopColor="#06182e"/>
          <stop offset="1" stopColor="#030d1c"/>
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0" stopColor={accent} stopOpacity=".65"/>
          <stop offset=".42" stopColor={accent} stopOpacity=".15"/>
          <stop offset="1" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="520" height="240" fill={"url(#"+shade+")"}/>
      <g stroke="#397b9d" strokeWidth=".65" opacity=".26">
        {Array.from({length:10},(_,i)=><path key={i} d={"M0 "+(i*28+4)+"H520"}/>)}
        {Array.from({length:18},(_,i)=><path key={i} d={"M"+(i*31)+" 0V240"}/>)}
      </g>
      <g fill="#a9eafa">
        {SPARKS.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%4===0?1.45:.75} opacity={i%3===0?.8:.42}/>)}
      </g>
      <ellipse cx="258" cy="125" rx={mode?195:165} ry={mode?136:122} fill={"url(#"+glow+")"} opacity=".85"/>
      <g stroke={accent} opacity=".30" fill="none">
        <path d="M-10 222Q260 148 530 222" strokeWidth="1.6"/>
        <path d="M-10 234Q260 164 530 234"/>
        <path d="M0 12L35 12L35 31 M485 12H515V40 M0 207H23V232 M496 212H520" strokeWidth="2"/>
      </g>

      {(scene==="modes"||scene==="campaign")&&(
        <g className="orbi-ux11f-solar">
          <circle cx="275" cy="115" r="90" stroke="#f3c96e" strokeWidth="1.7" opacity=".35" fill="none" strokeDasharray="7 14"/>
          <circle cx="275" cy="115" r="62" stroke="#f8d27b" strokeWidth="1.5" opacity=".66" fill="none"/>
          <path d="M105 186Q169 38 275 115T446 57" stroke="#7deddf" strokeWidth="2.5" opacity=".75" fill="none" strokeDasharray="4 9"/>
          <circle cx="275" cy="115" r="45" fill="#f4bf59" stroke="#fff1b0" strokeWidth="4"/>
          <ellipse cx="260" cy="109" rx="6" ry="8" fill="#06395a"/>
          <ellipse cx="290" cy="109" rx="6" ry="8" fill="#06395a"/>
          <path d="M263 128Q275 136 287 128" stroke="#8f581b" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <g transform="translate(145 145) rotate(-13)">
            <rect x="-30" y="-27" width="60" height="43" rx="6" fill="#0f523e" stroke="#a3ffab" strokeWidth="3"/>
            {[-14,0,14].map(x=><path key={x} d={"M"+x+" -26V15"} stroke="#72dbaf" strokeWidth="2"/>)}
            <path d="M-30 -5H30" stroke="#72dbaf" strokeWidth="2"/>
            <circle cx="0" cy="30" r="20" fill="#4fe798" stroke="#c2ffc2" strokeWidth="2"/>
            <circle cx="-6" cy="26" r="3" fill="#164a44"/><circle cx="7" cy="26" r="3" fill="#164a44"/>
          </g>
          {[0,1,2,3,4].map(i=>{
            const a=i*Math.PI*2/5-Math.PI/2;
            return <circle key={i} cx={275+Math.cos(a)*89} cy={115+Math.sin(a)*89} r="5" fill={i%2?"#a9f5ed":"#f8dd94"}/>;
          })}
        </g>
      )}
      {(scene==="hangar")&&(
        <g>
          <path d="M50 210L159 42H358L468 210" stroke="#6be5f5" strokeOpacity=".7" strokeWidth="3" fill="#0b3554" fillOpacity=".36"/>
          {[0,1,2].map(i=><path key={i} d={"M"+(91+i*30)+" 207L"+(180+i*12)+" 53H"+(337-i*12)+"L"+(429-i*30)+" 207"} fill="none" stroke="#62e7ff" strokeOpacity={.24+i*.1} strokeWidth="2"/>)}
          <path d="M130 213H398M155 191H375M178 170H351" stroke="#79dff1" strokeWidth="2" opacity=".65"/>
          <ellipse cx="260" cy="156" rx="68" ry="17" fill="#5de2ed" fillOpacity=".2"/>
          <path d="M209 115L234 90H288L312 115L294 157H224Z" fill="#0c5871" stroke="#9df7f7" strokeWidth="3"/>
          <path d="M227 110H295L280 146H238Z" fill="#78e6eb" fillOpacity=".28"/>
          <circle cx="260" cy="125" r="18" fill="#fbd477" stroke="#fff1af" strokeWidth="2.5"/>
          <path d="M198 115L159 132L188 143 M321 115L361 132L329 143" fill="#0e4d64" stroke="#8deef7" strokeWidth="2"/>
          <path d="M81 54V178M439 54V178" stroke="#59e1f3" strokeWidth="4" opacity=".48"/>
        </g>
      )}
      {scene==="tactics"&&(
        <g>
          <path d="M260 53L112 185H407Z M260 53L260 188 M112 185L407 185" stroke="#8caeff" strokeWidth="2" opacity=".7" fill="none"/>
          <path d="M139 130L260 78L379 130 M183 182L260 115L337 182" stroke="#67e8f9" strokeWidth="1.4" opacity=".5" fill="none"/>
          {[[260,50],[112,185],[407,185],[260,188],[260,110],[176,132],[344,132],[190,184],[330,184]].map(([x,y],i)=>
            <g key={i}><circle cx={x} cy={y} r={i===4?17:10} fill={i===4?"#efc66e":"#58d9e8"} stroke="#efffff" strokeWidth="2"/>
            <circle cx={x-3} cy={y-3} r="2" fill="#052035"/></g>
          )}
          <circle cx="260" cy="110" r="49" stroke="#f8dc99" strokeDasharray="5 8" fill="none" opacity=".65"/>
        </g>
      )}
      {scene==="codex"&&(
        <g>
          <path d="M124 43H256L277 63V205H124Z M280 43H398V205H280Z" fill="#0b304c" stroke="#74cddf" strokeWidth="2"/>
          <path d="M256 43V68H277 M138 176H263M296 176H382M138 193H248M296 193H371" stroke="#76cfe2" strokeWidth="2" opacity=".55"/>
          <circle cx="195" cy="112" r="40" fill="#d3a547" stroke="#fce6a0" strokeWidth="3"/>
          <ellipse cx="183" cy="105" rx="5" ry="7" fill="#0a4661"/><ellipse cx="207" cy="105" rx="5" ry="7" fill="#0a4661"/>
          <path d="M186 126Q195 132 204 126" fill="none" stroke="#73501f" strokeWidth="3"/>
          <g transform="translate(339 115)">
            <rect x="-31" y="-42" width="62" height="38" rx="4" fill="#13543e" stroke="#b5ffc6" strokeWidth="3"/>
            <path d="M-10 -40V-5M10 -40V-5M-30 -21H30" stroke="#98e5a7" strokeWidth="2"/>
            <circle cy="22" r="26" fill="#53e58a" stroke="#b3ffc6" strokeWidth="2.5"/>
            <circle cx="-8" cy="18" r="4" fill="#103b37"/><circle cx="8" cy="18" r="4" fill="#103b37"/>
          </g>
        </g>
      )}
      {scene==="controls"&&(
        <g>
          <path d="M173 93L213 68H307L347 93L378 157Q386 183 363 190L302 156H218L157 190Q134 183 142 157Z" fill="#0e4860" stroke="#7bf1f7" strokeWidth="4"/>
          <circle cx="260" cy="115" r="29" fill="#123553" stroke="#4bd2ea" strokeWidth="2"/>
          <path d="M196 104V148M174 126H218" stroke="#f8d27b" strokeWidth="11" strokeLinecap="round"/>
          <circle cx="317" cy="109" r="11" fill="#facb74"/><circle cx="340" cy="131" r="11" fill="#6dedba"/>
          <circle cx="238" cy="111" r="3" fill="#e5faff"/><circle cx="282" cy="111" r="3" fill="#e5faff"/>
        </g>
      )}
      {scene==="settings"&&(
        <g transform="translate(260 117)">
          {[93,70,48].map((r,i)=><circle key={r} r={r} fill="none" stroke={i===0?"#a89eff":"#7aebed"} strokeWidth={i===1?9:2} strokeDasharray={i===1?"26 13":i===0?"4 12":"none"} opacity={.9-i*.12}/>)}
          {[0,60,120,180,240,300].map(d=><g key={d} transform={"rotate("+d+")"}><path d="M-8 -105H8V-77H-8Z" fill="#bcb6f7"/></g>)}
          <circle r="33" fill="#122d50" stroke="#e2d2ff" strokeWidth="3"/>
          <circle r="17" fill="#b9a4ff" opacity=".85"/>
          <path d="M-7 0H7M0 -7V7" stroke="#0c1f3a" strokeWidth="3"/>
        </g>
      )}
      {scene==="about"&&(
        <g>
          <circle cx="260" cy="136" r="85" fill="#0c4163" stroke="#70d5f5" strokeWidth="2.5"/>
          <ellipse cx="260" cy="136" rx="84" ry="30" fill="none" stroke="#91e9f5" strokeOpacity=".65" strokeWidth="2"/>
          <ellipse cx="260" cy="136" rx="37" ry="83" fill="none" stroke="#91e9f5" strokeOpacity=".55" strokeWidth="2"/>
          <path d="M179 106Q260 80 342 106M179 168Q260 190 342 168" stroke="#91e9f5" strokeOpacity=".4" fill="none"/>
          <path d="M123 90L178 107 M340 172L415 201 M304 58L367 30" stroke="#f6d27c" strokeWidth="2"/>
          {[[123,90],[415,201],[367,30]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="9" fill="#f6d27c" stroke="#fff0c4" strokeWidth="2"/>)}
          <path d="M232 87L266 66L303 98L287 138L246 156L225 132Z" fill="#4ab5c9" fillOpacity=".55"/>
        </g>
      )}
      {scene==="score"&&(
        <g transform="translate(260 119)">
          <circle r="93" fill="#06364e" fillOpacity=".38" stroke="#a2ffff" strokeWidth="3"/>
          <circle r="76" fill="none" stroke="#4be0f1" strokeWidth="12" strokeDasharray="33 12" opacity=".5"/>
          <circle r="57" fill="none" stroke="#89faff" strokeWidth="2" strokeDasharray="4 8"/>
          {Array.from({length:12},(_,i)=><path key={i} d="M0 -82V-72" stroke="#e0ffff" strokeWidth="3" transform={"rotate("+(i*30)+")"}/>)}
          <path d="M0 0L-30 -44 M0 0L40 -17" stroke="#f8d27b" strokeLinecap="round" strokeWidth="6"/>
          <circle r="11" fill="#fff2b0" stroke="#03a8c7" strokeWidth="2"/>
          <path d="M-116 0H-93 M93 0H116 M0 -116V-93 M0 93V116" stroke="#d3faff" strokeWidth="2"/>
        </g>
      )}
      {scene==="route"&&(
        <g className="orbi-ux15-world-route-art">
          {/* Original 2.5D orbital canyon, no text, no borrowed Star Fox art. */}
          <path d="M0 166Q65 118 113 159T237 149T366 152T520 121V240H0Z"
            fill="#13426b" stroke="#71d9ee" strokeWidth="2" opacity=".6"/>
          <path d="M0 206L97 108L146 157L216 131L276 192L370 85L434 148L520 96V240H0Z"
            fill="#102d4b" stroke="#8acde3" strokeWidth="2"/>
          <path d="M-10 221L530 221 M-10 198L530 198" stroke="#5dfee5" strokeWidth="2" opacity=".55"/>
          <path d="M21 221L148 198M112 221L234 198M219 221L342 198M326 221L452 198M435 221L522 198"
            stroke="#5dfee5" strokeWidth="1.5" opacity=".3"/>
          <g stroke="#56d4e9" fill="#123c5d" strokeWidth="3">
            <path d="M70 177V87H93V177 M398 185V100H421V185 M327 158V118H341V158"/>
            <path d="M60 89H105M390 102H432M319 119H349"/>
          </g>
          <ellipse cx="440" cy="52" rx="69" ry="19" fill="none" stroke="#a7edff" strokeWidth="5" opacity=".6"/>
          <circle cx="215" cy="147" r="22" fill="#f4bf59" stroke="#fff1b0" strokeWidth="4"/>
          <path d="M170 147L191 147M238 147L285 147" stroke="#8df8dd" strokeWidth="3" strokeDasharray="4 7"/>
          <circle cx="168" cy="147" r="8" fill="#62ecc0" stroke="#d3ffef" strokeWidth="2"/>
          <circle cx="284" cy="147" r="7" fill="#9cb6ff" stroke="#ebfaff" strokeWidth="2"/>
        </g>
      )}
      {scene==="infinite"&&(
        <g className="orbi-ux11f-gate" transform="translate(260 115)">
          <path d="M0 -104L90 -52V52L0 104L-90 52V-52Z" fill="#2a1546" stroke="#ba96ff" strokeWidth="4"/>
          <path d="M0 -78L67 -39V39L0 78L-67 39V-39Z" fill="none" stroke="#d4c1ff" strokeWidth="2"/>
          <path d="M0 -58L50 -29V29L0 58L-50 29V-29Z" fill="#120d35" stroke="#9b65fa" strokeWidth="2" strokeDasharray="6 6"/>
          <rect x="-24" y="-4" width="48" height="49" rx="7" fill="#9a79d8" stroke="#f0ddff" strokeWidth="3"/>
          <path d="M-15 -4V-22Q-15 -43 0 -43Q15 -43 15 -22V-4" fill="none" stroke="#f0ddff" strokeWidth="8"/>
          <circle cx="0" cy="16" r="5" fill="#160f30"/><path d="M0 17V29" stroke="#160f30" strokeWidth="4"/>
          <path d="M-110 -56L-144 -92 M107 54L145 94" stroke="#b18af8" strokeWidth="3"/>
        </g>
      )}
      <g className="orbi-ux11f-scene-hud" stroke={accent} opacity=".65" fill="none" strokeWidth="2">
        <path d="M13 52V22H66 M506 190V220H453"/>
        <path d="M15 180V209H69 M504 61V31H451" opacity=".45"/>
      </g>
    </svg>
  );
});
