// Application de gestion de crise cyber - JavaScript

const API_BASE_URL = 'http://localhost:5000/api';

const pageMeta = {
    accueil: {
        breadcrumb: [{ label: 'Accueil', page: 'accueil' }],
    },
    dashboard: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Tableau de bord', page: 'dashboard' },
        ],
    },
    gouvernance: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Gouvernance', page: 'gouvernance' },
        ],
    },
    actions: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Plan d\'actions', page: 'actions' },
        ],
    },
    communication: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Communication', page: 'communication' },
        ],
    },
    investigation: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Investigation', page: 'investigation' },
        ],
    },
    reconstruction: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Reconstruction', page: 'reconstruction' },
        ],
    },
    reporting: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Reporting', page: 'reporting' },
        ],
    },
    profil: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Mon profil', page: 'profil' },
        ],
    },
    parametres: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Paramètres', page: 'parametres' },
        ],
    },
    aide: {
        breadcrumb: [
            { label: 'Accueil', page: 'accueil' },
            { label: 'Centre d\'aide', page: 'aide' },
        ],
    },
};

const demoIncidents = [
    {
        id: 'INC-245',
        titre: 'Intrusion par ransomware LockBit',
        statut: 'critique',
        responsable: 'Équipe SOC',
        derniereMiseAJour: 'Il y a 2 heures',
    },
    {
        id: 'INC-246',
        titre: 'Campagne de phishing ciblé',
        statut: 'en_cours',
        responsable: 'Cellule Communication',
        derniereMiseAJour: 'Il y a 30 minutes',
    },
    {
        id: 'INC-247',
        titre: 'Compromission de compte AD',
        statut: 'en_cours',
        responsable: 'Blue Team',
        derniereMiseAJour: 'Il y a 10 minutes',
    },
    {
        id: 'INC-248',
        titre: 'Fuite de données sensibles',
        statut: 'critique',
        responsable: 'RSSI',
        derniereMiseAJour: 'Il y a 1 heure',
    },
    {
        id: 'INC-249',
        titre: 'Arrêt de service applicatif',
        statut: 'resolu',
        responsable: 'Équipe Infra',
        derniereMiseAJour: 'Hier',
    },
];

const demoActivity = [
    {
        time: '08:35',
        author: 'A. Dupont',
        action: 'a validé le plan de communication externe.',
    },
    {
        time: '09:12',
        author: 'M. Laurent',
        action: 'a mis à jour la checklist de gouvernance pour INC-245.',
    },
    {
        time: '10:24',
        author: 'S. Diallo',
        action: 'a finalisé le rapport d\'investigation préliminaire.',
    },
    {
        time: '11:02',
        author: 'Équipe SOC',
        action: 'a appliqué les IOC partagés par l\'ANSSI.',
    },
];

const demoNotifications = [
    {
        title: 'Nouvelle alerte CERT-FR',
        description: 'Vulnérabilité critique sur les VPN Pulse Secure. Appliquer les correctifs.',
        meta: 'Diffusée il y a 25 min',
        type: 'warning',
    },
    {
        title: 'Retour ANSSI',
        description: 'Un analyste est disponible pour un point de situation à 15h00.',
        meta: 'Reçu ce matin',
        type: 'info',
    },
    {
        title: 'Plan de continuité',
        description: 'Vérifier la disponibilité du PRA pour l\'hébergement secondaire.',
        meta: 'À traiter aujourd\'hui',
        type: 'success',
    },
];

let checklistData = [];
let incidentAnswers = {};
let currentUser = null;
let currentPageId = null;
const navigationHistory = [];

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
    currentUser = null;
    updateUIForLoggedInState();
    updateProfileUI();
    activatePage('accueil', { pushHistory: true });
    showNotification('Déconnexion réussie.', 'info');
}

