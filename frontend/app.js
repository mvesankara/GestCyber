// Application de gestion de crise cyber - JavaScript

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

const phases = [
    {
        id: 1,
        nom: "Alerter, mobiliser et endiguer",
        description: "Activation du dispositif de crise et premiÃ¨res mesures d'endiguement",
        actionsTypes: ["Activer cellule de crise", "Isoler systÃ¨mes compromis", "Alerter autoritÃ©s", "Mobiliser Ã©quipes"]
    },
    {
        id: 2,
        nom: "Maintenir la confiance et comprendre l'attaque", 
        description: "Communication de crise et investigation technique",
        actionsTypes: ["Communiquer parties prenantes", "Analyser logs", "Identifier pÃ©rimÃ¨tre", "Mode dÃ©gradÃ©"]
    },
    {
        id: 3,
        nom: "Relancer les activitÃ©s et durcir les SI",
        description: "Reconstruction sÃ©curisÃ©e et durcissement", 
        actionsTypes: ["Durcir systÃ¨mes", "Restaurer donnÃ©es", "Tester applications", "Valider sÃ©curitÃ©"]
    },
    {
        id: 4,
        nom: "Tirer les leÃ§ons et capitaliser",
        description: "Retour d'expÃ©rience et amÃ©lioration continue",
        actionsTypes: ["RETEX Ã©quipes", "Rapport final", "Plan amÃ©lioration", "Formation"]
    }
];

const roles = [
    {id: "strategique", nom: "Cellule StratÃ©gique", couleur: "#6f42c1"},
    {id: "cyber-it", nom: "Ãquipes Cyber & IT", couleur: "#20c997"},
    {id: "metiers", nom: "MÃ©tiers", couleur: "#fd7e14"},
    {id: "communication", nom: "Communication", couleur: "#0dcaf0"},
    {id: "juridique", nom: "Juridique", couleur: "#6c757d"}
];

// Actions de dÃ©monstration
let actions = [
    {
        id: 1,
        title: "Isolation immÃ©diate des serveurs compromis",
        phase: 1,
        priority: "P0",
        role: "cyber-it",
        status: "done",
        description: "DÃ©connecter physiquement les serveurs affectÃ©s du rÃ©seau principal",
        createdAt: "2025-06-11T08:45:00",
        completedAt: "2025-06-11T09:15:00"
    },
    {
        id: 2,
        title: "Activation de la cellule de crise",
        phase: 1,
        priority: "P0", 
        role: "strategique",
        status: "done",
        description: "Convoquer tous les membres de la cellule de crise selon le plan d'urgence",
        createdAt: "2025-06-11T08:35:00",
        completedAt: "2025-06-11T09:00:00"
    },
    {
        id: 3,
        title: "DÃ©claration incident ANSSI/CNIL",
        phase: 1,
        priority: "P1",
        role: "juridique",
        status: "done",
        description: "Notification rÃ©glementaire sous 72h aux autoritÃ©s compÃ©tentes",
        createdAt: "2025-06-11T09:00:00",
        completedAt: "2025-06-11T09:30:00"
    },
    {
        id: 4,
        title: "Analyse forensique des logs systÃ¨me",
        phase: 2,
        priority: "P1",
        role: "cyber-it", 
        status: "in-progress",
        description: "Examiner les journaux pour identifier le vecteur d'attaque et la chronologie",
        createdAt: "2025-06-11T09:30:00"
    },
    {
        id: 5,
        title: "Communication interne Ã©quipes soignantes",
        phase: 2,
        priority: "P1",
        role: "communication",
        status: "in-progress", 
        description: "Informer les Ã©quipes mÃ©dicales des procÃ©dures en mode dÃ©gradÃ©",
        createdAt: "2025-06-11T09:45:00"
    },
    {
        id: 6,
        title: "Ãvaluation pÃ©rimÃ¨tre de compromission",
        phase: 2,
        priority: "P0",
        role: "cyber-it",
        status: "in-progress",
        description: "Cartographie complÃ¨te des systÃ¨mes affectÃ©s et potentiellement compromis",
        createdAt: "2025-06-11T10:00:00"
    },
    {
        id: 7,
        title: "Activation plan de continuitÃ© mÃ©tier",
        phase: 2,
        priority: "P1",
        role: "metiers",
        status: "in-progress",
        description: "Basculement vers les procÃ©dures papier et systÃ¨mes de secours",
        createdAt: "2025-06-11T10:15:00"
    },
    {
        id: 8,
        title: "ConfÃ©rence de presse direction",
        phase: 2,
        priority: "P2",
        role: "communication",
        status: "todo",
        description: "PrÃ©paration et organisation point presse pour rassurer patients et familles",
        createdAt: "2025-06-11T10:30:00"
    }
];

