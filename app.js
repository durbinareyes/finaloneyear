
(() => {
  const data = window.PUMPKIN_DATA;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  $("#startBtn").addEventListener("click", () => $("#intro").scrollIntoView({behavior:"smooth"}));

  let heroSecretClicks = 0;
  $("[data-secret]").addEventListener("click", () => {
    const lines = ["why are you clicking random pumpkins","nosey","fine i love you","okay go look for the real secrets now"];
    $("#heroSecret").textContent = lines[Math.min(heroSecretClicks, lines.length - 1)];
    heroSecretClicks++;
  });

  const memoryModal = $("#memoryModal");
  const videoModal = $("#videoModal");
  const soundtrackModal = $("#soundtrackModal");

  function openMemory(index){
    const ev = data.events[index];
    $("#modalDate").textContent = ev.date;
    $("#modalTitle").textContent = ev.title;
    $("#modalSubtitle").textContent = ev.subtitle;
    $("#modalStory").textContent = ev.body;
    const gallery = $("#modalGallery");
    gallery.innerHTML = "";
    if (!ev.media.length){
      gallery.innerHTML = '<div class="memory-placeholder"><span>♡</span></div>';
    } else {
      ev.media.forEach(m => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "gallery-item" + (m.is_video ? " video-tile" : "");
        if (m.is_video){
          b.textContent = "play video ♡";
          b.addEventListener("click", () => openVideo(m.preview));
        } else {
          const img = document.createElement("img");
          img.src = m.thumb;
          img.alt = ev.title;
          img.loading = "lazy";
          b.appendChild(img);
          b.addEventListener("click", () => window.open(`https://drive.google.com/file/d/${m.id}/view`, "_blank", "noopener"));
        }
        gallery.appendChild(b);
      });
    }
    memoryModal.showModal();
    document.body.classList.add("modal-open");
  }

  $$(".memory-card").forEach(card => {
    const action = () => openMemory(Number(card.dataset.eventIndex));
    card.addEventListener("click", action);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); action(); }
    });
  });

  function openVideo(url){
    $("#videoFrame").src = url;
    videoModal.showModal();
    document.body.classList.add("modal-open");
  }

  $$(".video-open").forEach(btn => btn.addEventListener("click", () => openVideo(btn.dataset.preview)));

  $$(".modal-close").forEach(btn => btn.addEventListener("click", () => {
    const d = btn.closest("dialog");
    if (d === videoModal) $("#videoFrame").src = "";
    d.close();
    document.body.classList.remove("modal-open");
  }));
  [memoryModal, videoModal, soundtrackModal].forEach(d => d.addEventListener("click", e => {
    if (e.target === d){
      if (d === videoModal) $("#videoFrame").src = "";
      d.close();
      document.body.classList.remove("modal-open");
    }
  }));

  $("#soundtrackBtn").addEventListener("click", () => soundtrackModal.showModal());

  let noteIndex = 0;
  $("#anotherNote").addEventListener("click", () => {
    noteIndex = (noteIndex + 1) % data.love_notes.length;
    $("#loveNote").animate?.([{opacity:.2,transform:"translateY(5px)"},{opacity:1,transform:"none"}],{duration:220});
    $("#loveNote").textContent = data.love_notes[noteIndex];
  });

  let quizIndex = 0, score = 0;
  function renderQuiz(){
    const box = $("#quizBox");
    if (quizIndex >= data.trivia.length){
      box.innerHTML = `<p class="quiz-q">final score ${score} / ${data.trivia.length}</p><p class="quiz-feedback">${score === data.trivia.length ? "okay you can keep the boyfriend" : "we might need to review the relationship lore 😭"}</p><button class="secondary-btn" id="quizRestart" type="button">again</button>`;
      $("#quizRestart").addEventListener("click",()=>{quizIndex=0;score=0;renderQuiz()});
      return;
    }
    const q = data.trivia[quizIndex];
    box.innerHTML = `<p class="quiz-q">${q.q}</p><div class="quiz-options"></div><p class="quiz-feedback" id="quizFeedback"></p>`;
    const opts = $(".quiz-options", box);
    q.choices.forEach((choice,i)=>{
      const b=document.createElement("button");
      b.className="quiz-choice"; b.type="button"; b.textContent=choice;
      b.addEventListener("click",()=>{
        $$(".quiz-choice",box).forEach(x=>x.disabled=true);
        if(i===q.answer){score++;b.classList.add("correct")}else{b.classList.add("wrong"); $$(".quiz-choice",box)[q.answer].classList.add("correct")}
        $("#quizFeedback").textContent=q.reply;
        setTimeout(()=>{quizIndex++;renderQuiz()},1200);
      });
      opts.appendChild(b);
    });
  }
  renderQuiz();

  $$(".thing-card").forEach(btn => btn.addEventListener("click", () => {
    $("#thingPopup").textContent = btn.dataset.popup;
  }));

  const eggMessages = {
    spider:"with great power comes great responsibility and apparently mine is annoying you forever",
    kitty:"pumpkin mode activated 🎀",
    penguin:"scientifically accurate representation of us somehow",
    onepiece:"episode 40 ish down approximately 94 years of television left",
    fortnite:"victory royale unlocked again somehow you still said yes"
  };
  const found = new Set();
  $$(".hidden-egg").forEach(btn => btn.addEventListener("click", () => {
    found.add(btn.dataset.egg); btn.classList.add("found");
    $("#secretCount").textContent = found.size;
    $("#eggMessage").textContent = eggMessages[btn.dataset.egg];
  }));

  $("#letterBtn").addEventListener("click", () => {
    $("#letterPaper").classList.toggle("open");
    if ($("#letterPaper").classList.contains("open")) $("#letterPaper").scrollIntoView({behavior:"smooth",block:"center"});
  });

  // emotional montage uses chronological event hero images then extras for normal-life texture
  const emotional = data.events.filter(e=>e.media && e.media.length && !e.media[0].is_video).map(e=>({
    src:e.media[0].thumb,
    caption:e.date + "  ·  " + e.title
  }));
  data.extra_media.filter(m=>!m.is_video).slice(0,12).forEach((m,i)=>emotional.push({
    src:m.thumb,
    caption:i < 5 ? "the normal days mattered too" : (i < 9 ? "somehow my life started feeling like ours" : "365 days with you")
  }));
  let montageTimer = null;
  $("#emotionalMontageBtn").addEventListener("click", () => {
    const stage=$("#emotionalStage"), img=$("#emotionalImage"), cap=$("#emotionalCaption");
    stage.classList.add("show");
    let i=0;
    const show=()=>{
      const item=emotional[i % emotional.length];
      img.src=item.src; cap.textContent=item.caption;
      img.animate?.([{opacity:.25},{opacity:1}],{duration:700});
      i++;
      if(i < emotional.length) montageTimer=setTimeout(show,2200);
      else cap.textContent="it wasnt just everything we did this year  it was getting to do all of it with you";
    };
    clearTimeout(montageTimer); show(); stage.scrollIntoView({behavior:"smooth",block:"center"});
  });

  $("#funnyMontageBtn").addEventListener("click", () => {
    const wall=$("#funnyWall"); wall.innerHTML="";
    data.funny_media.forEach((m,i)=>{
      const wrap=document.createElement("div"); wrap.className="fun-item";
      if(m.is_video){
        wrap.innerHTML="<div class='video-tile'>play chaos 😭</div><button aria-label='play funny video'></button>";
        $("button",wrap).addEventListener("click",()=>openVideo(m.preview));
      }else{
        const img=document.createElement("img"); img.src=m.thumb; img.alt="funny memory"; img.loading="lazy"; wrap.appendChild(img);
      }
      wall.appendChild(wrap);
      setTimeout(()=>wrap.animate?.([{opacity:0,transform:"scale(.86) rotate(-2deg)"},{opacity:1,transform:"none"}],{duration:280}), Math.min(i*50,1200));
    });
    wall.scrollIntoView({behavior:"smooth",block:"start"});
  });

  $("#yearTwoBtn").addEventListener("click", () => {
    $("#finalMessage").classList.add("show");
    const hearts=["♡","🌺","♡","🎀","🐧","♡"];
    for(let i=0;i<28;i++){
      const s=document.createElement("span");
      s.textContent=hearts[i%hearts.length];
      s.style.cssText=`position:fixed;z-index:99;left:${Math.random()*96}vw;top:-30px;font-size:${18+Math.random()*22}px;pointer-events:none`;
      document.body.appendChild(s);
      s.animate([{transform:"translateY(0) rotate(0)",opacity:1},{transform:`translateY(${window.innerHeight+80}px) rotate(${Math.random()*600-300}deg)`,opacity:.05}],{duration:2500+Math.random()*1800,easing:"cubic-bezier(.2,.7,.2,1)"});
      setTimeout(()=>s.remove(),4600);
    }
  });
})();