function updateUIForLoggedInState() {
    const token = localStorage.getItem('gestcyber_token');
    const authButtons = document.getElementById('auth-buttons');
    const logoutBtn = document.getElementById('logout-btn');
    const newIncidentBtn = document.getElementById('new-incident-btn');
    const quickIncidentBtn = document.getElementById('quick-add-incident');
    const sidebarProfileLink = document.getElementById('sidebar-profile-link');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');

    if (token) {
        if (authButtons) authButtons.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (newIncidentBtn) newIncidentBtn.disabled = false;
        if (quickIncidentBtn) quickIncidentBtn.disabled = false;
        if (sidebarProfileLink) sidebarProfileLink.style.display = 'inline-flex';
        if (profileLogoutBtn) profileLogoutBtn.style.display = 'inline-flex';
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (newIncidentBtn) newIncidentBtn.disabled = true;
        if (quickIncidentBtn) quickIncidentBtn.disabled = true;
        if (sidebarProfileLink) sidebarProfileLink.style.display = 'none';
        if (profileLogoutBtn) profileLogoutBtn.style.display = 'none';
    }
}

async function loadCurrentUser() {
    try {
        currentUser = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
        updateProfileUI();
    } catch (error) {
        showNotification(`Impossible de charger votre profil: ${error.message}`, 'warning');
    }
}

function updateProfileUI() {
    const topbarName = document.getElementById('topbar-name');
    const topbarAvatar = document.querySelector('.topbar__avatar');
    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');

    const fullName = currentUser
        ? [currentUser.prenom, currentUser.nom].filter(Boolean).join(' ') || currentUser.nom || 'Utilisateur'
        : 'Invité';
    const role = currentUser?.role || currentUser?.fonction || 'Utilisateur non authentifié';
    const email = currentUser?.email || 'Non renseigné';

    const avatarUrl = `https://ui-avatars.com/api/?background=21808D&color=fff&name=${encodeURIComponent(fullName || 'GestCyber')}`;

    if (topbarName) topbarName.textContent = fullName;
    if (profileName) profileName.textContent = fullName;
    if (profileRole) profileRole.textContent = role;
    if (profileEmail) profileEmail.textContent = email;
    if (topbarAvatar) topbarAvatar.setAttribute('src', avatarUrl);
    if (profileAvatar) profileAvatar.setAttribute('src', avatarUrl);
}

async function checkAuthStateOnLoad() {
    const token = localStorage.getItem('gestcyber_token');
    if (token) {
        try {
            await loadCurrentUser();
            updateUIForLoggedInState();
            activatePage('dashboard', { pushHistory: true, skipFocus: true });
        } catch (error) {
            console.error(error);
            logout();
        }
    } else {
        updateUIForLoggedInState();
        activatePage('accueil', { pushHistory: false, skipFocus: true });
    }
}

// --- Navigation & Mise en page ---
function initializeNavigation() {
    const navTargets = document.querySelectorAll('[data-page]');
    navTargets.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = link.getAttribute('data-page');
            activatePage(pageId);
        });
    });

    const ctaDashboard = document.getElementById('cta-go-dashboard');
    if (ctaDashboard) {
        ctaDashboard.addEventListener('click', (event) => {
            event.preventDefault();
            activatePage('dashboard');
        });
    }

    const brand = document.querySelector('.brand');
    if (brand) {
        brand.addEventListener('click', () => activatePage('accueil'));
    }

    // Première activation sans historique
    activatePage('accueil', { pushHistory: false, skipFocus: true });
}

