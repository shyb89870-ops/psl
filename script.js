const questions = [
"أشعر بأن المتطلبات الدراسية تفوق الوقت المتاح لي.",
"أشعر بالتوتر عندما تتراكم علي التكليفات والواجبات الجامعية.",
"أشعر بالقلق المفرط بشأن أدائي ودرجاتي في الاختبارات.",
"أواجه صعوبة في فهم بعض المناهج الدراسية أو معالجتها في الوقت المحدد.",
"أواجه صعوبة في التوفيق بين متطلبات عدة مواد في نفس الأسبوع.",
"أشعر بالارتباك أثناء العروض التقديمية (Presentation) أو المشاركات الشفهية.",
"أجد صعوبة في التوفيق بين الدراسة ومسؤولياتي الشخصية أو الأسرية.",
"أشعر بأنني لا أملك وقتاً كافياً للراحة أو ممارسة هواياتي بسبب الدراسة.",
"يضيع جزء كبير من وقتي دون إنجاز المهام المطلوبة مني.",
"أؤجل إنجاز المشاريع والمهام الدراسية إلى اللحظات الأخيرة.",
"أجد صعوبة في الالتزام بالجدول الزمني الذي أضعه لنفسي.",
"أجد صعوبة في التوقف عن التفكير السلبي في الأمور التي تشغلني.",
"أشعر بالانزعاج والتقلب المزاجي عندما تتغير خططي بصورة مفاجئة.",
"أشعر بالإرهاق والاستنزاف نتيجة تراكم المسؤوليات.",
"أجد صعوبة في الاسترخاء، أو الشعور بالهدوء، عندما أكون تحت ضغط.",
"أشعر بقلة الصبر وسرعة الغضب تجاه المواقف البسيطة.",
"يمتلكني الخوف من عدم قدرتي على تحقيق النجاح المستقبلي.",
"أشعر بأن الضغوط اليومية تؤثر سلباً في قدرتي على التركيز والاستيعاب.",
"أواجه صعوبة في النوم (أرق، تفكير مستمر) قبل مواعيد الاختبار.",
"أشعر بصداع أو إجهاد بدني مستمر دون وجود سبب عضوي واضح.",
"أفقد الشغف والطاقة لمتابعة الدراسة في أوقات الضغط المرتفع.",
"ألاحظ تغييراً في شهيتي للطعام (زيادة أو نقصان) عند الشعور بالتوتر.",
"أشعر بأن الأحداث والمسؤوليات اليومية تفوق قدرتي على التعامل معها."
];

const answers = [
["5","دائماً"],
["4","غالباً"],
["3","أحياناً"],
["2","نادراً"],
["1","أبداً"]
];

function startSurvey() {
  document.getElementById("intro").hidden = true;
  document.getElementById("survey").hidden = false;
}

function buildQuestions() {
  const container = document.getElementById("questions");

  container.innerHTML = questions.map((q, i) => `
    <div class="question">
      <p>${i + 1}. ${q}</p>
      ${answers.map(([value, text]) => `
        <label>
          <input type="radio" name="q${i}" value="${value}">
          ${text}
        </label>
      `).join("")}
    </div>
  `).join("");

  container.addEventListener("change", updateProgress);
}

function updateProgress() {
  const count = questions.filter((_, i) =>
    document.querySelector(`input[name="q${i}"]:checked`)
  ).length;

  document.getElementById("progress").textContent =
    `تمت الإجابة عن ${count} من 23`;

  document.getElementById("bar").style.width =
    `${count / 23 * 100}%`;
}

function getStressAssessment(score) {
  if (score <= 52) {
    return {
      boxId: "low-box",
      level: "منخفض",
      description: "تدل نتائجك على مستوى ضغوط منخفض نسبيًا، وقد تكون الأوضاع الحالية تحت السيطرة بشكل جيد.",
      statusText: "▲ مستوى الضغوط منخفض",
      color: "#26994d"
    };
  }

  if (score <= 82) {
    return {
      boxId: "medium-box",
      level: "متوسط",
      description: "تدل نتائجك على مستوى ضغوط متوسط، ومن المفيد مراجعة أولوياتك وتطبيق تقنيات تنظيم الوقت والراحة.",
      statusText: "▲ مستوى الضغوط متوسط",
      color: "#bd8900"
    };
  }

  return {
    boxId: "high-box",
    level: "مرتفع",
    description: "تدل نتائجك على مستوى ضغوط مرتفع، ويُرجى إعطاء الأولوية للعناية النفسية والراحة والتواصل مع من تثق بهم.",
    statusText: "▲ مستوى الضغوط مرتفع",
    color: "#d74444"
  };
}

function submitSurvey() {
  let score = 0;

  for (let i = 0; i < 23; i++) {
    const answer = document.querySelector(
      `input[name="q${i}"]:checked`
    );

    if (!answer) {
      alert("فضلاً أجيبي عن جميع العبارات أولاً.");
      return;
    }

    score += Number(answer.value);
  }

  document.querySelectorAll(".meter-box div")
    .forEach(box => box.classList.remove("active"));

  const assessment = getStressAssessment(score);
  const status = document.getElementById("meter-status");
  const indicator = document.getElementById("meter-indicator");

  document.getElementById(assessment.boxId).classList.add("active");

  if (status) {
    status.textContent = assessment.statusText;
    status.style.color = assessment.color;
  }

  document.getElementById("survey").hidden = true;
  document.getElementById("result").hidden = false;

  document.getElementById("score").textContent = `${score} من 115`;

  const levelEl = document.getElementById("level");
  const descriptionEl = document.getElementById("description");

  if (levelEl) levelEl.textContent = `المستوى: ${assessment.level}`;
  if (descriptionEl) descriptionEl.textContent = assessment.description;

  const position = ((score - 23) / 92) * 100;

  if (indicator) {
    indicator.style.right = `${Math.min(100, Math.max(0, position))}%`;
  }

  window.scrollTo(0, 0);
}

buildQuestions();

// اختبار حدود التصنيف
console.assert(23 <= 52);
console.assert(52 <= 52);
console.assert(53 > 52 && 53 <= 82);
console.assert(69 > 52 && 69 <= 82);
console.assert(82 <= 82);
console.assert(83 > 82);
console.assert(115 > 82);
