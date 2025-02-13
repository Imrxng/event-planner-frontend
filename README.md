# Event Planner Webapplicatie  

## Probleemstelling  
Binnen het bedrijf verloopt de eventorganisatie inefficiënt door verspreide communicatie via WhatsApp en Teams. Dit leidt tot:  
- Overzichtsverlies en dubbel werk  
- Vertraging in besluitvorming  
- Frustratie bij medewerkers  

## Oplossing  
Een centrale webapplicatie die:  
- **Evenementen beheert** met een overzicht van geplande en te bevestigen events  
- **Efficiënte besluitvorming** ondersteunt via polls  
- **Automatische notificaties** verzendt voor updates en herinneringen  
- **Gebruiksvriendelijk** is zonder uitgebreide training  

## Functionaliteiten  
- **Pollsysteem**: Stemmen en resultaten in real-time  
- **Gebruikersbeheer**: Rollen zoals admin, organisator, deelnemer  
- **Evenementbeheer**: Events aanmaken, bewerken, en bevestigen  
- **Notificatiesysteem**: E-mail en bedrijfsapps (Teams, Outlook)  
- **Kalendersynchronisatie**: Integratie met Outlook en Google Calendar  

## Technische Stack  
- **Frontend**: React  
- **Backend**: Express, MongoDB / Mongoose  
- **Authenticatie**: Auth0 / Azure AD voor SSO  
- **Realtime Communicatie**: Polling voor live updates  

## API Endpoints (Overzicht)  
- **Events**: CRUD-functionaliteiten en aanwezigheid registreren  
- **Polls**: Polls aanmaken, stemmen, en resultaten ophalen  
- **Kalendersynchronisatie**: Externe agenda’s koppelen  
- **Rapportages**: Inzichten in pollresultaten en aanwezigen  

## Database Structuur  
- **Users**: Accountgegevens, rol, voorkeuren  
- **Events**: Details, polls, aanwezigheden, validatiestatus  
- **Polls**: Vraag, opties, en stemresultaten  
- **Attendances**: Aanwezigheidsstatus en opmerkingen  


## Contact  
Ontwikkeld door Imran Ghaddoura & Ayoub Cherif – Voor vragen of suggesties, neem contact op via imran.ghaddoura@brightest.be of ayoub.cherif@brightest.be