function activatePage(pageId, options = {}) {
    if (!pageId) return;
    const { pushHistory = true, skipFocus = false } = options;
    const targetPage = document.getElementById(pageId);
    if (!targetPage) return;
    if (currentPageId === pageId && pushHistory) return;

    document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
    targetPage.classList.add('active');
    currentPageId = pageId;

    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach((link) => {
        const matches = link.getAttribute('data-page') === pageId;
        link.classList.toggle('active', matches);
        if (matches) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    updateBreadcrumb(pageId);
    updateBackButton();

    if (pushHistory) {
        if (navigationHistory[navigationHistory.length - 1] !== pageId) {
            navigationHistory.push(pageId);
        }
    } else if (navigationHistory.length === 0) {
        navigationHistory.push(pageId);
    }

    if (!skipFocus) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.focus();
    }

    loadPageData(pageId);
}

function updateBreadcrumb(pageId) {
    const breadcrumbList = document.getElementById('breadcrumb-list');
    if (!breadcrumbList) return;

    const crumbs = pageMeta[pageId]?.breadcrumb || pageMeta.accueil.breadcrumb;
    breadcrumbList.innerHTML = '';

    crumbs.forEach((crumb, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb__item';
        if (index === crumbs.length - 1) {
            const span = document.createElement('span');
            span.className = 'breadcrumb__link';
            span.setAttribute('aria-current', 'page');
            span.textContent = crumb.label;
            li.appendChild(span);
        } else {
            const link = document.createElement('a');
            link.href = `#${crumb.page}`;
            link.className = 'breadcrumb__link';
            link.textContent = crumb.label;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                activatePage(crumb.page);
            });
            li.appendChild(link);
        }
        breadcrumbList.appendChild(li);
    });
}

function updateBackButton() {
    const backButton = document.getElementById('back-button');
    if (!backButton) return;
    backButton.disabled = navigationHistory.length <= 1;
}

function handleBackNavigation() {
    if (navigationHistory.length <= 1) return;
    navigationHistory.pop();
    const previousPage = navigationHistory[navigationHistory.length - 1];
    activatePage(previousPage, { pushHistory: false });
}

function initializeDashboardInteractions() {
    const searchInput = document.getElementById('dashboard-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderDashboard());
    }

    const statusFilter = document.getElementById('dashboard-status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => renderDashboard());
    }

    const viewAllBtn = document.getElementById('dashboard-view-all');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            showNotification('Fonctionnalité à venir : affichage détaillé des incidents.', 'info');
        });
    }
}

function initializeChecklistInteractions() {
    const selector = document.getElementById('incident-selector');
    if (selector) selector.addEventListener('change', handleIncidentSelectionChange);

    const checklistContainer = document.getElementById('checklist-container');
    if (checklistContainer) checklistContainer.addEventListener('change', handleChecklistChange);
}

function setupGlobalActions() {
    const backButton = document.getElementById('back-button');
    if (backButton) backButton.addEventListener('click', handleBackNavigation);

    const quickIncidentBtn = document.getElementById('quick-add-incident');
    if (quickIncidentBtn) {
        quickIncidentBtn.addEventListener('click', () => {
            if (!localStorage.getItem('gestcyber_token')) {
                showNotification('Connectez-vous pour déclarer un incident.', 'warning');
                return;
            }
            activatePage('dashboard');
            document.getElementById('incident-modal')?.classList.add('show');
        });
    }

    const quickExportBtn = document.getElementById('quick-export');
    if (quickExportBtn) {
        quickExportBtn.addEventListener('click', () => {
            showNotification('Export en cours... vous recevrez un e-mail contenant le rapport.', 'info');
        });
    }

    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    if (profileLogoutBtn) profileLogoutBtn.addEventListener('click', logout);
}

// --- Tableau de bord & Profil ---
function renderDashboard() {
    const summaryContainer = document.getElementById('dashboard-summary');
    const incidentsList = document.getElementById('recent-incidents-list');
    const timeline = document.getElementById('activity-timeline');
    const notificationCenter = document.getElementById('notification-center');
    if (!summaryContainer || !incidentsList || !timeline || !notificationCenter) return;

    const searchTerm = document.getElementById('dashboard-search')?.value?.toLowerCase().trim() || '';
    const statusFilter = document.getElementById('dashboard-status-filter')?.value || 'all';

    const filteredIncidents = demoIncidents.filter((incident) => {
        const matchesSearch = [incident.id, incident.titre, incident.responsable]
            .join(' ')
            .toLowerCase()
            .includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || incident.statut === statusFilter;
        return matchesSearch && matchesStatus;
    });

    renderSummaryCards(summaryContainer, filteredIncidents);
    renderRecentIncidents(incidentsList, filteredIncidents);
    renderActivityTimeline(timeline);
    renderNotifications(notificationCenter);
}

