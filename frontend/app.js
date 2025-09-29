// Application de gestion de crise cyber - JavaScript

const API_BASE_URL = 'http://localhost:5000/api';

// --- Fonctions d'API ---

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('gestcyber_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }),
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        showNotification('Session expirée. Veuillez vous reconnecter.', 'error');
        logout();
        throw new Error('Unauthorized');
    }

    const responseData = await response.json().catch(() => ({ msg: response.statusText }));
    if (!response.ok) {
        throw new Error(responseData.msg || `Erreur serveur: ${response.status}`);
    }
    return responseData;
}


// --- Logique d'Authentification ---

function logout() {
    localStorage.removeItem('gestcyber_token');
    showNotification('Déconnexion réussie.', 'info');
    updateUIForLoggedInState();
    window.location.reload();
}

function updateUIForLoggedInState() {
    const token = localStorage.getItem('gestcyber_token');
    const authButtons = document.getElementById('auth-buttons');
    const logoutBtn = document.getElementById('logout-btn');
    const newIncidentBtn = document.getElementById('new-incident-btn');

    if (token) {
        if (authButtons) authButtons.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (newIncidentBtn) newIncidentBtn.disabled = false;
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (newIncidentBtn) newIncidentBtn.disabled = true;
        document.getElementById('dashboard').innerHTML = '<h1>Veuillez vous connecter pour voir le tableau de bord.</h1>';
        document.getElementById('gouvernance').innerHTML = '<h1>Veuillez vous connecter pour voir la gouvernance.</h1>';
    }
}

async function checkAuthStateOnLoad() {
    const token = localStorage.getItem('gestcyber_token');
    if (token) {
        try {
            await fetchWithAuth(`${API_BASE_URL}/auth/me`);
            updateUIForLoggedInState();
            loadPageData('dashboard');
        } catch (error) {
            logout();
        }
    } else {
        updateUIForLoggedInState();
    }
}

// --- Logique de la page Gouvernance ---

let checklistData = [];
let incidentAnswers = {};

async function loadGouvernancePage() {
    try {
        if (checklistData.length === 0) {
            checklistData = await fetchWithAuth(`${API_BASE_URL}/gouvernance/checklist`);
        }
        await populateIncidentSelector();
        renderChecklist();
    } catch (error) {
        showNotification(`Erreur de chargement de la page Gouvernance: ${error.message}`, 'error');
    }
}

async function populateIncidentSelector() {
    const selector = document.getElementById('incident-selector');
    if (!selector) return;
    try {
        const incidents = await fetchWithAuth(`${API_BASE_URL}/incidents`);
        const currentVal = selector.value;
        selector.innerHTML = '<option value="">-- Sélectionnez un incident --</option>';
        incidents.forEach(inc => {
            const option = document.createElement('option');
            option.value = inc.id;
            option.textContent = `#${inc.id} - ${inc.titre}`;
            selector.appendChild(option);
        });
        selector.value = currentVal;
    } catch (error) {
         selector.innerHTML = '<option value="">Erreur de chargement</option>';
    }
}

async function handleIncidentSelectionChange(event) {
    const incidentId = event.target.value;
    const container = document.getElementById('checklist-container');
    if (!container) return;

    if (!incidentId) {
        incidentAnswers = {};
        renderChecklist();
        return;
    }

    try {
        const answers = await fetchWithAuth(`${API_BASE_URL}/gouvernance/answers/${incidentId}`);
        incidentAnswers = answers.reduce((acc, ans) => {
            acc[ans.item_id] = ans;
            return acc;
        }, {});
        renderChecklist();
    } catch (error) {
        showNotification(`Erreur chargement des réponses: ${error.message}`, 'error');
    }
}

function renderChecklist() {
    const container = document.getElementById('checklist-container');
    if (!container) return;

    container.innerHTML = '';
    checklistData.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'checklist-category';

        let itemsHtml = category.items.map(item => {
            const answer = incidentAnswers[item.id] || {};
            return `
                <div class="checklist-item">
                    <label>
                        <input type="checkbox" data-item-id="${item.id}" ${answer.reponse_boolean ? 'checked' : ''}>
                        ${item.question}
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="Commentaires..." data-item-id="${item.id}" value="${answer.commentaires || ''}">
                </div>
            `;
        }).join('');

        categoryDiv.innerHTML = `<h3>${category.nom}</h3><div class="checklist-items-container">${itemsHtml}</div>`;
        container.appendChild(categoryDiv);
    });
}

