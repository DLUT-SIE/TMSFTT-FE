/** Permission objects are basic items to check permissions. */
export interface Permission {
    /** The id of the permission. */
    id?: number;
    /** Human-readable label of thie permission. */
    label?: string;
    /** The codename of the permission. */
    codename?: string;
}

/** UserPermission objects are related to specific user. */
export interface UserPermission {
    /** The id of the user-permission. */
    id?: number;
    /** The id of the user. */
    user?: number;
    /** The id of the permission. */
    permission?: number;
}

/** GroupPermission objects are related to specific group. */
export interface GroupPermission {
    /** The id of the group-permission. */
    id?: number;
    /** The id of the group. */
    group?: number;
    /** The id of the permission. */
    permission?: number;
}

/** The status of user for specific permission, it's temporary object. */
export interface UserPermissionStatus {
    /** The id of the user-permission. */
    id?: number;
    /** The id of the user. */
    user?: number;
    /** The permission object. */
    permission?: Permission;
    hasPermission?: boolean;
}

/** The status of group for specific permission, it's temporary object. */
export interface GroupPermissionStatus {
    /** The id of the group-permission. */
    id?: number;
    /** The id of the group. */
    group?: number;
    /** The permission object. */
    permission?: Permission;
    hasPermission?: boolean;
}
