import {
    ContactsService,
    UsersService,
    FilesService,
    DevelopersService,
} from './services';

const dal = {
    users: new UsersService(),
    contacts: new ContactsService(),
    files: new FilesService(),
    developers: new DevelopersService(),
};


export default dal;