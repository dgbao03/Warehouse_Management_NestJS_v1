import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../configs/.env`),
});

export interface PermissionDefinition {
    name: string;
    description: string;
}

export interface RoleDefinition {
    name: string;
}

export const permissions: PermissionDefinition[] = [
    { name: "get_all_users", description: "Allows retrieving a list of all users" },

    { name: "get_user_by_id", description: "Allows retrieving a specific user by ID" },

    { name: "create_user", description: "Allows creating a new user account" },

    { name: "update_user", description: "Allows updating an existing user account" },

    { name: "delete_user", description: "Allows deleting a user account" },

    { name: "get_all_products", description: "Allows retrieving a list of all products" },

    { name: "get_all_skus", description: "Allows retrieving a list of all SKUs" },

    { name: "get_product_by_id", description: "Allows retrieving a specific product by ID" },

    { name: "get_sku_by_id", description: "Allows retrieving a specific SKU by ID" },

    { name: "create_product_sku", description: "Allows creating a new product SKU" },

    { name: "create_product_option_value", description: "Allows creating a new product option value" },

    { name: "update_product_sku", description: "Allows updating an existing product SKU" },

    { name: "create_product", description: "Allows creating a new product" },

    { name: "update_product", description: "Allows updating an existing product" },

    { name: "delete_product", description: "Allows deleting a product" },

    { name: "delete_product_sku", description: "Allows deleting a specific product SKU" },

    { name: "get_all_exports", description: "Allows retrieving all the export data" },

    { name: "get_export_by_id", description: "Allows retrieving export data by its ID"},

    { name: "create_export", description: "Allows creating new export" },

    { name: "get_all_roles", description: "Allows retrieving all roles data" },

    { name: "create_role", description: "Allows creating new role" },
    
    { name: "update_role", description: "Allows updating an exist role" },

    { name: "create_role_permission", description: "Allows applying a permission to a role" },
    
    { name: "delete_role", description: "Allows deleting a role" },

    { name: "delete_role_permission", description: "Allows removing a permission from a role" },

    { name: "get_all_permissions", description: "Allows retrieving all permission data" },

    { name: "add_user_role", description: "Allows adding role to an user" },

    { name: "delete_user_role", description: "Allows removing role of an user" }
];

export const roles: RoleDefinition[] = [
    { name: "Admin" },
    { name: "Manager" },
    { name: "Staff" },
]

export const defaultUsers = [
    {
        fullname: "Default Admin",
        age: 20,
        email: process.env.DEFAULT_ADMIN_EMAIL as string,
        password: process.env.DEFAULT_ADMIN_PASSWORD as string
    }
]

export const roles_permissions = [
    { 
        role: "Admin",
        permissions: [
            "get_all_users",
            "get_user_by_id",
            "create_user",
            "update_user",
            "delete_user",
            "get_all_products",
            "get_all_skus",
            "get_product_by_id",
            "get_sku_by_id",
            "create_product_sku",
            "create_product_option_value",
            "update_product_sku",
            "create_product",
            "update_product",
            "delete_product",
            "delete_product_sku",
            "get_all_exports",
            "get_export_by_id",
            "create_export",
            "get_all_roles",
            "create_role",
            "update_role",
            "create_role_permission",
            "delete_role",
            "delete_role_permission",
            "get_all_permissions",
            "add_user_role",
            "delete_user_role"
          ]
    }, 

    {
        role: "Manager",
        permissions: [
            "get_all_users",
            "get_user_by_id",
            "get_all_products",
            "get_all_skus",
            "get_product_by_id",
            "get_sku_by_id",
            "create_product_sku",
            "create_product_option_value",
            "update_product_sku",
            "create_product",
            "update_product",
            "delete_product",
            "delete_product_sku",
            "get_export_by_id",
            "create_export",
            "get_all_exports"
          ]
    },

    {
        role: "Staff",
        permissions: [
            "get_all_products",
            "get_all_skus",
            "get_product_by_id",
            "get_sku_by_id",
            "create_product_sku",
            "create_product",
            "get_export_by_id",
            "create_export",
            "get_all_exports"
        ]
    }
]