/** Permission objects are basic items to check permissions. */
export interface Permission {
    /** The id of the permission. */
    id: number;
    /** Human-readable label of thie permission. */
    label: string;
    /** The codename of the permission. */
    codename: string;
}

/** UserPermission objects are related to specific user. */
export interface UserPermission {
    /** The id of the user-permission. */
    id?: number;
    /** The id of the user. */
    user: number;
    /** The id of the permission. */
    permission: number;
}

export interface UserPermissionRequest {
    user: number;
    permission: number;
}

/** The status of user for specific permission */
export interface UserPermissionStatus {
    /** The id of the user-permission. */
    id?: number;
    /** The id of the user. */
    user: number;
    /** The permission object. */
    permission: Permission;
    hasPermission: boolean;
}
