const owner_id = 256;
const baseUrl = 'https://newapi.katib.id';
const API_TOKEN = 'DpacnJf3uEQeM7HN';

const endpoints = {
  admin: {
    table: `${baseUrl}/data/cs/admin/wa/redirect/${owner_id}`,
    list: `${baseUrl}/cs/admin/wa/redirect/${owner_id}`,
    detail: `${baseUrl}/detail/cs/admin/wa/redirect`,
    update: `${baseUrl}/update/cs/admin/wa/redirect`,
    create: `${baseUrl}/add/cs/admin/wa/redirect`,
    delete: `${baseUrl}/delete/cs/admin/wa/redirect`,
  },
  campaign: {
    table: `${baseUrl}/data/campaign/wa/redirect/${owner_id}`,
    list: `${baseUrl}/campaign/wa/redirect/${owner_id}`,
    detail: `${baseUrl}/detail/campaign/wa/redirect`,
    update: `${baseUrl}/update/campaign/wa/redirect`,
    create: `${baseUrl}/add/campaign/wa/redirect`,
    delete: `${baseUrl}/delete/campaign/wa/redirect`,
  },
  detailcampaign: {
    table: `${baseUrl}/data/table/detail/campaign/wa/redirect`,
    detail: `${baseUrl}/detail/data/campaign/wa/redirect`,
    update: `${baseUrl}/update/detail/campaign/wa/redirect`,
    create: `${baseUrl}/add/detail/campaign/wa/redirect`,
    delete: `${baseUrl}/delete/detail/campaign/wa/redirect`,
  },
  tool: {
    table: `${baseUrl}/data/campaign/tool/wa/redirect/${owner_id}`,
    list: `${baseUrl}/campaign/tool/wa/redirect/${owner_id}`,
    detail: `${baseUrl}/detail/campaign/tool/wa/redirect`,
    update: `${baseUrl}/update/tool/campaign/wa/redirect`,
    create: `${baseUrl}/add/tool/campaign/wa/redirect`,
    delete: `${baseUrl}/delete/tool/campaign/wa/redirect`,
  }
};

async function fetchData(type, page = 1, id = null) {
  try {
    let url;

    if (type === 'detailcampaign') {
      if (!id) throw new Error('Campaign ID is required for detailcampaign');
      url = `${endpoints.detailcampaign.table}/${id}/${page}`;
    } else {
      url = `${endpoints[type].table}/${page}`;
    }
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    return { data: [], totalRecords: 0, totalPages: 0 };
  }
}

async function fetchList(type) {
  try {
    let url;

    url = `${endpoints[type].list}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} data: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Normalize data for both admin and campaign responses
    return result; 
  } catch (error) {
    console.error(`Error fetching ${type} list:`, error);
    return [];
  }
}


async function fetchById(type, id) {
  try {
    const response = await fetch(`${endpoints[type].detail}/${id}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log(data);
    return data.detail[0];
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