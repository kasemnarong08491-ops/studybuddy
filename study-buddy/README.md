# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Study group database policies

The SQL in [`supabase/rls_policies.sql`](./supabase/rls_policies.sql) enables Row Level Security for `study_groups`, `group_members`, and `group_messages`. It keeps groups readable to visitors, limits group editing to the host, and limits group chat to hosts and approved members.

To apply it, open the Supabase project, go to **SQL Editor**, create a query, paste the contents of that file, and run it. Test with two ordinary signed-in accounts: one creates a group, the other requests to join, the host approves, and both verify they can chat. A pending member should not be able to read or send group messages.

This script does not change policies for profiles, friend requests, or private messages.

## Removing a friend and private chat history

The SQL in [`supabase/friend_lifecycle.sql`](./supabase/friend_lifecycle.sql) adds the authenticated `unfriend_user` function. It atomically removes the accepted friendship and deletes all direct messages between the two users. Apply it in the Supabase project's **SQL Editor** before using the remove-friend action. Removed users must send and accept a new friend request before chatting again.
