# Documentation Utilisateur - GestCyber

## ð Guide d'utilisation de la plateforme de gestion de crise cyber

### ð¯ Objectif de l'application

GestCyber est une plateforme de gestion de crise cyber conforme aux recommandations ANSSI. Elle permet de coordonner efficacement la rÃ©ponse Ã  un incident cyber selon les 4 phases officielles :

1. **Phase 1** : Alerter, mobiliser et endiguer
2. **Phase 2** : Maintenir la confiance et comprendre l'attaque
3. **Phase 3** : Relancer les activitÃ©s et durcir les SI
4. **Phase 4** : Tirer les leÃ§ons et capitaliser

## ð  Page d'accueil - Dashboard

### Vue d'ensemble

Le dashboard principal offre une vue consolidÃ©e de la situation de crise :

#### Indicateurs de statut
- **ð¢ Normal** : Fonctionnement normal des systÃ¨mes
- **ð¡ Alerte** : Surveillance renforcÃ©e, incident mineur dÃ©tectÃ©
- **ð  Crise** : Incident majeur en cours nÃ©cessitant une cellule de crise
- **ð´ Critique** : Paralysie totale des activitÃ©s, situation d'urgence maximale

#### MÃ©triques temps rÃ©el
- **Temps Ã©coulÃ© depuis le dÃ©but de l'incident**
- **Phase actuelle de gestion de crise**
- **Nombre d'actions en cours / terminÃ©es**
- **Ãquipes mobilisÃ©es**
- **SystÃ¨mes affectÃ©s**

#### Timeline des Ã©vÃ©nements
Affichage chronologique des Ã©vÃ©nements majeurs de la crise avec :
- Horodatage prÃ©cis
- Type d'Ã©vÃ©nement (dÃ©tection, action, communication)
- Responsable de l'action
- Statut (en cours, terminÃ©, bloquÃ©)

### Navigation
Le menu latÃ©ral permet d'accÃ©der aux diffÃ©rents modules :
- ð **Dashboard** : Vue d'ensemble
- â **Actions** : Gestion des tÃ¢ches
- ð¬ **Communication** : Centre de communication
- ð **Investigation** : Analyse technique
- ð§ **Reconstruction** : Remise en service
- ð **Reporting** : Rapports et mÃ©triques

## â Module Actions

### Vue gÃ©nÃ©rale
Le module Actions centralise toutes les tÃ¢ches Ã  rÃ©aliser pendant la crise.

#### CrÃ©ation d'une nouvelle action
1. Cliquer sur **"Nouvelle Action"**
2. Remplir le formulaire :
   - **Titre** : Description claire de l'action
   - **Phase ANSSI** : SÃ©lectionner la phase correspondante (1-4)
   - **PrioritÃ©** : P0 (critique), P1 (Ã©levÃ©e), P2 (moyenne), P3 (faible)
   - **Ãquipe responsable** : Cellule stratÃ©gique, Cyber-IT, MÃ©tiers, Communication, Juridique
   - **ÃchÃ©ance** : Date et heure limite
   - **Description dÃ©taillÃ©e** : Instructions prÃ©cises
3. Cliquer sur **"CrÃ©er l'action"**

#### Gestion des actions existantes

##### Filtrage et tri
- **Par phase** : Afficher uniquement les actions d'une phase spÃ©cifique
- **Par prioritÃ©** : Trier par ordre de criticitÃ©
- **Par Ã©quipe** : Filtrer par Ã©quipe responsable
- **Par statut** : Ã faire, En cours, TerminÃ©, BloquÃ©

##### Statuts des actions
- **ð´ Ã faire** : Action crÃ©Ã©e, pas encore dÃ©marrÃ©e
- **ð¡ En cours** : Action en cours de rÃ©alisation
- **ð¢ TerminÃ©** : Action complÃ©tÃ©e avec succÃ¨s
- **â« BloquÃ©** : Action bloquÃ©e, nÃ©cessite intervention

##### Modification d'une action
1. Cliquer sur l'action dans la liste
2. Modifier les champs nÃ©cessaires
3. Ajouter des commentaires de suivi
4. Mettre Ã  jour le statut
5. Sauvegarder les modifications

#### Escalade automatique
- Les actions P0 non traitÃ©es dans les 30 minutes gÃ©nÃ¨rent une alerte
- Les actions P1 non traitÃ©es dans les 2 heures gÃ©nÃ¨rent une notification
- Notification automatique aux responsables hiÃ©rarchiques

