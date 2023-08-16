type Group = {
    id: number,
    name: string,
    rightsGroupesPermissions: Array<{ idGroupe: number, idPermission: number }>
}

export type {
    Group
}
