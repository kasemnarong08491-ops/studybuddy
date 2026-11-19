begin;

create or replace function public.unfriend_user(target_user_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_user_id text := auth.uid()::text;
begin
  if current_user_id is null then
    raise exception 'Authentication is required to remove a friend';
  end if;

  if target_user_id is null or target_user_id = current_user_id then
    raise exception 'A valid friend user ID is required';
  end if;

  delete from public.friend_requests as fr
  where fr.status = 'accepted'
    and (
      (fr.sender_id::text = current_user_id and fr.receiver_id::text = target_user_id)
      or (fr.receiver_id::text = current_user_id and fr.sender_id::text = target_user_id)
    );

  delete from public.direct_messages as dm
  where
    (dm.sender_id::text = current_user_id and dm.receiver_id::text = target_user_id)
    or (dm.receiver_id::text = current_user_id and dm.sender_id::text = target_user_id);
end;
$function$;

revoke all on function public.unfriend_user(text) from public, anon;
grant execute on function public.unfriend_user(text) to authenticated;

commit;