## ð¬ Module Communication

### Main courante partagÃ©e
Registre central de tous les Ã©vÃ©nements et communications :

#### Ajout d'une entrÃ©e
1. Cliquer sur **"Nouvelle entrÃ©e"**
2. SÃ©lectionner le type :
   - **Information** : Information gÃ©nÃ©rale
   - **DÃ©cision** : DÃ©cision prise par la cellule de crise
   - **Communication** : Message envoyÃ© Ã  des parties prenantes
   - **Alerte** : Information urgente
3. RÃ©diger le contenu
4. Attribuer l'importance (Normal, Important, Critique)
5. Valider l'entrÃ©e

#### Recherche et filtrage
- Recherche par mots-clÃ©s
- Filtrage par date/heure
- Filtrage par type d'entrÃ©e
- Filtrage par auteur

### Gestion des communications externes

#### Templates de messages
Messages prÃ©-approuvÃ©s pour diffÃ©rentes situations :
- **Notification d'incident** aux autoritÃ©s (ANSSI, CNIL)
- **Communication client** sur l'indisponibilitÃ© de services
- **CommuniquÃ© de presse** en cas de mÃ©diatisation
- **Information partenaires** sur les impacts

#### Annuaire de crise
- **Contacts internes** : Ãquipes, responsables, experts
- **Contacts externes** : AutoritÃ©s, prestataires, mÃ©dias
- **Contacts d'urgence** : NumÃ©ros prioritaires 24/7
- **Canaux alternatifs** : Moyens de communication de secours

### Suivi des dÃ©clarations obligatoires
- **ANSSI** : DÃ©claration d'incident de sÃ©curitÃ©
- **CNIL** : Notification de violation de donnÃ©es personnelles
- **AutoritÃ©s judiciaires** : DÃ©pÃ´t de plainte
- **Assurances** : DÃ©claration de sinistre

## ð Module Investigation

### Cartographie de la compromission

#### Vue systÃ¨me
- **SystÃ¨mes compromis** : Liste des serveurs/applications affectÃ©s
- **PÃ©rimÃ¨tre d'impact** : Ãtendue gÃ©ographique et technique
- **Vecteur d'attaque** : Point d'entrÃ©e identifiÃ©
- **Propagation** : Chemin de compromission

#### Timeline de l'attaque
1. **Point d'entrÃ©e** : Date/heure et mÃ©thode d'intrusion
2. **Mouvement latÃ©ral** : Progression dans le rÃ©seau
3. **Exfiltration** : Vol de donnÃ©es identifiÃ©
4. **Impact final** : Chiffrement/destruction de donnÃ©es

### Collecte des preuves

#### Logs et traces
- **Logs systÃ¨me** : ÃvÃ©nements Windows/Linux
- **Logs rÃ©seau** : Trafic suspect identifiÃ©
- **Logs applicatifs** : Comportements anormaux
- **Forensics** : Images disques et mÃ©moire

#### Indicateurs de compromission (IoC)
- **Adresses IP** malveillantes
- **Domaines** utilisÃ©s par les attaquants
- **Hash de fichiers** malveillants
- **Signatures** d'attaque dÃ©tectÃ©es

### Analyse et corrÃ©lation
- **Famille de malware** identifiÃ©e
- **Techniques MITRE ATT&CK** utilisÃ©es
- **Attribution** (si possible)
- **Motivations** de l'attaque

## ð§ Module Reconstruction

### Plan de remise en service

#### Priorisation des systÃ¨mes
- **P0 - Critique** : SystÃ¨mes vitaux (sauvegardes, AD, DNS)
- **P1 - ÃlevÃ©e** : Applications mÃ©tier critiques
- **P2 - Moyenne** : Applications secondaires
- **P3 - Faible** : SystÃ¨mes non-critiques

#### Phases de reconstruction
1. **PrÃ©paration** : Validation des sauvegardes saines
2. **Isolement** : CrÃ©ation d'un environnement sÃ©curisÃ©
3. **Restauration** : Remise en service progressive
4. **Tests** : Validation fonctionnelle et sÃ©curitaire
5. **Production** : Retour en service surveillÃ©

### Suivi de la progression

