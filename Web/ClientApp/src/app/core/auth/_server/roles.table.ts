export class RolesTable {
    public static roles: any = [
        {
            id: 1,
            title: 'Therapist',
            isCoreRole: true,
            permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33, 36, 39, 40, 42]
        },
        {
            id: 2,
            title: 'Administrator',
            isCoreRole: true,
            permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33, 36, 39, 40, 42]
        },
        {
            id: 3,
            title: 'Guest',
            isCoreRole: false,
            permissions: []
        },
        {
            id: 4,
            title: 'Participant',
            isCoreRole: false,
            permissions: [13, 14, 17, 19, 20, 21, 22, 31, 32, 34, 35, 37, 38, 41]
        }
    ];
}
