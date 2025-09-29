// Application de gestion de crise cyber - JavaScript

const API_BASE_URL = 'http://localhost:5000/api';

async function fetchIncidents() {
    console.log('Attempting to fetch incidents...');
    const token = localStorage.getItem('gestcyber_token');

    try {
        const response = await fetch(`${API_BASE_URL}/incidents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'x-auth-token': token })
            }
        });

        if (response.status === 401) {
            console.error('Unauthorized: No token or token invalid. Please log in.');
            displayErrorOnDashboard('Failed to fetch incidents: Authorization required. Please log in.');
            return [];
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ msg: 'Unknown error occurred' }));
            console.error('Échec de la récupération des incidents:', response.status, errorData.msg);
            displayErrorOnDashboard(`Échec de la récupération des incidents: ${errorData.msg || response.statusText}`);
            return [];
        }
        const incidents = await response.json();
        console.log('Incidents fetched:', incidents);
        return incidents;
    } catch (error) {
        console.error('Error fetching incidents:', error);
        displayErrorOnDashboard('Error fetching incidents: Could not connect to server.');
        return [];
    }
}

function displayErrorOnDashboard(message) {
    const statusOverviewCardBody = document.querySelector('#dashboard .status-overview .card__body');
    if (statusOverviewCardBody) {
        statusOverviewCardBody.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
    }
}

function renderIncidents(incidents) {
    const timelineRecentCardBody = document.querySelector('#dashboard .timeline-recent .card__body');
    const timelineContainer = document.querySelector('#dashboard .timeline-recent .timeline');

    if (!timelineRecentCardBody) {
        console.warn('Timeline recent card body not found for rendering incidents.');
        return;
    }
    if(timelineContainer) {
      timelineContainer.innerHTML = '';
    } else {
      timelineRecentCardBody.innerHTML = '';
    }

    if (incidents.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Aucun incident trouvé ou échec du chargement.';
        if(timelineContainer) timelineContainer.appendChild(p);
        else timelineRecentCardBody.appendChild(p);
        return;
    }

    const newTimelineContainer = timelineContainer || document.createElement('div');
    newTimelineContainer.className = 'timeline';

    incidents.forEach(incident => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        if (incident.niveau_critique === 'crise' || incident.niveau_critique === 'critique') {
            item.classList.add('critical');
        } else if (incident.niveau_critique === 'alerte') {
            item.classList.add('warning');
        }

        const date = new Date(incident.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

        item.innerHTML = `
            <div class="timeline-time">${date}</div>
            <div class="timeline-content">
                <strong>${incident.titre || 'Titre non disponible'}</strong>
                <p>Description: ${incident.description || 'N/A'}</p>
                <p>Statut: ${incident.statut || 'N/A'} | Phase: ${incident.phase_actuelle || 'N/A'} | Criticité: ${incident.niveau_critique || 'N/A'}</p>
                <div class="incident-item-actions" style="margin-top: 10px; display: flex; gap: 10px;">
                    <button class="btn btn--sm btn--secondary edit-incident-btn" data-id="${incident.id}">Modifier</button>
                    <button class="btn btn--sm btn--outline delete-incident-btn" data-id="${incident.id}" style="border-color: var(--color-error); color: var(--color-error);">Supprimer</button>
                </div>
            </div>
        `;
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) return;
            currentSelectedIncidentIdForFil = incident.id;
            const contextDisplay = document.getElementById('communication-context-incident-id');
            if (contextDisplay) {
                contextDisplay.textContent = `Fil des Événements pour l'Incident : #${incident.id} - ${incident.titre || 'Titre inconnu'}`;
            }
            showNotification(`Contexte "Fil des Événements" réglé sur l'incident #${incident.id}`, 'info');
            if (communicationPage && communicationPage.classList.contains('active')) {
                loadFilEvenements(currentSelectedIncidentIdForFil);
            }
        });
        newTimelineContainer.appendChild(item);
    });

    if(!timelineContainer) {
      timelineRecentCardBody.appendChild(newTimelineContainer);
    }
}

async function loadDashboardData() {
    const incidents = await fetchIncidents();
    renderIncidents(incidents);
}

// DonnÃ©es de dÃ©monstration
const crisisData = {
    startTime: new Date('2025-06-11T08:30:00'),
    currentStatus: 'Crise',
    currentPhase: 2,
    affectedSystems: ['Serveurs de donnÃ©es patients', 'SystÃ¨me de facturation', 'Messagerie interne'],
    actionsInProgress: 12,
    actionsCompleted: 8,
    mobilizedTeams: 25
};

// Ãtat de l'application
let currentPage = 'dashboard';
let currentSelectedIncidentIdForFil = null;

