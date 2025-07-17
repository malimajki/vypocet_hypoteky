document.addEventListener("DOMContentLoaded", () => {
    const partnerCheckbox = document.getElementById("partner");
    const debtCheckbox = document.getElementById("debt");

    const partnerIncomeWrapper = document.getElementById("partner_income_wrapper");
    const debtAmmontWrapper = document.getElementById("debt_ammont_wrapper");

    // Zobraz/skryj pole dle checkboxů
    function toggleVisibility() {
        partnerIncomeWrapper.classList.toggle("hidden", !partnerCheckbox.checked);
        debtAmmontWrapper.classList.toggle("hidden", !debtCheckbox.checked);
    }

    partnerCheckbox.addEventListener("change", toggleVisibility);
    debtCheckbox.addEventListener("change", toggleVisibility);

    // Formátování vstupů s třídou currency-input
    document.querySelectorAll(".currency-input").forEach(input => {
        input.addEventListener("input", (e) => {
            const clean = e.target.value.replace(/\D/g, "");
            const formatted = Number(clean).toLocaleString("cs-CZ");
            e.target.value = formatted;
        });
    });

    // Odebrání formátu při výpočtu (např. "25 000" -> 25000)
    const parseKc = (val) => Number(val.replace(/\s/g, "").replace(/\D/g, ""));

    // Pokud máš formátované vstupy jako text, uprav načítání v hlavním skriptu:
    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();

        const age = Number(document.getElementById("age").value);
        const income = parseKc(document.getElementById("income").value);
        const hasPartner = partnerCheckbox.checked;
        const partnerIncome = hasPartner ? parseKc(document.getElementById("partner_income").value) : 0;
        const hasDebt = debtCheckbox.checked;
        const debtAmount = hasDebt ? parseKc(document.getElementById("debt_ammont").value) : 0;
        const saved = parseKc(document.getElementById("deposit").value);
        const years = Number(document.getElementById("range").value);
        const interestRate = Number(document.getElementById("interest").value) / 100;

        const depositRatio = age < 36 ? 0.1 : 0.2;
        let maxMortgage = saved / depositRatio;

        const r = interestRate / 12;
        const n = years * 12;

        const calcAnnuity = (P) =>
            P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

        const calcMortgageFromAnnuity = (A) =>
            A * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));

        let A = calcAnnuity(maxMortgage);
        const maxMonthlyPayment = 0.5 * (income + partnerIncome - debtAmount);

        let monthlyPayment = A;
        let limitMessage = "";
        

        // ❗ Pokud A je vyšší než dovoleno, přepočti hypotéku a měsíční splátku
        if (A > maxMonthlyPayment) {
            monthlyPayment = maxMonthlyPayment;
            maxMortgage = calcMortgageFromAnnuity(monthlyPayment);
            A = monthlyPayment; // pro jistotu sjednocení názvu
            limitMessage = "Výše hypotéky byla omezena Vašimi příjmi.";
        }
        else {
            limitMessage = "Výše hypotéky byla omezena našetřenou částkou.";
        }

        const totalPaid = monthlyPayment * n;
        const interestPaid = totalPaid - maxMortgage;

        const formatKc = (val) =>
            val.toLocaleString("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 });

        const ul = document.querySelector("ul.space-y-2");
            ul.innerHTML = `
                <li class="dark:text-gray-400">Maximální výše hypotéky: <span class="dark:text-white text-lg font-semibold">${formatKc(maxMortgage)}</span>.</li>
                <li class="dark:text-gray-400">Celková zaplacená částka: <span class="dark:text-white text-lg font-semibold">${formatKc(totalPaid)}</span>,</li>
                <li class="dark:text-gray-400">Úroky celkem: <span class="dark:text-white text-lg font-semibold">${formatKc(interestPaid)}</span>.</li>
                <li class="dark:text-gray-400">Měsíční splátka: <span class="dark:text-white text-lg font-semibold">${formatKc(monthlyPayment)}</span>.</li>
                ${limitMessage ? `<li class="text-indigo-800 dark:text-indigo-500">${limitMessage}</li>` : ""}
                <li class="text-xs font-italic dark:text-gray-400">(Hodnoty jsou pouze orientační a v závislosti na bance se mohou lišit.)</li>
            `;
        setTimeout(() => {
            ul.classList.remove("opacity-0", "translate-y-2");
            ul.classList.add("opacity-100", "translate-y-0");
        }, 20);
    });
    const toggle = document.getElementById("darkToggle");
    let isDarkMode = false;
    
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            toggle.textContent = "☀️";
        } else {
            document.documentElement.classList.remove('dark');
            toggle.textContent = "🌙";
        }
    }
    
    // Initialize theme based on system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
        isDarkMode = true;
        document.documentElement.classList.add('dark');
        toggle.textContent = "☀️";
    } else {
        isDarkMode = false;
        document.documentElement.classList.remove('dark');
        toggle.textContent = "🌙";
    }
    
    toggle.addEventListener("click", toggleTheme);
});


// function updateCounter() {
//     fetch("counter.php")
//         .then(res => res.text())
//         .then(count => {
//             document.getElementById("counter").textContent = `Formulář byl vyplněn ${count}×`;
//         });
// }

// document.querySelector("form").addEventListener("submit", function (e) {
//     e.preventDefault();
    
//     // ... výpočty ...

//     updateCounter();
// });


// Dark mode toggle - Fixed version
            