#### MÃ©triques de rÃ©cupÃ©ration
- **RTO (Recovery Time Objective)** : Temps de remise en service visÃ©
- **RPO (Recovery Point Objective)** : Perte de donnÃ©es maximale tolÃ©rÃ©e
- **Temps rÃ©el de rÃ©cupÃ©ration** : Suivi en temps rÃ©el
- **Pourcentage d'avancement** : Par systÃ¨me et global

#### Validation de sÃ©curitÃ©
- **Tests de pÃ©nÃ©tration** : Validation de la sÃ©curisation
- **Scan de vulnÃ©rabilitÃ©s** : Absence de failles critiques
- **Configuration baseline** : Respect des standards de sÃ©curitÃ©
- **Monitoring renforcÃ©** : Surveillance active post-remise en service

### Gestion des dÃ©rogations
- **DÃ©rogations temporaires** : Mesures d'urgence documentÃ©es
- **Risques acceptÃ©s** : Validation par la direction
- **Plan de rÃ©gularisation** : Actions de mise en conformitÃ©
- **Suivi des Ã©chÃ©ances** : Alertes sur les dÃ©rogations expirÃ©es

## ð Module Reporting

### Rapports de situation

#### Rapport exÃ©cutif
- **RÃ©sumÃ© de situation** : Statut actuel en 1 page
- **Actions clÃ©s** : Principales dÃ©cisions et rÃ©alisations
- **Prochaines Ã©tapes** : Planning des 24 prochaines heures
- **Risques identifiÃ©s** : Points de vigilance

#### Rapport technique
- **Analyse de compromission** : DÃ©tails techniques
- **Actions de remÃ©diation** : Mesures techniques prises
- **Indicateurs de sÃ©curitÃ©** : MÃ©triques de protection
- **Recommandations** : AmÃ©liorations suggÃ©rÃ©es

### MÃ©triques de performance

#### Indicateurs de gestion de crise
- **Temps de dÃ©tection** : DÃ©lai entre incident et dÃ©tection
- **Temps de rÃ©action** : DÃ©lai entre dÃ©tection et premiÃ¨re action
- **Temps de rÃ©solution** : DurÃ©e totale de l'incident
- **EfficacitÃ© des Ã©quipes** : Ratio actions terminÃ©es/crÃ©Ã©es

#### Indicateurs opÃ©rationnels
- **DisponibilitÃ© des services** : Pourcentage de temps d'uptime
- **Performance des Ã©quipes** : Respect des Ã©chÃ©ances
- **QualitÃ© de la communication** : Indicateurs de satisfaction
- **CoÃ»t de la crise** : Impact financier global

### RETEX (Retour d'expÃ©rience)

#### Collecte des retours
- **Questionnaires Ã©quipes** : Feedback des intervenants
- **Analyse des dysfonctionnements** : Points d'amÃ©lioration
- **Bonnes pratiques** : Actions particuliÃ¨rement efficaces
- **Recommandations** : AmÃ©liorations pour l'avenir

#### Plan d'amÃ©lioration
- **Actions correctives** : Mesures immÃ©diates
- **Actions prÃ©ventives** : PrÃ©vention d'incidents similaires
- **Formation** : Besoins de renforcement des compÃ©tences
- **Ãvolution des procÃ©dures** : Mises Ã  jour nÃ©cessaires

## ð¨ Gestion d'un nouvel incident

### ProcÃ©dure de dÃ©clenchement

#### 1. DÃ©tection d'incident
- Cliquer sur **"ð¨ Nouveau Incident"** dans la barre latÃ©rale
- Remplir le formulaire de dÃ©claration :
  - **Date/heure de dÃ©tection**
  - **Type d'incident** (Ransomware, Vol de donnÃ©es, DDoS, etc.)
  - **SystÃ¨mes impactÃ©s**
  - **Niveau de criticitÃ©** initial
  - **PremiÃ¨res observations**

#### 2. Activation automatique
L'application gÃ©nÃ¨re automatiquement :
- **Actions de phase 1** : Mobilisation, isolation, alerte
- **Timeline d'incident** : Horodatage des Ã©vÃ©nements
- **Cellule de crise** : Notification des Ã©quipes
- **Communication** : Templates de messages

#### 3. Escalade
Selon la criticitÃ©, notification automatique :
- **Direction gÃ©nÃ©rale** pour incidents critiques
- **Ãquipes techniques** pour incidents majeurs
- **Parties prenantes** selon les procÃ©dures

