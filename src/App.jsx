import React, { useEffect, useState } from "react";

const screens = ["welcome", "profile", "home", "ready", "setup", "round", "hole", "review", "plan", "prompt", "practice", "progress"];

const COURSE_DATA = {
  "Chipstead Golf Club": {
    location: "Surrey, England",
    tees: {
      White: {
        pars: [4,4,3,5,3,4,4,4,3,3,3,4,3,4,4,5,3,4],
        yards: [326,414,131,523,179,265,409,355,218,196,223,327,175,447,287,440,149,269],
        si: [11,3,17,7,13,15,1,9,5,10,2,8,16,4,14,6,12,18]
      },
      Yellow: {
        pars: [4,4,3,5,3,4,4,4,3,3,3,4,3,4,4,5,3,4],
        yards: [320,404,125,483,173,262,408,345,204,193,219,315,166,436,260,415,141,261],
        si: [11,3,17,7,13,15,1,9,5,10,2,8,16,4,14,6,12,18]
      },
      Red: {
        pars: [4,4,3,5,3,4,5,4,3,3,3,4,3,4,4,5,3,4],
        yards: [308,359,119,472,149,254,400,339,181,188,211,301,156,381,247,389,133,254],
        si: [11,5,15,3,17,7,1,9,13,14,2,6,16,4,10,8,12,18]
      }
    }
  },
  "The Oaks Golf Club": {
    location: "Surrey, England",
    tees: {
      White: {
        pars: [3,4,3,4,4,4,5,4,3,4,4,3,4,5,3,4,5,4],
        yards: [167,411,200,409,375,314,508,388,147,316,333,203,294,495,173,429,491,324],
        si: [16,1,13,3,5,18,9,4,17,15,8,6,14,7,12,2,11,10]
      },
      Yellow: {
        pars: [3,4,3,4,4,4,5,4,3,4,4,3,4,5,3,4,5,4],
        yards: [157,358,185,401,357,307,496,375,135,305,326,182,284,485,162,362,480,311],
        si: [16,1,13,3,5,18,9,4,17,15,8,6,14,7,12,2,11,10]
      },
      Red: {
        pars: [3,4,3,5,4,4,5,5,3,4,4,3,4,5,3,4,5,4],
        yards: [138,332,160,377,342,297,473,360,113,274,315,138,258,448,134,331,463,277],
        si: [17,1,16,11,3,13,2,9,15,14,6,12,10,4,18,7,5,8]
      }
    }
  },
  "Kingswood Golf and Country Club": {
    location: "Surrey, England",
    tees: {
      White: {
        pars: [4,4,3,4,5,4,3,4,5,3,5,4,4,5,4,4,3,4],
        yards: [369,406,191,395,494,390,127,405,506,170,523,347,400,511,368,430,167,390],
        si: [11,5,9,7,13,3,17,1,15,12,6,18,2,14,8,4,16,10]
      },
      Yellow: {
        pars: [4,4,3,4,5,4,3,4,5,3,5,4,4,5,4,4,3,4],
        yards: [357,377,167,373,478,373,119,384,483,144,505,344,356,495,336,412,155,360],
        si: [11,5,9,7,13,3,17,1,15,12,6,18,2,14,8,4,16,10]
      },
      Red: {
        pars: [4,4,3,4,5,4,3,4,5,3,5,4,4,5,4,4,3,4],
        yards: [326,364,144,358,412,363,113,373,421,138,488,341,346,423,288,388,130,354],
        si: [11,3,15,7,13,1,17,5,9,18,2,6,10,12,14,4,16,8]
      }
    }
  }
};

const courseNames = Object.keys(COURSE_DATA);

function getTeeData(course, tee) {
  return COURSE_DATA[course]?.tees?.[tee] || COURSE_DATA[courseNames[0]].tees.Yellow;
}

function teeSummary(course, tee) {
  const data = getTeeData(course, tee);
  return {
    par: data.pars.reduce((a, b) => a + b, 0),
    yards: data.yards.reduce((a, b) => a + b, 0)
  };
}

