const getDataFromApi = (data) => {
  return fetch('/card/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.error('Error:', error));
};

export default getDataFromApi;
