import { apiSlice } from "../../core/api/apiSlice";
import type {
  UserResponse,
  UserPreview,
  UpdateUserRequest,
  ChangePasswordRequest,
} from "./userTypes";
import type {
  PagedResponse,
  CursorPagedResponse,
  PaginationRequest,
} from "../../core/types/ApiResponse";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getUsers: builder.query<PagedResponse<UserResponse>, PaginationRequest>({
      query: (params) => ({
        url: "users",
        params: {
          currentPage: params.currentPage,
          pageSize: params.pageSize,
        },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "User" as const, id })),
            { type: "User", id: "LIST" },
          ]
          : [{ type: "User", id: "LIST" }],
    }),

    getUserById: builder.query<UserResponse, string>({
      query: (id) => ({ url: `users/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    getUserByEmail: builder.query<UserResponse, string>({
      query: (email) => ({ url: `users/by-email/${email}` }),
      providesTags: (_result, _error, email) => [{ type: "User", id: email }],
    }),

    getNewestMembers: builder.query<
      CursorPagedResponse<UserPreview>,
      { count: number; lastDate?: string; lastId?: string }
    >({
      query: ({ count, lastDate, lastId }) => ({
        url: `users/newest-members/${count}`,
        params: { lastDate, lastId },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "User" as const, id })),
            { type: "User", id: "NEWEST" },
          ]
          : [{ type: "User", id: "NEWEST" }],
    }),

    checkEmailUnique: builder.query<boolean, string>({
      query: (email) => ({
        url: "users/check-email",
        params: { email },
      }),
    }),

    getMe: builder.query<UserResponse, void>({
      query: () => ({ url: "users/me" }),
      providesTags: ["User"],
    }),

    // PUT /api/users/profile
    updateProfile: builder.mutation<null, UpdateUserRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);

        if (data.imageFile) {
          formData.append("imageFile", data.imageFile);
        }

        return {
          url: "users/profile",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation<null, ChangePasswordRequest>({
      query: (body) => ({
        url: "users/change-password",
        method: "PUT",
        body,
      }),
    }),

    deleteUser: builder.mutation<null, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
        { type: "User", id: "NEWEST" },
      ],
    }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useGetNewestMembersQuery,
  useCheckEmailUniqueQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
} = usersApiSlice;