function initialRound(course = "Chipstead Golf Club", tee = "Yellow"){
  const data = getTeeData(course, tee);
  return Array.from({length:18},(_,i)=>({
    hole:i+1,
    par:data.pars[i],
    si:data.si[i],
    yards:data.yards[i],
    score:data.pars[i]+1,
    saved:i<4,
    tee:i===1?["Right"]:i===3?["Fairway"]:[],
    approach:i===1||i===2?["Short"]:i===3?["Green hit"]:[],
    green:i===2?["Poor chip"]:[],
    putting:i===0?["2-putt"]:i===1?["3-putt"]:[]
  }));
}

function LogoMark({ size = 142 }) {
  return <div className="loopLogo" style={{ width: size * 1.9 }}><div className="loopInfinity"><span className="loopRing left" /><span className="loopRing right" /></div><div className="loopWord">Loop</div><div className="loopTagline">Play. Reflect. Improve.</div></div>;
}

function FeatureIcon({ symbol }) { return <div className="featureIcon">{symbol}</div>; }

function analyse(round){
  const saved=round.filter(h=>h.saved); const sample=saved.length?saved:round.slice(0,4);
  const count=(fn)=>sample.filter(fn).length;
  const short=count(h=>h.approach.includes("Short")||h.approach.includes("Miss short"));
  const right=count(h=>h.tee.includes("Right")||h.tee.includes("Miss right"));
  const fairway=count(h=>h.tee.includes("Fairway")||h.tee.includes("Fairway hit"));
  const penalty=count(h=>h.tee.includes("Penalty")||h.green.includes("Bunker miss"));
  const threePutts=count(h=>h.putting.includes("3-putt"));
  const twoOrBetter=count(h=>h.putting.includes("1-putt")||h.putting.includes("2-putt"));
  const chips=count(h=>h.green.includes("Poor chip")||h.green.includes("Chunk")||h.green.includes("Thin"));
  const par4Short=count(h=>h.par===4&&(h.approach.includes("Short")||h.approach.includes("Miss short")));
  const early=count(h=>h.hole<=3&&h.score>h.par+1);
  const items=[]; const strengths=[];
  if(fairway>=2) strengths.push({title:"Driving", detail:"Driver kept you in play across the holes you logged.", label:"What worked"});
  if(threePutts===0 && twoOrBetter>=2) strengths.push({title:"Putting", detail:"No three putts logged. That protected your score after you reached the green.", label:"Reliable strength"});
  if(sample.some(h=>h.green.includes("Up and down")||h.green.includes("Good recovery"))) strengths.push({title:"Recovery", detail:"You recovered well after missed greens and kept damage under control.", label:"Positive trend"});
  if(!strengths.length) strengths.push({title:"Steady scoring", detail:"You kept enough holes under control to build from next round.", label:"Good sign"});
  if(short>=2) items.push({title:"Approach pattern", detail:par4Short>=2?"Most missed greens came up short, especially on par 4 approaches.":"Most missed greens came from approaches finishing short.", source:`Based on ${sample.length} logged holes`, action:"Take one extra club into greens from 140 yards and beyond.", confidence:"Strong pattern"});
  if(right>=1||penalty>=1) items.push({title:"Tee-shot risk", detail:"Right-side misses are creating recovery shots and bringing doubles into play.", source:"Seen across your saved holes", action:"Use a safer club when trouble sits right.", confidence:"Worth watching"});
  if(threePutts>=1) items.push({title:"Putting distance control", detail:"The biggest putting risk is leaving yourself too much work from the first putt.", source:"Observed from post-hole putting tags", action:"Lag first putts into a 3ft circle.", confidence:"Early signal"});
  if(chips>=1) items.push({title:"Around the green", detail:"Short-game mistakes are turning missed greens into dropped shots.", source:"Based on your around-green tags", action:"Get the first chip on the green before chasing the flag.", confidence:"Early signal"});
  if(early>=1) items.push({title:"Opening holes", detail:"Your early holes need a steadier start and fewer aggressive choices.", source:"Based on your first few logged holes", action:"Play the first three holes with the safest target in mind.", confidence:"Recurring phase to track"});
  if(!items.length) items.push({title:"Course management", detail:"No major leak stands out yet. Keep logging to build a clearer pattern.", source:"Based on the holes saved so far", action:"Choose the shot that removes the worst miss.", confidence:"Needs more rounds"});
  return {strengths:strengths.slice(0,2), improvements:items.slice(0,3)};
}

