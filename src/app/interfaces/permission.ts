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
    id?: number;
    /** The id of the user. */
    user: number;
    /** The permission id of this user-permission related to. */
    permission: Permission;
    /** Indicate whether user has this permission. */
    hasPerm: boolean;
}

export interface UserPermissionRequest {
    user: number;
    permission_id: number;
}