function renderSummaryCards(container, incidents) {
    const activeCount = incidents.filter((incident) => incident.statut !== 'resolu').length;
    const criticalCount = incidents.filter((incident) => incident.statut === 'critique').length;
    const resolvedCount = incidents.filter((incident) => incident.statut === 'resolu').length;

    const cards = [
        { label: 'Incidents actifs', value: activeCount, modifier: 'summary-card--warning' },
        { label: 'Incidents critiques', value: criticalCount, modifier: 'summary-card--critical' },
        { label: 'Incidents résolus (30j)', value: resolvedCount, modifier: 'summary-card--success' },
        { label: 'Temps moyen de résolution', value: '4h12', modifier: '' },
    ];

    container.innerHTML = cards
        .map(
            (card) => `
            <article class="summary-card ${card.modifier}">
                <span class="summary-card__value">${card.value}</span>
                <span class="summary-card__label">${card.label}</span>
            </article>
        `,
        )
        .join('');
}

function renderRecentIncidents(listElement, incidents) {
    const badgeClass = {
        critique: 'status--error',
        en_cours: 'status--warning',
        resolu: 'status--success',
    };

    if (incidents.length === 0) {
        listElement.innerHTML = '<li>Aucun incident ne correspond à votre recherche.</li>';
        return;
    }

    listElement.innerHTML = incidents
        .slice(0, 4)
        .map((incident) => `
            <li data-status="${incident.statut}">
                <div>
                    <strong>${incident.titre}</strong>
                    <p class="notification__meta">${incident.derniereMiseAJour} • ${incident.responsable}</p>
                </div>
                <span class="status ${badgeClass[incident.statut] || 'status--info'}">${incident.id}</span>
            </li>
        `)
        .join('');
}

function renderActivityTimeline(timeline) {
    timeline.innerHTML = demoActivity
        .map(
            (item) => `
            <li class="timeline__item">
                <time>${item.time}</time>
                <strong>${item.author}</strong>
                <span>${item.action}</span>
            </li>
        `,
        )
        .join('');
}

function renderNotifications(container) {
    container.innerHTML = demoNotifications
        .map(
            (notification) => `
            <li class="notification notification--${notification.type}">
                <span class="notification__title">${notification.title}</span>
                <p>${notification.description}</p>
                <span class="notification__meta">${notification.meta}</span>
            </li>
        `,
        )
        .join('');
}

function renderProfile() {
    updateProfileUI();

    const profileInfo = document.getElementById('profile-info');
    const profileActivity = document.getElementById('profile-activity');
    if (!profileInfo || !profileActivity) return;

    const defaultOrganisation = currentUser?.organisation || 'GestCyber';
    const info = [
        { label: 'Nom complet', value: document.getElementById('profile-name')?.textContent || 'Invité' },
        { label: 'Adresse e-mail', value: currentUser?.email || 'Non renseignée' },
        { label: 'Rôle', value: currentUser?.role || currentUser?.fonction || 'Utilisateur' },
        { label: 'Organisation', value: defaultOrganisation },
        { label: 'Fuseau horaire', value: 'Europe/Paris' },
    ];

    profileInfo.innerHTML = info
        .map(
            (item) => `
            <div>
                <dt>${item.label}</dt>
                <dd>${item.value}</dd>
            </div>
        `,
        )
        .join('');

    profileActivity.innerHTML = demoActivity
        .slice(0, 3)
        .map((activity) => `
            <li>
                <strong>${activity.author}</strong>
                <p>${activity.action}</p>
                <span class="notification__meta">${activity.time}</span>
            </li>
        `)
        .join('');
}