function Phone({children}){return <main className="page"><section className="phone"><div className="notch"/><div className="screen">{children}</div></section></main>}
function Header({title,sub,back,hideBack}){return <div className="header">{!hideBack&&<button className="back" onClick={back}>‹</button>}<div><h2>{title}</h2>{sub&&<p>{sub}</p>}</div></div>}
function Card({children,dark=false,soft=false}){return <div className={`card ${dark?"dark":""} ${soft?"soft":""}`}>{children}</div>}
function Btn({children,onClick,secondary=false}){return <button onClick={onClick} className={`btn ${secondary?"secondary":""}`}>{children}</button>}
function Pill({children,on,click}){return <button onClick={click} className={`pill ${on?"on":""}`}>{children}</button>}
function Nav({go}){return <div className="nav">{[["home","⛳","Home"],["ready","◌","Ready"],["setup","＋","Round"],["plan","◎","Plan"],["practice","◉","Practice"]].map(([s,i,t])=><button key={s} onClick={()=>go(s)}><span>{i}</span>{t}</button>)}</div>}

function Welcome({go}){return <Phone><div className="welcomeScreen"><div className="welcomeHero"><LogoMark/><p className="welcomeCopy">An easier way to <strong>track your round</strong>,<br/><strong>spot patterns</strong> and play your next round with a <strong>clearer plan</strong>.</p></div><Card><div className="featureList"><div className="featureRow"><FeatureIcon symbol="✓"/><div><h3>Simple post-hole tracking</h3><p>Quick to use. Built for your game.</p></div></div><div className="featureRow"><FeatureIcon symbol="▥"/><div><h3>Clear insight from your patterns</h3><p>See what’s working and what’s not.</p></div></div><div className="featureRow"><FeatureIcon symbol="◎"/><div><h3>Practice that transfers to the course</h3><p>Build better habits. Play better golf.</p></div></div></div></Card><button className="btn welcomeBtn" onClick={()=>go("profile")}>Get started <span>→</span></button></div></Phone>}
function Profile({go,back}){const[h,setH]=useState(14),[goal,setGoal]=useState("Break 80");return <Phone><Header title="Your golfer profile" sub="A quick setup so advice feels relevant." back={back}/><div className="stack"><Card><p className="eyebrow">Current handicap</p><div className="counter"><button onClick={()=>setH(Math.max(1,h-1))}>−</button><strong>{h}</strong><button onClick={()=>setH(h+1)}>+</button></div></Card><div><p className="eyebrow">Main goal</p><div className="pills">{["Break 90","Break 85","Break 80","Single figures"].map(x=><Pill key={x} on={goal===x} click={()=>setGoal(x)}>{x}</Pill>)}</div></div><Btn onClick={()=>go("home")}>Continue</Btn></div></Phone>}
function Home({go}){return <Phone><Header title="Today" sub="Get ready, play, then review what mattered." hideBack/><div className="stack"><Card dark><p className="eyebrow light">Before you tee off</p><h2>Ready to Play</h2><p>A short warm-up to loosen up, find rhythm and settle your first tee focus.</p><button className="white" onClick={()=>go("ready")}>Start prep</button></Card><Card><h3>How better rounds are built</h3><p className="muted">A simple rhythm that helps you learn from each round and carry improvements into the next one.</p><div className="journey">{["Play","Review","Practise","Improve"].map((x,i)=><React.Fragment key={x}><div><b>{i+1}</b><span>{x}</span></div>{i<3&&<em/>}</React.Fragment>)}</div></Card><Btn onClick={()=>go("setup")}>Start round capture</Btn></div><Nav go={go}/></Phone>}
function Ready({go,back}){const moves=["Shoulder turns","Hip openers","Hamstring sweep","Wrist circles","Three easy swings"];return <Phone><Header title="Ready to Play" sub="Four minutes. Calm body, clear first tee." back={back}/><div className="stack bottomGap"><Card dark><p className="eyebrow light">First tee reset</p><h2>Loosen up and find rhythm</h2><p>Simple movements you can do by the car park or practice green.</p><p className="note">Better starts usually lead to steadier opening holes.</p></Card>{moves.map((m,i)=><Card key={m}><div className="row"><b className="num">{i+1}</b><div><h3>{m}</h3><p className="muted">30–45 seconds. Smooth and easy.</p></div></div></Card>)}<Card><p className="eyebrow">First tee focus</p><h3>Pick a safe target. Commit to one smooth swing.</h3></Card><Btn onClick={()=>go("setup")}>Start round</Btn></div><Nav go={go}/></Phone>}

