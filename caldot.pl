#!/usr/bin/env perl
use Mojolicious::Lite;

get '/' => sub {
  my $c = shift;
  $c->render(template => 'index');
};

get '/load';

get '/chart';

get '/table';

get '/help/*help' => sub {
    my $c = shift;
    $c->render(text => $c->param('help'))
};

app->start;

__DATA__

