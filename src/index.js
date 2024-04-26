// src/index.js

const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

// Helper functions for different JOIN types
function performInnerJoin(/* parameters */) {
    // Logic for INNER JOIN
    // ...
}

function performLeftJoin(/* parameters */) {
    // Logic for LEFT JOIN
    // ...
}

function performRightJoin(/* parameters */) {
    // Logic for RIGHT JOIN
    // ...
}

async function executeSELECTQuery(query) {
    const { fields, table, whereClauses, joinType, joinTable, joinCondition } = parseQuery(query);
    let data = await readCSV(`${table}.csv`);

    // Logic for applying JOINs
    if (joinTable && joinCondition) {
        const joinData = await readCSV(`${joinTable}.csv`);
        switch (joinType.toUpperCase()) {
            case 'INNER':
                data = performInnerJoin(data, joinData, joinCondition, fields, table);
                break;
            case 'LEFT':
                data = performLeftJoin(data, joinData, joinCondition, fields, table);
                break;
            case 'RIGHT':
                data = performRightJoin(data, joinData, joinCondition, fields, table);
                break;
            // Handle default case or unsupported JOIN types
        }
    }

    const filteredData = whereClauses.length > 0
        ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
        : data;

    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            // Assuming 'field' is just the column name without table prefix
            selectedRow[field] = row[field];
        });
        return selectedRow;
    });
}

function evaluateCondition(row, clause) {
    const { field, operator, value } = clause;
    switch (operator) {
        case '=': return row[field] === value;
        case '!=': return row[field] !== value;
        case '>': return row[field] > value;
        case '<': return row[field] < value;
        case '>=': return row[field] >= value;
        case '<=': return row[field] <= value;
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
}

module.exports = executeSELECTQuery;