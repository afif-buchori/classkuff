export interface IDataOrganization {
    id: string;
    title: string;
}

export interface IDataClassInfo {
    name: string;
    titles: IDataOrganization[];
}

export interface IUserForm {
    nis: string;
    name: string;
    gender: string;
    title: string;
}
export interface IDayGroup {
    day: string;
    members: IUserForm[];
}

export interface IUserCash {
    idUser: string;
    cashInfo: string[];
}