const editIncidentModal = document.getElementById('edit-incident-modal');
const editIncidentForm = document.getElementById('edit-incident-form');
const editIncidentErrorMessage = document.getElementById('edit-incident-error-message');
const editIncidentIdField = document.getElementById('edit-incident-id');
const editIncidentTitreField = document.getElementById('edit-incident-titre');
const editIncidentDescriptionField = document.getElementById('edit-incident-description');
const editIncidentTypeField = document.getElementById('edit-incident-type');
const editIncidentNiveauCritiqueField = document.getElementById('edit-incident-niveau-critique');
const editIncidentPhaseActuelleField = document.getElementById('edit-incident-phase-actuelle');
const editIncidentStatutField = document.getElementById('edit-incident-statut');
const editIncidentPerimetreImpactField = document.getElementById('edit-incident-perimetre-impact');
const editIncidentDirigeantCriseIdField = document.getElementById('edit-incident-dirigeant-crise-id');
const editIncidentDateFinField = document.getElementById('edit-incident-date-fin');
const communicationPage = document.getElementById('communication');

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
        const timelineContainer = document.querySelector('#dashboard .timeline-recent .timeline');
        if (timelineContainer) {
             timelineContainer.innerHTML = '<p>Veuillez vous connecter pour voir les incidents.</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginErrorMessage = document.getElementById('login-error-message');
    const registerErrorMessage = document.getElementById('register-error-message');

    initializeNavigation();
    initializeModals();

    // Modals Toggling Logic
    const closeLoginModalBtn = document.getElementById('close-login-modal');
    const cancelLoginModalBtn = document.getElementById('cancel-login-modal');
    const closeRegisterModalBtn = document.getElementById('close-register-modal');
    const cancelRegisterModalBtn = document.getElementById('cancel-register-modal');

    if (loginBtn) loginBtn.addEventListener('click', () => { if (loginModal) loginModal.classList.add('show'); });
    if (registerBtn) registerBtn.addEventListener('click', () => { if (registerModal) registerModal.classList.add('show'); });

    const closeModal = (modal, errorMsg) => {
        if (modal) modal.classList.remove('show');
        if (errorMsg) errorMsg.style.display = 'none';
    };

    if (closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', () => closeModal(loginModal, loginErrorMessage));
    if (cancelLoginModalBtn) cancelLoginModalBtn.addEventListener('click', () => closeModal(loginModal, loginErrorMessage));
    if (loginModal) loginModal.addEventListener('click', (e) => { if (e.target === loginModal) closeModal(loginModal, loginErrorMessage); });

    if (closeRegisterModalBtn) closeRegisterModalBtn.addEventListener('click', () => closeModal(registerModal, registerErrorMessage));
    if (cancelRegisterModalBtn) cancelRegisterModalBtn.addEventListener('click', () => closeModal(registerModal, registerErrorMessage));
    if (registerModal) registerModal.addEventListener('click', (e) => { if (e.target === registerModal) closeModal(registerModal, registerErrorMessage); });

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (loginErrorMessage) loginErrorMessage.style.display = 'none';
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.msg || 'Échec de la connexion.');
                }
                localStorage.setItem('gestcyber_token', data.token);
                showNotification('Connexion réussie !', 'success');
                closeModal(loginModal, loginErrorMessage);
                loginForm.reset();
                updateUIForLoggedInState();
                loadDashboardData();
            } catch (error) {
                if (loginErrorMessage) {
                    loginErrorMessage.textContent = error.message;
                    loginErrorMessage.style.display = 'block';
                }
            }
        });
    }

    // Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (registerErrorMessage) registerErrorMessage.style.display = 'none';
            const nom = document.getElementById('register-nom').value;
            const prenom = document.getElementById('register-prenom').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom, prenom, email, password }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.msg || 'Échec de l\'inscription.');
                }
                localStorage.setItem('gestcyber_token', data.token);
                showNotification('Inscription réussie ! Vous êtes connecté.', 'success');
                closeModal(registerModal, registerErrorMessage);
                registerForm.reset();
                updateUIForLoggedInState();
                loadDashboardData();
            } catch (error) {
                if (registerErrorMessage) {
                    registerErrorMessage.textContent = error.message;
                    registerErrorMessage.style.display = 'block';
                }
            }
        });
    }

    // Logout Button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('gestcyber_token');
            showNotification('Déconnexion réussie.', 'info');
            updateUIForLoggedInState();
        });
    }

    checkAuthStateOnLoad();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');
            currentPage = targetPage;
            if (targetPage === 'dashboard') {
                loadDashboardData();
            }
        });
    });
}

function initializeModals() {
    const incidentModal = document.getElementById('incident-modal');
    const newIncidentBtn = document.getElementById('new-incident-btn');
    if (newIncidentBtn) {
        newIncidentBtn.addEventListener('click', () => incidentModal.classList.add('show'));
    }
    document.getElementById('close-incident-modal').addEventListener('click', () => incidentModal.classList.remove('show'));
    document.getElementById('cancel-incident').addEventListener('click', () => incidentModal.classList.remove('show'));
    incidentModal.addEventListener('click', (e) => {
        if (e.target === incidentModal) incidentModal.classList.remove('show');
    });
    document.getElementById('incident-form').addEventListener('submit', handleIncidentSubmit);
}

async function handleIncidentSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const incidentData = {
        titre: document.getElementById('incident-titre').value,
        type_incident: document.getElementById('incident-type').value,
        niveau_critique: document.getElementById('incident-urgence').value,
        description: document.getElementById('incident-description').value,
        phase_actuelle: 'phase1_alerter',
        statut: 'ouvert'
    };
    const token = localStorage.getItem('gestcyber_token');
    try {
        const response = await fetch(`${API_BASE_URL}/incidents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token && { 'x-auth-token': token }) },
            body: JSON.stringify(incidentData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Impossible de créer l\'incident');
        }
        showNotification('Incident déclaré avec succès !', 'success');
        document.getElementById('incident-modal').classList.remove('show');
        form.reset();
        loadDashboardData();
    } catch (error) {
        showNotification(`Erreur: ${error.message}`, 'error');
    }
}

async function checkAuthStateOnLoad() {
    const token = localStorage.getItem('gestcyber_token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                updateUIForLoggedInState();
                loadDashboardData();
            } else {
                localStorage.removeItem('gestcyber_token');
                updateUIForLoggedInState();
            }
        } catch (error) {
            console.error('Error verifying token on load:', error);
            localStorage.removeItem('gestcyber_token');
            updateUIForLoggedInState();
            displayErrorOnDashboard('Impossible de vérifier la session. Le serveur est peut-être indisponible.');
        }
    } else {
        updateUIForLoggedInState();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 12px 20px;
        background: ${type === 'error' ? 'var(--color-error)' : 'var(--color-success)'};
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