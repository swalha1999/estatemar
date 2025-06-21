import {
    ContactsService,
    UsersService,
    FilesService,
    InvitesService,
    LeadsService,
    WhatsAppService,
    FamiliesService,
    HouseholdsService
} from './services';

const dal = {
    users: new UsersService(),
    contacts: new ContactsService(),
    files: new FilesService(),
    invites: new InvitesService(),
    leads: new LeadsService(),
    whatsapp: new WhatsAppService(),
    families: new FamiliesService(),
    households: new HouseholdsService(),
};

export default dal;