function Setup({go,back,course,setCourse,tee,setTee}){
  const summary = teeSummary(course, tee);
  return <Phone><Header title="Course setup" sub="Choose your course and tee before you play." back={back}/><div className="stack bottomGap"><Card dark><p className="eyebrow light">Today’s round</p><h2>Where are you playing?</h2><p>Loop uses the course, tee, par, yardage and stroke index to make round capture feel real without GPS or shot-by-shot tracking.</p></Card><Card><p className="eyebrow">Course</p><div className="courseList">{courseNames.map(name=><button key={name} className={`courseOption ${course===name?"selected":""}`} onClick={()=>setCourse(name)}><b>{name}</b><span>{COURSE_DATA[name].location}</span></button>)}</div></Card><Card><p className="eyebrow">Tee colour</p><div className="pills">{["White","Yellow","Red"].map(x=><Pill key={x} on={tee===x} click={()=>setTee(x)}>{x}</Pill>)}</div></Card><Card soft><strong>{summary.par} par · {summary.yards.toLocaleString()} yards</strong><br/>Hole pars, yardages and stroke indexes are attached to the round.</Card><Btn onClick={()=>go("round")}>Continue to round capture</Btn></div><Nav go={go}/></Phone>
}

function HoleGrid({round,select}){return <div className="holes">{round.map((h,i)=><button key={h.hole} onClick={()=>select(i)} className={`${h.saved?"saved":""}`}><b>{h.hole}</b><span>{h.saved?"Saved":`${h.yards}y`}</span></button>)}</div>}
function Round({go,back,round,setHole,lastSaved,course,tee}){const done=round.filter(h=>h.saved).length;const current=round.find(h=>!h.saved)||round[17];const summary=teeSummary(course,tee);return <Phone><Header title="Round capture" sub={`${course} · ${tee} tees`} back={back}/><div className="stack bottomGap">{lastSaved&&<div className="savedMsg">Hole {lastSaved} saved. Ready for the next one.</div>}<Card><div className="between"><div><p className="eyebrow">Current hole</p><h2>Hole {current.hole}</h2></div><span className="badge">Par {current.par} · {current.yards}y · SI {current.si}</span></div><div className="bar"><i style={{width:`${done/18*100}%`}}/></div><p className="muted">{done} of 18 holes saved · Course par {summary.par}</p></Card><HoleGrid round={round} select={(i)=>{setHole(i);go("hole")}}/><Card soft>Most golfers log each hole walking to the next tee.</Card><Btn onClick={()=>go("review")}>Finish and review</Btn></div><Nav go={go}/></Phone>}

