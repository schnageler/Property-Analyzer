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

    result.new_properties = newProperties;
    result.removed_properties = removedProperties;

    return result;
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    const list = document.createElement('ul');

    const newPropertiesHeader = document.createElement('li');
    newPropertiesHeader.innerHTML = `<strong>New Properties:</strong>`;
    list.appendChild(newPropertiesHeader);

    result.new_properties.forEach(unitID => {
        const newItem = document.createElement('li');
        newItem.textContent = unitID;
        list.appendChild(newItem);
    });

    const removedPropertiesHeader = document.createElement('li');
    removedPropertiesHeader.innerHTML = `<strong>Removed Properties:</strong>`;
    list.appendChild(removedPropertiesHeader);

    result.removed_properties.forEach(unitID => {
        const removedItem = document.createElement('li');
        removedItem.textContent = unitID;
        list.appendChild(removedItem);
    });

    resultDiv.appendChild(list);
}
