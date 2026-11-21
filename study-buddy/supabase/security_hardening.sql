-- StudyBuddy access-control hardening.
-- Review this migration before running it in Supabase SQL Editor.
-- It intentionally keeps the authenticated user directory searchable by name,
-- while exposing an email address through search_profiles only for an exact match.

begin;

-- DELETE realtime events must include enough participant data for both sides
-- to remove a friendship immediately instead of waiting for a manual refresh.
alter table public.friend_requests replica identity full;
alter table public.direct_messages replica identity full;
alter table public.group_members replica identity full;
alter table public.group_messages replica identity full;

-- Ensure the tables used by Realtime subscriptions are published.
-- Run this migration if chat or notifications arrive only after a manual refresh.
do $$
declare
  realtime_table text;
begin
  foreach realtime_table in array array[
    'friend_requests',
    'direct_messages',
    'study_groups',
    'group_members',
    'group_messages',
    'profiles'
  ]
  loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = realtime_table
    ) then
      execute format(
        'alter publication supabase_realtime add table public.%I',
        realtime_table
      );
    end if;
  end loop;
end;
$$;

-- Remove duplicate join requests/memberships and prevent future duplicates.
-- Accepted membership wins, followed by pending, rejected, and unknown status.
delete from public.group_members as gm
using (
  select
    ctid,
    row_number() over (
      partition by group_id, user_id
      order by
        case status
          when 'accepted' then 0
          when 'pending' then 1
          when 'rejected' then 2
          else 3
        end,
        created_at desc nulls last,
        id desc
    ) as duplicate_rank
  from public.group_members
) as ranked
where gm.ctid = ranked.ctid
  and ranked.duplicate_rank > 1;

create unique index if not exists group_members_group_user_unique
  on public.group_members (group_id, user_id);

-- RLS must be enabled for policies to be enforced.
alter table public.profiles enable row level security;
alter table public.friend_requests enable row level security;
alter table public.direct_messages enable row level security;
alter table public.study_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_messages enable row level security;
alter table public.room_messages enable row level security;

-- Remove the permissive legacy policies shown in the supplied Supabase output.
drop policy if exists "Allow all insert direct_messages" on public.direct_messages;
drop policy if exists "Allow all read direct_messages" on public.direct_messages;

drop policy if exists "Allow all read friend_requests" on public.friend_requests;
drop policy if exists "Allow all update friend_requests" on public.friend_requests;
drop policy if exists "Allow all write friend_requests" on public.friend_requests;

drop policy if exists "Allow individual insert/update access" on public.profiles;
drop policy if exists "Allow insert profiles for all users" on public.profiles;
drop policy if exists "Allow public read access to profiles" on public.profiles;
drop policy if exists "Allow update profile for all authenticated users" on public.profiles;
drop policy if exists "Allow update profiles for all users" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

drop policy if exists "Allow all to insert messages" on public.room_messages;
drop policy if exists "Allow all to select messages" on public.room_messages;

drop policy if exists "Allow all access for study_groups" on public.study_groups;
drop policy if exists "Allow public read and insert" on public.study_groups;

-- Recreate the application's intended study-group policies.
drop policy if exists study_groups_read_public on public.study_groups;
drop policy if exists study_groups_insert_owner on public.study_groups;
drop policy if exists study_groups_update_owner on public.study_groups;
drop policy if exists study_groups_delete_owner on public.study_groups;

create policy study_groups_read_public
  on public.study_groups for select
  to anon, authenticated
  using (true);

create policy study_groups_insert_owner
  on public.study_groups for insert
  to authenticated
  with check (host_id = (select auth.uid())::text);

create policy study_groups_update_owner
  on public.study_groups for update
  to authenticated
  using (public.is_study_group_host(id::text))
  with check (public.is_study_group_host(id::text));

create policy study_groups_delete_owner
  on public.study_groups for delete
  to authenticated
  using (public.is_study_group_host(id::text));

-- Group membership and group-chat rules remain host/member scoped.
drop policy if exists group_members_read_related on public.group_members;
drop policy if exists group_members_insert_self_pending on public.group_members;
drop policy if exists group_members_update_group_host on public.group_members;
drop policy if exists group_members_delete_self_or_host on public.group_members;

create policy group_members_read_related
  on public.group_members for select
  to authenticated
  using (
    user_id = (select auth.uid())::text
    or public.is_study_group_host(group_id::text)
    or public.is_accepted_study_group_member(group_id::text)
  );

create policy group_members_insert_self_pending
  on public.group_members for insert
  to authenticated
  with check (
    user_id = (select auth.uid())::text
    and status = 'pending'
    and exists (
      select 1 from public.study_groups as sg
      where sg.id = group_members.group_id
    )
  );

create policy group_members_update_group_host
  on public.group_members for update
  to authenticated
  using (public.is_study_group_host(group_id::text))
  with check (
    public.is_study_group_host(group_id::text)
    and status in ('accepted', 'rejected')
  );

create policy group_members_delete_self_or_host
  on public.group_members for delete
  to authenticated
  using (
    user_id = (select auth.uid())::text
    or public.is_study_group_host(group_id::text)
  );

