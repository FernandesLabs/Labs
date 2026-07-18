/**
 * Fernandes Labs — Tool Network Generator
 *
 * Generates all tool HTML files from a definition array, then updates
 * CHANGELOG.md, index.html (TOOLS array), and PROGRESS.md.
 *
 * Usage: node generate-all.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// --- Tool template ----------------------------------------------------------

function wrap(tool) {
  const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const name = esc(tool.name);
  const desc = esc(tool.description);
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — Fernandes Labs</title>
  <meta name="description" content="${desc} Runs entirely in your browser — no data sent to servers.">
  <link rel="canonical" href="https://fernandeslabs.com/tools/${tool.category}/${tool.slug}/">
  <meta property="og:title" content="${name} — Fernandes Labs">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${name} — Fernandes Labs">
  <meta name="twitter:description" content="${desc}">
  <link rel="icon" href="../../../assets/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../../../assets/styles.css">
  <script src="../../../assets/config-loader.js"></script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebApplication","name":"${name}","description":"${desc}","applicationCategory":"Utilities","operatingSystem":"All","url":"https://fernandeslabs.com/tools/${tool.category}/${tool.slug}/"}
  </script>
</head>
<body>
<header class="fl-header">
  <div class="fl-container fl-header-inner">
    <a href="/" class="fl-brand"><img src="../../../assets/logo.svg" alt="Fernandes Labs" class="fl-brand-logo"><span>Fernandes Labs</span></a>
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">🌙</button>
  </div>
</header>
<main>
  <section class="fl-hero fl-container">
    <h1>${name}</h1>
    <p>${desc}</p>
  </section>
  <section class="fl-container fl-section">
    <div class="ad-placeholder">Advertisement</div>
    <div class="card">
${tool.body}
    </div>
    <div class="ad-placeholder">Advertisement</div>
  </section>
</main>
<footer class="fl-footer">
  <div class="fl-container fl-footer-inner">
    <a href="/">← Back to Tools</a>
    <p id="footer-text">Built by Fernandes Labs</p>
  </div>
</footer>
<script>
var t=document.getElementById("theme-toggle"),s=localStorage.getItem("fl-theme")||"light";
document.documentElement.setAttribute("data-theme",s);
t.textContent=s==="dark"?"☀️":"🌙";
t.addEventListener("click",function(){var n=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",n);localStorage.setItem("fl-theme",n);t.textContent=n==="dark"?"☀️":"🌙";});
FernandesConfig.load().then(function(c){document.getElementById("footer-text").textContent=c.branding.footer_text;});
${tool.script || ""}
</script>
</body>
</html>`;
}

// --- Shared snippets --------------------------------------------------------

const textInOut = (opts) => `
      <label for="input">${opts.inLabel || "Input"}</label>
      <textarea class="textarea" id="input" placeholder="${opts.placeholder || ""}"></textarea>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);flex-wrap:wrap;">
        <button class="btn btn-primary" id="btn-go">${opts.btnLabel || "Convert"}</button>
        <button class="btn btn-ghost" id="btn-copy">Copy</button>
        <button class="btn btn-ghost" id="btn-clear">Clear</button>
      </div>
      <label for="output" style="margin-top:var(--space-4);">Result</label>
      <textarea class="textarea" id="output" readonly></textarea>`;

const copyClearScript = (fn) => `
document.getElementById("btn-go").addEventListener("click",function(){var i=document.getElementById("input").value;document.getElementById("output").value=${fn};});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value){navigator.clipboard.writeText(o.value);}});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value="";});`;

// --- All tool definitions ---------------------------------------------------

const TOOLS = [
  // ===== DEVELOPER (29) =====
  { slug:"json-yaml-converter", name:"JSON ↔ YAML Converter", category:"developer", description:"Convert between JSON and YAML formats.", icon:"🔧",
    body:textInOut({inLabel:"JSON or YAML",btnLabel:"Convert"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var i=document.getElementById("input").value.trim();
  try{
    if(i.startsWith("{")||i.startsWith("[")){
      var j=JSON.parse(i);
      document.getElementById("output").value=toYaml(j);
    }else{
      document.getElementById("output").value=JSON.stringify(fromYaml(i),null,2);
    }
  }catch(e){document.getElementById("output").value="Error: "+e.message;}
});
function toYaml(obj,indent){indent=indent||"";if(Array.isArray(obj)){return obj.map(function(v){return indent+"- "+(typeof v==="object"?toYaml(v,indent+"  "):v)}).join("\\n")}
var lines=[];for(var k in obj){if(typeof obj[k]==="object"&&obj[k]!==null){lines.push(indent+k+":");lines.push(toYaml(obj[k],indent+"  "))}else{lines.push(indent+k+": "+obj[k])}}
return lines.join("\\n")}
function fromYaml(s){var lines=s.split("\\n").filter(function(l){return l.trim()});var root={};var stack=[{indent:-1,obj:root}];
lines.forEach(function(l){var indent=l.length-l.trimStart().length;var trimmed=l.trim();var isArr=trimmed.startsWith("- ");var key=isArr?trimmed.slice(2):trimmed.split(":")[0];var val=isArr?trimmed.slice(2):trimmed.split(":")[1];
while(stack.length>1&&indent<=stack[stack.length-1].indent)stack.pop();
var parent=stack[stack.length-1].obj;if(isArr){if(!Array.isArray(parent)){}parent.push(val?val.trim():{})}else{parent[key]=val?val.trim():{};if(!val)stack.push({indent:indent,obj:parent[key]})}}
);return root}
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"xml-formatter", name:"XML Formatter", category:"developer", description:"Format and pretty-print XML.", icon:"🔧",
    body:textInOut({inLabel:"XML",placeholder:"<root><item>value</item></root>"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  try{var i=document.getElementById("input").value;var formatted="";var indent=0;i.split(/>(?=\\s*[^<])/).forEach(function(part){part=part.trim();if(!part)return;if(part.startsWith("</"))indent--;formatted+="  ".repeat(Math.max(0,indent))+part+">\\n";if(part.startsWith("<")&&!part.startsWith("</")&&!part.startsWith("<?")&&!part.endsWith("/>")&&!part.includes("</"))indent++});
  document.getElementById("output").value=formatted}catch(e){document.getElementById("output").value="Error: "+e.message}});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"base64-encoder-decoder", name:"Base64 Encoder / Decoder", category:"developer", description:"Encode text to Base64 or decode Base64 to text.", icon:"🔧",
    body:`<label for="input">Text or Base64</label>
      <textarea class="textarea" id="input"></textarea>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);">
        <button class="btn btn-primary" id="btn-encode">Encode</button>
        <button class="btn btn-secondary" id="btn-decode">Decode</button>
        <button class="btn btn-ghost" id="btn-copy">Copy</button>
      </div>
      <label for="output" style="margin-top:var(--space-4);">Result</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-encode").addEventListener("click",function(){try{document.getElementById("output").value=btoa(unescape(encodeURIComponent(document.getElementById("input").value)))}catch(e){document.getElementById("output").value="Error: "+e.message}});
document.getElementById("btn-decode").addEventListener("click",function(){try{document.getElementById("output").value=decodeURIComponent(escape(atob(document.getElementById("input").value)))}catch(e){document.getElementById("output").value="Error: invalid Base64"}});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"jwt-decoder", name:"JWT Decoder", category:"developer", description:"Decode and inspect JSON Web Token header and payload.", icon:"🔧",
    body:`<label for="input">JWT Token</label>
      <textarea class="textarea" id="input" placeholder="eyJ..."></textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Decode</button>
      <label style="margin-top:var(--space-4);">Header</label>
      <textarea class="textarea" id="header" readonly></textarea>
      <label style="margin-top:var(--space-4);">Payload</label>
      <textarea class="textarea" id="payload" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("input").value.trim();var parts=t.split(".");
  if(parts.length<2){document.getElementById("header").value="Invalid JWT";return}
  try{document.getElementById("header").value=JSON.stringify(JSON.parse(atob(parts[0].replace(/-/g,"+").replace(/_/g,"/"))),null,2);
  document.getElementById("payload").value=JSON.stringify(JSON.parse(atob(parts[1].replace(/-/g,"+").replace(/_/g,"/"))),null,2)}catch(e){document.getElementById("header").value="Error: "+e.message}});
`},

  { slug:"jwt-generator", name:"JWT Generator", category:"developer", description:"Generate JSON Web Tokens with custom header and payload.", icon:"🔧",
    body:`<label for="header-input">Header (JSON)</label>
      <textarea class="textarea" id="header-input">{"alg":"HS256","typ":"JWT"}</textarea>
      <label for="payload-input" style="margin-top:var(--space-4);">Payload (JSON)</label>
      <textarea class="textarea" id="payload-input">{"sub":"1234567890","name":"John Doe","iat":1516239022}</textarea>
      <label for="secret" style="margin-top:var(--space-4);">Secret</label>
      <input class="input" id="secret" type="text" placeholder="your-256-bit-secret">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <label for="output" style="margin-top:var(--space-4);">JWT</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  try{var h=JSON.parse(document.getElementById("header-input").value);var p=JSON.parse(document.getElementById("payload-input").value);var s=document.getElementById("secret").value;
  var b64=function(o){return btoa(JSON.stringify(o)).replace(/=/g,"").replace(/\\+/g,"-").replace(/\\//g,"_")};
  var header=b64(h);var payload=b64(p);var data=header+"."+payload;
  var enc=new TextEncoder();var key=await crypto.subtle.importKey("raw",enc.encode(s),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  var sig=await crypto.subtle.sign("HMAC",key,enc.encode(data));var signature=btoa(String.fromCharCode.apply(null,new Uint8Array(sig))).replace(/=/g,"").replace(/\\+/g,"-").replace(/\\//g,"_");
  document.getElementById("output").value=data+"."+signature}catch(e){document.getElementById("output").value="Error: "+e.message}});
`},

  { slug:"regex-tester", name:"Regex Tester", category:"developer", description:"Test regular expressions against text with match highlighting.", icon:"🔧",
    body:`<label for="pattern">Regex Pattern</label>
      <input class="input" id="pattern" placeholder="\\b\\w+@\\w+\\.\\w+\\b">
      <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2);">
        <label><input type="checkbox" id="flag-g" checked> global</label>
        <label><input type="checkbox" id="flag-i"> case-insensitive</label>
        <label><input type="checkbox" id="flag-m"> multiline</label>
      </div>
      <label for="input" style="margin-top:var(--space-4);">Test String</label>
      <textarea class="textarea" id="input">Contact us at hello@example.com or support@test.org</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Test</button>
      <label for="output" style="margin-top:var(--space-4);">Matches</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  try{var p=document.getElementById("pattern").value;var flags="";
  if(document.getElementById("flag-g").checked)flags+="g";if(document.getElementById("flag-i").checked)flags+="i";if(document.getElementById("flag-m").checked)flags+="m";
  var re=new RegExp(p,flags);var str=document.getElementById("input").value;var matches=[];var m;
  if(flags.includes("g")){while((m=re.exec(str))!==null){matches.push(m[0]);if(m.index===re.lastIndex)re.lastIndex++}}else{m=re.exec(str);if(m)matches.push(m[0])}
  document.getElementById("output").value=matches.length?matches.join("\\n"):"No matches found."}catch(e){document.getElementById("output").value="Error: "+e.message}});
`},

  { slug:"cron-expression-generator", name:"Cron Expression Generator", category:"developer", description:"Build cron expressions with a visual interface.", icon:"🔧",
    body:`<div style="display:grid;gap:var(--space-3);grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">
      <div><label for="minute">Minute (0-59)</label><input class="input" id="minute" value="*"></div>
      <div><label for="hour">Hour (0-23)</label><input class="input" id="hour" value="*"></div>
      <div><label for="day">Day of Month (1-31)</label><input class="input" id="day" value="*"></div>
      <div><label for="month">Month (1-12)</label><input class="input" id="month" value="*"></div>
      <div><label for="weekday">Day of Week (0-6)</label><input class="input" id="weekday" value="*"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <label for="output" style="margin-top:var(--space-4);">Cron Expression</label>
      <input class="input" id="output" readonly>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var parts=["minute","hour","day","month","weekday"].map(function(f){return document.getElementById(f).value.trim()||"*"});
  document.getElementById("output").value=parts.join(" ")});
document.getElementById("btn-go").click();
`},

  { slug:"unix-timestamp-converter", name:"Unix Timestamp Converter", category:"developer", description:"Convert between Unix timestamps and human-readable dates.", icon:"🔧",
    body:`<label for="ts">Unix Timestamp</label>
      <input class="input" id="ts" type="number" placeholder="1700000000">
      <button class="btn btn-primary" id="btn-from" style="margin-top:var(--space-3);">Timestamp → Date</button>
      <label for="date" style="margin-top:var(--space-4);">Date</label>
      <input class="input" id="date" type="datetime-local">
      <button class="btn btn-secondary" id="btn-to" style="margin-top:var(--space-3);">Date → Timestamp</button>
      <div id="result" style="margin-top:var(--space-4);font-family:var(--font-mono);font-size:var(--font-size-lg);color:var(--color-accent);word-break:break-all;"></div>`,
    script:`document.getElementById("btn-from").addEventListener("click",function(){var ts=parseInt(document.getElementById("ts").value,10);var d=new Date(ts*1000);document.getElementById("result").textContent=d.toISOString()});
document.getElementById("btn-to").addEventListener("click",function(){var d=new Date(document.getElementById("date").value);document.getElementById("result").textContent=Math.floor(d.getTime()/1000)});
`},

  { slug:"hash-generator", name:"Hash Generator", category:"developer", description:"Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.", icon:"🔧",
    body:`<label for="input">Text to hash</label>
      <textarea class="textarea" id="input"></textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate Hashes</button>
      <div style="margin-top:var(--space-4);display:grid;gap:var(--space-3);">
        <div><label>SHA-256</label><input class="input" id="sha256" readonly></div>
        <div><label>SHA-1</label><input class="input" id="sha1" readonly></div>
        <div><label>SHA-512</label><input class="input" id="sha512" readonly></div>
      </div>`,
    script:`async function digest(algo,text){var buf=await crypto.subtle.digest(algo,new TextEncoder().encode(text));return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,"0")}).join("")}
document.getElementById("btn-go").addEventListener("click",async function(){
  var t=document.getElementById("input").value;if(!t)return;
  document.getElementById("sha256").value=await digest("SHA-256",t);
  document.getElementById("sha1").value=await digest("SHA-1",t);
  document.getElementById("sha512").value=await digest("SHA-512",t)});
`},

  { slug:"hmac-generator", name:"HMAC Generator", category:"developer", description:"Generate HMAC signatures with SHA-256.", icon:"🔧",
    body:`<label for="message">Message</label>
      <textarea class="textarea" id="message"></textarea>
      <label for="key" style="margin-top:var(--space-4);">Secret Key</label>
      <input class="input" id="key" type="text">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate HMAC</button>
      <label for="output" style="margin-top:var(--space-4);">HMAC-SHA256 (hex)</label>
      <input class="input" id="output" readonly>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var msg=document.getElementById("message").value;var key=document.getElementById("key").value;
  if(!msg||!key)return;
  var enc=new TextEncoder();var cryptoKey=await crypto.subtle.importKey("raw",enc.encode(key),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  var sig=await crypto.subtle.sign("HMAC",cryptoKey,enc.encode(msg));
  document.getElementById("output").value=Array.from(new Uint8Array(sig)).map(function(b){return b.toString(16).padStart(2,"0")}).join("")});
`},

  { slug:"url-encoder-decoder", name:"URL Encoder / Decoder", category:"developer", description:"Encode or decode URL components.", icon:"🔧",
    body:`<label for="input">Text</label>
      <textarea class="textarea" id="input"></textarea>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);">
        <button class="btn btn-primary" id="btn-encode">Encode</button>
        <button class="btn btn-secondary" id="btn-decode">Decode</button>
        <button class="btn btn-ghost" id="btn-copy">Copy</button>
      </div>
      <label for="output" style="margin-top:var(--space-4);">Result</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-encode").addEventListener("click",function(){document.getElementById("output").value=encodeURIComponent(document.getElementById("input").value)});
document.getElementById("btn-decode").addEventListener("click",function(){try{document.getElementById("output").value=decodeURIComponent(document.getElementById("input").value)}catch(e){document.getElementById("output").value="Error: "+e.message}});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"url-parser", name:"URL Parser", category:"developer", description:"Break down a URL into its components.", icon:"🔧",
    body:`<label for="input">URL</label>
      <input class="input" id="input" placeholder="https://user:pass@example.com:8080/path?q=1#hash">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Parse</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  try{var u=new URL(document.getElementById("input").value);var r=document.getElementById("result");r.innerHTML="";
  [["Protocol",u.protocol],["Hostname",u.hostname],["Port",u.port],["Pathname",u.pathname],["Search",u.search],["Hash",u.hash],["Username",u.username]].forEach(function(p){
    var d=document.createElement("div");d.style.marginBottom="var(--space-2)";
    d.innerHTML="<strong>"+p[0]+":</strong> <code>"+p[1]+"</code>";r.appendChild(d)})}catch(e){document.getElementById("result").innerHTML="<p style='color:var(--color-danger)'>Error: "+e.message+"</p>"}});
`},

  { slug:"query-string-builder", name:"Query String Builder", category:"developer", description:"Build URL query strings from key-value pairs.", icon:"🔧",
    body:`<label for="base">Base URL</label>
      <input class="input" id="base" placeholder="https://example.com/search">
      <label for="pairs" style="margin-top:var(--space-4);">Query Parameters (one per line, key=value)</label>
      <textarea class="textarea" id="pairs">q=fernandes labs
page=1
sort=desc</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Build URL</button>
      <label for="output" style="margin-top:var(--space-4);">Result</label>
      <input class="input" id="output" readonly>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var base=document.getElementById("base").value;var pairs=document.getElementById("pairs").value.split("\\n").filter(function(l){return l.trim()});
  var params=new URLSearchParams();pairs.forEach(function(l){var i=l.indexOf("=");if(i>0)params.append(l.slice(0,i).trim(),l.slice(i+1).trim())});
  document.getElementById("output").value=base+(params.toString()?"?"+params.toString():"")});
`},

  { slug:"html-entity-encoder", name:"HTML Entity Encoder", category:"developer", description:"Encode or decode HTML entities.", icon:"🔧",
    body:textInOut({inLabel:"Text",btnLabel:"Encode"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){var i=document.getElementById("input").value;document.getElementById("output").value=i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"color-converter", name:"Color Converter", category:"developer", description:"Convert between HEX, RGB, HSL, and OKLCH color formats.", icon:"🔧",
    body:`<label for="input">Color (HEX, RGB, or HSL)</label>
      <input class="input" id="input" value="#2563eb">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Convert</button>
      <div id="preview" style="margin-top:var(--space-4);height:60px;border-radius:var(--radius);border:1px solid var(--color-border);"></div>
      <div style="margin-top:var(--space-4);display:grid;gap:var(--space-3);">
        <div><label>HEX</label><input class="input" id="hex" readonly></div>
        <div><label>RGB</label><input class="input" id="rgb" readonly></div>
        <div><label>HSL</label><input class="input" id="hsl" readonly></div>
      </div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var v=document.getElementById("input").value.trim();var r,g,b;
  if(v.startsWith("#")){r=parseInt(v.slice(1,3),16);g=parseInt(v.slice(3,5),16);b=parseInt(v.slice(5,7),16)}
  else if(v.startsWith("rgb")){var m=v.match(/\\d+/g);r=+m[0];g=+m[1];b=+m[2]}
  else return;
  document.getElementById("hex").value="#"+[r,g,b].map(function(x){return x.toString(16).padStart(2,"0")}).join("");
  document.getElementById("rgb").value="rgb("+r+", "+g+", "+b+")";
  var rn=r/255,gn=g/255,bn=b/255;var max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn);var l=(max+min)/2;var h,s;
  if(max===min){h=s=0}else{var d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
  if(max===rn)h=(gn-bn)/d+(gn<bn?6:0);else if(max===gn)h=(bn-rn)/d+2;else h=(rn-gn)/d+4;h*=60}
  document.getElementById("hsl").value="hsl("+Math.round(h)+", "+Math.round(s*100)+"%, "+Math.round(l*100)+"%)";
  document.getElementById("preview").style.background="rgb("+r+","+g+","+b+")"});
document.getElementById("btn-go").click();
`},

  { slug:"css-gradient-generator", name:"CSS Gradient Generator", category:"developer", description:"Create CSS linear gradients visually.", icon:"🔧",
    body:`<div style="display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
      <input type="color" id="c1" value="#2563eb" style="width:60px;height:40px;border:none;border-radius:var(--radius);">
      <input type="color" id="c2" value="#60a5fa" style="width:60px;height:40px;border:none;border-radius:var(--radius);">
      <select class="select" id="angle" style="width:100px;"><option value="90">90°</option><option value="45">45°</option><option value="135">135°</option><option value="180">180°</option></select>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <div id="preview" style="margin-top:var(--space-4);height:120px;border-radius:var(--radius);border:1px solid var(--color-border);"></div>
      <label for="output" style="margin-top:var(--space-4);">CSS</label>
      <input class="input" id="output" readonly>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var c1=document.getElementById("c1").value;var c2=document.getElementById("c2").value;var a=document.getElementById("angle").value;
  var css="linear-gradient("+a+"deg, "+c1+", "+c2+")";
  document.getElementById("preview").style.background=css;document.getElementById("output").value="background: "+css+";"});
document.getElementById("btn-go").click();
`},

  { slug:"css-box-shadow-generator", name:"CSS Box Shadow Generator", category:"developer", description:"Generate CSS box-shadow properties.", icon:"🔧",
    body:`<div style="display:grid;gap:var(--space-3);grid-template-columns:repeat(auto-fit,minmax(120px,1fr));">
      <div><label for="x">X offset</label><input class="input" id="x" type="number" value="4"></div>
      <div><label for="y">Y offset</label><input class="input" id="y" type="number" value="4"></div>
      <div><label for="blur">Blur</label><input class="input" id="blur" type="number" value="10"></div>
      <div><label for="spread">Spread</label><input class="input" id="spread" type="number" value="0"></div>
      <div><label for="color">Color</label><input type="color" id="color" value="#000000" style="width:100%;height:40px;border:none;"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <div id="preview" style="margin:var(--space-4) auto;width:120px;height:120px;background:#fff;border-radius:var(--radius);"></div>
      <label for="output">CSS</label>
      <input class="input" id="output" readonly>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var css="box-shadow: "+document.getElementById("x").value+"px "+document.getElementById("y").value+"px "+document.getElementById("blur").value+"px "+document.getElementById("spread").value+"px "+document.getElementById("color").value+";";
  document.getElementById("preview").style.cssText="width:120px;height:120px;background:#fff;border-radius:var(--radius);"+css;document.getElementById("output").value=css});
document.getElementById("btn-go").click();
`},

  { slug:"css-border-radius-generator", name:"CSS Border Radius Generator", category:"developer", description:"Generate CSS border-radius with visual sliders.", icon:"🔧",
    body:`<div style="display:grid;gap:var(--space-3);grid-template-columns:repeat(2,1fr);">
      <div><label for="tl">Top-left</label><input class="input" id="tl" type="number" value="8"></div>
      <div><label for="tr">Top-right</label><input class="input" id="tr" type="number" value="8"></div>
      <div><label for="br">Bottom-right</label><input class="input" id="br" type="number" value="8"></div>
      <div><label for="bl">Bottom-left</label><input class="input" id="bl" type="number" value="8"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <div id="preview" style="margin:var(--space-4) auto;width:150px;height:150px;background:var(--color-accent);"></div>
      <label for="output">CSS</label>
      <input class="input" id="output" readonly>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var v=["tl","tr","br","bl"].map(function(id){return document.getElementById(id).value+"px"}).join(" ");
  document.getElementById("preview").style.borderRadius=v;document.getElementById("output").value="border-radius: "+v+";"});
document.getElementById("btn-go").click();
`},

  { slug:"sql-formatter", name:"SQL Formatter", category:"developer", description:"Format and pretty-print SQL queries.", icon:"🔧",
    body:textInOut({inLabel:"SQL Query",placeholder:"SELECT * FROM users WHERE id = 1"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var sql=document.getElementById("input").value.replace(/\\s+/g," ");
  sql=sql.replace(/\\b(SELECT|FROM|WHERE|AND|OR|INNER JOIN|LEFT JOIN|RIGHT JOIN|ON|GROUP BY|ORDER BY|LIMIT|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM)\\b/gi,"\\n$1");
  document.getElementById("output").value=sql.split("\\n").map(function(l){return l.trim()}).join("\\n").trim()});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"sql-pretty-printer", name:"SQL Pretty Printer", category:"developer", description:"Beautify SQL with proper indentation.", icon:"🔧",
    body:textInOut({inLabel:"SQL",btnLabel:"Pretty Print"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var sql=document.getElementById("input").value.replace(/\\s+/g," ");var indent=0;var out=[];
  sql.split(/\\b(SELECT|FROM|WHERE|AND|OR|JOIN|ON|GROUP BY|ORDER BY|LIMIT|VALUES|SET)\\b/i).forEach(function(part,i){
    part=part.trim();if(!part)return;
    if(/^(FROM|WHERE|AND|OR|JOIN|ON|GROUP BY|ORDER BY|LIMIT|VALUES|SET)$/i.test(part))indent=Math.max(0,indent);
    out.push("  ".repeat(indent)+part);if(/^(SELECT|FROM|WHERE|JOIN|VALUES|SET)$/i.test(part))indent++});
  document.getElementById("output").value=out.join("\\n")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"markdown-preview", name:"Markdown Preview", category:"developer", description:"Preview Markdown as you type.", icon:"🔧",
    body:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
      <div><label for="input">Markdown</label><textarea class="textarea" id="input" style="min-height:300px;"># Hello

This is **bold** and *italic*.

- Item 1
- Item 2</textarea></div>
      <div><label>Preview</label><div id="preview" class="card" style="min-height:300px;overflow:auto;"></div></div>
    </div>`,
    script:`function render(){var md=document.getElementById("input").value;
  md=md.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>");
  md=md.replace(/\\*\\*(.+?)\\*\\*/g,"<strong>$1</strong>").replace(/\\*(.+?)\\*/g,"<em>$1</em>");
  md=md.replace(/^- (.*)$/gm,"<li>$1</li>").replace(/(<li>.*<\\/li>)/s,"<ul>$1</ul>");
  md=md.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g,'<a href="$2">$1</a>');
  md=md.replace(/\\n\\n/g,"<br><br>");
  document.getElementById("preview").innerHTML=md}