// EntrÃ©es de main courante
let mainCourante = [
    {
        id: 1,
        author: "Chef de projet SI",
        time: "09:45",
        content: "Isolation des serveurs patients effectuÃ©e. Aucune propagation dÃ©tectÃ©e sur ce segment."
    },
    {
        id: 2,
        author: "Responsable Communication",
        time: "09:30", 
        content: "ANSSI et CNIL informÃ©es par tÃ©lÃ©phone. Confirmation Ã©crite envoyÃ©e."
    },
    {
        id: 3,
        author: "DSI",
        time: "09:15",
        content: "Cellule de crise activÃ©e. 15 personnes mobilisÃ©es sur site, 10 en tÃ©lÃ©travail sÃ©curisÃ©."
    },
    {
        id: 4,
        author: "Analyste Cyber",
        time: "09:00",
        content: "PremiÃ¨re analyse : ransomware de type Ryuk dÃ©tectÃ©. Investigation en cours sur le vecteur initial."
    }
];

// Ãtat de l'application
let currentPage = 'dashboard';
let filteredActions = [...actions];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    updateCrisisTimer();
    generateActionsList();
    generateMainCourante();
    initializeCharts();
    initializeTemplatesAndReports();
    
    // Mise Ã  jour du timer toutes les minutes
    setInterval(updateCrisisTimer, 60000);
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Mettre Ã  jour les liens actifs
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher la page correspondante
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');
            
            currentPage = targetPage;
            
            // RÃ©initialiser les graphiques si nÃ©cessaire
            if (targetPage === 'reporting') {
                setTimeout(initializeCharts, 100);
            }
        });
    });
}

// Gestion des modals
function initializeModals() {
    const incidentModal = document.getElementById('incident-modal');
    const actionModal = document.getElementById('action-modal');
    
    // Gestion du bouton nouveau incident
    const newIncidentBtn = document.getElementById('new-incident-btn');
    if (newIncidentBtn) {
        newIncidentBtn.addEventListener('click', () => {
            incidentModal.classList.add('show');
        });
    }
    
    // Gestion du bouton nouvelle action avec dÃ©lÃ©gation d'Ã©vÃ©nement
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'new-action-btn') {
            actionModal.classList.add('show');
        }
    });
    
    // Fermeture des modals
    document.getElementById('close-incident-modal').addEventListener('click', () => {
        incidentModal.classList.remove('show');
    });
    
    document.getElementById('cancel-incident').addEventListener('click', () => {
        incidentModal.classList.remove('show');
    });
    
    document.getElementById('close-action-modal').addEventListener('click', () => {
        actionModal.classList.remove('show');
    });
    
    document.getElementById('cancel-action').addEventListener('click', () => {
        actionModal.classList.remove('show');
    });
    
    // Fermeture en cliquant Ã  l'extÃ©rieur
    [incidentModal, actionModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Soumission des formulaires
    document.getElementById('incident-form').addEventListener('submit', handleIncidentSubmit);
    document.getElementById('action-form').addEventListener('submit', handleActionSubmit);
}

function handleIncidentSubmit(e) {
    e.preventDefault();
    // Simulation de crÃ©ation d'incident
    alert('Incident dÃ©clarÃ© avec succÃ¨s ! La cellule de crise sera notifiÃ©e.');
    document.getElementById('incident-modal').classList.remove('show');
    e.target.reset();
}

function handleActionSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const inputs = e.target.querySelectorAll('input, select, textarea');
    const newAction = {
        id: actions.length + 1,
        title: inputs[0].value,
        phase: parseInt(inputs[1].value),
        priority: inputs[2].value,
        role: inputs[3].value,
        status: 'todo',
        description: inputs[4].value,
        createdAt: new Date().toISOString()
    };
    
    actions.unshift(newAction);
    filteredActions = [...actions];
    generateActionsList();
    
    document.getElementById('action-modal').classList.remove('show');
    e.target.reset();
    
    // Notification
    showNotification('Action crÃ©Ã©e avec succÃ¨s !', 'success');
}