drop policy if exists group_messages_read_members on public.group_messages;
drop policy if exists group_messages_insert_members on public.group_messages;
drop policy if exists group_messages_delete_host on public.group_messages;

create policy group_messages_read_members
  on public.group_messages for select
  to authenticated
  using (
    public.is_study_group_host(group_id)
    or public.is_accepted_study_group_member(group_id)
  );

create policy group_messages_insert_members
  on public.group_messages for insert
  to authenticated
  with check (
    user_id = (select auth.uid())::text
    and (
      public.is_study_group_host(group_id)
      or public.is_accepted_study_group_member(group_id)
    )
  );

create policy group_messages_delete_host
  on public.group_messages for delete
  to authenticated
  using (public.is_study_group_host(group_id));

-- Profiles: users can read themselves and accepted friends. Profile discovery
-- uses the limited search function below instead of exposing the full table.
create policy profiles_read_self_and_friends
  on public.profiles for select
  to authenticated
  using (
    id = (select auth.uid())
    or exists (
      select 1
      from public.friend_requests as fr
      where fr.status = 'accepted'
        and (
          (fr.sender_id = (select auth.uid()) and fr.receiver_id = profiles.id)
          or (fr.receiver_id = (select auth.uid()) and fr.sender_id = profiles.id)
        )
    )
  );

create policy profiles_insert_self
  on public.profiles for insert
  to authenticated
  with check (
    id = (select auth.uid())
    and email = (select auth.jwt() ->> 'email')
  );

create policy profiles_update_self
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid())
    and email = (select auth.jwt() ->> 'email')
  );

-- Friend requests: only participants can read; only the recipient can respond.
create policy friend_requests_read_participants
  on public.friend_requests for select
  to authenticated
  using (
    sender_id = (select auth.uid())
    or receiver_id = (select auth.uid())
  );

create policy friend_requests_insert_self_pending
  on public.friend_requests for insert
  to authenticated
  with check (
    sender_id = (select auth.uid())
    and receiver_id <> (select auth.uid())
    and status = 'pending'
  );

create policy friend_requests_update_recipient
  on public.friend_requests for update
  to authenticated
  using (
    receiver_id = (select auth.uid())
    and status = 'pending'
  )
  with check (
    receiver_id = (select auth.uid())
    and status in ('accepted', 'rejected')
  );

-- Direct messages: restrict message rows to their two participants and allow
-- sending only between users with an accepted friend request.
create policy direct_messages_read_participants
  on public.direct_messages for select
  to authenticated
  using (
    sender_id = (select auth.uid())
    or receiver_id = (select auth.uid())
  );

create policy direct_messages_insert_friends
  on public.direct_messages for insert
  to authenticated
  with check (
    sender_id = (select auth.uid())
    and receiver_id <> (select auth.uid())
    and exists (
      select 1
      from public.friend_requests as fr
      where fr.status = 'accepted'
        and (
          (fr.sender_id = direct_messages.sender_id and fr.receiver_id = direct_messages.receiver_id)
          or (fr.receiver_id = direct_messages.sender_id and fr.sender_id = direct_messages.receiver_id)
        )
    )
  );

-- Do not expose the unused legacy room_messages table through the Data API.
-- The React app uses group_messages instead.

-- Remove broad table grants and grant only the operations the app needs.
revoke all on table public.profiles, public.friend_requests,
  public.direct_messages, public.study_groups, public.group_members,
  public.group_messages, public.room_messages
  from public, anon;

revoke select, insert, update, delete on table public.profiles,
  public.friend_requests, public.direct_messages, public.study_groups,
  public.group_members, public.group_messages, public.room_messages
  from authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert on table public.friend_requests to authenticated;
grant update (status) on table public.friend_requests to authenticated;
grant select, insert on table public.direct_messages to authenticated;
grant select, insert, update, delete on table public.study_groups to authenticated;
grant select, insert, delete on table public.group_members to authenticated;
grant update (status) on table public.group_members to authenticated;
grant select, insert, delete on table public.group_messages to authenticated;
grant select on table public.study_groups to anon;

-- The old table is not used by this app; deny its API access.
revoke all on table public.room_messages from authenticated;

-- Limited user search: return only display fields, and reveal an email only
-- when the user searched for that exact email address.
create or replace function public.search_profiles(search_term text)
returns table (
  id uuid,
  display_name text,
  email text,
  avatar text,
  faculty text
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    p.id,
    p.display_name,
    case
      when lower(p.email) = lower(trim(search_term)) then p.email
      else null
    end as email,
    p.avatar,
    p.faculty
  from public.profiles as p
  where auth.uid() is not null
    and nullif(trim(search_term), '') is not null
    and (
      p.display_name ilike '%' || trim(search_term) || '%'
      or p.email ilike '%' || trim(search_term) || '%'
    )
  order by
    case when lower(p.email) = lower(trim(search_term)) then 0 else 1 end,
    p.display_name
  limit 10;
$function$;

revoke all on function public.search_profiles(text) from public, anon;
grant execute on function public.search_profiles(text) to authenticated;

commit;