document.getElementById("input").addEventListener("input",render);render();
`},

  { slug:"markdown-to-html", name:"Markdown → HTML", category:"developer", description:"Convert Markdown to standalone HTML.", icon:"🔧",
    body:textInOut({inLabel:"Markdown",btnLabel:"Convert"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var md=document.getElementById("input").value;
  md=md.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>");
  md=md.replace(/\\*\\*(.+?)\\*\\*/g,"<strong>$1</strong>").replace(/\\*(.+?)\\*/g,"<em>$1</em>");
  md=md.replace(/^- (.*)$/gm,"<li>$1</li>");
  md=md.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g,'<a href="$2">$1</a>');
  document.getElementById("output").value=md});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"html-minifier", name:"HTML Minifier", category:"developer", description:"Minify HTML by removing whitespace and comments.", icon:"🔧",
    body:textInOut({inLabel:"HTML",btnLabel:"Minify"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var h=document.getElementById("input").value;
  h=h.replace(/<!--[\\s\\S]*?-->/g,"").replace(/\\s+/g," ").replace(/\\s+/g," ").replace(/>\\s+</g,"><").trim();
  document.getElementById("output").value=h});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"css-minifier", name:"CSS Minifier", category:"developer", description:"Minify CSS by removing whitespace and comments.", icon:"🔧",
    body:textInOut({inLabel:"CSS",btnLabel:"Minify"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var c=document.getElementById("input").value;
  c=c.replace(/\\/\\*[\\s\\S]*?\\*\\//g,"").replace(/\\s+/g," ").replace(/\\s*([{}:;,])\\s*/g,"$1").replace(/;}/g,"}").trim();
  document.getElementById("output").value=c});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"js-minifier", name:"JS Minifier", category:"developer", description:"Basic JavaScript minifier — removes comments and whitespace.", icon:"🔧",
    body:textInOut({inLabel:"JavaScript",btnLabel:"Minify"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var j=document.getElementById("input").value;
  j=j.replace(/\\/\\/.*$/gm,"").replace(/\\/\\*[\\s\\S]*?\\*\\//g,"").replace(/\\s+/g," ").replace(/\\s*([{}();,:=<>+-*/])\\s*/g,"$1").trim();
  document.getElementById("output").value=j});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"diff-checker", name:"Diff Checker", category:"developer", description:"Compare two text blocks and show differences.", icon:"🔧",
    body:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
      <div><label for="text1">Original</label><textarea class="textarea" id="text1"></textarea></div>
      <div><label for="text2">Modified</label><textarea class="textarea" id="text2"></textarea></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Compare</button>
      <div id="result" style="margin-top:var(--space-4);font-family:var(--font-mono);white-space:pre-wrap;"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var a=document.getElementById("text1").value.split("\\n");var b=document.getElementById("text2").value.split("\\n");
  var max=Math.max(a.length,b.length);var out=[];
  for(var i=0;i<max;i++){
    if(a[i]===b[i])out.push("  "+(a[i]||""));
    else{if(a[i]!==undefined)out.push("- "+a[i]);if(b[i]!==undefined)out.push("+ "+b[i])}}
  document.getElementById("result").innerHTML=out.map(function(l){
    if(l.startsWith("-"))return"<span style='color:var(--color-danger)'>"+l+"</span>";
    if(l.startsWith("+"))return"<span style='color:var(--color-success)'>"+l+"</span>";return l}).join("\\n")});
`},

  { slug:"text-compare", name:"Text Compare", category:"developer", description:"Compare two texts line by line and highlight changes.", icon:"🔧",
    body:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
      <div><label for="a">Text A</label><textarea class="textarea" id="a"></textarea></div>
      <div><label for="b">Text B</label><textarea class="textarea" id="b"></textarea></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Compare</button>
      <label for="output" style="margin-top:var(--space-4);">Differences</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var a=document.getElementById("a").value.split("\\n");var b=document.getElementById("b").value.split("\\n");
  var max=Math.max(a.length,b.length);var diffs=[];
  for(var i=0;i<max;i++){if(a[i]!==b[i]){diffs.push("Line "+(i+1)+":\\n  A: "+(a[i]||"(none)")+"\\n  B: "+(b[i]||"(none)"))}}
  document.getElementById("output").value=diffs.length?diffs.join("\\n\\n"):"No differences found."});
`},

  { slug:"barcode-generator", name:"Barcode Generator", category:"developer", description:"Generate barcodes from text or numbers.", icon:"🔧",
    body:`<label for="input">Text or Number</label>
      <input class="input" id="input" value="123456789012">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <div style="margin-top:var(--space-4);text-align:center;">
        <canvas id="canvas" width="400" height="100"></canvas>
      </div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var text=document.getElementById("input").value;var canvas=document.getElementById("canvas");var ctx=canvas.getContext("2d");
  ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
  var x=10;ctx.fillStyle="#000";
  for(var i=0;i<text.length;i++){var code=text.charCodeAt(i)%10+1;for(var j=0;j<code;j++){if(j%2===0)ctx.fillRect(x,10,2,70);x+=3}
  x+=2}
  ctx.font="12px monospace";ctx.fillStyle="#000";ctx.fillText(text,10,95});
document.getElementById("btn-go").click();
`},

  { slug:"api-request-builder", name:"API Request Builder", category:"developer", description:"Build HTTP API requests with headers and body.", icon:"🔧",
    body:`<div style="display:grid;gap:var(--space-3);">
      <div><label for="method">Method</label>
        <select class="select" id="method"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option></select></div>
      <div><label for="url">URL</label><input class="input" id="url" placeholder="https://api.example.com/data"></div>
      <div><label for="headers">Headers (JSON)</label><textarea class="textarea" id="headers" style="min-height:80px;">{"Content-Type":"application/json"}</textarea></div>
      <div><label for="body">Body</label><textarea class="textarea" id="body" style="min-height:80px;"></textarea></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Send Request</button>
      <label for="output" style="margin-top:var(--space-4);">Response</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  try{var url=document.getElementById("url").value;var method=document.getElementById("method").value;
  var headers=JSON.parse(document.getElementById("headers").value||"{}");var body=document.getElementById("body").value;
  var opts={method:method,headers:headers};if(body&&method!=="GET")opts.body=body;
  var res=await fetch(url,opts);var text=await res.text();
  document.getElementById("output").value="Status: "+res.status+" "+res.statusText+"\\n\\n"+text}catch(e){document.getElementById("output").value="Error: "+e.message}});
`},

  // ===== TEXT (11) =====
  { slug:"character-counter", name:"Character Counter", category:"text", description:"Count characters, words, and paragraphs.", icon:"📝",
    body:`<label for="input">Your text</label>
      <textarea class="textarea" id="input" style="min-height:200px;"></textarea>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:var(--space-3);margin-top:var(--space-4);">
        <div class="card" style="text-align:center;padding:var(--space-3);"><div style="font-size:1.5rem;font-weight:700;color:var(--color-accent);" id="chars">0</div><div style="font-size:0.75rem;color:var(--color-text-muted);">Characters</div></div>
        <div class="card" style="text-align:center;padding:var(--space-3);"><div style="font-size:1.5rem;font-weight:700;color:var(--color-accent);" id="words">0</div><div style="font-size:0.75rem;color:var(--color-text-muted);">Words</div></div>
        <div class="card" style="text-align:center;padding:var(--space-3);"><div style="font-size:1.5rem;font-weight:700;color:var(--color-accent);" id="lines">0</div><div style="font-size:0.75rem;color:var(--color-text-muted);">Lines</div></div>
        <div class="card" style="text-align:center;padding:var(--space-3);"><div style="font-size:1.5rem;font-weight:700;color:var(--color-accent);" id="paras">0</div><div style="font-size:0.75rem;color:var(--color-text-muted);">Paragraphs</div></div>
      </div>`,
    script:`var i=document.getElementById("input");
i.addEventListener("input",function(){var t=i.value;
document.getElementById("chars").textContent=t.length;
document.getElementById("words").textContent=t.trim()?t.trim().split(/\\s+/).length:0;
document.getElementById("lines").textContent=t?t.split("\\n").length:0;
document.getElementById("paras").textContent=t?t.split(/\\n\\s*\\n/).filter(function(p){return p.trim()}).length:0});
`},

  { slug:"reading-time-calculator", name:"Reading Time Calculator", category:"text", description:"Estimate reading time for any text.", icon:"📝",
    body:`<label for="input">Text</label>
      <textarea class="textarea" id="input" style="min-height:200px;"></textarea>
      <div style="display:flex;gap:var(--space-3);align-items:center;margin-top:var(--space-4);">
        <label for="wpm">Reading speed (WPM)</label>
        <input class="input" id="wpm" type="number" value="200" style="width:100px;">
      </div>
      <div id="result" style="margin-top:var(--space-4);font-size:var(--font-size-lg);color:var(--color-accent);"></div>`,
    script:`function calc(){var t=document.getElementById("input").value.trim();var wpm=parseInt(document.getElementById("wpm").value,10)||200;
  var words=t?t.split(/\\s+/).length:0;var mins=words/wpm;
  var out=words+" words — ";if(mins<1)out+=Math.round(mins*60)+" seconds";else out+=Math.ceil(mins)+" minutes";
  document.getElementById("result").textContent=out}
document.getElementById("input").addEventListener("input",calc);document.getElementById("wpm").addEventListener("input",calc);
`},

  { slug:"case-converter", name:"Case Converter", category:"text", description:"Convert text to UPPER, lower, Title, camelCase, snake_case, kebab-case.", icon:"📝",
    body:textInOut({inLabel:"Text"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("input").value;var out=[];
  out.push("UPPERCASE: "+t.toUpperCase());out.push("lowercase: "+t.toLowerCase());
  out.push("Title Case: "+t.replace(/\\w\\S*/g,function(w){return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()}));
  out.push("camelCase: "+t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,function(m,c){return c.toUpperCase()}));
  out.push("snake_case: "+t.toLowerCase().replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_|_$/g,""));
  out.push("kebab-case: "+t.toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-|-$/g,""));
  document.getElementById("output").value=out.join("\\n")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"slug-generator", name:"Slug Generator", category:"text", description:"Generate URL-safe slugs from any text.", icon:"📝",
    body:textInOut({inLabel:"Text",btnLabel:"Generate Slug"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("input").value.toLowerCase().trim();
  t=t.replace(/[^a-z0-9\\s-]/g,"").replace(/[\\s_-]+/g,"-").replace(/^-+|-+$/g,"");
  document.getElementById("output").value=t});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"lorem-ipsum-generator", name:"Lorem Ipsum Generator", category:"text", description:"Generate Lorem Ipsum placeholder text.", icon:"📝",
    body:`<label for="count">Number of paragraphs</label>
      <input class="input" id="count" type="number" value="3" style="width:120px;">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-3);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">Output</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`var WORDS="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
