// URL к публичной Google Таблице (CSV)
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRgXoe7l2lPUZyDQsXeLMRGni-KiJwxIRAn8W-WTmoj7g7yODy8Uo8lMKSjBb2YE7rNi4bi0Og844pk/pub?output=csv ';

// Объект для хранения оценок
const ratings = {};

// Парсим CSV
Papa.parse(csvUrl, {
    download: true,
    header: false,
    skipEmptyLines: true,
    complete: function(results) {
        const data = results.data;

        // Пропускаем заголовок
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const university = row[1]; // Вторая колонка — вуз
            const rating = parseFloat(row[2]); // Третья колонка — оценка

            if (!ratings[university]) {
                ratings[university] = { total: 0, count: 0 };
            }

            ratings[university].total += rating;
            ratings[university].count += 1;
        }

        // Строим рейтинг
        const sortedRatings = Object.keys(ratings)
            .map(university => ({
                name: university,
                avg: (ratings[university].total / ratings[university].count).toFixed(2)
            }))
            .sort((a, b) => b.avg - a.avg);

        // Вставляем в таблицу
        const tableBody = document.querySelector("#rating-table tbody");
        tableBody.innerHTML = '';

        sortedRatings.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>⭐ ${item.avg}</td>
            `;
            tableBody.appendChild(tr);
        });
    }
});