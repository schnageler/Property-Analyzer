document.getElementById('propertyForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const todayInput = document.getElementById('today');
    const yesterdayInput = document.getElementById('yesterday');

    const todayProperties = await readCSV(todayInput.files[0]);
    const yesterdayProperties = await readCSV(yesterdayInput.files[0]);

    // Perform your analysis here
    const result = analyzeProperties(todayProperties, yesterdayProperties);

    displayResult(result);
});

async function readCSV(file) {
    const content = await file.text();
    const lines = content.split('\n');
    const headers = lines[0].split(',');

    const properties = lines.slice(1).map((line) => {
        const values = line.split(',');
        const property = {};

        headers.forEach((header, index) => {
            property[header] = values[index];
        });

        return property;
    });

    return properties;
}

function analyzeProperties(todayProperties, yesterdayProperties) {
    // Your analysis logic goes here
    const result = {};

    // Example: Count properties in each list
    result.today_count = todayProperties.length;
    result.yesterday_count = yesterdayProperties.length;

    return result;
}


function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    // Display the result, e.g., as a table or list
    const table = document.createElement('table');
    for (const key in result) {
        const row = document.createElement('tr');
        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        row.appendChild(keyCell);
        const valueCell = document.createElement('td');
        valueCell.textContent = result[key];
        row.appendChild(valueCell);
        table.appendChild(row);
    }
    resultDiv.appendChild(table);
}
