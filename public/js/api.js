const owner_id = 256;
const baseUrl = 'https://newapi.katib.id';
const API_TOKEN = 'DpacnJf3uEQeM7HN';

const endpoints = {
  admin: {
    table: `${baseUrl}/data/cs/admin/wa/redirect/${owner_id}`,
    detail: `${baseUrl}/detail/cs/admin/wa/redirect`,
    update: `${baseUrl}/update/cs/admin/wa/redirect`,
    create: `${baseUrl}/add/cs/admin/wa/redirect`,
    delete: `${baseUrl}/delete/cs/admin/wa/redirect`
  },
  campaign: {
    table: `${baseUrl}/data/campaign/wa/redirect/${owner_id}`,
    detail: `${baseUrl}/detail/campaign/wa/redirect`,
    update: `${baseUrl}/update/campaign/wa/redirect`,
    create: `${baseUrl}/add/campaign/wa/redirect`,
    delete: `${baseUrl}/delete/campaign/wa/redirect`
  }
};

async function fetchData(type, page = 1) {
  try {
    const response = await fetch(`${endpoints[type].table}/${page}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    return { data: [], totalRecords: 0, totalPages: 0 };
  }
}

async function fetchById(type, id) {
  try {
    const response = await fetch(`${endpoints[type].detail}/${id}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.error(`Error fetching ${type} by ID:`, error);
    return null;
  }
}

async function updateData(type, id, payload) {
  try {
    const response = await fetch(`${endpoints[type].update}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${type} data:`, error);
    return null;
  }
}

async function createData(type, payload) {
  try {
    const body = JSON.stringify({ owner_id, ...payload }); 
    const response = await fetch(`${endpoints[type].create}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: body
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    return null;
  }
}

async function deleteData(type, id) {
  try {
    const response = await fetch(`${endpoints[type].delete}/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    return null;
  }
}