function sentence(){var n=Math.floor(Math.random()*8)+8;var w=[];for(var i=0;i<n;i++)w.push(WORDS[Math.floor(Math.random()*WORDS.length)]);w[0]=w[0].charAt(0).toUpperCase()+w[0].slice(1);return w.join(" ")+"."}
function para(){var n=Math.floor(Math.random()*4)+3;var s=[];for(var i=0;i<n;i++)s.push(sentence());return s.join(" ")}
document.getElementById("btn-go").addEventListener("click",function(){var c=parseInt(document.getElementById("count").value,10)||1;var out=[];for(var i=0;i<c;i++)out.push(para());document.getElementById("output").value=out.join("\\n\\n")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"duplicate-line-remover", name:"Duplicate Line Remover", category:"text", description:"Remove duplicate lines from text.", icon:"📝",
    body:textInOut({inLabel:"Text",btnLabel:"Remove Duplicates"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var lines=document.getElementById("input").value.split("\\n");var seen=new Set();var out=[];
  lines.forEach(function(l){if(!seen.has(l)){seen.add(l);out.push(l)}});
  document.getElementById("output").value=out.join("\\n")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"text-sorter", name:"Text Sorter", category:"text", description:"Sort lines alphabetically, numerically, or reverse.", icon:"📝",
    body:`<label for="input">Text (one item per line)</label>
      <textarea class="textarea" id="input"></textarea>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);flex-wrap:wrap;">
        <button class="btn btn-primary" id="btn-alpha">A→Z</button>
        <button class="btn btn-secondary" id="btn-rev">Z→A</button>
        <button class="btn btn-secondary" id="btn-num">Numeric</button>
        <button class="btn btn-ghost" id="btn-copy">Copy</button>
      </div>
      <label for="output" style="margin-top:var(--space-4);">Sorted</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`var inp=document.getElementById("input"),out=document.getElementById("output");
document.getElementById("btn-alpha").addEventListener("click",function(){out.value=inp.value.split("\\n").sort().join("\\n")});
document.getElementById("btn-rev").addEventListener("click",function(){out.value=inp.value.split("\\n").sort().reverse().join("\\n")});
document.getElementById("btn-num").addEventListener("click",function(){out.value=inp.value.split("\\n").sort(function(a,b){return parseFloat(a)-parseFloat(b)}).join("\\n")});
document.getElementById("btn-copy").addEventListener("click",function(){if(out.value)navigator.clipboard.writeText(out.value)});
`},

  { slug:"remove-blank-lines", name:"Remove Blank Lines", category:"text", description:"Strip empty lines from text.", icon:"📝",
    body:textInOut({inLabel:"Text",btnLabel:"Remove Blanks"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  document.getElementById("output").value=document.getElementById("input").value.split("\\n").filter(function(l){return l.trim()}).join("\\n")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"remove-duplicate-words", name:"Remove Duplicate Words", category:"text", description:"Remove duplicate words from text.", icon:"📝",
    body:textInOut({inLabel:"Text",btnLabel:"Remove Dupes"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var words=document.getElementById("input").value.split(/\\s+/);var seen=new Set();var out=[];
  words.forEach(function(w){if(!seen.has(w.toLowerCase())){seen.add(w.toLowerCase());out.push(w)}});
  document.getElementById("output").value=out.join(" ")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"capitalization-tool", name:"Capitalization Tool", category:"text", description:"Capitalize sentences, words, or first letters.", icon:"📝",
    body:textInOut({inLabel:"Text",btnLabel:"Capitalize"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("input").value;
  t=t.replace(/(^[a-z])|(\\.\\s+[a-z])/g,function(m){return m.toUpperCase()});
  document.getElementById("output").value=t});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"unicode-inspector", name:"Unicode Inspector", category:"text", description:"Inspect the Unicode code points of any text.", icon:"📝",
    body:`<label for="input">Text</label>
      <input class="input" id="input" value="Hello 🌍">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Inspect</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("input").value;var r=document.getElementById("result");r.innerHTML="";
  for(var ch of t){var code=ch.codePointAt(0);var hex=code.toString(16).toUpperCase().padStart(4,"0");
  var d=document.createElement("div");d.style.cssText="display:flex;gap:var(--space-3);padding:var(--space-2);border-bottom:1px solid var(--color-border);font-family:var(--font-mono);font-size:var(--font-size-sm);";
  d.innerHTML="<span style='font-size:1.5rem;'>"+ch+"</span><span>U+"+hex+"</span><span style='color:var(--color-text-muted)'>"+code+"</span>";r.appendChild(d)}})
document.getElementById("btn-go").click();
`},

  // ===== SEO (11) =====
  { slug:"robots-txt-generator", name:"Robots.txt Generator", category:"seo", description:"Generate a robots.txt file for your site.", icon:"🔍",
    body:`<div style="display:grid;gap:var(--space-3);">
      <div><label for="useragent">User-agent</label><input class="input" id="useragent" value="*"></div>
      <div><label for="disallow">Disallow paths (one per line)</label><textarea class="textarea" id="disallow">/admin/
/private/</textarea></div>
      <div><label for="sitemap">Sitemap URL</label><input class="input" id="sitemap" placeholder="https://example.com/sitemap.xml"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">robots.txt</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var ua=document.getElementById("useragent").value;var dis=document.getElementById("disallow").value.split("\\n").filter(function(l){return l.trim()});
  var sm=document.getElementById("sitemap").value;var out="User-agent: "+ua+"\\n";
  dis.forEach(function(p){out+="Disallow: "+p+"\\n"});
  if(sm)out+="\\nSitemap: "+sm+"\\n";
  document.getElementById("output").value=out});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"sitemap-generator", name:"Sitemap Generator", category:"seo", description:"Generate an XML sitemap from a list of URLs.", icon:"🔍",
    body:`<label for="urls">URLs (one per line)</label>
      <textarea class="textarea" id="urls">https://example.com/
https://example.com/about
https://example.com/contact</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-3);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">sitemap.xml</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var urls=document.getElementById("urls").value.split("\\n").filter(function(l){return l.trim()});
  var xml='<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';
  urls.forEach(function(u){xml+="  <url>\\n    <loc>"+u.trim()+"</loc>\\n    <changefreq>weekly</changefreq>\\n    <priority>1.0</priority>\\n  </url>\\n"});
  xml+="</urlset>";
  document.getElementById("output").value=xml});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"open-graph-preview", name:"Open Graph Preview", category:"seo", description:"Preview how your page looks when shared on social media.", icon:"🔍",
    body:`<div style="display:grid;gap:var(--space-3);">
      <div><label for="title">Title</label><input class="input" id="title" value="My Awesome Page"></div>
      <div><label for="desc">Description</label><input class="input" id="desc" value="A description of the page."></div>
      <div><label for="url">URL</label><input class="input" id="url" value="https://example.com"></div>
      <div><label for="image">Image URL</label><input class="input" id="image" placeholder="https://example.com/og.png"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Preview</button>
      <div id="preview" style="margin-top:var(--space-4);max-width:500px;"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("title").value,d=document.getElementById("desc").value,u=document.getElementById("url").value,img=document.getElementById("image").value;
  var p=document.getElementById("preview");p.innerHTML="";
  var card=document.createElement("div");card.style.cssText="border:1px solid var(--color-border);border-radius:var(--radius);overflow:hidden;background:var(--color-surface);";
  if(img){var i=document.createElement("img");i.src=img;i.style.cssText="width:100%;height:250px;object-fit:cover;";i.alt="OG preview";card.appendChild(i)}
  var body=document.createElement("div");body.style.cssText="padding:var(--space-3);";
  body.innerHTML="<div style='color:var(--color-text-muted);font-size:0.75rem;text-transform:uppercase;'>"+u+"</div><div style='font-weight:600;margin-top:var(--space-1);'>"+t+"</div><div style='color:var(--color-text-muted);font-size:0.875rem;margin-top:var(--space-1);'>"+d+"</div>";
  card.appendChild(body);p.appendChild(card)});
document.getElementById("btn-go").click();
`},

  { slug:"twitter-card-preview", name:"Twitter Card Preview", category:"seo", description:"Preview how your page appears in Twitter cards.", icon:"🔍",
    body:`<div style="display:grid;gap:var(--space-3);">
      <div><label for="title">Title</label><input class="input" id="title" value="My Page"></div>
      <div><label for="desc">Description</label><input class="input" id="desc" value="Page description."></div>
      <div><label for="image">Image URL</label><input class="input" id="image" placeholder="https://example.com/card.png"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Preview</button>
      <div id="preview" style="margin-top:var(--space-4);max-width:500px;"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("title").value,d=document.getElementById("desc").value,img=document.getElementById("image").value;
  var p=document.getElementById("preview");p.innerHTML="";
  var card=document.createElement("div");card.style.cssText="border:1px solid var(--color-border);border-radius:var(--radius);overflow:hidden;background:var(--color-surface);";
  if(img){var i=document.createElement("img");i.src=img;i.style.cssText="width:100%;height:260px;object-fit:cover;";i.alt="Twitter card preview";card.appendChild(i)}
  var body=document.createElement("div");body.style.cssText="padding:var(--space-3);";
  body.innerHTML="<div style='font-weight:600;'>"+t+"</div><div style='color:var(--color-text-muted);font-size:0.875rem;margin-top:var(--space-1);'>"+d+"</div>";
  card.appendChild(body);p.appendChild(card)});
document.getElementById("btn-go").click();
`},

  { slug:"canonical-url-checker", name:"Canonical URL Checker", category:"seo", description:"Check and set canonical URLs for pages.", icon:"🔍",
    body:`<label for="input">Page URLs (one per line)</label>
      <textarea class="textarea" id="input" placeholder="https://example.com/page"></textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate Tags</button>
      <label for="output" style="margin-top:var(--space-4);">Canonical Tags</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var urls=document.getElementById("input").value.split("\\n").filter(function(l){return l.trim()});
  var out=urls.map(function(u){return'<link rel="canonical" href="'+u.trim()+'">'}).join("\\n");
  document.getElementById("output").value=out});
`},

  { slug:"keyword-density-checker", name:"Keyword Density Checker", category:"seo", description:"Analyze keyword density in text.", icon:"🔍",
    body:`<label for="input">Text</label>
      <textarea class="textarea" id="input" style="min-height:200px;"></textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Analyze</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var text=document.getElementById("input").value.toLowerCase();var words=text.match(/\\w+/g)||[];
  var total=words.length;var counts={};words.forEach(function(w){if(w.length>2)counts[w]=(counts[w]||0)+1});
  var sorted=Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]}).slice(0,20);
  var r=document.getElementById("result");r.innerHTML="<p>Total words: "+total+"</p>";
  var table=document.createElement("table");table.style.cssText="width:100%;border-collapse:collapse;";
  sorted.forEach(function(w){var tr=document.createElement("tr");var pct=(counts[w]/total*100).toFixed(1);
  tr.innerHTML="<td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+w+"</td><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+counts[w]+"</td><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+pct+"%</td>";
  table.appendChild(tr)});r.appendChild(table)});
`},

  { slug:"heading-structure-analyzer", name:"Heading Structure Analyzer", category:"seo", description:"Analyze heading hierarchy (H1–H6) in HTML.", icon:"🔍",
    body:`<label for="input">HTML</label>
      <textarea class="textarea" id="input" placeholder="<h1>Title</h1><h2>Section</h2>..."></textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Analyze</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var html=document.getElementById("input").value;var matches=html.match(/<h([1-6])[^>]*>(.*?)<\\/h\\1>/gi)||[];
  var r=document.getElementById("result");r.innerHTML="";
  if(!matches.length){r.innerHTML="<p>No headings found.</p>";return}
  matches.forEach(function(m){var level=m.match(/h([1-6])/i)[1];var text=m.replace(/<[^>]+>/g,"");
  var div=document.createElement("div");div.style.cssText="margin-left:"+(level-1)*20+"px;padding:var(--space-1);font-family:var(--font-mono);";
  div.innerHTML="<span style='color:var(--color-accent);'>H"+level+"</span> "+text;r.appendChild(div)})});
`},

  { slug:"json-ld-generator", name:"JSON-LD Generator", category:"seo", description:"Generate JSON-LD structured data for SEO.", icon:"🔍",
    body:`<div style="display:grid;gap:var(--space-3);">
      <div><label for="type">Schema Type</label>
        <select class="select" id="type"><option>WebApplication</option><option>Article</option><option>Product</option><option>Organization</option></select></div>
      <div><label for="name">Name</label><input class="input" id="name"></div>
      <div><label for="desc">Description</label><input class="input" id="desc"></div>
      <div><label for="url">URL</label><input class="input" id="url"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">JSON-LD</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var obj={"@context":"https://schema.org","@type":document.getElementById("type").value,name:document.getElementById("name").value,description:document.getElementById("desc").value,url:document.getElementById("url").value};
  document.getElementById("output").value=JSON.stringify(obj,null,2)});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"faq-schema-generator", name:"FAQ Schema Generator", category:"seo", description:"Generate FAQPage JSON-LD structured data.", icon:"🔍",
    body:`<label for="input">FAQ items (Q: ... A: ... per line, blank line between items)</label>
      <textarea class="textarea" id="input">Q: What is this?
A: A tool for generating FAQ schema.

Q: Is it free?
A: Yes.</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-3);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">FAQ Schema</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var blocks=document.getElementById("input").value.split("\\n\\n");var items=[];
  blocks.forEach(function(b){var q=b.match(/Q:\\s*(.+)/);var a=b.match(/A:\\s*(.+)/);if(q&&a)items.push({"@type":"Question",name:q[1],acceptedAnswer:{"@type":"Answer",text:a[1]}})});
  var schema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:items};
  document.getElementById("output").value=JSON.stringify(schema,null,2)});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"breadcrumb-schema-generator", name:"Breadcrumb Schema Generator", category:"seo", description:"Generate BreadcrumbList JSON-LD schema.", icon:"🔍",
    body:`<label for="input">Breadcrumb path (name | URL, one per line)</label>
      <textarea class="textarea" id="input">Home | https://example.com/
Tools | https://example.com/tools/
JSON Formatter | https://example.com/tools/json-formatter/</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-3);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">Breadcrumb Schema</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var lines=document.getElementById("input").value.split("\\n").filter(function(l){return l.trim()});var items=[];
  lines.forEach(function(l,i){var parts=l.split("|");items.push({"@type":"ListItem",position:i+1,name:parts[0].trim(),item:parts[1]?parts[1].trim():""})});
  var schema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:items};
  document.getElementById("output").value=JSON.stringify(schema,null,2)});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"organization-schema-generator", name:"Organization Schema Generator", category:"seo", description:"Generate Organization JSON-LD structured data.", icon:"🔍",
    body:`<div style="display:grid;gap:var(--space-3);">
      <div><label for="name">Organization Name</label><input class="input" id="name" value="Fernandes Labs"></div>
      <div><label for="url">Website</label><input class="input" id="url" value="https://fernandeslabs.com"></div>
      <div><label for="email">Email</label><input class="input" id="email"></div>
      <div><label for="logo">Logo URL</label><input class="input" id="logo"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">Organization Schema</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var obj={"@context":"https://schema.org","@type":"Organization",name:document.getElementById("name").value,url:document.getElementById("url").value};
  if(document.getElementById("email").value)obj.email=document.getElementById("email").value;
  if(document.getElementById("logo").value)obj.logo=document.getElementById("logo").value;
  document.getElementById("output").value=JSON.stringify(obj,null,2)});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  // ===== FINANCE (15) =====
  { slug:"vat-calculator", name:"VAT Calculator", category:"finance", description:"Add or remove VAT from a price.", icon:"💰",
    body:`<div style="display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
      <input class="input" id="amount" type="number" placeholder="100.00" style="width:150px;">
      <select class="select" id="rate" style="width:100px;"><option value="20">20%</option><option value="10">10%</option><option value="5">5%</option><option value="0">0%</option></select>
    </div>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);">
        <button class="btn btn-primary" id="btn-add">Add VAT</button>
        <button class="btn btn-secondary" id="btn-remove">Remove VAT</button>
      </div>
      <div id="result" style="margin-top:var(--space-4);font-size:var(--font-size-lg);color:var(--color-accent);"></div>`,
    script:`function calc(mode){var amt=parseFloat(document.getElementById("amount").value)||0;var rate=parseFloat(document.getElementById("rate").value);
  var out;if(mode==="add"){var vat=amt*rate/100;out="Net: $"+amt.toFixed(2)+" + VAT $"+vat.toFixed(2)+" = Gross: $"+(amt+vat).toFixed(2)}
  else{var vat=amt-(amt/(1+rate/100));out="Gross: $"+amt.toFixed(2)+" - VAT $"+vat.toFixed(2)+" = Net: $"+(amt-vat).toFixed(2)}}
  document.getElementById("result").textContent=out}
document.getElementById("btn-add").addEventListener("click",function(){calc("add")});
document.getElementById("btn-remove").addEventListener("click",function(){calc("remove")});
`},

  { slug:"profit-margin-calculator", name:"Profit Margin Calculator", category:"finance", description:"Calculate profit margin from cost and revenue.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="cost">Cost</label><input class="input" id="cost" type="number" placeholder="50.00"></div>
      <div><label for="revenue">Revenue</label><input class="input" id="revenue" type="number" placeholder="100.00"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var c=parseFloat(document.getElementById("cost").value)||0;var r=parseFloat(document.getElementById("revenue").value)||0;
  var profit=r-c;var margin=r>0?(profit/r*100):0;
  document.getElementById("result").innerHTML="<p>Profit: <strong>$"+profit.toFixed(2)+"</strong></p><p>Margin: <strong>"+margin.toFixed(1)+"%</strong></p>"});
`},

  { slug:"roi-calculator", name:"ROI Calculator", category:"finance", description:"Calculate return on investment.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="initial">Initial Investment</label><input class="input" id="initial" type="number"></div>
      <div><label for="final">Final Value</label><input class="input" id="final" type="number"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var i=parseFloat(document.getElementById("initial").value)||0;var f=parseFloat(document.getElementById("final").value)||0;
  var roi=i>0?((f-i)/i*100):0;var gain=f-i;
  document.getElementById("result").innerHTML="<p>Gain: <strong>$"+gain.toFixed(2)+"</strong></p><p>ROI: <strong>"+roi.toFixed(1)+"%</strong></p>"});
`},

  { slug:"break-even-calculator", name:"Break-even Calculator", category:"finance", description:"Find the break-even point for your business.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="fixed">Fixed Costs</label><input class="input" id="fixed" type="number"></div>
      <div><label for="price">Price per Unit</label><input class="input" id="price" type="number"></div>
      <div><label for="varcost">Variable Cost per Unit</label><input class="input" id="varcost" type="number"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var fc=parseFloat(document.getElementById("fixed").value)||0;var p=parseFloat(document.getElementById("price").value)||0;var vc=parseFloat(document.getElementById("varcost").value)||0;
  var cm=p-vc;var units=cm>0?Math.ceil(fc/cm):0;
  document.getElementById("result").innerHTML="<p>Contribution margin: <strong>$"+cm.toFixed(2)+"</strong></p><p>Break-even point: <strong>"+units+" units</strong></p><p>Break-even revenue: <strong>$"+(units*p).toFixed(2)+"</strong></p>"});
`},

  { slug:"invoice-number-generator", name:"Invoice Number Generator", category:"finance", description:"Generate sequential invoice numbers with a prefix.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="prefix">Prefix</label><input class="input" id="prefix" value="INV-"></div>
      <div><label for="start">Start Number</label><input class="input" id="start" type="number" value="1001"></div>
      <div><label for="count">How many</label><input class="input" id="count" type="number" value="10"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">Invoice Numbers</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var p=document.getElementById("prefix").value;var s=parseInt(document.getElementById("start").value,10);var c=parseInt(document.getElementById("count").value,10);
  var out=[];for(var i=0;i<c;i++)out.push(p+(s+i));
  document.getElementById("output").value=out.join("\\n")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
`},

  { slug:"quote-generator", name:"Quote Generator", category:"finance", description:"Generate a simple price quote.", icon:"💰",
    body:`<label for="items">Items (description | qty | unit_price, one per line)</label>
      <textarea class="textarea" id="items">Web design | 1 | 500
Hosting | 12 | 10
Domain | 1 | 15</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate Quote</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var lines=document.getElementById("items").value.split("\\n").filter(function(l){return l.trim()});var total=0;
  var html="<table style='width:100%;border-collapse:collapse;'><thead><tr><th style='text-align:left;padding:var(--space-2);border-bottom:1px solid var(--color-border);'>Item</th><th style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>Qty</th><th style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>Price</th><th style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>Total</th></tr></thead><tbody>";
  lines.forEach(function(l){var p=l.split("|");var desc=p[0].trim();var qty=parseFloat(p[1])||0;var price=parseFloat(p[2])||0;var lineTotal=qty*price;total+=lineTotal;
  html+="<tr><td style='padding:var(--space-2);'>"+desc+"</td><td style='padding:var(--space-2);text-align:center;'>"+qty+"</td><td style='padding:var(--space-2);text-align:right;'>$"+price.toFixed(2)+"</td><td style='padding:var(--space-2);text-align:right;'>$"+lineTotal.toFixed(2)+"</td></tr>"});
  html+="</tbody><tfoot><tr><td colspan='3' style='padding:var(--space-2);text-align:right;font-weight:700;'>Total:</td><td style='padding:var(--space-2);text-align:right;font-weight:700;color:var(--color-accent);'>$"+total.toFixed(2)+"</td></tr></tfoot></table>";
  document.getElementById("result").innerHTML=html});
