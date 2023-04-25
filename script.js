document.getElementById('propertyForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const todayInput = document.getElementById('today');
    const yesterdayInput = document.getElementById('yesterday');

    const todayProperties = await readCSV(todayInput.files[0]);
    const yesterdayProperties = await readCSV(yesterdayInput.files[0]);

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
            property[header.trim()] = values[index].trim();
        });

        return property;
    });

    return properties;
}

function analyzeProperties(todayProperties, yesterdayProperties) {
    const result = {};

    const todayUnitIDs = new Set(todayProperties.map(property => property['Unit ID']));
    const yesterdayUnitIDs = new Set(yesterdayProperties.map(property => property['Unit ID']));

    // Count unique properties in each list
    result.today_count = todayUnitIDs.size;
    result.yesterday_count = yesterdayUnitIDs.size;

    // Find new properties and removed properties
    const newProperties = [...todayUnitIDs].filter(id => !yesterdayUnitIDs.has(id));
    const removedProperties = [...yesterdayUnitIDs].filter(id => !todayUnitIDs.has(id));

    result.new_properties_count = newProperties.length;
    result.removed_properties_count = removedProperties.length;
    result.new_properties = newProperties;
    result.removed_properties = removedProperties;

    return result;
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    const table = document.createElement('table');

    for (const key in result) {
        if (key === 'new_properties' || key === 'removed_properties') {
            const rowHeader = document.createElement('tr');
            const headerCell = document.createElement('th');
            headerCell.textContent = key === 'new_properties' ? 'New Properties' : 'Removed Properties';
            rowHeader.appendChild(headerCell);
            table.appendChild(rowHeader);

            result[key].forEach(unitID => {
                const row = document.createElement('tr');
                const valueCell = document.createElement('td');
                valueCell.textContent = unitID;
                row.appendChild(valueCell);
                table.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            const keyCell = document.createElement('td');
            keyCell.textContent = key;
            row.appendChild(keyCell);
            const valueCell = document.createElement('td');
            valueCell.textContent = result[key];
            row.appendChild(valueCell);
            table.appendChild(row);
        }
    }

    resultDiv.appendChild(table);
}
