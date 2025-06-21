import {
    ContactsService,
    UsersService,
    FilesService,

} from './services';

const dal = {
    users: new UsersService(),
    contacts: new ContactsService(),
    files: new FilesService(),
};

export default dal;