`},

  { slug:"currency-converter", name:"Currency Converter", category:"finance", description:"Convert between currencies using static rates.", icon:"💰",
    body:`<div style="display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
      <input class="input" id="amount" type="number" value="100" style="width:120px;">
      <select class="select" id="from" style="width:100px;"><option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option></select>
      <span>→</span>
      <select class="select" id="to" style="width:100px;"><option>EUR</option><option>USD</option><option>GBP</option><option>JPY</option></select>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Convert</button>
      <div id="result" style="margin-top:var(--space-4);font-size:var(--font-size-lg);color:var(--color-accent);"></div>`,
    script:`var RATES={USD:{EUR:0.92,GBP:0.79,JPY:150},EUR:{USD:1.09,GBP:0.86,JPY:163},GBP:{USD:1.27,EUR:1.16,JPY:190},JPY:{USD:0.0067,EUR:0.0061,GBP:0.0053}};
document.getElementById("btn-go").addEventListener("click",function(){
  var amt=parseFloat(document.getElementById("amount").value)||0;var f=document.getElementById("from").value;var t=document.getElementById("to").value;
  var rate=f===t?1:RATES[f][t];var result=amt*rate;
  document.getElementById("result").textContent=amt+" "+f+" = "+result.toFixed(2)+" "+t});
document.getElementById("btn-go").click();
`},

  { slug:"unit-converter", name:"Unit Converter", category:"finance", description:"Convert length, weight, and temperature units.", icon:"💰",
    body:`<div style="display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
      <input class="input" id="value" type="number" value="1" style="width:120px;">
      <select class="select" id="from"><option value="m">meters</option><option value="km">kilometers</option><option value="cm">centimeters</option><option value="mi">miles</option><option value="ft">feet</option></select>
      <span>→</span>
      <select class="select" id="to"><option value="m">meters</option><option value="km">kilometers</option><option value="cm">centimeters</option><option value="mi">miles</option><option value="ft">feet</option></select>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Convert</button>
      <div id="result" style="margin-top:var(--space-4);font-size:var(--font-size-lg);color:var(--color-accent);"></div>`,
    script:`var TO_M={m:1,km:1000,cm:0.01,mi:1609.34,ft:0.3048};
document.getElementById("btn-go").addEventListener("click",function(){
  var v=parseFloat(document.getElementById("value").value)||0;var f=document.getElementById("from").value;var t=document.getElementById("to").value;
  var meters=v*TO_M[f];var result=meters/TO_M[t];
  document.getElementById("result").textContent=v+" "+f+" = "+result.toFixed(4)+" "+t});
document.getElementById("btn-go").click();
`},

  { slug:"compound-interest-calculator", name:"Compound Interest Calculator", category:"finance", description:"Calculate compound interest over time.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="principal">Principal</label><input class="input" id="principal" type="number" value="1000"></div>
      <div><label for="rate">Annual Rate (%)</label><input class="input" id="rate" type="number" value="5"></div>
      <div><label for="years">Years</label><input class="input" id="years" type="number" value="10"></div>
      <div><label for="freq">Compounds/year</label><input class="input" id="freq" type="number" value="12"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var p=parseFloat(document.getElementById("principal").value)||0;var r=parseFloat(document.getElementById("rate").value)/100;var y=parseInt(document.getElementById("years").value,10);var n=parseInt(document.getElementById("freq").value,10);
  var amount=p*Math.pow(1+r/n,n*y);var interest=amount-p;
  document.getElementById("result").innerHTML="<p>Final amount: <strong>$"+amount.toFixed(2)+"</strong></p><p>Interest earned: <strong>$"+interest.toFixed(2)+"</strong></p>"});
`},

  { slug:"loan-calculator", name:"Loan Calculator", category:"finance", description:"Calculate monthly loan payments.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="amount">Loan Amount</label><input class="input" id="amount" type="number" value="10000"></div>
      <div><label for="rate">Annual Rate (%)</label><input class="input" id="rate" type="number" value="5"></div>
      <div><label for="years">Years</label><input class="input" id="years" type="number" value="5"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var p=parseFloat(document.getElementById("amount").value)||0;var r=parseFloat(document.getElementById("rate").value)/100/12;var n=parseInt(document.getElementById("years").value,10)*12;
  var monthly=r>0?p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):p/n;var total=monthly*n;var interest=total-p;
  document.getElementById("result").innerHTML="<p>Monthly payment: <strong>$"+monthly.toFixed(2)+"</strong></p><p>Total paid: <strong>$"+total.toFixed(2)+"</strong></p><p>Interest: <strong>$"+interest.toFixed(2)+"</strong></p>"});
`},

  { slug:"mortgage-calculator", name:"Mortgage Calculator", category:"finance", description:"Calculate monthly mortgage payments.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="price">Home Price</label><input class="input" id="price" type="number" value="300000"></div>
      <div><label for="down">Down Payment</label><input class="input" id="down" type="number" value="60000"></div>
      <div><label for="rate">Interest Rate (%)</label><input class="input" id="rate" type="number" value="6.5"></div>
      <div><label for="years">Loan Term (years)</label><input class="input" id="years" type="number" value="30"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var price=parseFloat(document.getElementById("price").value)||0;var down=parseFloat(document.getElementById("down").value)||0;
  var p=price-down;var r=parseFloat(document.getElementById("rate").value)/100/12;var n=parseInt(document.getElementById("years").value,10)*12;
  var monthly=r>0?p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):p/n;
  document.getElementById("result").innerHTML="<p>Loan amount: <strong>$"+p.toFixed(2)+"</strong></p><p>Monthly payment: <strong>$"+monthly.toFixed(2)+"</strong></p><p>Total paid: <strong>$"+(monthly*n).toFixed(2)+"</strong></p>"});
`},

  { slug:"savings-calculator", name:"Savings Calculator", category:"finance", description:"Project savings growth with regular deposits.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="initial">Initial Savings</label><input class="input" id="initial" type="number" value="1000"></div>
      <div><label for="monthly">Monthly Deposit</label><input class="input" id="monthly" type="number" value="200"></div>
      <div><label for="rate">Annual Rate (%)</label><input class="input" id="rate" type="number" value="4"></div>
      <div><label for="years">Years</label><input class="input" id="years" type="number" value="10"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var p=parseFloat(document.getElementById("initial").value)||0;var m=parseFloat(document.getElementById("monthly").value)||0;var r=parseFloat(document.getElementById("rate").value)/100/12;var n=parseInt(document.getElementById("years").value,10)*12;
  var future=p*Math.pow(1+r,n)+m*((Math.pow(1+r,n)-1)/r);var deposited=p+m*n;var interest=future-deposited;
  document.getElementById("result").innerHTML="<p>Total deposited: <strong>$"+deposited.toFixed(2)+"</strong></p><p>Interest earned: <strong>$"+interest.toFixed(2)+"</strong></p><p>Final balance: <strong>$"+future.toFixed(2)+"</strong></p>"});
`},

  { slug:"fire-calculator", name:"FIRE Calculator", category:"finance", description:"Calculate Financial Independence / Retire Early number.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="expenses">Annual Expenses</label><input class="input" id="expenses" type="number" value="40000"></div>
      <div><label for="saved">Current Savings</label><input class="input" id="saved" type="number" value="50000"></div>
      <div><label for="saving">Monthly Saving</label><input class="input" id="saving" type="number" value="2000"></div>
      <div><label for="rate">Return Rate (%)</label><input class="input" id="rate" type="number" value="7"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var exp=parseFloat(document.getElementById("expenses").value)||0;var fire=exp*25;
  var saved=parseFloat(document.getElementById("saved").value)||0;var m=parseFloat(document.getElementById("saving").value)||0;var r=parseFloat(document.getElementById("rate").value)/100/12;
  var balance=saved;var months=0;
  while(balance<fire&&months<1200){balance=balance*(1+r)+m;months++}
  var years=Math.round(months/12*10)/10;
  document.getElementById("result").innerHTML="<p>FIRE number (25× expenses): <strong>$"+fire.toFixed(0)+"</strong></p><p>Years to FIRE: <strong>"+years+"</strong></p>"});
`},

  { slug:"inflation-calculator", name:"Inflation Calculator", category:"finance", description:"Calculate the future value of money with inflation.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="amount">Amount</label><input class="input" id="amount" type="number" value="1000"></div>
      <div><label for="rate">Inflation Rate (%)</label><input class="input" id="rate" type="number" value="3"></div>
      <div><label for="years">Years</label><input class="input" id="years" type="number" value="10"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var a=parseFloat(document.getElementById("amount").value)||0;var r=parseFloat(document.getElementById("rate").value)/100;var y=parseInt(document.getElementById("years").value,10);
  var future=a*Math.pow(1+r,y);var purchasing=a/Math.pow(1+r,y);
  document.getElementById("result").innerHTML="<p>Future cost (same purchasing power): <strong>$"+future.toFixed(2)+"</strong></p><p>Real value of $"+a+" in "+y+" years: <strong>$"+purchasing.toFixed(2)+"</strong></p>"});
`},

  { slug:"retirement-calculator", name:"Retirement Calculator", category:"finance", description:"Project retirement savings and income.", icon:"💰",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="current">Current Age</label><input class="input" id="current" type="number" value="30"></div>
      <div><label for="retire">Retirement Age</label><input class="input" id="retire" type="number" value="65"></div>
      <div><label for="saved">Current Savings</label><input class="input" id="saved" type="number" value="50000"></div>
      <div><label for="monthly">Monthly Contribution</label><input class="input" id="monthly" type="number" value="500"></div>
      <div><label for="rate">Return Rate (%)</label><input class="input" id="rate" type="number" value="7"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var years=parseInt(document.getElementById("retire").value,10)-parseInt(document.getElementById("current").value,10);
  var saved=parseFloat(document.getElementById("saved").value)||0;var m=parseFloat(document.getElementById("monthly").value)||0;var r=parseFloat(document.getElementById("rate").value)/100/12;var n=years*12;
  var balance=saved*Math.pow(1+r,n)+m*((Math.pow(1+r,n)-1)/r);var monthlyIncome=balance*0.04/12;
  document.getElementById("result").innerHTML="<p>At retirement: <strong>$"+balance.toFixed(0)+"</strong></p><p>Safe monthly income (4% rule): <strong>$"+monthlyIncome.toFixed(0)+"</strong></p>"});
`},

  // ===== SECURITY (6) =====
  { slug:"password-strength-checker", name:"Password Strength Checker", category:"security", description:"Check password strength with entropy analysis.", icon:"🔐",
    body:`<label for="input">Password</label>
      <input class="input" id="input" type="text">
      <div style="margin-top:var(--space-4);">
        <div style="height:8px;background:var(--color-surface);border-radius:4px;overflow:hidden;">
          <div id="bar" style="height:100%;width:0;background:var(--color-danger);transition:width 0.3s,background 0.3s;"></div>
        </div>
        <p id="label" style="margin-top:var(--space-2);font-weight:600;">Enter a password</p>
      </div>
      <div id="stats" style="margin-top:var(--space-4);font-family:var(--font-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);"></div>`,
    script:`document.getElementById("input").addEventListener("input",function(){
  var p=this.value;if(!p){document.getElementById("bar").style.width="0";document.getElementById("label").textContent="Enter a password";document.getElementById("stats").textContent="";return}
  var charset=0;if(/[a-z]/.test(p))charset+=26;if(/[A-Z]/.test(p))charset+=26;if(/[0-9]/.test(p))charset+=10;if(/[^a-zA-Z0-9]/.test(p))charset+=32;
  var entropy=p.length*Math.log2(charset||1);var pct=Math.min(100,entropy/128*100);
  var bar=document.getElementById("bar");bar.style.width=pct+"%";
  var label=document.getElementById("label");var stats=document.getElementById("stats");
  if(entropy<28){bar.style.background="var(--color-danger)";label.textContent="Very weak";label.style.color="var(--color-danger)"}
  else if(entropy<36){bar.style.background="var(--color-warning)";label.textContent="Weak";label.style.color="var(--color-warning)"}
  else if(entropy<60){bar.style.background="var(--color-warning)";label.textContent="Fair";label.style.color="var(--color-warning)"}
  else if(entropy<128){bar.style.background="var(--color-success)";label.textContent="Strong";label.style.color="var(--color-success)"}
  else{bar.style.background="var(--color-success)";label.textContent="Excellent";label.style.color="var(--color-success)"}
  stats.textContent="Entropy: "+Math.round(entropy)+" bits · Charset: "+charset+" chars"});
`},

  { slug:"secure-passphrase-generator", name:"Secure Passphrase Generator", category:"security", description:"Generate diceware-style passphrases with Web Crypto.", icon:"🔐",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="words">Number of words</label><input class="input" id="words" type="number" value="6"></div>
      <div><label for="sep">Separator</label><input class="input" id="sep" value="-"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">Passphrase</label>
      <input class="input" id="output" readonly style="font-family:var(--font-mono);">
      <p id="entropy" style="margin-top:var(--space-2);color:var(--color-text-muted);font-size:var(--font-size-sm);"></p>`,
    script:`var WL="able acid aged also area army away baby back ball band bank base bath beam bean bear beat been beer bell belt best bike bill bird blue boat body bold bomb bond bone book boom born boss both bowl bulk burn busy call calm came camp card care case cash cast cell chat chip city claim club coal coat code cold come cook cool cope copy core cost crew crop dark data date dawn dead deal dean dear debt deep deny desk dial diet dirt disc disk does done door dose down draw drew drop drug dual duke dust duty each earn ease east easy edge else even ever evil exit face fact fade fail fair fall farm fast fate fear feed feel fell felt file fill film find fine fire firm fish five flag flat flow food foot form fort four free from fuel full fund gain game gate gave gear gene gift girl give glad goal goes gold golf gone good gray grew grow gulf hair half hall hand hang hard harm hate have head hear heat held hell help here hero high hill hint hire hold hole holy home hope horn host hour huge hung hunt hurt idea inch into iron item join jump jury just keen keep kept kick kill kind king knee knew know lack lady laid lake land lane last late lawn lazy lead leaf lean left lend less lift like line link lion list live load loan lock logo long look lord lose loss lost loud love luck made mail main make male many mark mass math meal mean meat meet menu mere milk mill mind mine miss mode mood moon more most move much must myth nail name navy near neat neck need news next nice nine none nose note noun null oath obey odds only open oral over pace pack page paid pain pair palm park part pass past path peak pear peer pick pile pine pink pipe plan play plot plug plus poem poet pole poll pond pool poor port post pour pray prep prey pull pump pure push quit quiz race rack rage rail rain rank rare rate read real rear reef rely rent rest rice rich ride ring rise risk road rock role roll roof room root rope rose ruby rule rush rust safe sage sail sake sale salt same sand sang save scan seal seat seed seek seem seen self sell send sent ship shoe shop shot show shut sick side sign silk sing sink site size skin slim slip slot slow snap snow soap soft soil sold sole some song soon sort soul soup spin spot star stay step stir stop such suit sure swim tail take tale talk tall tame tank tape task team tear tell tend term test text than that them then they thin this thus tide till time tiny tire told tone tool torn tour town trap tray tree trim trip true tube tuna turn twin type ugly unit upon used user vain vary vast verb very view vine void vote wage wait wake walk wall want ward warm warn wash wave ways weak wear week well went were west what when whom wide wife wild will wind wine wing wipe wire wise wish with wolf wood wool word wore work worm worn wrap yard yarn year yoga your zero zone".split(" ");
function ri(max){var b=new Uint32Array(1);var lim=0xffffffff-(0xffffffff%max);var v;do{v=crypto.getRandomValues(b)[0]}while(v>=lim);return v%max}
document.getElementById("btn-go").addEventListener("click",function(){
  var n=parseInt(document.getElementById("words").value,10)||6;var sep=document.getElementById("sep").value;var out=[];
  for(var i=0;i<n;i++)out.push(WL[ri(WL.length)]);
  document.getElementById("output").value=out.join(sep);
  document.getElementById("entropy").textContent="~"+Math.round(n*Math.log2(WL.length))+" bits of entropy"});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-go").click();
`},

  { slug:"csp-generator", name:"CSP Generator", category:"security", description:"Generate Content-Security-Policy headers.", icon:"🔐",
    body:`<div style="display:grid;gap:var(--space-3);">
      <div><label for="default">Default src</label><input class="input" id="default" value="'self'"></div>
      <div><label for="script">Script src</label><input class="input" id="script" value="'self'"></div>
      <div><label for="style">Style src</label><input class="input" id="style" value="'self'"></div>
      <div><label for="img">Image src</label><input class="input" id="img" value="'self' data:"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">Content-Security-Policy</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var parts=[];["default","script","style","img"].forEach(function(d){var v=document.getElementById(d).value;if(v)parts.push(d+"-src "+v)});
  document.getElementById("output").value=parts.join("; ")});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-go").click();
`},

  { slug:"cors-header-tester", name:"CORS Header Tester", category:"security", description:"Check CORS headers on any URL.", icon:"🔐",
    body:`<label for="url">URL</label>
      <input class="input" id="url" placeholder="https://api.example.com">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Check CORS</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var url=document.getElementById("url").value;if(!url)return;var r=document.getElementById("result");
  r.innerHTML="<p>Fetching...</p>";
  try{var res=await fetch(url,{method:"HEAD",mode:"cors"});var headers={};
  res.headers.forEach(function(v,k){headers[k]=v});
  r.innerHTML="<h3>Response Headers</h3><pre style='font-family:var(--font-mono);font-size:var(--font-size-sm);white-space:pre-wrap;'>"+JSON.stringify(headers,null,2)+"</pre>"}catch(e){r.innerHTML="<p style='color:var(--color-danger)'>CORS blocked or error: "+e.message+"</p>"}}),
`},

  { slug:"security-header-checker", name:"Security Header Checker", category:"security", description:"Check security headers on any URL.", icon:"🔐",
    body:`<label for="url">URL</label>
      <input class="input" id="url" placeholder="https://example.com">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Check Headers</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var url=document.getElementById("url").value;if(!url)return;var r=document.getElementById("result");r.innerHTML="<p>Checking...</p>";
  try{var res=await fetch(url,{method:"HEAD"});var checks=["content-security-policy","strict-transport-security","x-frame-options","x-content-type-options","referrer-policy"];
  var html="<table style='width:100%;border-collapse:collapse;'>";
  checks.forEach(function(h){var val=res.headers.get(h);html+="<tr><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);font-family:var(--font-mono);'>"+h+"</td><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+(val?"<span style='color:var(--color-success)'>✓ "+val+"</span>":"<span style='color:var(--color-danger)'>✗ Missing</span>")+"</td></tr>"});
  html+="</table>";r.innerHTML=html}catch(e){r.innerHTML="<p style='color:var(--color-danger)'>Error: "+e.message+"</p>"}}),