// Timer de crise
function updateCrisisTimer() {
    const now = new Date();
    const elapsed = now - crisisData.startTime;
    
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    
    const timerElement = document.getElementById('elapsed-time');
    if (timerElement) {
        timerElement.textContent = `${hours}h ${minutes}min`;
    }
}

// GÃ©nÃ©ration de la liste des actions
function generateActionsList() {
    const container = document.getElementById('actions-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    filteredActions.forEach(action => {
        const actionElement = createActionElement(action);
        container.appendChild(actionElement);
    });
    
    // Initialiser les filtres
    initializeActionFilters();
}

function createActionElement(action) {
    const div = document.createElement('div');
    div.className = 'action-item';
    
    const role = roles.find(r => r.id === action.role);
    const phase = phases.find(p => p.id === action.phase);
    
    const statusLabels = {
        'todo': 'Ã faire',
        'in-progress': 'En cours', 
        'blocked': 'BloquÃ©',
        'done': 'TerminÃ©'
    };
    
    const statusClasses = {
        'todo': 'status--info',
        'in-progress': 'status--warning',
        'blocked': 'status--error', 
        'done': 'status--success'
    };
    
    div.innerHTML = `
        <div class="action-header">
            <h3 class="action-title">${action.title}</h3>
            <span class="status ${statusClasses[action.status]}">${statusLabels[action.status]}</span>
        </div>
        <div class="action-meta">
            <span class="action-tag priority-${action.priority}">${action.priority}</span>
            <span class="action-tag role-${action.role}">${role.nom}</span>
            <span class="action-tag">Phase ${action.phase}</span>
        </div>
        <p class="action-description">${action.description}</p>
        <div class="action-footer">
            <span class="action-progress">CrÃ©Ã© le ${formatDate(action.createdAt)}</span>
            <div class="action-buttons">
                ${action.status !== 'done' ? `<button class="btn btn--sm btn--secondary" onclick="updateActionStatus(${action.id}, 'in-progress')">Prendre en charge</button>` : ''}
                ${action.status === 'in-progress' ? `<button class="btn btn--sm btn--primary" onclick="updateActionStatus(${action.id}, 'done')">Terminer</button>` : ''}
            </div>
        </div>
    `;
    
    return div;
}

function updateActionStatus(actionId, newStatus) {
    const action = actions.find(a => a.id === actionId);
    if (action) {
        action.status = newStatus;
        if (newStatus === 'done') {
            action.completedAt = new Date().toISOString();
        }
        filteredActions = [...actions];
        generateActionsList();
        showNotification(`Action mise Ã  jour : ${statusLabels[newStatus] || newStatus}`, 'success');
    }
}

// Filtres des actions
function initializeActionFilters() {
    const phaseFilter = document.getElementById('filter-phase');
    const priorityFilter = document.getElementById('filter-priority');
    const statusFilter = document.getElementById('filter-status');
    
    [phaseFilter, priorityFilter, statusFilter].forEach(filter => {
        if (filter) {
            filter.removeEventListener('change', applyActionFilters);
            filter.addEventListener('change', applyActionFilters);
        }
    });
}

function applyActionFilters() {
    const phaseFilter = document.getElementById('filter-phase').value;
    const priorityFilter = document.getElementById('filter-priority').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredActions = actions.filter(action => {
        return (!phaseFilter || action.phase.toString() === phaseFilter) &&
               (!priorityFilter || action.priority === priorityFilter) &&
               (!statusFilter || action.status === statusFilter);
    });
    
    const container = document.getElementById('actions-list');
    if (container) {
        container.innerHTML = '';
        filteredActions.forEach(action => {
            const actionElement = createActionElement(action);
            container.appendChild(actionElement);
        });
    }
}

// Main courante
function generateMainCourante() {
    const container = document.getElementById('entries-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    mainCourante.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'entry-item';
        
        entryElement.innerHTML = `
            <div class="entry-header">
                <span class="entry-author">${entry.author}</span>
                <span class="entry-time">${entry.time}</span>
            </div>
            <p class="entry-content">${entry.content}</p>
        `;
        
        container.appendChild(entryElement);
    });
    
    // Bouton d'ajout d'entrÃ©e
    const addBtn = document.getElementById('add-entry-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addMainCouranteEntry);
    }
}

