import { apiSlice } from "@/core/api/apiSlice";
import type { RoleResponse, CreateRoleRequest, UpdateRoleRequest } from "@/features/roles/roleTypes";
import type { PagedResponse, PaginationRequest } from "@/core/types/ApiResponse";

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getRoles: builder.query<PagedResponse<RoleResponse>, PaginationRequest>({
      query: (params) => ({
        url: "roles",
        params: {
          currentPage: params.currentPage,
          pageSize: params.pageSize,
        },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "Role" as const, id })),
            { type: "Role", id: "LIST" },
          ]
          : [{ type: "Role", id: "LIST" }],
    }),

    getRoleById: builder.query<RoleResponse, number>({
      query: (id) => ({ url: `roles/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),

    createRole: builder.mutation<RoleResponse, CreateRoleRequest>({
      query: (body) => ({
        url: "roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    updateRole: builder.mutation<null, UpdateRoleRequest>({
      query: (body) => ({
        url: "roles",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Role", id: arg.id },
        { type: "Role", id: "LIST" }
      ],
    }),

    deleteRole: builder.mutation<null, number>({
      query: (id) => ({
        url: `roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" }
      ],
    }),

  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApiSlice;