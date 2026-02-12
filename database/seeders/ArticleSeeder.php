<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        Article::create([
            'title'   => 'Первая запись',
            'content' => 'Как же много снега в Петербурге.',
        ]);

        Article::create([
            'title'   => 'Морозные дни',
            'content' => 'Каждый день всё холоднее и холоднее.',
        ]);

        Article::create([
            'title'   => 'Рутина',
            'content' => 'Встаём, завтракаем, делаем промты, идём в зал — вот и прошёл ещё один день.',
        ]);

        Article::create([
            'title'   => 'Обычный вечер',
            'content' => 'Приготовил ужин, посмотрел фильм. Ничего особенного, но день прошёл спокойно и нормально.',
        ]);
    }
}