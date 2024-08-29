var baseUrl = 'https://localhost:7012';
export const environment = {
    production: false,
    // LOGIN
    loginUrl: `${baseUrl}/login`,
    logoutUrl: `${baseUrl}/logout`,
    identityUrl: `${baseUrl}/identity`,

    // SUPPLY
    supplyUrl: `${baseUrl}/supplies`,
    // SUPPLY CODES
    codesUrl: `${baseUrl}/supplycodes`,
    // BUDGET
    budgetUrl: `${baseUrl}/budget-expenses`,
};