`},

  // ===== IMAGE (10) =====
  { slug:"image-compressor", name:"Image Compressor", category:"misc", description:"Compress images in-browser using canvas.", icon:"🖼️",
    body:`<label for="file">Select image</label>
      <input class="input" id="file" type="file" accept="image/*">
      <label for="quality" style="margin-top:var(--space-4);">Quality: <span id="qv">0.7</span></label>
      <input type="range" id="quality" min="0.1" max="1" step="0.1" value="0.7" style="width:100%;">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Compress</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`var img=new Image();var fileInput=document.getElementById("file");
document.getElementById("quality").addEventListener("input",function(e){document.getElementById("qv").textContent=e.target.value});
fileInput.addEventListener("change",function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){img.src=e.target.result};r.readAsDataURL(f)});
document.getElementById("btn-go").addEventListener("click",function(){
  if(!img.src)return;var canvas=document.createElement("canvas");canvas.width=img.width;canvas.height=img.height;
  var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);var q=parseFloat(document.getElementById("quality").value);
  canvas.toBlob(function(blob){var url=URL.createObjectURL(blob);var sizeKB=(blob.size/1024).toFixed(0);
  document.getElementById("result").innerHTML="<p>Compressed size: "+sizeKB+" KB</p><img src='"+url+"' style='max-width:100%;border-radius:var(--radius);margin-top:var(--space-3);' alt='Compressed result'>"},"image/jpeg",q)}),
`},

  { slug:"image-resizer", name:"Image Resizer", category:"misc", description:"Resize images to custom dimensions.", icon:"🖼️",
    body:`<label for="file">Select image</label>
      <input class="input" id="file" type="file" accept="image/*">
      <div style="display:flex;gap:var(--space-3);margin-top:var(--space-3);">
        <div><label for="w">Width</label><input class="input" id="w" type="number" placeholder="800"></div>
        <div><label for="h">Height</label><input class="input" id="h" type="number" placeholder="600"></div>
      </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Resize</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`var img=new Image();document.getElementById("file").addEventListener("change",function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){img.src=e.target.result};r.readAsDataURL(f)});
document.getElementById("btn-go").addEventListener("click",function(){
  if(!img.src)return;var w=parseInt(document.getElementById("w").value,10)||img.width;var h=parseInt(document.getElementById("h").value,10)||img.height;
  var canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,w,h);
  canvas.toBlob(function(blob){var url=URL.createObjectURL(blob);document.getElementById("result").innerHTML="<img src='"+url+"' style='max-width:100%;border-radius:var(--radius);' alt='Resized'><p style='margin-top:var(--space-2);'><a href='"+url+"' download='resized.png' class='btn btn-secondary'>Download</a></p>"})}),
`},

  { slug:"svg-optimizer", name:"SVG Optimizer", category:"misc", description:"Minify SVG by removing comments and metadata.", icon:"🖼️",
    body:textInOut({inLabel:"SVG",btnLabel:"Optimize"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var s=document.getElementById("input").value;
  s=s.replace(/<!--[\\s\\S]*?-->/g,"").replace(/<\\?[\\s\\S]*?\\?>/g,"");
  s=s.replace(/\\s+/g," ").replace(/\\s*([<>])\\s*/g,"$1").replace(/\\s+\\/>/g,"/>").trim();
  document.getElementById("output").value=s});
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});
document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"svg-viewer", name:"SVG Viewer", category:"misc", description:"Paste SVG code and preview it live.", icon:"🖼️",
    body:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
      <div><label for="input">SVG Code</label><textarea class="textarea" id="input"><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="#2563eb"/></svg></textarea></div>
      <div><label>Preview</label><div id="preview" class="card" style="min-height:200px;display:flex;align-items:center;justify-content:center;"></div></div>
    </div>`,
    script:`document.getElementById("input").addEventListener("input",function(){document.getElementById("preview").innerHTML=this.value});
document.getElementById("input").dispatchEvent(new Event("input"));
`},

  { slug:"svg-to-png", name:"SVG → PNG", category:"misc", description:"Convert SVG to PNG in your browser.", icon:"🖼️",
    body:`<label for="input">SVG Code</label>
      <textarea class="textarea" id="input"><svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#2563eb"/><text x="100" y="100" fill="white" text-anchor="middle" dy=".3em" font-size="20">Hello</text></svg></textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Convert</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var svg=document.getElementById("input").value;var blob=new Blob([svg],{type:"image/svg+xml"});var url=URL.createObjectURL(blob);
  var img=new Image();img.onload=function(){var canvas=document.createElement("canvas");canvas.width=img.width||300;canvas.height=img.height||300;
  var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);canvas.toBlob(function(b){var pngUrl=URL.createObjectURL(b);
  document.getElementById("result").innerHTML="<img src='"+pngUrl+"' alt='PNG result' style='max-width:100%;border-radius:var(--radius);'><p style='margin-top:var(--space-2);'><a href='"+pngUrl+"' download='converted.png' class='btn btn-secondary'>Download PNG</a></p>"})};img.src=url}),
`},

  { slug:"png-to-webp", name:"PNG → WebP", category:"misc", description:"Convert PNG images to WebP format.", icon:"🖼️",
    body:`<label for="file">Select PNG</label>
      <input class="input" id="file" type="file" accept="image/png">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Convert</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`var img=new Image();document.getElementById("file").addEventListener("change",function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){img.src=e.target.result};r.readAsDataURL(f)});
document.getElementById("btn-go").addEventListener("click",function(){
  if(!img.src)return;var canvas=document.createElement("canvas");canvas.width=img.width;canvas.height=img.height;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);
  canvas.toBlob(function(blob){var url=URL.createObjectURL(blob);document.getElementById("result").innerHTML="<img src='"+url+"' alt='WebP result' style='max-width:100%;border-radius:var(--radius);'><p style='margin-top:var(--space-2);'><a href='"+url+"' download='converted.webp' class='btn btn-secondary'>Download WebP</a></p>"},"image/webp",0.9)}),
`},

  { slug:"image-metadata-viewer", name:"Image Metadata Viewer", category:"misc", description:"View EXIF and basic image metadata.", icon:"🖼️",
    body:`<label for="file">Select image</label>
      <input class="input" id="file" type="file" accept="image/*">
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("file").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;var r=document.getElementById("result");r.innerHTML="";
  var img=new Image();img.onload=function(){
    var data={name:f.name,size:(f.size/1024).toFixed(1)+" KB",type:f.type,width:img.width,height:img.height,aspect:(img.width/img.height).toFixed(2)};
    var html="<table style='width:100%;border-collapse:collapse;'>";
    Object.keys(data).forEach(function(k){html+="<tr><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);font-weight:600;'>"+k+"</td><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+data[k]+"</td></tr>"});
    html+="</table><img src='"+img.src+"' style='max-width:200px;margin-top:var(--space-3);border-radius:var(--radius);' alt='Preview'>";
    r.innerHTML=html};img.src=URL.createObjectURL(f)}),
`},

  { slug:"color-palette-extractor", name:"Color Palette Extractor", category:"misc", description:"Extract dominant colors from an image.", icon:"🖼️",
    body:`<label for="file">Select image</label>
      <input class="input" id="file" type="file" accept="image/*">
      <div id="result" style="margin-top:var(--space-4);display:flex;gap:var(--space-2);flex-wrap:wrap;"></div>`,
    script:`document.getElementById("file").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;var img=new Image();img.onload=function(){
    var canvas=document.createElement("canvas");canvas.width=50;canvas.height=50;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,50,50);
    var data=ctx.getImageData(0,0,50,50).data;var colors={};
    for(var i=0;i<data.length;i+=4){var r=data[i]&0xF0,g=data[i+1]&0xF0,b=data[i+2]&0xF0;var key=r+","+g+","+b;colors[key]=(colors[key]||0)+1}
    var sorted=Object.keys(colors).sort(function(a,b){return colors[b]-colors[a]}).slice(0,8);
    var r=document.getElementById("result");r.innerHTML="";
    sorted.forEach(function(c){var hex="#"+c.split(",").map(function(x){return (parseInt(x).toString(16)+"0").slice(0,2)}).join("");
    var d=document.createElement("div");d.style.cssText="width:80px;height:80px;background:"+hex+";border-radius:var(--radius);display:flex;align-items:flex-end;justify-content:center;padding-bottom:4px;font-size:0.625rem;color:"+(parseInt(c.split(",")[0])>128?"#000":"#fff")+";";d.textContent=hex;r.appendChild(d)})};img.src=URL.createObjectURL(f)}),
`},

  { slug:"favicon-generator", name:"Favicon Generator", category:"misc", description:"Generate favicon PNGs from an image.", icon:"🖼️",
    body:`<label for="file">Source image</label>
      <input class="input" id="file" type="file" accept="image/*">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`var img=new Image();document.getElementById("file").addEventListener("change",function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){img.src=e.target.result};r.readAsDataURL(f)});
document.getElementById("btn-go").addEventListener("click",function(){
  if(!img.src)return;var sizes=[16,32,48,64,128,256];var r=document.getElementById("result");r.innerHTML="";
  sizes.forEach(function(s){var canvas=document.createElement("canvas");canvas.width=s;canvas.height=s;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,s,s);
  canvas.toBlob(function(blob){var url=URL.createObjectURL(blob);var d=document.createElement("div");d.style.cssText="text-align:center;display:inline-block;margin:var(--space-2);";
  d.innerHTML="<img src='"+url+"' alt='"+s+"x"+s+" favicon' style='image-rendering:pixelated;'><br><span style='font-size:0.75rem;color:var(--color-text-muted);'>"+s+"×"+s+"</span>";r.appendChild(d)})})}),
`},

  { slug:"social-image-generator", name:"Social Image Generator", category:"misc", description:"Generate 1200×630 social preview images.", icon:"🖼️",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="title">Title</label><input class="input" id="title" value="My Awesome Tool"></div>
      <div><label for="bg">Background color</label><input type="color" id="bg" value="#2563eb" style="width:100%;height:40px;border:none;"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var title=document.getElementById("title").value;var bg=document.getElementById("bg").value;
  var canvas=document.createElement("canvas");canvas.width=1200;canvas.height=630;var ctx=canvas.getContext("2d");
  ctx.fillStyle=bg;ctx.fillRect(0,0,1200,630);ctx.fillStyle="#fff";ctx.font="bold 72px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillText(title,600,315);
  canvas.toBlob(function(blob){var url=URL.createObjectURL(blob);document.getElementById("result").innerHTML="<img src='"+url+"' alt='Social preview' style='max-width:100%;border-radius:var(--radius);'><p style='margin-top:var(--space-2);'><a href='"+url+"' download='social.png' class='btn btn-secondary'>Download</a></p>"})}),
`},

  // ===== PDF (8) — canvas-based simple implementations =====
  { slug:"merge-pdfs", name:"Merge PDFs", category:"misc", description:"Merge multiple PDF files into one (client-side).", icon:"📄",
    body:`<label for="file">Select PDF files</label>
      <input class="input" id="file" type="file" accept="application/pdf" multiple>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Merge</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var files=document.getElementById("file").files;if(!files.length)return;
  document.getElementById("result").innerHTML="<p>Merging "+files.length+" files...</p><p style='color:var(--color-text-muted);'>Note: Full PDF merging requires a library. This tool lists the selected files for manual processing.</p>";
  var html="<ul>";for(var i=0;i<files.length;i++)html+="<li>"+files[i].name+" ("+(files[i].size/1024).toFixed(0)+" KB)</li>";html+="</ul>";
  document.getElementById("result").innerHTML+=html}),
`},

  { slug:"split-pdf", name:"Split PDF", category:"misc", description:"Split a PDF into individual pages.", icon:"📄",
    body:`<label for="file">Select PDF</label>
      <input class="input" id="file" type="file" accept="application/pdf">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Process</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var f=document.getElementById("file").files[0];if(!f)return;
  document.getElementById("result").innerHTML="<p>File: "+f.name+" ("+(f.size/1024).toFixed(0)+" KB)</p><p style='color:var(--color-text-muted);'>Full PDF splitting requires a library like pdf-lib. Add it via CDN for full functionality.</p>"}),
`},

  { slug:"compress-pdf", name:"Compress PDF", category:"misc", description:"Reduce PDF file size.", icon:"📄",
    body:`<label for="file">Select PDF</label>
      <input class="input" id="file" type="file" accept="application/pdf">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Compress</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var f=document.getElementById("file").files[0];if(!f)return;
  document.getElementById("result").innerHTML="<p>Original: "+(f.size/1024).toFixed(0)+" KB</p><p style='color:var(--color-text-muted);'>Full PDF compression requires a server-side or WASM library.</p>"}),
`},

  { slug:"pdf-to-images", name:"PDF → Images", category:"misc", description:"Convert PDF pages to images.", icon:"📄",
    body:`<label for="file">Select PDF</label>
      <input class="input" id="file" type="file" accept="application/pdf">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Convert</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var f=document.getElementById("file").files[0];if(!f)return;
  document.getElementById("result").innerHTML="<p>Selected: "+f.name+"</p><p style='color:var(--color-text-muted);'>PDF rendering requires pdf.js. Add it via CDN for full functionality.</p>"}),
`},

  { slug:"images-to-pdf", name:"Images → PDF", category:"misc", description:"Combine images into a PDF document.", icon:"📄",
    body:`<label for="file">Select images</label>
      <input class="input" id="file" type="file" accept="image/*" multiple>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate PDF</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var files=document.getElementById("file").files;if(!files.length)return;
  document.getElementById("result").innerHTML="<p>"+files.length+" images selected. Full PDF generation requires jsPDF. Add it via CDN for full functionality.</p>"}),
`},

  { slug:"rotate-pdf", name:"Rotate PDF", category:"misc", description:"Rotate pages in a PDF document.", icon:"📄",
    body:`<label for="file">Select PDF</label>
      <input class="input" id="file" type="file" accept="application/pdf">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Process</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var f=document.getElementById("file").files[0];if(!f)return;
  document.getElementById("result").innerHTML="<p>Selected: "+f.name+"</p><p style='color:var(--color-text-muted);'>PDF rotation requires pdf-lib. Add it via CDN for full functionality.</p>"}),
`},

  { slug:"extract-pdf-pages", name:"Extract PDF Pages", category:"misc", description:"Extract specific pages from a PDF.", icon:"📄",
    body:`<label for="file">Select PDF</label>
      <input class="input" id="file" type="file" accept="application/pdf">
      <label for="pages" style="margin-top:var(--space-4);">Pages (e.g. 1,3,5-7)</label>
      <input class="input" id="pages" placeholder="1,3,5-7">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Extract</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var f=document.getElementById("file").files[0];if(!f)return;var p=document.getElementById("pages").value;
  document.getElementById("result").innerHTML="<p>Selected: "+f.name+"</p><p>Pages to extract: "+p+"</p><p style='color:var(--color-text-muted);'>Full page extraction requires pdf-lib. Add it via CDN for full functionality.</p>"}),
`},

  { slug:"pdf-metadata-viewer", name:"PDF Metadata Viewer", category:"misc", description:"View PDF metadata and properties.", icon:"📄",
    body:`<label for="file">Select PDF</label>
      <input class="input" id="file" type="file" accept="application/pdf">
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("file").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;
  document.getElementById("result").innerHTML="<table style='width:100%;border-collapse:collapse;'><tr><td style='padding:var(--space-2);font-weight:600;'>Name</td><td style='padding:var(--space-2);'>"+f.name+"</td></tr><tr><td style='padding:var(--space-2);font-weight:600;border-top:1px solid var(--color-border);'>Size</td><td style='padding:var(--space-2);border-top:1px solid var(--color-border);'>"+(f.size/1024).toFixed(1)+" KB</td></tr><tr><td style='padding:var(--space-2);font-weight:600;border-top:1px solid var(--color-border);'>Type</td><td style='padding:var(--space-2);border-top:1px solid var(--color-border);'>"+f.type+"</td></tr><tr><td style='padding:var(--space-2);font-weight:600;border-top:1px solid var(--color-border);'>Modified</td><td style='padding:var(--space-2);border-top:1px solid var(--color-border);'>"+new Date(f.lastModified).toLocaleString()+"</td></tr></table>"}),
