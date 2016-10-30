#!/usr/bin/env perl
use Mojolicious::Lite;
use Path::Tiny;

get '/' => sub {
  my $c = shift;
  $c->render(template => 'index');
};

get '/load';

get '/chart';

get '/table';

get '/help/*help' => sub {
    my $c = shift;
    app->log->info($c->req->headers->referrer);
    $c->render(json => { help => $c->param('help'), referrer => $c->req->headers->referrer })
};

app->start;

__DATA__