function TagSection({title,hint,options,selected,toggle}){return <Card><h3>{title}</h3><p className="muted">{hint}</p><div className="pills">{options.map(o=><Pill key={o} on={selected.includes(o)} click={()=>toggle(o)}>{o}</Pill>)}</div></Card>}
function Hole({go,back,round,setRound,hole,setHole,setLastSaved}){const h=round[hole];const update=p=>setRound(prev=>prev.map((x,i)=>i===hole?{...x,...p}:x));const toggle=(sec,tag)=>update({[sec]:h[sec].includes(tag)?h[sec].filter(x=>x!==tag):[...h[sec],tag]});const save=()=>{update({saved:true});setLastSaved(h.hole);setHole(Math.min(hole+1,17));go("round")};return <Phone><Header title={`Hole ${h.hole}`} sub={`Par ${h.par} · ${h.yards}y · SI ${h.si}`} back={back}/><div className="stack scroll"><Card><p className="eyebrow">Score</p><div className="counter"><button onClick={()=>update({score:Math.max(1,h.score-1)})}>−</button><strong>{h.score}</strong><button onClick={()=>update({score:h.score+1})}>+</button></div></Card><TagSection title="Tee shot" hint="Only the first shot on par 4s and par 5s." options={["Fairway","Left","Right","Penalty","Top/thin"]} selected={h.tee} toggle={t=>toggle("tee",t)}/><TagSection title="Approach" hint="The shot into the green." options={["Green hit","Short","Left","Right","Long"]} selected={h.approach} toggle={t=>toggle("approach",t)}/><TagSection title="Short game" hint="Only if you missed the green." options={["Up and down","Bunker","Chunk","Thin","Good recovery"]} selected={h.green} toggle={t=>toggle("green",t)}/><TagSection title="Putting" hint="What happened once you reached the green." options={["1-putt","2-putt","3-putt"]} selected={h.putting} toggle={t=>toggle("putting",t)}/><Btn onClick={save}>Save hole and continue</Btn></div></Phone>}
function Review({go,back,round}){const result=analyse(round);const main=result.improvements[0];const strength=result.strengths[0];return <Phone><Header title="Round review" sub="What worked, what cost shots and what to take forward." back={back}/><div className="stack bottomGap"><Card dark><p className="eyebrow light">Round story</p><h2>A steadier back nine</h2><p>You kept the ball in play more often and the main scoring leak came from one repeated approach pattern.</p><p className="note">Based on the holes you saved in this prototype round.</p></Card><Card><div className="between"><h3>What worked today</h3><span className="good">Well done</span></div><p>{strength.detail}</p><p className="muted">Good rounds are built by keeping strengths reliable, not only fixing weaknesses.</p></Card><Card><div className="between"><h3>What cost shots</h3><span className="badge">{main.confidence}</span></div><p>{main.detail}</p><p className="muted">{main.source}</p></Card><Card><p className="eyebrow">Next round focus</p><h3>{main.action}</h3><p className="muted">One clear playing rule beats taking five swing thoughts to the first tee.</p></Card><Card><p className="eyebrow">One thing to remember</p><p className="quote">“Started trusting the middle of the green more on the back nine.”</p></Card><div className="two"><Btn onClick={()=>go("plan")}>Next Round Plan</Btn><Btn secondary onClick={()=>go("practice")}>Practice ideas</Btn></div></div><Nav go={go}/></Phone>}
function PlanCard({n,title,body,evidence}){return <Card><div className="row"><b className="num">{n}</b><div><h3>{title}</h3><p>{body}</p><p className="muted">{evidence}</p></div></div></Card>}
function Plan({go,back,round}){const main=analyse(round).improvements[0];return <Phone><Header title="Next Round Plan" sub="Three simple rules to take to the course." back={back}/><div className="stack bottomGap"><PlanCard n="1" title={main.action} body="Use this as your main playing rule next round. Keep it simple and repeat it before each relevant shot." evidence={main.source}/><PlanCard n="2" title="Play the first three holes safely" body="Start steady. Pick targets that remove the worst miss and avoid chasing early birdies." evidence="Your opening holes are now being tracked as a round phase."/><PlanCard n="3" title="Protect against doubles" body="A bogey after a poor shot is fine. The scorecard damage comes from forcing the next one." evidence="This is the fastest improvement route for most mid-handicap golfers."/><div className="two"><Btn onClick={()=>go("prompt")}>Start round</Btn><Btn secondary onClick={()=>go("practice")}>Practise</Btn></div></div><Nav go={go}/></Phone>}
function Prompt({go,back,round}){const insight=analyse(round).improvements[0];return <Phone><Header title="Hole 4" sub="Smart prompt · based on your plan" back={back}/><div className="stack bottomGap"><Card dark><p className="eyebrow light">Before you hit</p><h2>{insight.action}</h2><p>{insight.detail}</p></Card><Card><p className="eyebrow">Why this prompt appears</p><p>{insight.source}. This prompt only appears when it connects to your current plan.</p></Card><Btn onClick={()=>go("round")}>Log this hole</Btn></div><Nav go={go}/></Phone>}
function Drill({title,body}){return <Card><div className="row"><b className="tick">✓</b><div><h3>{title}</h3><p>{body}</p></div></div></Card>}
function Practice({go,back,round}){const insight=analyse(round).improvements[0];return <Phone><Header title="Practice plan" sub="Short, practical and built for your next round." back={back}/><div className="stack bottomGap"><Card dark><p className="eyebrow light">Before your next round</p><h2>{insight.title}</h2><p>{insight.action}</p></Card><Drill title="Driver confidence · 10 mins" body="Hit 5 tee shots at 70% tempo. Focus only on balance and finishing the swing."/><Drill title="Distance control · 15 mins" body="Land 10 wedges inside 15 paces without changing target. The goal is pin-high, not perfect."/><Drill title="Short putts · 10 mins" body="Make 20 three-foot putts before leaving the green. Keep the routine the same every time."/><Btn onClick={()=>go("progress")}>Mark practice complete</Btn></div><Nav go={go}/></Phone>}
function Progress({go,back}){return <Phone><Header title="Progress" sub="Simple trends. No stats overload." back={back}/><div className="stack bottomGap"><Card dark><p className="eyebrow light">Current pattern</p><h2>Reliable strengths are building</h2><p>Your driving and putting are giving you a stronger base while approach distance control remains the focus.</p></Card><Card><h3>Trend confidence</h3>{[["Round 1","No three putts","Strong"],["Round 2","More tee shots in play","Improving"],["Round 3","Short approaches reduced","Stronger"]].map(([r,l,s])=><div className="trend" key={r}><div><b>{r}</b><p>{l}</p></div><span>{s}</span></div>)}</Card><Btn onClick={()=>go("plan")}>View updated plan</Btn></div><Nav go={go}/></Phone>}