### Workflow type d'incident

#### Phase 1 : Alerter, mobiliser et endiguer (0-4h)
1. **Confirmer l'incident** et Ã©valuer la criticitÃ©
2. **Activer la cellule de crise** stratÃ©gique
3. **Isoler les systÃ¨mes** compromis
4. **Alerter les autoritÃ©s** (ANSSI, CNIL si applicable)
5. **Mobiliser les Ã©quipes** techniques et mÃ©tiers

#### Phase 2 : Maintenir la confiance et comprendre l'attaque (4h-48h)
1. **Communiquer** avec les parties prenantes
2. **Investiguer** pour comprendre l'attaque
3. **Identifier le pÃ©rimÃ¨tre** de compromission
4. **Mettre en place** le mode dÃ©gradÃ©
5. **Analyser les impacts** mÃ©tiers

#### Phase 3 : Relancer les activitÃ©s et durcir les SI (2-30 jours)
1. **Durcir** les systÃ¨mes selon les vulnÃ©rabilitÃ©s identifiÃ©es
2. **Restaurer** les donnÃ©es Ã  partir de sauvegardes saines
3. **Tester** les applications avant remise en production
4. **Surveiller** les systÃ¨mes restaurÃ©s
5. **Reprendre** progressivement les activitÃ©s

#### Phase 4 : Tirer les leÃ§ons et capitaliser (aprÃ¨s rÃ©solution)
1. **Organiser** le retour d'expÃ©rience (RETEX)
2. **Analyser** les dysfonctionnements et bonnes pratiques
3. **DÃ©finir** un plan d'amÃ©lioration
4. **Former** les Ã©quipes sur les leÃ§ons apprises
5. **Mettre Ã  jour** les procÃ©dures et outils

## âï¸ Configuration et personnalisation

### ParamÃ¨tres utilisateur
- **Profil** : RÃ´le dans l'organisation (StratÃ©gique, Technique, MÃ©tier)
- **Notifications** : Types d'alertes Ã  recevoir
- **Interface** : PrÃ©fÃ©rences d'affichage (mode sombre, langue)
- **Raccourcis** : Actions rapides personnalisÃ©es

### ParamÃ¨tres organisation
- **Contacts** : Annuaire de crise spÃ©cifique
- **ProcÃ©dures** : Adaptation aux processus internes
- **Seuils d'alerte** : CritÃ¨res de dÃ©clenchement personnalisÃ©s
- **Templates** : Messages adaptÃ©s au contexte

## ð Support et aide

### Aide contextuelle
- **Bouton "?"** : Aide sur chaque Ã©cran
- **Tooltips** : Explications des champs et fonctions
- **Guides intÃ©grÃ©s** : ProcÃ©dures pas-Ã -pas
- **FAQ** : Questions frÃ©quentes

### En cas de problÃ¨me technique
1. **Actualiser** la page (F5)
2. **Vider le cache** du navigateur
3. **VÃ©rifier la connexion** internet
4. **Contacter** l'administrateur systÃ¨me

### Formation recommandÃ©e
- **Formation initiale** : 2 heures sur l'utilisation de base
- **Formation avancÃ©e** : 4 heures sur toutes les fonctionnalitÃ©s
- **Exercices pratiques** : Simulations d'incidents
- **Mise Ã  jour** : Formation continue sur les Ã©volutions

## ð Checklist utilisateur

### Avant un incident
- [ ] VÃ©rifier l'accÃ¨s Ã  l'application
- [ ] Valider les contacts dans l'annuaire
- [ ] Tester les notifications
- [ ] RÃ©viser les procÃ©dures d'urgence

### Pendant un incident
- [ ] Documenter toutes les actions dans la main courante
- [ ] Mettre Ã  jour rÃ©guliÃ¨rement le statut des actions
- [ ] Communiquer les informations importantes
- [ ] Respecter les prioritÃ©s et Ã©chÃ©ances

### AprÃ¨s un incident
- [ ] ComplÃ©ter le RETEX
- [ ] Archiver la documentation
- [ ] Mettre Ã  jour les procÃ©dures
- [ ] Planifier les actions d'amÃ©lioration

---

**Important** : Cette application contient des informations sensibles de sÃ©curitÃ©. Respectez les consignes de confidentialitÃ© et de sÃ©curitÃ© de votre organisation.