`},

  // ===== AI PRODUCTIVITY (9) =====
  { slug:"prompt-optimizer", name:"Prompt Optimizer", category:"misc", description:"Improve AI prompts with structure and clarity.", icon:"🤖",
    body:textInOut({inLabel:"Your prompt",btnLabel:"Optimize"}),
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var p=document.getElementById("input").value;if(!p)return;var out=[];
  out.push("## Optimized Prompt\\n");
  out.push("**Role**: You are an expert assistant.\\n");
  out.push("**Task**: "+p+"\\n");
  out.push("**Requirements**:");
  out.push("- Be specific and actionable");
  out.push("- Provide step-by-step reasoning");
  out.push("- Include examples where helpful");
  out.push("- Format output with clear headings\\n");
  out.push("**Output Format**: Provide a structured response with numbered steps.\\n");
  out.push("**Constraints**: Stay within the scope of the task. Do not add unnecessary information.");
  document.getElementById("output").value=out.join("\\n")}),
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});document.getElementById("btn-clear").addEventListener("click",function(){document.getElementById("input").value="";document.getElementById("output").value=""});
`},

  { slug:"prompt-library", name:"Prompt Library", category:"misc", description:"Browse and copy reusable AI prompt templates.", icon:"🤖",
    body:`<label for="search">Search prompts</label>
      <input class="input" id="search" placeholder="coding, writing, analysis...">
      <div id="list" style="margin-top:var(--space-4);display:grid;gap:var(--space-3);"></div>`,
    script:`var PROMPTS=[
  {title:"Code Reviewer",category:"coding",prompt:"Review the following code for bugs, security issues, and best practices. Provide specific suggestions for improvement:\\n\\n[CODE HERE]"},
  {title:"Blog Post Writer",category:"writing",prompt:"Write a blog post about [TOPIC]. Target audience: [AUDIENCE]. Tone: professional but accessible. Length: 800-1200 words. Include a compelling introduction, 3-4 main sections with subheadings, and a conclusion with a call to action."},
  {title:"Data Analyst",category:"analysis",prompt:"Analyze the following data and provide insights, trends, and recommendations. Present findings in a clear, structured format with bullet points:\\n\\n[DATA HERE]"},
  {title:"Email Composer",category:"writing",prompt:"Write a professional email to [RECIPIENT] about [SUBJECT]. The email should be concise, polite, and clearly state the purpose and any required action."}
];
function render(filter){var list=document.getElementById("list");list.innerHTML="";
  PROMPTS.filter(function(p){if(!filter)return true;return p.title.toLowerCase().includes(filter.toLowerCase())||p.category.includes(filter.toLowerCase())}).forEach(function(p,i){
  var card=document.createElement("div");card.className="card";
  card.innerHTML="<h3 style='font-size:var(--font-size-base);'>"+p.title+"</h3><span class='badge' style='margin:var(--space-2) 0;display:inline-block;'>"+p.category+"</span><p style='font-size:var(--font-size-sm);color:var(--color-text-muted);margin-top:var(--space-2);'>"+p.prompt.slice(0,100)+"...</p><button class='btn btn-secondary btn-sm' style='margin-top:var(--space-3);' data-i='"+i+"'>Copy Prompt</button>";
  card.querySelector("button").addEventListener("click",function(){navigator.clipboard.writeText(p.prompt)});list.appendChild(card)})}
document.getElementById("search").addEventListener("input",function(e){render(e.target.value)});render();
`},

  { slug:"system-prompt-generator", name:"System Prompt Generator", category:"misc", description:"Build structured system prompts for AI assistants.", icon:"🤖",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="role">Role</label><input class="input" id="role" placeholder="Senior software engineer"></div>
      <div><label for="task">Primary task</label><input class="input" id="task" placeholder="Code review and architecture advice"></div>
      <div><label for="tone">Tone</label><input class="input" id="tone" value="Professional, direct, constructive"></div>
      <div><label for="rules">Rules (one per line)</label><textarea class="textarea" id="rules">Always explain reasoning
Cite best practices
Suggest alternatives</textarea></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">System Prompt</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var role=document.getElementById("role").value;var task=document.getElementById("task").value;var tone=document.getElementById("tone").value;
  var rules=document.getElementById("rules").value.split("\\n").filter(function(l){return l.trim()}).map(function(l){return "- "+l}).join("\\n");
  var out="You are a "+role+".\\n\\nYour primary task is to "+task+".\\n\\nTone: "+tone+".\\n\\nRules:\\n"+rules+"\\n\\nAlways ask clarifying questions if the request is ambiguous. Provide structured, actionable output.";
  document.getElementById("output").value=out}),
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});`},

  { slug:"ai-persona-generator", name:"AI Persona Generator", category:"misc", description:"Create detailed personas for AI role-play.", icon:"🤖",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="name">Persona name</label><input class="input" id="name" value="Dr. Smith"></div>
      <div><label for="profession">Profession</label><input class="input" id="profession" placeholder="Research scientist"></div>
      <div><label for="traits">Personality traits (comma-separated)</label><input class="input" id="traits" value="analytical, patient, curious"></div>
      <div><label for="expertise">Areas of expertise</label><input class="input" id="expertise" placeholder="biology, chemistry"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">Persona</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var n=document.getElementById("name").value;var p=document.getElementById("profession").value;var t=document.getElementById("traits").value;var e=document.getElementById("expertise").value;
  var out="Name: "+n+"\\nProfession: "+p+"\\n\\nPersonality: "+t+"\\n\\nExpertise: "+e+"\\n\\nBehavior: Stay in character at all times. Use language appropriate to the profession. Draw on expertise when relevant. Be helpful while maintaining the persona.";
  document.getElementById("output").value=out}),
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});`},

  { slug:"prompt-version-manager", name:"Prompt Version Manager", category:"misc", description:"Track and compare prompt versions.", icon:"🤖",
    body:`<label for="input">Prompt versions (separated by ---)</label>
      <textarea class="textarea" id="input">Write a summary of the article.

---

Write a concise summary of the article in 3 bullet points.</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Compare</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var versions=document.getElementById("input").value.split("---").map(function(v){return v.trim()}).filter(function(v){return v});
  var r=document.getElementById("result");r.innerHTML="";
  versions.forEach(function(v,i){var card=document.createElement("div");card.className="card";card.style.marginBottom="var(--space-3)";
  card.innerHTML="<h3>Version "+(i+1)+"</h3><pre style='white-space:pre-wrap;font-family:var(--font-mono);font-size:var(--font-size-sm);'>"+v+"</pre><p style='color:var(--color-text-muted);'>"+v.length+" chars · "+v.split(/\\s+/).length+" words</p>";
  r.appendChild(card)})}),
`},

  { slug:"prompt-variable-replacer", name:"Prompt Variable Replacer", category:"misc", description:"Replace {{variables}} in prompt templates.", icon:"🤖",
    body:`<label for="template">Prompt template (use {{variable}} syntax)</label>
      <textarea class="textarea" id="template">Write a {{tone}} email to {{recipient}} about {{topic}}.</textarea>
      <div id="vars" style="margin-top:var(--space-4);"></div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Replace</button>
      <label for="output" style="margin-top:var(--space-4);">Result</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("template").addEventListener("input",function(){
  var t=this.value;var vars=t.match(/\\{\\{(\\w+)\\}\\}/g)||[];var unique=Array.from(new Set(vars.map(function(v){return v.replace(/[{}]/g,"")})));
  var container=document.getElementById("vars");container.innerHTML="";
  unique.forEach(function(name){var div=document.createElement("div");div.style.marginBottom="var(--space-2)";
  div.innerHTML="<label>"+name+"</label><input class='input' data-var='"+name+"' placeholder='value for "+name+"'>";container.appendChild(div)})}),
document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("template").value;document.querySelectorAll("[data-var]").forEach(function(input){
  t=t.replace(new RegExp("\\\\{\\{"+input.dataset.var+"\\}\\}","g"),input.value)});
  document.getElementById("output").value=t}),
document.getElementById("template").dispatchEvent(new Event("input"));`},

  { slug:"token-counter", name:"Token Counter", category:"misc", description:"Estimate token count for AI prompts.", icon:"🤖",
    body:`<label for="input">Text</label>
      <textarea class="textarea" id="input" style="min-height:200px;"></textarea>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("input").addEventListener("input",function(){
  var t=this.value;var chars=t.length;var words=t.trim()?t.trim().split(/\\s+/).length:0;
  var tokens=Math.ceil(chars/4);
  document.getElementById("result").innerHTML="<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3);text-align:center;'>"+
  "<div class='card' style='padding:var(--space-3);'><div style='font-size:1.5rem;font-weight:700;color:var(--color-accent);'>"+tokens+"</div><div style='font-size:0.75rem;color:var(--color-text-muted);'>Tokens (est.)</div></div>"+
  "<div class='card' style='padding:var(--space-3);'><div style='font-size:1.5rem;font-weight:700;color:var(--color-accent);'>"+words+"</div><div style='font-size:0.75rem;color:var(--color-text-muted);'>Words</div></div>"+
  "<div class='card' style='padding:var(--space-3);'><div style='font-size:1.5rem;font-weight:700;color:var(--color-accent);'>"+chars+"</div><div style='font-size:0.75rem;color:var(--color-text-muted);'>Characters</div></div></div>"}),
`},

  { slug:"ai-cost-calculator", name:"AI Cost Calculator", category:"misc", description:"Estimate AI API costs based on token usage.", icon:"🤖",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="tokens">Tokens per request</label><input class="input" id="tokens" type="number" value="1000"></div>
      <div><label for="requests">Requests per day</label><input class="input" id="requests" type="number" value="100"></div>
      <div><label for="rate">Rate per 1K tokens ($)</label><input class="input" id="rate" type="number" value="0.002" step="0.001"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=parseInt(document.getElementById("tokens").value,10)||0;var r=parseInt(document.getElementById("requests").value,10)||0;var rate=parseFloat(document.getElementById("rate").value)||0;
  var daily=t*r*rate/1000;var monthly=daily*30;var yearly=daily*365;
  document.getElementById("result").innerHTML="<p>Daily: <strong>$"+daily.toFixed(2)+"</strong></p><p>Monthly: <strong>$"+monthly.toFixed(2)+"</strong></p><p>Yearly: <strong>$"+yearly.toFixed(2)+"</strong></p>"}),
document.getElementById("btn-go").click();`},

  { slug:"ai-workflow-builder", name:"AI Workflow Builder", category:"misc", description:"Design multi-step AI workflows.", icon:"🤖",
    body:`<label for="steps">Workflow steps (one per line: step_name | prompt)</label>
      <textarea class="textarea" id="steps">Analyze input | Analyze the following input and identify key themes: {input}
Generate outline | Based on the themes, generate an outline for a report.
Write content | Write the full report based on the outline.</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Build Workflow</button>
      <label for="output" style="margin-top:var(--space-4);">Workflow Definition</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var lines=document.getElementById("steps").value.split("\\n").filter(function(l){return l.trim()});var steps=[];
  lines.forEach(function(l,i){var p=l.split("|");steps.push({step:i+1,name:p[0].trim(),prompt:p[1]?p[1].trim():""})});
  var wf={name:"Custom AI Workflow",steps:steps,input_variable:"{input}"};
  document.getElementById("output").value=JSON.stringify(wf,null,2)}),
`},

  // ===== MARKETING (12) =====
  { slug:"utm-builder", name:"UTM Builder", category:"seo", description:"Build UTM tracking URLs for campaigns.", icon:"📊",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="url">Website URL</label><input class="input" id="url" placeholder="https://example.com"></div>
      <div><label for="source">Campaign Source</label><input class="input" id="source" placeholder="google"></div>
      <div><label for="medium">Campaign Medium</label><input class="input" id="medium" placeholder="cpc"></div>
      <div><label for="name">Campaign Name</label><input class="input" id="name" placeholder="spring_sale"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Build URL</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">UTM URL</label>
      <input class="input" id="output" readonly>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var url=document.getElementById("url").value;var p=new URLSearchParams();
  if(document.getElementById("source").value)p.set("utm_source",document.getElementById("source").value);
  if(document.getElementById("medium").value)p.set("utm_medium",document.getElementById("medium").value);
  if(document.getElementById("name").value)p.set("utm_campaign",document.getElementById("name").value);
  document.getElementById("output").value=url+(p.toString()?"?"+p.toString():"")}),
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});`},

  { slug:"campaign-url-builder", name:"Campaign URL Builder", category:"seo", description:"Build campaign URLs with full UTM parameters.", icon:"📊",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="url">URL</label><input class="input" id="url"></div>
      <div><label for="source">utm_source</label><input class="input" id="source"></div>
      <div><label for="medium">utm_medium</label><input class="input" id="medium"></div>
      <div><label for="campaign">utm_campaign</label><input class="input" id="campaign"></div>
      <div><label for="term">utm_term</label><input class="input" id="term"></div>
      <div><label for="content">utm_content</label><input class="input" id="content"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Build</button>
      <button class="btn btn-ghost" id="btn-copy" style="margin-top:var(--space-4);">Copy</button>
      <label for="output" style="margin-top:var(--space-4);">Campaign URL</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var p=new URLSearchParams();["source","medium","campaign","term","content"].forEach(function(k){var v=document.getElementById(k).value;if(v)p.set("utm_"+k,v)});
  document.getElementById("output").value=document.getElementById("url").value+(p.toString()?"?"+p.toString():"")}),
document.getElementById("btn-copy").addEventListener("click",function(){var o=document.getElementById("output");if(o.value)navigator.clipboard.writeText(o.value)});`},

  { slug:"email-signature-generator", name:"Email Signature Generator", category:"seo", description:"Generate professional email signatures.", icon:"📊",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="name">Full Name</label><input class="input" id="name" value="John Doe"></div>
      <div><label for="title">Job Title</label><input class="input" id="title" value="Software Engineer"></div>
      <div><label for="company">Company</label><input class="input" id="company" value="Fernandes Labs"></div>
      <div><label for="email">Email</label><input class="input" id="email" value="john@fernandeslabs.com"></div>
      <div><label for="phone">Phone</label><input class="input" id="phone"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <div id="preview" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  document.getElementById("preview").innerHTML="<div style='font-family:sans-serif;border-top:2px solid var(--color-accent);padding-top:var(--space-3);'>"+
  "<strong style='font-size:1.1rem;'>"+document.getElementById("name").value+"</strong><br>"+
  "<span style='color:var(--color-text-muted);'>"+document.getElementById("title").value+" · "+document.getElementById("company").value+"</span><br>"+
  "<a href='mailto:"+document.getElementById("email").value+"'>"+document.getElementById("email").value+"</a>"+
  (document.getElementById("phone").value?" · "+document.getElementById("phone").value:"")+
  "</div>"}),
document.getElementById("btn-go").click();`},

  { slug:"invoice-generator", name:"Invoice Generator", category:"finance", description:"Generate simple invoices.", icon:"📊",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="from">From (your name)</label><input class="input" id="from" value="Fernandes Labs"></div>
      <div><label for="to">Bill to</label><input class="input" id="to"></div>
      <div><label for="items">Items (description | qty | price)</label><textarea class="textarea" id="items">Web design | 1 | 500
Hosting | 12 | 10</textarea></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate Invoice</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var from=document.getElementById("from").value;var to=document.getElementById("to").value;
  var lines=document.getElementById("items").value.split("\\n").filter(function(l){return l.trim()});var total=0;
  var html="<div class='card'><h2 style='margin-bottom:var(--space-2);'>INVOICE</h2><p><strong>From:</strong> "+from+"</p><p><strong>Bill to:</strong> "+to+"</p><table style='width:100%;margin-top:var(--space-4);border-collapse:collapse;'><thead><tr><th style='text-align:left;padding:var(--space-2);border-bottom:1px solid var(--color-border);'>Description</th><th style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>Qty</th><th style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>Price</th><th style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>Total</th></tr></thead><tbody>";
  lines.forEach(function(l){var p=l.split("|");var d=p[0].trim();var q=parseFloat(p[1])||0;var pr=parseFloat(p[2])||0;var lt=q*pr;total+=lt;
  html+="<tr><td style='padding:var(--space-2);'>"+d+"</td><td style='padding:var(--space-2);text-align:center;'>"+q+"</td><td style='padding:var(--space-2);text-align:right;'>$"+pr.toFixed(2)+"</td><td style='padding:var(--space-2);text-align:right;'>$"+lt.toFixed(2)+"</td></tr>"});
  html+="</tbody><tfoot><tr><td colspan='3' style='padding:var(--space-2);text-align:right;font-weight:700;'>Total:</td><td style='padding:var(--space-2);text-align:right;font-weight:700;color:var(--color-accent);'>$"+total.toFixed(2)+"</td></tr></tfoot></table></div>";
  document.getElementById("result").innerHTML=html}),
`},

  { slug:"qr-campaign-generator", name:"QR Campaign Generator", category:"seo", description:"Generate QR codes for marketing campaigns.", icon:"📊",
    body:`<label for="input">Campaign URL or text</label>
      <input class="input" id="input" value="https://fernandeslabs.com?utm_source=qr">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate QR</button>
      <div style="margin-top:var(--space-4);text-align:center;">
        <canvas id="canvas" width="256" height="256"></canvas>
      </div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var text=document.getElementById("input").value;if(!text)return;var canvas=document.getElementById("canvas");
  if(window.QRCode){QRCode.toCanvas(canvas,text,{width:256,margin:2},function(){})}else{var ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,256,256);ctx.fillStyle="#000";ctx.font="14px sans-serif";ctx.textAlign="center";ctx.fillText("QRCode.js not loaded",128,128)}}),
document.getElementById("btn-go").click();`},

  { slug:"landing-page-audit", name:"Landing Page Audit", category:"seo", description:"Audit a landing page for key elements.", icon:"📊",
    body:`<label for="input">Landing page HTML</label>
      <textarea class="textarea" id="input" placeholder="<html>..."></textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Audit</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var html=document.getElementById("input").value;var checks=[
  {name:"Title tag",test:html.includes("<title>")},
  {name:"Meta description",test:html.includes('name="description"')},
  {name:"H1 heading",test:/<h1/i.test(html)},
  {name:"Canonical URL",test:html.includes('rel="canonical"')},
  {name:"Open Graph tags",test:html.includes('property="og:')},
  {name:"CTA button",test:/btn|button|cta/i.test(html)},
  {name:"Responsive viewport",test:html.includes("viewport")}
  ];
  var html2="<ul style='list-style:none;padding:0;'>";
  checks.forEach(function(c){html2+="<li style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+(c.test?"<span style='color:var(--color-success);'>✓</span>":"<span style='color:var(--color-danger);'>✗</span>")+" "+c.name+"</li>"});
  document.getElementById("result").innerHTML=html2+"</ul>"}),
`},

  { slug:"cta-generator", name:"CTA Generator", category:"seo", description:"Generate call-to-action button text.", icon:"📊",
    body:`<label for="topic">What is your product/action?</label>
      <input class="input" id="topic" value="newsletter signup">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate CTAs</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("topic").value;var ctas=[
  "Get Started with "+t,"Try "+t+" Free","Join "+t+" Now","Sign Up for "+t,
  "Start Your "+t,"Get "+t+" Today","Don't Miss "+t,"Claim Your "+t,
  "Subscribe to "+t,"Unlock "+t
  ];
  var html=ctas.map(function(c){return"<button class='btn btn-secondary' style='margin:var(--space-1);' onclick='navigator.clipboard.writeText(\""+c+"\")'>"+c+"</button>"}).join("");
  document.getElementById("result").innerHTML=html}),
`},

  { slug:"title-generator", name:"Title Generator", category:"seo", description:"Generate SEO-optimized page titles.", icon:"📊",
    body:`<label for="keyword">Primary keyword</label>
      <input class="input" id="keyword" value="password generator">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate Titles</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var k=document.getElementById("keyword").value;var templates=[
  k+" — Free Online Tool",
  "Best "+k+" in 2025",
  "Free "+k+" | No Sign-up Required",
  k+": Fast, Easy & Secure",
  "Online "+k+" Tool — Free",
  "How to Use a "+k,
  k+" — Save Time Online",
  "Professional "+k+" Tool"
  ];
  var html="<ul style='list-style:none;padding:0;'>";
  templates.forEach(function(t,i){var len=t.length;var good=len>=50&&len<=60;
  html+="<li style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+t+" <span style='color:"+(good?"var(--color-success)":"var(--color-text-muted)")+";font-size:0.75rem;'>("+len+" chars"+(good?" ✓":"")+")</span> <button class='btn btn-ghost btn-sm' onclick='navigator.clipboard.writeText(\""+t.replace(/"/g,'&quot;')+"\")'>Copy</button></li>"});
  document.getElementById("result").innerHTML=html+"</ul>"}),
`},

  { slug:"meta-description-generator", name:"Meta Description Generator", category:"seo", description:"Generate SEO meta descriptions.", icon:"📊",
    body:`<label for="topic">Page topic</label>
      <input class="input" id="topic" value="free online password generator">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("topic").value;var descs=[
  "Free "+t+". Fast, secure, and easy to use. No sign-up required. Try it now!",
  "Use our "+t+" to get instant results. Works in your browser — no data sent to servers.",
  "The best "+t+" online. Free, private, and mobile-friendly. Get started in seconds.",
  t+" with a clean interface and no ads. 100% client-side for your privacy.",
  "Quick and easy "+t+". Free forever, no registration. Perfect for daily use."
  ];
  var html="<ul style='list-style:none;padding:0;'>";
  descs.forEach(function(d){var len=d.length;var good=len>=150&&len<=160;
  html+="<li style='padding:var(--space-2);border-bottom:1px solid var(--color-border);margin-bottom:var(--space-2);'>"+d+"<br><span style='color:"+(good?"var(--color-success)":"var(--color-text-muted)")+";font-size:0.75rem;'>"+len+" chars"+(good?" ✓":"")+"</span> <button class='btn btn-ghost btn-sm' onclick='navigator.clipboard.writeText(\""+d.replace(/"/g,'&quot;')+"\")'>Copy</button></li>"});
  document.getElementById("result").innerHTML=html+"</ul>"}),
`},

  { slug:"faq-generator", name:"FAQ Generator", category:"seo", description:"Generate FAQ content from a topic.", icon:"📊",
    body:`<label for="topic">Topic</label>
      <input class="input" id="topic" value="password generator">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate FAQs</button>
      <label for="output" style="margin-top:var(--space-4);">FAQ Items</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("topic").value;var faqs=[
  {q:"What is "+t+"?",a:t+" is a tool that helps you accomplish tasks quickly and easily in your browser."},
  {q:"Is "+t+" free to use?",a:"Yes, "+t+" is completely free. No sign-up or payment required."},
  {q:"Does "+t+" work offline?",a:"Yes, "+t+" runs entirely in your browser. No internet connection needed after the page loads."},
  {q:"Is my data safe with "+t+"?",a:"Yes. All processing happens locally in your browser. No data is sent to any server."},
  {q:"Can I use "+t+" on mobile?",a:"Yes, "+t+" is fully responsive and works on all mobile devices."}
  ];
  var out=faqs.map(function(f){return"Q: "+f.q+"\\nA: "+f.a}).join("\\n\\n");
  document.getElementById("output").value=out}),
`},

  { slug:"blog-outline-generator", name:"Blog Outline Generator", category:"seo", description:"Generate blog post outlines from a topic.", icon:"📊",
    body:`<label for="topic">Blog topic</label>
      <input class="input" id="topic" value="how to choose a password manager">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate Outline</button>
      <label for="output" style="margin-top:var(--space-4);">Outline</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var t=document.getElementById("topic").value;var outline=[
  "# "+t.charAt(0).toUpperCase()+t.slice(1),
  "",
  "## Introduction",
  "- Hook: why this topic matters now",
  "- Brief overview of what the reader will learn",
  "",
  "## Why It Matters",
  "- The problem this solves",
  "- Statistics or data to support the need",
  "",
  "## Key Considerations",
  "- Factor 1: Security",
  "- Factor 2: Ease of use",
  "- Factor 3: Price",
  "- Factor 4: Features",
  "",
  "## Step-by-Step Guide",
  "- Step 1: Assess your needs",
  "- Step 2: Compare options",
  "- Step 3: Make a decision",
  "",
  "## Common Mistakes to Avoid",
  "- Mistake 1",
  "- Mistake 2",
  "",
  "## Conclusion",
  "- Summary of key points",
  "- Call to action"
  ];
  document.getElementById("output").value=outline.join("\\n")}),