async function handleChecklistChange(event) {
    const target = event.target;
    const incidentId = document.getElementById('incident-selector').value;

    if (!incidentId) {
        showNotification('Veuillez sélectionner un incident.', 'warning');
        if (target.type === 'checkbox') target.checked = !target.checked;
        return;
    }

    const itemId = target.dataset.itemId;
    const itemContainer = target.closest('.checklist-item');

    const answerData = {
        incident_id: incidentId,
        item_id: itemId,
        reponse_boolean: itemContainer.querySelector('input[type="checkbox"]').checked,
        commentaires: itemContainer.querySelector('input[type="text"]').value
    };

    try {
        const updatedAnswer = await fetchWithAuth(`${API_BASE_URL}/gouvernance/answers`, {
            method: 'POST',
            body: JSON.stringify(answerData)
        });
        incidentAnswers[itemId] = updatedAnswer; // Mettre à jour l'état local
    } catch (error) {
        showNotification(`Erreur de sauvegarde: ${error.message}`, 'error');
    }
}

// --- Initialisation ---

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    checkAuthStateOnLoad();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPageId = this.getAttribute('data-page');
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById(targetPageId).classList.add('active');
            loadPageData(targetPageId);
        });
    });
}

function loadPageData(pageId) {
    if (!localStorage.getItem('gestcyber_token')) return;
    if (pageId === 'gouvernance') loadGouvernancePage();
}

function initializeModals() {
    // Auth Modals
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    if (loginBtn) loginBtn.addEventListener('click', () => loginModal.classList.add('show'));
    if (registerBtn) registerBtn.addEventListener('click', () => registerModal.classList.add('show'));
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    document.querySelectorAll('.modal .modal-close, .modal .btn--secondary').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal').classList.remove('show'));
    });

    document.getElementById('login-form').addEventListener('submit', handleAuthFormSubmit);
    document.getElementById('register-form').addEventListener('submit', handleAuthFormSubmit);

    // Incident Modal
    const newIncidentBtn = document.getElementById('new-incident-btn');
    const incidentModal = document.getElementById('incident-modal');
    if (newIncidentBtn) newIncidentBtn.addEventListener('click', () => incidentModal.classList.add('show'));
    document.getElementById('incident-form').addEventListener('submit', handleIncidentFormSubmit);
}

async function handleAuthFormSubmit(e) {
    e.preventDefault();
    const isRegister = e.target.id === 'register-form';
    const endpoint = isRegister ? 'register' : 'login';
    const modal = isRegister ? document.getElementById('register-modal') : document.getElementById('login-modal');
    const errorMsgEl = isRegister ? document.getElementById('register-error-message') : document.getElementById('login-error-message');

    const formData = {
        email: e.target.querySelector('input[type="email"]').value,
        password: e.target.querySelector('input[type="password"]').value,
    };
    if (isRegister) {
        formData.nom = document.getElementById('register-nom').value;
        formData.prenom = document.getElementById('register-prenom').value;
    }

    try {
        const data = await fetchWithAuth(`${API_BASE_URL}/auth/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        localStorage.setItem('gestcyber_token', data.token);
        showNotification(isRegister ? 'Inscription réussie !' : 'Connexion réussie !', 'success');
        modal.classList.remove('show');
        e.target.reset();
        updateUIForLoggedInState();
        loadPageData('dashboard');
    } catch (error) {
        errorMsgEl.textContent = error.message;
        errorMsgEl.style.display = 'block';
    }
}

async function handleIncidentFormSubmit(e) {
    e.preventDefault();
    const modal = document.getElementById('incident-modal');
    const incidentData = {
        titre: document.getElementById('incident-titre').value,
        description: document.getElementById('incident-description').value,
    };
    try {
        await fetchWithAuth(`${API_BASE_URL}/incidents`, {
            method: 'POST',
            body: JSON.stringify(incidentData),
        });
        showNotification('Incident créé avec succès !', 'success');
        modal.classList.remove('show');
        e.target.reset();
        // Rafraîchir la liste des incidents si nous sommes sur la page de gouvernance
        if (document.getElementById('gouvernance').classList.contains('active')) {
            populateIncidentSelector();
        }
    } catch (error) {
        showNotification(`Erreur: ${error.message}`, 'error');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 12px 20px;
        background: ${type === 'error' ? '#B4413C' : '#1FB8CD'};
        color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1001; transition: all 0.3s ease; transform: translateX(100%); opacity: 0;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event listener pour la checklist (délégation d'événement)
const checklistContainer = document.getElementById('checklist-container');
if(checklistContainer) checklistContainer.addEventListener('change', handleChecklistChange);