function addMainCouranteEntry() {
    const content = prompt('Nouvelle entrÃ©e dans la main courante :');
    if (content && content.trim()) {
        const now = new Date();
        const entry = {
            id: mainCourante.length + 1,
            author: 'Utilisateur actuel',
            time: now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}),
            content: content.trim()
        };
        
        mainCourante.unshift(entry);
        generateMainCourante();
        showNotification('EntrÃ©e ajoutÃ©e Ã  la main courante', 'success');
    }
}

// Graphiques
function initializeCharts() {
    // DÃ©truire les graphiques existants s'ils existent
    if (window.progressChart) {
        window.progressChart.destroy();
    }
    if (window.actionsChart) {
        window.actionsChart.destroy();
    }
    
    // Graphique de progression
    const progressCtx = document.getElementById('progressChart');
    if (progressCtx) {
        window.progressChart = new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: ['08:30', '09:00', '09:30', '10:00', '10:30'],
                datasets: [{
                    label: 'Actions terminÃ©es',
                    data: [0, 2, 5, 8, 8],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Actions crÃ©Ã©es',
                    data: [4, 8, 12, 16, 20],
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Graphique rÃ©partition des actions
    const actionsCtx = document.getElementById('actionsChart');
    if (actionsCtx) {
        window.actionsChart = new Chart(actionsCtx, {
            type: 'doughnut',
            data: {
                labels: ['TerminÃ©es', 'En cours', 'Ã faire', 'BloquÃ©es'],
                datasets: [{
                    data: [8, 4, 6, 2],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Initialisation des templates et rapports
function initializeTemplatesAndReports() {
    // Gestion des templates de communication
    const templateBtns = document.querySelectorAll('.template-btn');
    templateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const templateType = this.textContent.trim();
            showNotification(`Template "${templateType}" chargÃ©`, 'success');
        });
    });
    
    // Gestion des boutons de rapport
    const reportBtns = document.querySelectorAll('.report-btn');
    reportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.textContent.trim();
            showNotification(`GÃ©nÃ©ration du rapport "${reportType}" en cours...`, 'info');
        });
    });
}

// Utilitaires
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    // CrÃ©ation d'une notification simple
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: var(--color-success);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1001;
        transition: all 0.3s ease;
        transform: translateX(100%);
        opacity: 0;
    `;
    
    if (type === 'error') {
        notification.style.background = 'var(--color-error)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animation d'entrÃ©e
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Raccourcis clavier
document.addEventListener('keydown', function(e) {
    // Alt + D : Dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        document.querySelector('[data-page="dashboard"]').click();
    }
    
    // Alt + A : Actions
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        document.querySelector('[data-page="actions"]').click();
    }
    
    // Alt + C : Communication
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        document.querySelector('[data-page="communication"]').click();
    }
    
    // Ãchap : Fermer les modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

// Simulation de donnÃ©es en temps rÃ©el
setInterval(function() {
    // Mise Ã  jour alÃ©atoire de quelques mÃ©triques
    const now = new Date();
    if (now.getMinutes() % 5 === 0 && now.getSeconds() === 0) {
        // Toutes les 5 minutes, simuler une mise Ã  jour
        showNotification('Mise Ã  jour des donnÃ©es en temps rÃ©el', 'info');
    }
}, 1000);

// Gestion de la persistance locale simple (simulation)
function saveApplicationState() {
    const state = {
        actions: actions,
        mainCourante: mainCourante,
        currentPage: currentPage,
        lastUpdate: new Date().toISOString()
    };
    
    // En production, ceci serait envoyÃ© vers un serveur
    console.log('Ãtat de l\'application sauvegardÃ©', state);
}

// Sauvegarde pÃ©riodique de l'Ã©tat
setInterval(saveApplicationState, 30000); // Toutes les 30 secondes

// Variables globales pour les labels de statut
const statusLabels = {
    'todo': 'Ã faire',
    'in-progress': 'En cours', 
    'blocked': 'BloquÃ©',
    'done': 'TerminÃ©'
};