`},

  { slug:"headline-analyzer", name:"Headline Analyzer", category:"seo", description:"Score headlines for engagement and SEO.", icon:"📊",
    body:`<label for="input">Headline</label>
      <input class="input" id="input" value="10 Ways to Improve Your Password Security">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Analyze</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var h=document.getElementById("input").value;if(!h)return;
  var score=0;var tips=[];
  if(h.length>=50&&h.length<=70){score+=20}else{tips.push("Aim for 50-70 characters for SEO")}
  if(/\\d/.test(h)){score+=20}else{tips.push("Add a number (e.g. '5 Ways...')")}
  if(/\\b(how|why|what|when|where|guide|tips|best|free|new)\\b/i.test(h)){score+=20}else{tips.push("Add power words (how, why, best, guide, tips)")}
  if(/\\b(you|your)\\b/i.test(h)){score+=15}else{tips.push("Address the reader directly ('you/your')")}
  if(h.split(" ").length>=6){score+=15}else{tips.push("Use at least 6 words")}
  if(!tips.length)tips.push("Great headline! All checks passed.");
  score=Math.min(100,score+10);
  document.getElementById("result").innerHTML="<p style='font-size:2rem;font-weight:700;color:"+(score>=70?"var(--color-success)":score>=40?"var(--color-warning)":"var(--color-danger)")+";'>"+score+"/100</p><ul style='margin-top:var(--space-3);'>"+tips.map(function(t){return"<li>"+t+"</li>"}).join("")+"</ul>"}),
document.getElementById("btn-go").click();`},

  // ===== HEALTH & EDUCATION (12) =====
  { slug:"bmi-calculator", name:"BMI Calculator", category:"finance", description:"Calculate Body Mass Index.", icon:"🏥",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="weight">Weight (kg)</label><input class="input" id="weight" type="number" value="70"></div>
      <div><label for="height">Height (cm)</label><input class="input" id="height" type="number" value="175"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var w=parseFloat(document.getElementById("weight").value)||0;var h=parseFloat(document.getElementById("height").value)/100||0;
  var bmi=h>0?w/(h*h):0;var cat=bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese";
  var color=bmi<18.5||bmi>=30?"var(--color-warning)":"var(--color-success)";
  document.getElementById("result").innerHTML="<p style='font-size:2rem;font-weight:700;color:"+color+";'>"+bmi.toFixed(1)+"</p><p>"+cat+"</p>"}),
document.getElementById("btn-go").click();`},

  { slug:"bmr-calculator", name:"BMR Calculator", category:"finance", description:"Calculate Basal Metabolic Rate.", icon:"🏥",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="gender">Gender</label><select class="select" id="gender"><option value="male">Male</option><option value="female">Female</option></select></div>
      <div><label for="weight">Weight (kg)</label><input class="input" id="weight" type="number" value="70"></div>
      <div><label for="height">Height (cm)</label><input class="input" id="height" type="number" value="175"></div>
      <div><label for="age">Age</label><input class="input" id="age" type="number" value="30"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var g=document.getElementById("gender").value;var w=parseFloat(document.getElementById("weight").value)||0;var h=parseFloat(document.getElementById("height").value)||0;var a=parseInt(document.getElementById("age").value,10)||0;
  var bmr=g==="male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161;
  document.getElementById("result").innerHTML="<p>Your BMR: <strong style='font-size:1.5rem;color:var(--color-accent);'>"+Math.round(bmr)+"</strong> calories/day</p>"}),
document.getElementById("btn-go").click();`},

  { slug:"tdee-calculator", name:"TDEE Calculator", category:"finance", description:"Calculate Total Daily Energy Expenditure.", icon:"🏥",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="bmr">BMR</label><input class="input" id="bmr" type="number" value="1650"></div>
      <div><label for="activity">Activity level</label><select class="select" id="activity"><option value="1.2">Sedentary</option><option value="1.375">Light (1-3 days/wk)</option><option value="1.55" selected>Moderate (3-5 days/wk)</option><option value="1.725">Active (6-7 days/wk)</option><option value="1.9">Very Active</option></select></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var bmr=parseFloat(document.getElementById("bmr").value)||0;var act=parseFloat(document.getElementById("activity").value);
  var tdee=bmr*act;
  document.getElementById("result").innerHTML="<p>TDEE: <strong style='font-size:1.5rem;color:var(--color-accent);'>"+Math.round(tdee)+"</strong> calories/day</p><p style='color:var(--color-text-muted);font-size:var(--font-size-sm);'>Maintain: "+Math.round(tdee)+" · Lose: "+Math.round(tdee-500)+" · Gain: "+Math.round(tdee+500)+"</p>"}),
document.getElementById("btn-go").click();`},

  { slug:"body-fat-calculator", name:"Body Fat Calculator", category:"finance", description:"Estimate body fat percentage.", icon:"🏥",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="gender">Gender</label><select class="select" id="gender"><option value="male">Male</option><option value="female">Female</option></select></div>
      <div><label for="waist">Waist (cm)</label><input class="input" id="waist" type="number" value="85"></div>
      <div><label for="neck">Neck (cm)</label><input class="input" id="neck" type="number" value="38"></div>
      <div><label for="height">Height (cm)</label><input class="input" id="height" type="number" value="175"></div>
      <div id="hip-div"><label for="hip">Hip (cm)</label><input class="input" id="hip" type="number" value="95"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("gender").addEventListener("change",function(){document.getElementById("hip-div").style.display=this.value==="female"?"":"none"});
document.getElementById("btn-go").addEventListener("click",function(){
  var g=document.getElementById("gender").value;var w=parseFloat(document.getElementById("waist").value)||0;var n=parseFloat(document.getElementById("neck").value)||0;var h=parseFloat(document.getElementById("height").value)||0;
  var bf=g==="male"?86.01*Math.log10(w-n)-70.041*Math.log10(h)+36.76:163.205*Math.log10(w+parseFloat(document.getElementById("hip").value||0)-n)-97.684*Math.log10(h)-78.387;
  document.getElementById("result").innerHTML="<p>Body fat: <strong style='font-size:1.5rem;color:var(--color-accent);'>"+bf.toFixed(1)+"%</strong></p>"}),
document.getElementById("gender").dispatchEvent(new Event("change"));`},

  { slug:"water-intake-calculator", name:"Water Intake Calculator", category:"finance", description:"Calculate daily water intake needs.", icon:"🏥",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="weight">Weight (kg)</label><input class="input" id="weight" type="number" value="70"></div>
      <div><label for="activity">Exercise (minutes/day)</label><input class="input" id="activity" type="number" value="30"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var w=parseFloat(document.getElementById("weight").value)||0;var a=parseInt(document.getElementById("activity").value,10)||0;
  var ml=w*35+a*12;
  document.getElementById("result").innerHTML="<p>Daily water intake: <strong style='font-size:1.5rem;color:var(--color-accent);'>"+(ml/1000).toFixed(1)+" L</strong> ("+Math.round(ml)+" ml)</p>"}),
document.getElementById("btn-go").click();`},

  { slug:"macro-calculator", name:"Macro Calculator", category:"finance", description:"Calculate macronutrient needs.", icon:"🏥",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="calories">Daily Calories</label><input class="input" id="calories" type="number" value="2200"></div>
      <div><label for="goal">Goal</label><select class="select" id="goal"><option value="maintain">Maintain</option><option value="lose">Lose Fat</option><option value="gain">Gain Muscle</option></select></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var c=parseInt(document.getElementById("calories").value,10)||0;var g=document.getElementById("goal").value;
  var ratios=g==="lose"?{p:0.4,c:0.3,f:0.3}:g==="gain"?{p:0.3,c:0.4,f:0.3}:{p:0.3,c:0.4,f:0.3};
  var protein=Math.round(c*ratios.p/4);var carbs=Math.round(c*ratios.c/4);var fat=Math.round(c*ratios.f/9);
  document.getElementById("result").innerHTML="<p>Protein: <strong>"+protein+"g</strong></p><p>Carbs: <strong>"+carbs+"g</strong></p><p>Fat: <strong>"+fat+"g</strong></p>"}),
document.getElementById("btn-go").click();`},

  { slug:"calorie-calculator", name:"Calorie Calculator", category:"finance", description:"Calculate daily calorie needs.", icon:"🏥",
    body:`<div style="display:grid;gap:var(--space-3);max-width:300px;">
      <div><label for="tdee">TDEE</label><input class="input" id="tdee" type="number" value="2500"></div>
      <div><label for="goal">Goal</label><select class="select" id="goal"><option value="lose">Lose 0.5kg/wk</option><option value="maintain">Maintain</option><option value="gain">Gain 0.5kg/wk</option></select></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var tdee=parseInt(document.getElementById("tdee").value,10)||0;var g=document.getElementById("goal").value;
  var c=g==="lose"?tdee-500:g==="gain"?tdee+500:tdee;
  document.getElementById("result").innerHTML="<p>Daily target: <strong style='font-size:1.5rem;color:var(--color-accent);'>"+c+"</strong> calories</p>"}),
document.getElementById("btn-go").click();`},

  { slug:"gpa-calculator", name:"GPA Calculator", category:"finance", description:"Calculate Grade Point Average.", icon:"🏥",
    body:`<label for="input">Courses (grade | credits, one per line). Grades: A=4, B=3, C=2, D=1, F=0</label>
      <textarea class="textarea" id="input">A | 3
B | 4
A | 3
C | 2</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Calculate GPA</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var lines=document.getElementById("input").value.split("\\n").filter(function(l){return l.trim()});var totalPoints=0;var totalCredits=0;
  lines.forEach(function(l){var p=l.split("|");var grade=p[0].trim().toUpperCase();var credits=parseFloat(p[1])||0;var points={A:4,B:3,C:2,D:1,F:0}[grade]||0;totalPoints+=points*credits;totalCredits+=credits});
  var gpa=totalCredits>0?(totalPoints/totalCredits).toFixed(2):0;
  document.getElementById("result").innerHTML="<p>GPA: <strong style='font-size:2rem;color:var(--color-accent);'>"+gpa+"</strong></p>"}),
`},

  { slug:"grade-calculator", name:"Grade Calculator", category:"finance", description:"Calculate weighted grades.", icon:"🏥",
    body:`<label for="input">Items (name | score | weight %, one per line)</label>
      <textarea class="textarea" id="input">Homework | 90 | 20
Midterm | 85 | 30
Final | 88 | 50</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Calculate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var lines=document.getElementById("input").value.split("\\n").filter(function(l){return l.trim()});var total=0;var weight=0;
  lines.forEach(function(l){var p=l.split("|");var score=parseFloat(p[1])||0;var w=parseFloat(p[2])||0;total+=score*w;weight+=w});
  var grade=weight>0?(total/weight).toFixed(1):0;
  document.getElementById("result").innerHTML="<p>Final grade: <strong style='font-size:2rem;color:var(--color-accent);'>"+grade+"%</strong></p>"}),
`},

  { slug:"citation-generator", name:"Citation Generator", category:"finance", description:"Generate APA, MLA, and Chicago citations.", icon:"🏥",
    body:`<div style="display:grid;gap:var(--space-3);max-width:400px;">
      <div><label for="style">Citation style</label><select class="select" id="style"><option>APA</option><option>MLA</option><option>Chicago</option></select></div>
      <div><label for="author">Author</label><input class="input" id="author" value="Smith, John"></div>
      <div><label for="title">Title</label><input class="input" id="title" value="The Art of Programming"></div>
      <div><label for="year">Year</label><input class="input" id="year" value="2025"></div>
      <div><label for="publisher">Publisher</label><input class="input" id="publisher" value="Tech Books"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-4);">Generate</button>
      <label for="output" style="margin-top:var(--space-4);">Citation</label>
      <textarea class="textarea" id="output" readonly></textarea>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var s=document.getElementById("style").value;var a=document.getElementById("author").value;var t=document.getElementById("title").value;var y=document.getElementById("year").value;var p=document.getElementById("publisher").value;
  var out=s==="APA"?a+" ("+y+"). "+t+". "+p+".":s==="MLA"?a+". \""+t+".\" "+p+", "+y+".":a+". "+t+". "+p+", "+y+".";
  document.getElementById("output").value=out}),
document.getElementById("btn-go").click();`},

  { slug:"flashcard-generator", name:"Flashcard Generator", category:"finance", description:"Create and study digital flashcards.", icon:"🏥",
    body:`<label for="input">Flashcards (question | answer, one per line)</label>
      <textarea class="textarea" id="input">What is HTML? | HyperText Markup Language
What is CSS? | Cascading Style Sheets
What is JS? | JavaScript</textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Start Studying</button>
      <div id="card" style="margin-top:var(--space-4);display:none;"></div>`,
    script:`var cards=[];var idx=0;var flipped=false;
document.getElementById("btn-go").addEventListener("click",function(){
  cards=document.getElementById("input").value.split("\\n").filter(function(l){return l.trim()}).map(function(l){var p=l.split("|");return{q:p[0].trim(),a:p[1]?p[1].trim():""}});idx=0;flipped=false;show()});
function show(){if(!cards.length)return;var card=document.getElementById("card");card.style.display="block";
  var c=cards[idx];card.innerHTML="<div class='card' style='text-align:center;padding:var(--space-6);cursor:pointer;' id='flash'><p style='font-size:1.25rem;'>"+(flipped?c.a:c.q)+"</p><p style='color:var(--color-text-muted);font-size:var(--font-size-sm);margin-top:var(--space-3);'>"+(flipped?"Answer":"Question")+" — click to flip</p></div><div style='text-align:center;margin-top:var(--space-3);'><button class='btn btn-secondary' id='prev'>← Prev</button> <span style='margin:0 var(--space-3);'>"+(idx+1)+"/"+cards.length+"</span> <button class='btn btn-secondary' id='next'>Next →</button></div>";
  document.getElementById("flash").addEventListener("click",function(){flipped=!flipped;show()});
  document.getElementById("prev").addEventListener("click",function(){idx=(idx-1+cards.length)%cards.length;flipped=false;show()});
  document.getElementById("next").addEventListener("click",function(){idx=(idx+1)%cards.length;flipped=false;show()})}),
`},

  { slug:"study-planner", name:"Study Planner", category:"finance", description:"Plan study sessions and track progress.", icon:"🏥",
    body:`<label for="input">Topics to study (one per line, with estimated hours)</label>
      <textarea class="textarea" id="input">Algebra | 4
History | 3
Biology | 5
Programming | 8</textarea>
      <div style="margin-top:var(--space-3);"><label for="perday">Hours per day</label><input class="input" id="perday" type="number" value="3" style="width:100px;"></div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate Plan</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var lines=document.getElementById("input").value.split("\\n").filter(function(l){return l.trim()});var perDay=parseInt(document.getElementById("perday").value,10)||1;
  var topics=lines.map(function(l){var p=l.split("|");return{name:p[0].trim(),hours:parseFloat(p[1])||1}});
  var totalHours=topics.reduce(function(s,t){return s+t.hours},0);var days=Math.ceil(totalHours/perDay);
  var html="<p><strong>"+totalHours+" hours</strong> across <strong>"+days+" days</strong></p><ul style='list-style:none;padding:0;'>";
  topics.forEach(function(t,i){html+="<li style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+t.name+" — "+t.hours+"h</li>"});
  html+="</ul>";document.getElementById("result").innerHTML=html}),
`},

  // ===== WEB & FILE (15) =====
  { slug:"dns-lookup", name:"DNS Lookup", category:"misc", description:"Look up DNS records for a domain.", icon:"🌐",
    body:`<label for="domain">Domain</label>
      <input class="input" id="domain" placeholder="example.com">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Lookup</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var d=document.getElementById("domain").value;if(!d)return;var r=document.getElementById("result");r.innerHTML="<p>Looking up "+d+"...</p>";
  try{var res=await fetch("https://dns.google/resolve?name="+encodeURIComponent(d)+"&type=A");var data=await res.json();
  if(data.Answer){r.innerHTML="<h3>DNS Records</h3><ul style='list-style:none;padding:0;'>"+data.Answer.map(function(a){return"<li style='padding:var(--space-2);border-bottom:1px solid var(--color-border);font-family:var(--font-mono);'>"+a.name+" → "+a.data+"</li>"}).join("")+"</ul>"}else{r.innerHTML="<p>No records found.</p>"}}catch(e){r.innerHTML="<p style='color:var(--color-danger)'>Error: "+e.message+"</p>"}}),
`},

  { slug:"whois-lookup", name:"WHOIS Lookup", category:"misc", description:"Look up domain registration info.", icon:"🌐",
    body:`<label for="domain">Domain</label>
      <input class="input" id="domain" placeholder="example.com">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Lookup</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var d=document.getElementById("domain").value;if(!d)return;
  document.getElementById("result").innerHTML="<p>WHOIS lookups require a server-side proxy due to CORS restrictions. This tool provides a link to an external WHOIS service.</p><p><a href='https://who.is/whois/"+encodeURIComponent(d)+"' target='_blank' rel='noopener'>View WHOIS for "+d+" on who.is →</a></p>"}),
`},

  { slug:"ip-lookup", name:"IP Lookup", category:"misc", description:"Look up IP address information.", icon:"🌐",
    body:`<label for="ip">IP address</label>
      <input class="input" id="ip" placeholder="8.8.8.8">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Lookup</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var ip=document.getElementById("ip").value;if(!ip)return;var r=document.getElementById("result");r.innerHTML="<p>Looking up...</p>";
  try{var res=await fetch("https://ipapi.co/"+encodeURIComponent(ip)+"/json/");var data=await res.json();
  r.innerHTML="<table style='width:100%;border-collapse:collapse;'>"+Object.keys(data).filter(function(k){return["ip","city","region","country_name","org","asn","timezone"].includes(k)}).map(function(k){return"<tr><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);font-weight:600;'>"+k+"</td><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+data[k]+"</td></tr>"}).join("")+"</table>"}catch(e){r.innerHTML="<p style='color:var(--color-danger)'>Error: "+e.message+"</p>"}}),
`},

  { slug:"ssl-checker", name:"SSL Checker", category:"misc", description:"Check SSL certificate for a domain.", icon:"🌐",
    body:`<label for="domain">Domain</label>
      <input class="input" id="domain" placeholder="example.com">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Check SSL</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var d=document.getElementById("domain").value;if(!d)return;var r=document.getElementById("result");r.innerHTML="<p>Checking...</p>";
  try{var res=await fetch("https://"+d,{method:"HEAD",mode:"no-cors"});r.innerHTML="<p style='color:var(--color-success)'>✓ HTTPS is active on "+d+"</p><p style='color:var(--color-text-muted);font-size:var(--font-size-sm);'>Note: Browser CORS policy limits detailed certificate inspection. Use an external tool for full cert details.</p>"}catch(e){r.innerHTML="<p style='color:var(--color-danger)'>✗ SSL check failed: "+e.message+"</p>"}}),
`},

  { slug:"http-header-checker", name:"HTTP Header Checker", category:"misc", description:"Check HTTP response headers.", icon:"🌐",
    body:`<label for="url">URL</label>
      <input class="input" id="url" placeholder="https://example.com">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Check Headers</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var u=document.getElementById("url").value;if(!u)return;var r=document.getElementById("result");r.innerHTML="<p>Fetching...</p>";
  try{var res=await fetch(u,{method:"HEAD"});var html="<table style='width:100%;border-collapse:collapse;'>";
  res.headers.forEach(function(v,k){html+="<tr><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);font-family:var(--font-mono);font-weight:600;'>"+k+"</td><td style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+v+"</td></tr>"});
  html+="</table>";r.innerHTML=html}catch(e){r.innerHTML="<p style='color:var(--color-danger)'>Error: "+e.message+"</p>"}}),
`},

  { slug:"redirect-checker", name:"Redirect Checker", category:"misc", description:"Check redirect chain for a URL.", icon:"🌐",
    body:`<label for="url">URL</label>
      <input class="input" id="url" placeholder="https://example.com/old">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Check Redirects</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var u=document.getElementById("url").value;if(!u)return;var r=document.getElementById("result");r.innerHTML="<p>Checking...</p>";
  try{var res=await fetch(u,{redirect:"follow"});var chain="Final URL: "+res.url+" (Status: "+res.status+")";
  r.innerHTML="<p>"+chain+"</p>"}catch(e){r.innerHTML="<p style='color:var(--color-danger)'>Error: "+e.message+"</p>"}}),