export default function App(){
  const[screen,setScreen]=useState("welcome"),[history,setHistory]=useState([]),[course,setCourse]=useState("Chipstead Golf Club"),[tee,setTee]=useState("Yellow"),[round,setRound]=useState(()=>initialRound("Chipstead Golf Club","Yellow")),[hole,setHole]=useState(4),[lastSaved,setLastSaved]=useState(null);
  useEffect(()=>{ setRound(initialRound(course, tee)); setHole(4); setLastSaved(null); }, [course, tee]);
  const go=s=>{if(!screens.includes(s))return;setHistory(h=>[...h,screen]);setScreen(s)};
  const back=()=>setHistory(h=>{if(!h.length)return h;setScreen(h[h.length-1]);return h.slice(0,-1)});
  const props={go,back,round,setRound,hole,setHole,lastSaved,setLastSaved,course,setCourse,tee,setTee};
  return <div><style>{css}</style>{screen==="welcome"&&<Welcome {...props}/>} {screen==="profile"&&<Profile {...props}/>} {screen==="home"&&<Home {...props}/>} {screen==="ready"&&<Ready {...props}/>} {screen==="setup"&&<Setup {...props}/>} {screen==="round"&&<Round {...props}/>} {screen==="hole"&&<Hole {...props}/>} {screen==="review"&&<Review {...props}/>} {screen==="plan"&&<Plan {...props}/>} {screen==="prompt"&&<Prompt {...props}/>} {screen==="practice"&&<Practice {...props}/>} {screen==="progress"&&<Progress {...props}/>}</div>
}

