const API_URL = 'http://localhost:4000';

const state = {
  token: null,
  clients: [],
  selectedClient: null
};

const clientList = document.getElementById('client-list');
const clientDetails = document.getElementById('client-details');
const emptyState = document.getElementById('empty-state');
const clientName = document.getElementById('client-name');
const clientEmail = document.getElementById('client-email');
const clientPhone = document.getElementById('client-phone');
const clientNotes = document.getElementById('client-notes');
const travelsContainer = document.getElementById('travels-container');
const clientModal = document.getElementById('client-modal');
const clientForm = document.getElementById('client-form');
const addClientBtn = document.getElementById('add-client-btn');

const travelTemplate = document.getElementById('travel-template');

const authenticate = async () => {
  const email = window.prompt('Email');
  const password = window.prompt('Contraseña');
  if (!email || !password) return;

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    alert('Error de autenticación');
    return;
  }

  const data = await response.json();
  state.token = data.token;
  await loadClients();
};

const loadClients = async () => {
  const response = await fetch(`${API_URL}/clientes`, {
    headers: {
      Authorization: `Bearer ${state.token}`
    }
  });
  const clients = await response.json();
  state.clients = clients;
  renderClientList();
};

const renderClientList = () => {
  clientList.innerHTML = '';
  state.clients.forEach((client) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="name">${client.firstName} ${client.lastName}</span><span class="info">${
      client.email
    }</span>`;
    li.addEventListener('click', () => selectClient(client.id));
    if (state.selectedClient && state.selectedClient.id === client.id) {
      li.classList.add('active');
    }
    clientList.appendChild(li);
  });
};

const selectClient = (clientId) => {
  const client = state.clients.find((c) => c.id === clientId);
  if (!client) return;
  state.selectedClient = client;
  clientName.textContent = `${client.firstName} ${client.lastName}`;
  clientEmail.textContent = client.email || '—';
  clientPhone.textContent = client.phone || '—';
  clientNotes.textContent = client.notes || '—';
  renderTravels(client.travels || []);

  clientDetails.classList.remove('hidden');
  emptyState.classList.add('hidden');
  renderClientList();
};

const renderTravels = (travels) => {
  travelsContainer.innerHTML = '';
  travels.forEach((travel) => {
    const node = travelTemplate.content.cloneNode(true);
    node.querySelector('.travel-name').textContent = travel.name;

    node.querySelectorAll('.travel-section').forEach((sectionNode) => {
      const section = sectionNode.dataset.section;
      const sectionDocs = (travel.documents || []).filter((doc) => doc.section === section);
      const list = sectionNode.querySelector('.document-list');

      sectionDocs.forEach((doc) => {
        const item = document.createElement('li');
        item.innerHTML = `<span>${doc.title}</span><a href="${API_URL}/documentos/${doc.id}" target="_blank">Ver</a>`;
        list.appendChild(item);
      });
    });

    travelsContainer.appendChild(node);
  });
};

addClientBtn.addEventListener('click', () => {
  clientModal.showModal();
});

clientForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(clientForm);

  const response = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${state.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  });

  if (!response.ok) {
    alert('No se pudo crear el cliente');
    return;
  }

  clientModal.close('submit');
  clientForm.reset();
  await loadClients();
});

window.addEventListener('DOMContentLoaded', () => {
  authenticate();
});
