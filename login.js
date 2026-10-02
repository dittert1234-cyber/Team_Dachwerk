(function(){
  const SUPABASE_URL = 'https://zwzwritlecmurmufzwje.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_n8nX6s_Nt_Op2r7aKC4A-w_NOI_TBFP';
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  window.dachwerkSupabase = sb;

  const gate=document.getElementById('loginGate'), fields=document.getElementById('loginFields'), row=document.getElementById('loginRow'), primary=document.getElementById('loginPrimary'), msg=document.getElementById('loginMessage'), card=document.getElementById('loginCard'), tag=document.getElementById('loginTag'), sub=document.getElementById('loginSub');
  let setup=true;
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function renderSetup(){
    gate.classList.remove('login-hidden'); msg.textContent=''; card.classList.add('login-setup');
    tag.textContent='Ihre digitale Auftragsverwaltung'; sub.textContent='Beim ersten Start dein DACHWERK-Konto anlegen.';
    fields.innerHTML='<label class="login-field"><span class="login-icon">◯</span><input id="loginUser" type="email" autocomplete="email" placeholder="E-Mail-Adresse"></label><label class="login-field"><span class="login-icon">▣</span><input id="loginPass" type="password" autocomplete="new-password" placeholder="Passwort"><button class="login-eye" type="button" onclick="toggleLoginPass(\'loginPass\')">◉</button></label><label class="login-field"><span class="login-icon">✓</span><input id="loginPass2" type="password" autocomplete="new-password" placeholder="Passwort wiederholen"></label>';
    row.innerHTML='<label class="login-check"><input id="rememberSetup" type="checkbox" checked> Angemeldet bleiben</label>';
    primary.textContent='✓  KONTO ANLEGEN'; primary.onclick=signUp;
    const old=document.getElementById('loginAccountLink'); if(old) old.remove();
    const link=document.createElement('button'); link.id='loginAccountLink'; link.type='button'; link.className='login-account-link'; link.textContent='← Zurück zur Anmeldung'; link.onclick=()=>renderLogin(document.getElementById('loginUser')?.value||'');
    primary.insertAdjacentElement('afterend',link);
  }
  function renderLogin(email){
    gate.classList.remove('login-hidden'); msg.textContent=''; card.classList.remove('login-setup');
    tag.textContent='Ihre digitale Auftragsverwaltung'; sub.textContent='Einfach. Effizient. Immer im Einsatz.';
    fields.innerHTML='<label class="login-field"><span class="login-icon">◯</span><input id="loginUser" type="email" autocomplete="email" placeholder="E-Mail-Adresse" value="'+esc(email||'')+'"></label><label class="login-field"><span class="login-icon">▣</span><input id="loginPass" type="password" autocomplete="current-password" placeholder="Passwort"><button class="login-eye" type="button" onclick="toggleLoginPass(\'loginPass\')">◉</button></label>';
    row.innerHTML='<label class="login-check"><input id="rememberMe" type="checkbox" checked> Angemeldet bleiben</label><button class="login-link" type="button" onclick="resetSupabasePassword()">Passwort vergessen?</button>';
    primary.textContent='→  ANMELDEN'; primary.onclick=doLogin;
    const old=document.getElementById('loginAccountLink'); if(old) old.remove();
    const link=document.createElement('button'); link.id='loginAccountLink'; link.type='button'; link.className='login-account-link'; link.textContent='Noch kein DACHWERK-Konto? Konto anlegen'; link.onclick=()=>renderSetup();
    primary.insertAdjacentElement('afterend',link);
  }
  window.toggleLoginPass=function(id){const e=document.getElementById(id);if(e)e.type=e.type==='password'?'text':'password'};
  async function signUp(){
    const email=document.getElementById('loginUser').value.trim().toLowerCase(), p=document.getElementById('loginPass').value, p2=document.getElementById('loginPass2').value;
    if(!email || !email.includes('@')){msg.textContent='Bitte eine gültige E-Mail-Adresse eingeben.';return;}
    if(p.length<6){msg.textContent='Das Passwort muss mindestens 6 Zeichen haben.';return;}
    if(p!==p2){msg.textContent='Die Passwörter stimmen nicht überein.';return;}
    primary.disabled=true; msg.textContent='Konto wird angelegt …';
    const {data,error}=await sb.auth.signUp({email,password:p});
    primary.disabled=false;
    if(error){msg.textContent=error.message;return;}
    if(data.session){unlock(data.session.user);} else {msg.textContent='Konto erstellt. Prüfe deine E-Mails und bestätige deine E-Mail-Adresse. Danach kannst du dich anmelden.'; renderLogin(email);}
  }
  async function doLogin(){
    const email=document.getElementById('loginUser').value.trim().toLowerCase(), password=document.getElementById('loginPass').value;
    if(!email || !password){msg.textContent='Bitte E-Mail und Passwort eingeben.';return;}
    primary.disabled=true; msg.textContent='Anmeldung läuft …';
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    primary.disabled=false;
    if(error){msg.textContent=error.message;return;}
    unlock(data.user);
  }
  async function resetSupabasePassword(){
    const email=(document.getElementById('loginUser')?.value||'').trim().toLowerCase();
    if(!email || !email.includes('@')){msg.textContent='Bitte zuerst deine E-Mail-Adresse eingeben.';return;}
    const redirect=window.location.origin+window.location.pathname;
    const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:redirect});
    msg.textContent=error?error.message:'Wir haben dir eine E-Mail zum Zurücksetzen des Passworts geschickt.';
  }
  function unlock(user){gate.classList.add('login-hidden');document.body.classList.add('app-unlocked');window.dachwerkUser=user||null; try{localStorage.setItem('dachwerk_auth_email',user?.email||'')}catch(e){}}
  window.resetLocalLogin=function(){msg.textContent='Die Anmeldung läuft jetzt über Supabase. Zum Zurücksetzen bitte „Passwort vergessen?“ verwenden.';};
  window.loginBiometric=function(kind){msg.textContent=kind+' wird später als Passkey mit Supabase Auth eingerichtet.';};
  window.dachwerkLogout=async function(){await sb.auth.signOut();document.body.classList.remove('app-unlocked');renderLogin(window.dachwerkUser?.email||localStorage.getItem('dachwerk_auth_email')||'');};
  sb.auth.onAuthStateChange((event,session)=>{if(session?.user){unlock(session.user)}else if(event==='SIGNED_OUT'){renderLogin(localStorage.getItem('dachwerk_auth_email')||'')}});
  (async()=>{const {data}=await sb.auth.getSession();if(data.session) unlock(data.session.user); else {setup=false;renderLogin(localStorage.getItem('dachwerk_auth_email')||'');}})();
})();