const css = `
:root{--deep:#0F2D2E;--mint:#17A589;--soft:#7EDBB4;--pale:#E6F4EE;--off:#F7F7F4;--ink:#0F2D2E}*{box-sizing:border-box}body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif;background:var(--pale);color:var(--ink)}button{font:inherit}.page{min-height:100vh;display:grid;place-items:center;padding:20px;background:var(--pale)}.phone{width:390px;height:844px;border:10px solid #09090b;border-radius:46px;background:white;overflow:hidden;position:relative;box-shadow:0 28px 70px rgba(15,45,46,.22)}.notch{width:140px;height:28px;border-radius:0 0 22px 22px;background:#09090b;position:absolute;left:50%;top:0;transform:translateX(-50%);z-index:2}.screen{height:100%;overflow-y:auto;padding:38px 0 0;background:linear-gradient(180deg,#fff 0%,var(--off) 68%,var(--pale) 100%)}.header{position:sticky;top:0;z-index:2;display:flex;gap:12px;align-items:center;padding:16px 20px 12px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(126,219,180,.25)}.header h2{font-size:18px;margin:0;color:var(--deep);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.header p{font-size:12px;color:rgba(15,45,46,.58);margin:2px 0 0}.back{border:0;background:var(--pale);color:var(--deep);border-radius:999px;width:36px;height:36px;font-size:24px}.stack{display:flex;flex-direction:column;gap:16px;padding:20px}.bottomGap{padding-bottom:110px}.scroll{height:760px;overflow-y:auto;padding-bottom:32px}h1{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:42px;line-height:.95;letter-spacing:-.04em;margin:0;color:var(--deep)}h2{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:30px;line-height:1;letter-spacing:-.03em;margin:0}h3,p{margin:0}h3{font-size:17px;color:var(--deep)}.muted{color:rgba(15,45,46,.58);font-size:13px;line-height:1.45;margin-top:7px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;color:rgba(15,45,46,.55);margin-bottom:8px}.light{color:rgba(232,245,239,.85)}.card{padding:18px;border-radius:24px;border:1px solid rgba(126,219,180,.25);background:rgba(255,255,255,.95);box-shadow:0 8px 30px rgba(15,45,46,.07)}.card.dark{background:linear-gradient(145deg,var(--deep),#051f20);color:white;border-color:transparent;box-shadow:0 12px 34px rgba(15,45,46,.20)}.card.soft{background:var(--off);color:rgba(15,45,46,.65)}.card p,.card li{font-size:14px;line-height:1.5;color:rgba(15,45,46,.72)}.card.dark p{color:#e4e4e7}.btn{border:0;cursor:pointer;height:54px;border-radius:18px;background:linear-gradient(135deg,var(--deep),#051f20);color:white;font-weight:750;width:100%;padding:0 16px;box-shadow:0 8px 22px rgba(23,165,137,.22)}.btn.secondary{background:white;color:var(--deep);border:1px solid var(--deep);box-shadow:none}.white{margin-top:20px;background:white;color:var(--deep);border:0;border-radius:16px;height:48px;padding:0 18px;font-weight:750}.nav{position:absolute;bottom:0;left:0;right:0;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:8px 12px 24px;background:rgba(255,255,255,.96);border-top:1px solid rgba(126,219,180,.25);backdrop-filter:blur(12px)}.nav button{border:0;background:transparent;color:rgba(15,45,46,.72);font-size:11px;display:flex;flex-direction:column;gap:3px;align-items:center}.nav span{font-size:17px}.pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.pill{border:1px solid rgba(126,219,180,.25);border-radius:999px;background:var(--off);color:rgba(15,45,46,.78);padding:10px 12px;font-size:13px}.pill.on{background:var(--deep);color:white;border-color:var(--deep)}.counter{display:flex;align-items:center;justify-content:space-between}.counter button{width:44px;height:44px;border-radius:999px;border:0;background:var(--pale);color:var(--deep);font-size:20px}.counter strong{font-size:60px;color:var(--deep)}.journey{display:flex;align-items:flex-start;margin-top:18px;text-align:center}.journey div{flex:1}.journey b{display:grid;place-items:center;width:38px;height:38px;border-radius:999px;background:var(--pale);margin:0 auto;color:var(--deep)}.journey span{display:block;font-size:11px;margin-top:8px;color:rgba(15,45,46,.72);font-weight:700}.journey em{height:1px;background:rgba(126,219,180,.5);flex:.5;margin-top:19px}.row{display:flex;gap:14px;align-items:flex-start}.num,.tick{display:grid;place-items:center;min-width:36px;height:36px;border-radius:999px;background:var(--deep);color:white}.tick{background:var(--mint)}.note{background:rgba(255,255,255,.1);border-radius:16px;padding:12px;margin-top:14px;font-size:12px}.savedMsg{background:var(--pale);color:var(--mint);border-radius:16px;padding:12px 14px;font-size:14px;font-weight:700}.between{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.badge,.good{border-radius:999px;background:var(--off);color:rgba(15,45,46,.68);padding:7px 10px;font-size:11px;white-space:nowrap}.good{background:var(--pale);color:var(--mint)}.bar{height:8px;background:var(--pale);border-radius:999px;overflow:hidden}.bar i{display:block;height:100%;background:var(--mint)}.holes{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.holes button{border:1px solid rgba(126,219,180,.18);background:var(--off);color:rgba(15,45,46,.58);border-radius:16px;padding:11px 4px}.holes button.saved{background:var(--pale);color:var(--mint);border:1px solid var(--soft)}.holes b{display:block}.holes span{display:block;font-size:10px;margin-top:3px}.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}.trend{display:flex;justify-content:space-between;gap:12px;padding:12px;border-radius:16px;background:var(--off);margin-top:10px}.trend p{color:rgba(15,45,46,.58)}.trend span{background:white;border-radius:999px;padding:7px 10px;font-size:11px;color:rgba(15,45,46,.68);height:max-content}.quote{background:var(--off);border-radius:18px;padding:14px;font-style:italic;color:rgba(15,45,46,.72)}.courseList{display:flex;flex-direction:column;gap:10px}.courseOption{width:100%;text-align:left;border:1px solid rgba(126,219,180,.25);background:var(--off);border-radius:18px;padding:14px;color:var(--deep);cursor:pointer}.courseOption b{display:block;font-size:15px}.courseOption span{display:block;font-size:12px;color:rgba(15,45,46,.58);margin-top:4px}.courseOption.selected{background:var(--deep);color:white;border-color:var(--deep)}.courseOption.selected span{color:rgba(255,255,255,.72)}@media(max-width:440px){.page{padding:0}.phone{width:100vw;height:100vh;border:0;border-radius:0}.notch{display:none}.screen{padding-top:0}}
.welcomeScreen{position:relative;display:flex;min-height:100%;flex-direction:column;justify-content:space-between;overflow-y:auto;padding:48px 28px 40px;background:linear-gradient(180deg,#fff 0%,var(--off) 58%,var(--pale) 100%)}.welcomeScreen:after{content:"";position:absolute;left:0;right:0;bottom:96px;height:288px;opacity:.4;background-image:radial-gradient(ellipse at 20% 30%,rgba(23,165,137,.1),transparent 42%),radial-gradient(ellipse at 80% 20%,rgba(126,219,180,.14),transparent 44%);pointer-events:none}.welcomeHero{position:relative;z-index:1;text-align:center}.loopLogo{position:relative;z-index:1;margin:0 auto;text-align:center;display:flex;flex-direction:column;align-items:center}.loopInfinity{position:relative;width:150px;height:72px;margin:0 auto 8px}.loopRing{position:absolute;top:10px;width:64px;height:48px;border:13px solid var(--deep);border-radius:999px}.loopRing.left{left:10px;border-right-color:var(--mint);transform:rotate(-32deg)}.loopRing.right{right:10px;border-left-color:var(--mint);transform:rotate(32deg)}.loopWord{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:64px;line-height:.9;font-weight:800;letter-spacing:-.08em;color:var(--deep)}.loopTagline{margin-top:14px;color:var(--mint);text-transform:uppercase;letter-spacing:.32em;font-size:12px;font-weight:700}.welcomeCopy{max-width:340px;margin:42px auto 0;text-align:center;font-size:26px;font-weight:500;line-height:1.45;color:var(--deep)}.welcomeCopy strong{color:var(--mint);font-weight:800}.featureList{padding:20px}.featureRow{display:flex;align-items:center;gap:20px;padding:18px 0}.featureRow+ .featureRow{border-top:1px solid #f1f1f2}.featureRow h3{font-size:18px;font-weight:800;color:var(--deep)}.featureRow p{margin-top:4px;font-size:14px;color:#71717a}.featureIcon{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:64px;height:64px;border-radius:999px;background:var(--pale);color:var(--mint);font-size:30px;font-weight:700}.welcomeBtn{height:64px;border-radius:24px;font-size:20px;position:relative;z-index:3;display:flex;align-items:center;justify-content:center;margin-top:20px;min-height:64px;flex-shrink:0;cursor:pointer}.welcomeBtn span{font-size:30px;margin-left:12px}
`;
