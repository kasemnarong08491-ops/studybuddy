begin;

create or replace function public.is_study_group_host(target_group_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.study_groups as sg
    where sg.id::text = target_group_id
      and (
        sg.host_id = (select auth.uid())::text
        or sg.host_id = (select auth.jwt() ->> 'email')
      )
  );
$$;

create or replace function public.is_accepted_study_group_member(target_group_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members as gm
    where gm.group_id::text = target_group_id
      and gm.user_id = (select auth.uid())::text
      and gm.status = 'accepted'
  );
$$;

revoke all on function public.is_study_group_host(text) from public, anon;
revoke all on function public.is_accepted_study_group_member(text) from public, anon;
grant execute on function public.is_study_group_host(text) to authenticated;
grant execute on function public.is_accepted_study_group_member(text) to authenticated;

alter table public.study_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_messages enable row level security;

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
      select 1
      from public.study_groups as sg
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

revoke all on public.study_groups, public.group_members, public.group_messages from anon;
grant select on public.study_groups to anon;
grant select, insert, update, delete on public.study_groups to authenticated;
grant select, insert, update, delete on public.group_members to authenticated;
grant select, insert, delete on public.group_messages to authenticated;

commit;