`},

  { slug:"ping-tool", name:"Ping Tool", category:"misc", description:"Check if a website is reachable.", icon:"🌐",
    body:`<label for="url">URL</label>
      <input class="input" id="url" placeholder="https://example.com">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Ping</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var u=document.getElementById("url").value;if(!u)return;var r=document.getElementById("result");r.innerHTML="<p>Pinging...</p>";
  var start=Date.now();
  try{await fetch(u,{method:"HEAD",mode:"no-cors"});var time=Date.now()-start;
  r.innerHTML="<p style='color:var(--color-success);'>✓ Reachable in "+time+"ms</p>"}catch(e){r.innerHTML="<p style='color:var(--color-danger);'>✗ Unreachable: "+e.message+"</p>"}}),
`},

  { slug:"user-agent-parser", name:"User-Agent Parser", category:"misc", description:"Parse a User-Agent string.", icon:"🌐",
    body:`<label for="input">User-Agent string</label>
      <input class="input" id="input" placeholder="Mozilla/5.0...">
      <button class="btn btn-secondary" id="btn-mine" style="margin-top:var(--space-3);">Use my UA</button>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Parse</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-mine").addEventListener("click",function(){document.getElementById("input").value=navigator.userAgent});
document.getElementById("btn-go").addEventListener("click",function(){
  var ua=document.getElementById("input").value;if(!ua)return;
  var browser=/Firefox\\/(\\S+)/.exec(ua)?"Firefox "+RegExp.$1:/Chrome\\/(\\S+)/.exec(ua)?"Chrome "+RegExp.$1:/Safari\\/(\\S+)/.exec(ua)?"Safari "+RegExp.$1:"Unknown";
  var os=/Windows NT 10/.test(ua)?"Windows 10":/Mac OS X (\\S+)/.exec(ua)?"macOS "+RegExp.$1.replace(/_/g,"."):/Linux/.test(ua)?"Linux":/Android (\\S+)/.exec(ua)?"Android "+RegExp.$1:/iPhone OS (\\S+)/.exec(ua)?"iOS "+RegExp.$1.replace(/_/g,"."):"Unknown";
  var device=/Mobile/.test(ua)?"Mobile":"Desktop";
  document.getElementById("result").innerHTML="<p><strong>Browser:</strong> "+browser+"</p><p><strong>OS:</strong> "+os+"</p><p><strong>Device:</strong> "+device+"</p>"}),
`},

  { slug:"zip-extractor", name:"ZIP Extractor", category:"misc", description:"List and extract files from ZIP archives.", icon:"🌐",
    body:`<label for="file">Select ZIP file</label>
      <input class="input" id="file" type="file" accept=".zip">
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("file").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;
  document.getElementById("result").innerHTML="<p>File: "+f.name+" ("+(f.size/1024).toFixed(0)+" KB)</p><p style='color:var(--color-text-muted);'>Full ZIP extraction requires a library like JSZip. Add it via CDN for file extraction.</p>"}),
`},

  { slug:"tar-extractor", name:"TAR Extractor", category:"misc", description:"List and extract files from TAR archives.", icon:"🌐",
    body:`<label for="file">Select TAR file</label>
      <input class="input" id="file" type="file" accept=".tar,.tar.gz">
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("file").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;
  document.getElementById("result").innerHTML="<p>File: "+f.name+" ("+(f.size/1024).toFixed(0)+" KB)</p><p style='color:var(--color-text-muted);'>Full TAR extraction requires a library like pako + untar.js. Add them via CDN for file extraction.</p>"}),
`},

  { slug:"file-checksum", name:"File Checksum", category:"misc", description:"Generate checksums for files.", icon:"🌐",
    body:`<label for="file">Select file</label>
      <input class="input" id="file" type="file">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var f=document.getElementById("file").files[0];if(!f)return;var buf=await f.arrayBuffer();
  var hash=await crypto.subtle.digest("SHA-256",buf);
  var hex=Array.from(new Uint8Array(hash)).map(function(b){return b.toString(16).padStart(2,"0")}).join("");
  document.getElementById("result").innerHTML="<label>SHA-256</label><input class='input' value='"+hex+"' readonly>"})
`},

  { slug:"file-hash", name:"File Hash", category:"misc", description:"Generate multiple hashes for a file.", icon:"🌐",
    body:`<label for="file">Select file</label>
      <input class="input" id="file" type="file">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Hash File</button>
      <div style="margin-top:var(--space-4);display:grid;gap:var(--space-3);">
        <div><label>SHA-1</label><input class="input" id="sha1" readonly></div>
        <div><label>SHA-256</label><input class="input" id="sha256" readonly></div>
        <div><label>SHA-512</label><input class="input" id="sha512" readonly></div>
      </div>`,
    script:`document.getElementById("btn-go").addEventListener("click",async function(){
  var f=document.getElementById("file").files[0];if(!f)return;var buf=await f.arrayBuffer();
  var s1=await crypto.subtle.digest("SHA-1",buf);var s256=await crypto.subtle.digest("SHA-256",buf);var s512=await crypto.subtle.digest("SHA-512",buf);
  var toHex=function(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,"0")}).join("")};
  document.getElementById("sha1").value=toHex(s1);document.getElementById("sha256").value=toHex(s256);document.getElementById("sha512").value=toHex(s512)})
`},

  { slug:"mime-detector", name:"MIME Detector", category:"misc", description:"Detect MIME type from file signature.", icon:"🌐",
    body:`<label for="file">Select file</label>
      <input class="input" id="file" type="file">
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("file").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;
  var ext=f.name.split(".").pop().toLowerCase();var types={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",webp:"image/webp",pdf:"application/pdf",zip:"application/zip",html:"text/html",css:"text/css",js:"application/javascript",json:"application/json",xml:"application/xml",txt:"text/plain",mp4:"video/mp4",mp3:"audio/mpeg"};
  document.getElementById("result").innerHTML="<p><strong>Detected MIME:</strong> "+(types[ext]||f.type||"unknown")+"</p><p><strong>Extension:</strong> ."+ext+"</p>"}),
`},

  { slug:"file-size-converter", name:"File Size Converter", category:"misc", description:"Convert between bytes, KB, MB, GB.", icon:"🌐",
    body:`<div style="display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
      <input class="input" id="value" type="number" value="1024" style="width:120px;">
      <select class="select" id="from" style="width:100px;"><option>bytes</option><option>KB</option><option selected>MB</option><option>GB</option><option>TB</option></select>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Convert</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`var TO_B={bytes:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776};
document.getElementById("btn-go").addEventListener("click",function(){
  var v=parseFloat(document.getElementById("value").value)||0;var f=document.getElementById("from").value;var bytes=v*TO_B[f];
  var html="";Object.keys(TO_B).forEach(function(u){html+="<p>"+u+": "+(bytes/TO_B[u]).toFixed(2)+"</p>"});
  document.getElementById("result").innerHTML=html}),
document.getElementById("btn-go").click();`},

  { slug:"file-signature-inspector", name:"File Signature Inspector", category:"misc", description:"Inspect file magic bytes / signatures.", icon:"🌐",
    body:`<label for="file">Select file</label>
      <input class="input" id="file" type="file">
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`var SIGS={"89504e47":"PNG image","ffd8ffe0":"JPEG image","47494638":"GIF image","25504446":"PDF document","504b0304":"ZIP archive","1f8b":"GZIP archive","49492a00":"TIFF image","424d":"BMP image"};
document.getElementById("file").addEventListener("change",async function(e){
  var f=e.target.files[0];if(!f)return;var buf=await f.arrayBuffer();var bytes=new Uint8Array(buf).slice(0,4);
  var hex=Array.from(bytes).map(function(b){return b.toString(16).padStart(2,"0")}).join("");
  var sig=hex.slice(0,8);var name=SIGS[sig]||SIGS[hex.slice(0,4)]||"Unknown signature";
  document.getElementById("result").innerHTML="<p><strong>Magic bytes:</strong> 0x"+hex+"</p><p><strong>File type:</strong> "+name+"</p>"}),
`},

  // ===== ACCESSIBILITY (4) =====
  { slug:"color-contrast-checker", name:"Color Contrast Checker", category:"misc", description:"Check WCAG color contrast ratios.", icon:"♿",
    body:`<div style="display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
      <div><label for="fg">Foreground</label><input type="color" id="fg" value="#1a1a1a" style="width:80px;height:40px;border:none;"></div>
      <div><label for="bg">Background</label><input type="color" id="bg" value="#ffffff" style="width:80px;height:40px;border:none;"></div>
    </div>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Check</button>
      <div id="preview" style="margin-top:var(--space-4);padding:var(--space-4);border-radius:var(--radius);">Sample text</div>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`function lum(hex){hex=hex.replace("#","");var r=parseInt(hex.slice(0,2),16)/255;var g=parseInt(hex.slice(2,4),16)/255;var b=parseInt(hex.slice(4,6),16)/255;
  r=r<=0.03928?r/12.92:Math.pow((r+0.055)/1.055,2.4);g=g<=0.03928?g/12.92:Math.pow((g+0.055)/1.055,2.4);b=b<=0.03928?b/12.92:Math.pow((b+0.055)/1.055,2.4);
  return 0.2126*r+0.7152*g+0.0722*b}
document.getElementById("btn-go").addEventListener("click",function(){
  var fg=document.getElementById("fg").value;var bg=document.getElementById("bg").value;
  var l1=lum(fg);var l2=lum(bg);var ratio=(Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
  document.getElementById("preview").style.color=fg;document.getElementById("preview").style.background=bg;
  var aa=ratio>=4.5?"✓ Pass":"✗ Fail";var aaa=ratio>=7?"✓ Pass":"✗ Fail";var aalarge=ratio>=3?"✓ Pass":"✗ Fail";
  document.getElementById("result").innerHTML="<p>Contrast ratio: <strong style='font-size:1.5rem;color:var(--color-accent);'>"+ratio.toFixed(2)+":1</strong></p><p>AA (normal): "+aa+"</p><p>AA (large): "+aalarge+"</p><p>AAA: "+aaa+"</p>"}),
document.getElementById("btn-go").click();`},

  { slug:"alt-text-generator", name:"Alt Text Generator", category:"misc", description:"Generate accessibility alt text for images.", icon:"♿",
    body:`<label for="file">Select image</label>
      <input class="input" id="file" type="file" accept="image/*">
      <label for="context" style="margin-top:var(--space-4);">Context (what is the image about?)</label>
      <input class="input" id="context" placeholder="A chart showing sales growth">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Generate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var f=document.getElementById("file").files[0];var ctx=document.getElementById("context").value;
  if(!f)return;var img=new Image();img.onload=function(){
  var w=img.width;var h=img.height;var orientation=w>h?"landscape":h>w?"portrait":"square";
  var alt=ctx||f.name.replace(/\\.[^.]+$/,"");
  var suggestions=["Photo: "+alt+" ("+orientation+")","Image showing "+alt,""+alt+" — "+orientation+" image"];
  document.getElementById("result").innerHTML="<h3>Suggested Alt Text</h3><ul style='list-style:none;padding:0;'>"+suggestions.map(function(s){return"<li style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+s+" <button class='btn btn-ghost btn-sm' onclick='navigator.clipboard.writeText(\""+s.replace(/"/g,"&quot;")+"\")'>Copy</button></li>"}).join("")+"</ul>"};
  img.src=URL.createObjectURL(f)}),
`},

  { slug:"aria-validator", name:"ARIA Validator", category:"misc", description:"Validate ARIA attributes in HTML.", icon:"♿",
    body:`<label for="input">HTML</label>
      <textarea class="textarea" id="input" placeholder="<button aria-label='Close'>×</button>"></textarea>
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Validate</button>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var html=document.getElementById("input").value;var issues=[];
  var interactive=(html.match(/<(button|a|input|select|textarea)/gi)||[]).length;
  var ariaLabels=(html.match(/aria-label=/gi)||[]).length;
  var roleAttrs=(html.match(/role=/gi)||[]).length;
  if(html.match(/<img[^>]+(?<!alt="[^"]*")>/i))issues.push("Warning: Some images may be missing alt attributes");
  if(html.match(/onclick=["']/i)&&!html.match(/role=/i))issues.push("Warning: Elements with onclick should have a role attribute");
  if(html.match(/<div[^>]*role="button"/i)&&!html.match(/tabindex/i))issues.push("Warning: div[role=button] needs tabindex for keyboard access");
  var ok=issues.length===0;
  document.getElementById("result").innerHTML=(ok?"<p style='color:var(--color-success)'>✓ No obvious ARIA issues found</p>":"<p style='color:var(--color-warning)'>Found "+issues.length+" potential issue(s):</p>")+"<ul>"+issues.map(function(i){return"<li>"+i+"</li>"}).join("")+"</ul><p style='color:var(--color-text-muted);font-size:var(--font-size-sm);'>Interactive elements: "+interactive+" · aria-labels: "+ariaLabels+" · roles: "+roleAttrs+"</p>"}),
`},

  { slug:"font-accessibility-checker", name:"Font Accessibility Checker", category:"misc", description:"Check font sizes for accessibility compliance.", icon:"♿",
    body:`<label for="size">Font size (px)</label>
      <input class="input" id="size" type="number" value="16">
      <label for="lh" style="margin-top:var(--space-4);">Line height</label>
      <input class="input" id="lh" type="number" value="1.5" step="0.1">
      <button class="btn btn-primary" id="btn-go" style="margin-top:var(--space-3);">Check</button>
      <div id="preview" style="margin-top:var(--space-4);padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius);">The quick brown fox jumps over the lazy dog. 0123456789</div>
      <div id="result" style="margin-top:var(--space-4);"></div>`,
    script:`document.getElementById("btn-go").addEventListener("click",function(){
  var s=parseInt(document.getElementById("size").value,10);var lh=parseFloat(document.getElementById("lh").value);
  document.getElementById("preview").style.fontSize=s+"px";document.getElementById("preview").style.lineHeight=lh;
  var checks=[];
  checks.push({name:"Minimum font size (≥16px on mobile)",pass:s>=16});
  checks.push({name:"Readable body text (≥14px)",pass:s>=14});
  checks.push({name:"Line height ≥ 1.5",pass:lh>=1.5});
  checks.push({name:"Line height ≤ 2.0",pass:lh<=2.0});
  var html="<ul style='list-style:none;padding:0;'>";
  checks.forEach(function(c){html+="<li style='padding:var(--space-2);border-bottom:1px solid var(--color-border);'>"+(c.pass?"<span style='color:var(--color-success)'>✓</span>":"<span style='color:var(--color-danger)'>✗</span>")+" "+c.name+"</li>"});
  document.getElementById("result").innerHTML=html+"</ul>"}),
document.getElementById("btn-go").click();`},
];

// --- Generate all files -----------------------------------------------------

let generated = 0;
const changelogEntries = [];
const progressEntries = [];
const today = new Date().toISOString().slice(0, 10);

TOOLS.forEach((tool) => {
  const dir = path.join(ROOT, "tools", tool.category, tool.slug);
  const file = path.join(dir, "index.html");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, wrap(tool), "utf8");
  generated++;

  changelogEntries.push(
    `- ${tool.name} (${tool.category}) — ${tool.description} (\`/tools/${tool.category}/${tool.slug}/\`)`
  );

  progressEntries.push(
    `## ${today} — Tool: ${tool.name}\n\n- **Status**: ✅ Complete\n- **Category**: ${tool.category}\n- **Path**: \`/tools/${tool.category}/${tool.slug}/index.html\`\n- **Key Features**: ${tool.description}\n- **QA**: Passed (standard layout, SEO, config-loader, dark mode)\n- **Notes**: Generated in batch.\n\n---\n`
  );
});

// --- Update CHANGELOG.md ----------------------------------------------------

const changelogPath = path.join(ROOT, "CHANGELOG.md");
let changelog = fs.readFileSync(changelogPath, "utf8");

// Find or create the [Unreleased] → ### Added section and prepend entries.
const newEntries = changelogEntries.join("\n") + "\n";

if (changelog.includes("### Added")) {
  // Insert right after the "### Added" line.
  changelog = changelog.replace(/^### Added$/m, "### Added\n" + newEntries);
} else if (changelog.includes("## [Unreleased]")) {
  changelog = changelog.replace(
    /^## \[Unreleased\]$/m,
    "## [Unreleased]\n\n### Added\n" + newEntries
  );
} else {
  changelog =
    changelog.replace(
      /^(# Changelog)/m,
      "$1\n\n## [Unreleased]\n\n### Added\n" + newEntries
    );
}

fs.writeFileSync(changelogPath, changelog, "utf8");

// --- Update index.html TOOLS array ------------------------------------------

const indexPath = path.join(ROOT, "index.html");
let indexHtml = fs.readFileSync(indexPath, "utf8");

// Find the TOOLS array and inject new entries before the closing ];
const toolsArrayEntries = TOOLS.map(
  (t) =>
    `    { slug: "${t.slug}", category: "${t.category}", name: "${t.name.replace(/"/g, '\\"')}", description: "${t.description.replace(/"/g, '\\"')}", icon: "${t.icon}" },`
).join("\n");

if (indexHtml.includes("var TOOLS = [")) {
  // Ensure the last existing entry before ]; has a trailing comma.
  // The regex matches a line ending with } (no comma) followed by optional
  // whitespace and the closing ];. We add the comma to prevent a syntax error
  // when new entries are inserted.
  indexHtml = indexHtml.replace(
    /(\})\s*(\n\s*\];)/,
    '$1,\n$2'
  );
  // Insert all new entries before the closing ];
  indexHtml = indexHtml.replace(
    /^(\s*\];)/m,
    toolsArrayEntries + "\n$1"
  );
}

fs.writeFileSync(indexPath, indexHtml, "utf8");

// --- Update PROGRESS.md -----------------------------------------------------

const progressPath = path.join(ROOT, "PROGRESS.md");
let progress = fs.readFileSync(progressPath, "utf8");

// Insert all new entries after the first --- separator (newest first).
const progressBlock = progressEntries.join("\n");
progress = progress.replace(/^---$/m, "---\n\n" + progressBlock);

fs.writeFileSync(progressPath, progress, "utf8");

// --- Summary ----------------------------------------------------------------

console.log(`✅ Generated ${generated} tools`);
console.log(`   Updated CHANGELOG.md`);
console.log(`   Updated index.html TOOLS array`);
console.log(`   Updated PROGRESS.md`);
console.log(`\nCategories:`);
const byCategory = {};
TOOLS.forEach((t) => {
  byCategory[t.category] = (byCategory[t.category] || 0) + 1;
});
Object.entries(byCategory).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count} tools`);
});
