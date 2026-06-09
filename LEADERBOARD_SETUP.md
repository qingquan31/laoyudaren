# 在线排行榜配置

当前游戏默认使用本机排行榜。要让所有玩家看到同一个真实排行榜，需要配置一个可写的线上数据库。

推荐使用 Supabase：

1. 创建 Supabase 项目。
2. 在 SQL Editor 执行下面的 SQL。
3. 打开 `leaderboard-config.js`，填入 Supabase Project URL 和 anon public key，并把 `provider` 改成 `"supabase"`。
4. 提交并重新部署 GitHub Pages。

```sql
create table if not exists public.fish_master_leaderboard (
  player_id text primary key,
  name text not null,
  clears integer not null default 0,
  level_index integer not null default 0,
  score integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.fish_master_leaderboard enable row level security;

create policy "Leaderboard is readable by everyone"
on public.fish_master_leaderboard
for select
to anon
using (true);

create policy "Players can submit leaderboard records"
on public.fish_master_leaderboard
for insert
to anon
with check (
  length(player_id) between 8 and 80
  and length(name) between 1 and 10
  and clears between 0 and 50
  and level_index between 0 and 49
);

create policy "Players can update leaderboard records"
on public.fish_master_leaderboard
for update
to anon
using (true)
with check (
  length(player_id) between 8 and 80
  and length(name) between 1 and 10
  and clears between 0 and 50
  and level_index between 0 and 49
);
```

`leaderboard-config.js` 示例：

```js
window.LAODAREN_LEADERBOARD = {
  provider: "supabase",
  supabaseUrl: "https://你的项目.supabase.co",
  supabaseAnonKey: "你的 anon public key",
};
```
