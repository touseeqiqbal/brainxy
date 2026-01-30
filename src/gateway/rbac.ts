import type { GatewayAuthUserRole } from "../config/types.gateway.js";

export const RBAC_ROLES: Record<GatewayAuthUserRole, number> = {
    viewer: 1,
    editor: 2,
    admin: 3,
};

export function hasPermission(userRole: GatewayAuthUserRole, requiredRole: GatewayAuthUserRole): boolean {
    return (RBAC_ROLES[userRole] ?? 0) >= (RBAC_ROLES[requiredRole] ?? 0);
}

export function resolveUserRole(
    roleRaw: string | undefined,
    defaultRole: GatewayAuthUserRole = "viewer",
): GatewayAuthUserRole {
    const role = roleRaw?.trim().toLowerCase();
    if (role === "admin" || role === "editor" || role === "viewer") {
        return role as GatewayAuthUserRole;
    }
    return defaultRole;
}

export const VIEW_ONLY_TOOLS = new Set([
    "read", "ls", "search", "grep_search", "find_by_name", "list_dir", "cat", "view_file", "view_code_item", "view_file_outline"
]);

export const EDITOR_TOOLS = new Set([
    ...VIEW_ONLY_TOOLS, "write", "edit", "replace_file_content", "write_to_file", "multi_replace_file_content", "apply_patch"
]);

export function filterToolsByRole<T extends { name: string }>(
    tools: T[],
    role: GatewayAuthUserRole,
): T[] {
    if (role === "admin") return tools;

    const allowed = role === "editor" ? EDITOR_TOOLS : VIEW_ONLY_TOOLS;
    return tools.filter((t) => allowed.has(t.name) || t.name.startsWith("read_") || t.name.startsWith("view_"));
}
