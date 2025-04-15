# Event Planner Webapplicatie  

## Overzicht  
Een centrale webapplicatie voor efficiënte eventorganisatie binnen bedrijven. De applicatie biedt functies zoals evenementenbeheer, polls, notificaties, en kalendersynchronisatie.

---

## Probleemstelling  
Binnen het bedrijf verloopt de eventorganisatie inefficiënt door verspreide communicatie via WhatsApp en Teams. Dit leidt tot:  
- Overzichtsverlies en dubbel werk  
- Vertraging in besluitvorming  
- Frustratie bij medewerkers  

---

## Oplossing  
Een centrale webapplicatie die:  
- **Evenementen beheert** met een overzicht van geplande en te bevestigen events  
- **Efficiënte besluitvorming** ondersteunt via polls  
- **Automatische notificaties** verzendt voor updates en herinneringen  
- **Gebruiksvriendelijk** is zonder uitgebreide training  

---

## Functionaliteiten  
- **Pollsysteem**: Stemmen en resultaten in real-time  
- **Gebruikersbeheer**: Rollen zoals admin, organisator, deelnemer  
- **Evenementbeheer**: Events aanmaken, bewerken, en bevestigen  
- **Notificatiesysteem**: E-mail en bedrijfsapps (Teams, Outlook)  
- **Kalendersynchronisatie**: Integratie met Outlook en Google Calendar  

---

## Technische Stack  
- **Frontend**: React, TypeScript, Vite  
- **Backend**: Express, MongoDB / Mongoose  
- **Authenticatie**: Auth0 / Azure AD voor SSO  
- **Realtime Communicatie**: Polling voor live updates  

---

## API Endpoints  
- **Events**: CRUD-functionaliteiten en aanwezigheid registreren  
- **Polls**: Polls aanmaken, stemmen, en resultaten ophalen  
- **Kalendersynchronisatie**: Externe agenda’s koppelen  
- **Rapportages**: Inzichten in pollresultaten en aanwezigen  

---

## Database Structuur  
- **Users**: Accountgegevens, rol, voorkeuren  
- **Events**: Details, polls, aanwezigheden, validatiestatus  
- **Polls**: Vraag, opties, en stemresultaten  
- **Attendances**: Aanwezigheidsstatus en opmerkingen  

---

## Projectstructuur  

### 1. Pages  
- **`Index.tsx`**: Homepage met navigatie naar events en polls.  
- **`Brightevents.tsx`**: Lijst van aankomende events met zoek- en paginatieopties.  
- **`BrightEventDetail.tsx`**: Gedetailleerde weergave van een specifiek event.  
- **`Myparticipations.tsx`**: Lijst van events waaraan de gebruiker deelneemt.  
- **`Myrequests.tsx`**: Overzicht van eventaanvragen van de gebruiker.  
- **`DeclinedRequests.tsx`**: Weergave van afgewezen eventaanvragen.  
- **`CreateEvent.tsx`**: Formulier voor het aanmaken van nieuwe events.  
- **`BrightPolls.tsx`**: Lijst van polls met paginatie.  
- **`BrightPollsDetail.tsx`**: Gedetailleerde weergave van een poll met stemopties.  
- **`Admin.tsx`**: Dashboard voor beheerders.  
- **`404.tsx`**: Aangepaste 404-pagina voor ongeldige routes.  

### 2. Components  
#### Global Components  
- **`Navbar.tsx`**: Navigatiebalk met authenticatie en rolgebaseerde links.  
- **`Footer.tsx`**: Footer met links naar externe bronnen en sociale media.  
- **`LinkBack.tsx`**: Navigatiecomponent voor terugkeren.  
- **`ParticipationMenu.tsx`**: Menu voor eventgerelateerde pagina's.  
- **`Pagination.tsx`**: Paginatie voor events en polls.  
- **`Searchbar.tsx`**: Zoekbalk voor het filteren van events.  

