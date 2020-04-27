var BASE_URL = "";
if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:5000";
} else {
  BASE_URL = "https://bisso1998.pythonanywhere.com";
}

export const fetchDepartmentSummaryData = async () => {
  let response = await fetch(
    `${BASE_URL}/departments-summary`
  ).then((response) => response.json());
  return response;
};

export const fetchBudgetGrandTotal = async () => {
  let response = await fetch(`${BASE_URL}/total-budget`).then((response) =>
    response.json()
  );
  return response;
};

export const fetchSummaryOfEachDepartment = async (name) => {
  let response = await fetch(
    `${BASE_URL}/department/` + name
  ).then((response) => response.json());
  return response;
};

export const fetchAllDepartmentData = async () => {
  let response = await fetch(`${BASE_URL}/departments`).then((response) =>
    response.json()
  );
  return response;
};
