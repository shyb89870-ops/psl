const questions = [
    "أشعر بأن المتطلبات الدراسية تفوق الوقت المتاح لي.",
    "أشعر بالتوتر عندما تتراكم علي التكليفات والواجبات الجامعية.",
    "أشعر بالقلق المفرط بشأن أدائي ودرجاتي في الاختبارات.",
    "أجد صعوبة في التوفيق بين الدراسة ومسؤولياتي الشخصية أو الأسرية.",
    "أؤجل إنجاز المشاريع والمهام الدراسية إلى اللحظات الأخيرة.",
    "أجد صعوبة في الالتزام بالجدول الزمني الذي أضعه لنفسي.",
    "أشعر بالإرهاق النفسي والاستنزاف نتيجة تراكم المسؤوليات.",
    "أجد صعوبة في الاسترخاء أو الشعور بالهدوء عندما أكون تحت ضغط.",
    "يمتلكني الخوف من عدم قدرتي على تحقيق النجاح المستقبلي.",
    "أشعر بأن الضغوط اليومية تؤثر سلباً في قدرتي على التركيز والاستيعاب.",
    "أواجه صعوبة في النوم (أرق، تفكير مستمر) قبل مواعيد الاختبار.",
    "أشعر بصداع أو إجهاد بدني مستمر دون وجود سبب عضوي واضح."
];

const answers = [
    { value: 5, label: "دائماً" },
    { value: 4, label: "غالباً" },
    { value: 3, label: "أحياناً" },
    { value: 2, label: "نادراً" },
    { value: 1, label: "أبداً" }
];

const container = document.getElementById("questionsContainer");
const form = document.getElementById("stressForm");


// الانتقال بين الصفحات

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// إنشاء الأسئلة تلقائياً

function renderQuestions() {

    container.innerHTML = "";

    questions.forEach((question, index) => {

        const number = index + 1;

        const card = document.createElement("div");
        card.className = "question-card";

        const title = document.createElement("div");
        title.className = "question-title";

        const numberBox = document.createElement("span");
        numberBox.className = "question-number";
        numberBox.textContent = number;

        const text = document.createElement("span");
        text.textContent = question;

        title.appendChild(numberBox);
        title.appendChild(text);

        const optionsBox = document.createElement("div");
        optionsBox.className = "options";

        answers.forEach(answer => {

            const label = document.createElement("label");
            label.className = "option";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `q${number}`;
            input.value = answer.value;
            input.required = true;

            const span = document.createElement("span");
            span.textContent = `${answer.value} - ${answer.label}`;

            label.appendChild(input);
            label.appendChild(span);

            optionsBox.appendChild(label);

        });

        card.appendChild(title);
        card.appendChild(optionsBox);

        container.appendChild(card);

    });

}


// بدء المقياس

function startTest() {
    form.reset();
    updateProgress();
    showPage("questionsPage");
}


// حساب عدد الإجابات المكتملة

function updateProgress() {

    let completed = 0;

    questions.forEach((question, index) => {

        const selected = document.querySelector(
            `input[name="q${index + 1}"]:checked`
        );

        if (selected) {
            completed++;
        }

    });

    const percentage = (completed / questions.length) * 100;

    document.getElementById("progressText").textContent =
        `${completed} / 12`;

    document.getElementById("progressBar").style.width =
        `${percentage}%`;

}


// متابعة الاختيارات

container.addEventListener("change", function(event) {

    if (event.target.matches('input[type="radio"]')) {

        updateProgress();

        document.getElementById("errorMessage").style.display =
            "none";

    }

});


// تحديد مستوى الضغوط النفسية

function classifyScore(score) {

    if (score >= 12 && score <= 27) {

        return {
            level: "ضغوط نفسية منخفضة",
            shortLevel: "منخفضة",
            description:
                "تشير نتيجتك إلى مستوى منخفض من الضغوط النفسية وفقاً لحدود هذا المقياس التوعوي."
        };

    }

    if (score >= 28 && score <= 43) {

        return {
            level: "ضغوط نفسية متوسطة",
            shortLevel: "متوسطة",
            description:
                "تشير نتيجتك إلى مستوى متوسط من الضغوط النفسية. قد يكون من المفيد الاهتمام بتنظيم الوقت وتحقيق التوازن بين الدراسة والحياة الشخصية."
        };

    }

    if (score >= 44 && score <= 60) {

        return {
            level: "ضغوط نفسية مرتفعة",
            shortLevel: "مرتفعة",
            description:
                "تشير نتيجتك إلى مستوى مرتفع من الضغوط النفسية وفقاً لهذا المقياس التوعوي. يُستحسن الاهتمام بالراحة النفسية وطلب الدعم من المختصين عند الحاجة."
        };

    }

}


// حساب النتيجة وعرضها

function calculateResult() {

    let total = 0;

    for (let i = 1; i <= 12; i++) {

        const selected = document.querySelector(
            `input[name="q${i}"]:checked`
        );

        if (!selected) {
            return;
        }

        total += Number(selected.value);

    }

    const result = classifyScore(total);

    document.getElementById("totalScore").textContent =
        total;

    document.getElementById("resultLevel").textContent =
        result.level;

    document.getElementById("resultDescription").textContent =
        result.description;

    // تحويل الدرجة إلى نسبة من المجال 12 إلى 60

    const percentage = ((total - 12) / 48) * 100;

    document.getElementById("resultIndicator").style.right =
        `${percentage}%`;

    document.getElementById("indicatorScore").textContent =
        `درجتك: ${total} من 60`;

    showPage("resultPage");

}


// إرسال الإجابات

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const errorMessage = document.getElementById("errorMessage");

    let allAnswered = true;

    for (let i = 1; i <= 12; i++) {

        const selected = document.querySelector(
            `input[name="q${i}"]:checked`
        );

        if (!selected) {
            allAnswered = false;
            break;
        }

    }

    if (!allAnswered) {

        errorMessage.style.display = "block";

        errorMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;

    }

    errorMessage.style.display = "none";

    calculateResult();

});


// إعادة المقياس

function restartTest() {

    form.reset();

    updateProgress();

    showPage("introPage");

}


// اختبارات التحقق من صحة الحساب والتصنيف

function runTests() {

    const tests = [
        {
            answers: Array(12).fill(1),
            expectedScore: 12,
            expectedLevel: "منخفضة"
        },
        {
            answers: Array(12).fill(3),
            expectedScore: 36,
            expectedLevel: "متوسطة"
        },
        {
            answers: Array(12).fill(5),
            expectedScore: 60,
            expectedLevel: "مرتفعة"
        }
    ];

    tests.forEach((test, index) => {

        const score = test.answers.reduce(
            (sum, value) => sum + value, 0
        );

        const result = classifyScore(score);

        console.assert(
            score === test.expectedScore,
            `فشل اختبار المجموع ${index + 1}`
        );

        console.assert(
            result.shortLevel === test.expectedLevel,
            `فشل اختبار التصنيف ${index + 1}`
        );

        console.log(
            `اختبار ${index + 1}:`,
            score,
            result.level
        );

    });

}


// تشغيل الموقع

renderQuestions();
updateProgress();
runTests();