#### Event Components  
- **`EventListItem.tsx`**: Toont een enkel event in een lijst.  
- **`RequestItem.tsx`**: Toont een enkele eventaanvraag.  
- **`DeclinedItem.tsx`**: Toont een afgewezen eventaanvraag.  

#### Poll Components  
- **`PollsItem.tsx`**: Toont een enkele poll in een lijst.  
- **`ProgressBar.tsx`**: Visualiseert pollresultaten met een voortgangsbalk.  
- **`ProgressBarVote.tsx`**: Laat gebruikers stemmen in polls.  

#### Spinner  
- **`FullscreenLoader.tsx`**: Toont een laadspinner met aangepaste berichten.  

### 3. Modals  
- **`FormModal.tsx`**: Beheert formulieren voor eventdeelname.  
- **`RejectEventModal.tsx`**: Laat gebruikers deelname aan events weigeren.  
- **`CancelAttendanceModal.tsx`**: Laat gebruikers hun aanwezigheid annuleren.  
- **`DeleteEventModal.tsx`**: Bevestigt het verwijderen van een event.  
- **`ReportModal.tsx`**: Laat gebruikers events rapporteren.  
- **`DownloadModal.tsx`**: Toont een bericht wanneer er geen aanwezigheidsgegevens beschikbaar zijn.  

### 4. Providers  
- **`auth0Provider.tsx`**: Configuratie voor Auth0-authenticatie.  
- **`userProvider.tsx`**: Beheert gebruikersgegevens en rollen via context.  

### 5. Utilities  
- **`formatName.ts`**: Formatteert gebruikersnamen voor weergave.  

### 6. Context  
- **`context.ts`**: Biedt globale contexten voor gebruikersgegevens, rollen en tokens.  

### 7. Router  
- **`Router.tsx`**: Definieert applicatieroutes en hun componenten.  
- **`Root.tsx`**: Rootlayout met een navbar, footer en dynamische inhoud.  

### 8. Styles  
Custom CSS-bestanden voor componentstyling:  
- **`navbar.component.css`**  
- **`footer.component.css`**  
- **`brightEvents.component.css`**  
- **`pollsItem.component.css`**  
- **`requestItem.component.css`**  
- **`searchbar.component.css`**  
- **`404.component.css`**  
- **`Modal.component.css`**  

---

## Installatie en Setup  

### Vereisten  
- Node.js (v16 of hoger)  
- NPM of Yarn  

### Installatie  
1. **Repository klonen**  
   ```bash
   git clone <repository-url>
   cd typescript-cypress-event-planner-frontend
```
2. **Dependencies installeren**  
   ```bash
   npm install
```
3. **.env configureren**  
   Maak een .env bestand in de root van het project en voeg de volgende variabelen toe:  
   ```env
   VITE_SERVER_URL=http://localhost:3000
   VITE_AUTH0_DOMAIN=<jouw-auth0-domein>
   VITE_AUTH0_CLIENT_ID=<jouw-auth0-client-id>
   VITE_AUTH0_AUDIENCE=<jouw-auth0-audience>
   VITE_AUTH0_CLIENT_SECRET=<jouw-auth0-client-secret>
   ```
   - VITE_SERVER_URL: De URL van de backend-server.  
   - VITE_AUTH0_DOMAIN: Het domein van je Auth0-account.  
   - VITE_AUTH0_CLIENT_ID: De client-ID van je Auth0-applicatie.  
   - VITE_AUTH0_AUDIENCE: De API-audience die je in Auth0 hebt ingesteld.  
   - VITE_AUTH0_CLIENT_SECRET: De client-secret van je Auth0-applicatie (alleen nodig voor server-side functionaliteiten).  

4. **Development server starten**  
   ```bash
   npm run dev
   ```
   De applicatie is nu beschikbaar op http://localhost:3000.

---

## Contact  
Ontwikkeld door Imran Ghaddoura & Ayoub Cherif – Voor vragen of suggesties, neem contact op via imran.ghaddoura@brightest.be of ayoub.cherif@brightest.be