// --- Logique de la page Gouvernance ---
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
        incidents.forEach((inc) => {
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
    checklistData.forEach((category) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'checklist-category';

        const itemsHtml = category.items
            .map((item) => {
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
            })
            .join('');

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
        commentaires: itemContainer.querySelector('input[type="text"]').value,
    };

    try {
        const updatedAnswer = await fetchWithAuth(`${API_BASE_URL}/gouvernance/answers`, {
            method: 'POST',
            body: JSON.stringify(answerData),
        });
        incidentAnswers[itemId] = updatedAnswer;
    } catch (error) {
        showNotification(`Erreur de sauvegarde: ${error.message}`, 'error');
    }
}

// --- Chargement conditionnel des pages ---
function loadPageData(pageId) {
    if (pageId === 'dashboard') {
        renderDashboard();
    } else if (pageId === 'profil') {
        renderProfile();
    } else if (pageId === 'gouvernance') {
        if (!localStorage.getItem('gestcyber_token')) {
            showNotification('Authentifiez-vous pour accéder à la gouvernance.', 'warning');
            return;
        }
        loadGouvernancePage();
    }
}

// --- Initialisation des modales et formulaires ---
function initializeModals() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    if (loginBtn) loginBtn.addEventListener('click', () => loginModal.classList.add('show'));
    if (registerBtn) registerBtn.addEventListener('click', () => registerModal.classList.add('show'));
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    document.querySelectorAll('.modal .modal-close, .modal .btn--secondary').forEach((btn) => {
        btn.addEventListener('click', () => btn.closest('.modal').classList.remove('show'));
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleAuthFormSubmit);

    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleAuthFormSubmit);

    const newIncidentBtn = document.getElementById('new-incident-btn');
    const incidentModal = document.getElementById('incident-modal');
    if (newIncidentBtn) newIncidentBtn.addEventListener('click', () => incidentModal.classList.add('show'));

    const incidentForm = document.getElementById('incident-form');
    if (incidentForm) incidentForm.addEventListener('submit', handleIncidentFormSubmit);
}

async function handleAuthFormSubmit(event) {
    event.preventDefault();
    const isRegister = event.target.id === 'register-form';
    const endpoint = isRegister ? 'register' : 'login';
    const modal = isRegister ? document.getElementById('register-modal') : document.getElementById('login-modal');
    const errorMsgEl = isRegister
        ? document.getElementById('register-error-message')
        : document.getElementById('login-error-message');

    const formData = {
        email: event.target.querySelector('input[type="email"]').value,
        password: event.target.querySelector('input[type="password"]').value,
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
        await loadCurrentUser();
        updateUIForLoggedInState();
        modal.classList.remove('show');
        event.target.reset();
        showNotification(isRegister ? 'Inscription réussie !' : 'Connexion réussie !', 'success');
        activatePage('dashboard');
    } catch (error) {
        errorMsgEl.textContent = error.message;
        errorMsgEl.style.display = 'block';
    }
}

async function handleIncidentFormSubmit(event) {
    event.preventDefault();
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
        event.target.reset();
        if (document.getElementById('gouvernance').classList.contains('active')) {
            populateIncidentSelector();
        }
    } catch (error) {
        showNotification(`Erreur: ${error.message}`, 'error');
    }
}

function showNotification(message, type = 'info') {
    const palette = {
        success: '#1FB8CD',
        error: '#B4413C',
        warning: '#E68161',
        info: '#21808D',
    };
    const notification = document.createElement('div');
    notification.className = `notification toast-${type}`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 12px 20px;
        background: ${palette[type] || palette.info};
        color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1001; transition: all 0.3s ease; transform: translateX(100%); opacity: 0;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// --- Initialisation globale ---
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeModals();
    initializeDashboardInteractions();
    initializeChecklistInteractions();
    setupGlobalActions();
    updateProfileUI();
    checkAuthStateOnLoad();
});
