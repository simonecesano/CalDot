#!/usr/bin/env perl
use Mojolicious::Lite;
use Mojo::URL;
use Path::Tiny;
use Data::Dump qw/dump/;
use Text::MultiMarkdown 'markdown';

get '/' => sub {
  my $c = shift;
  $c->render(template => 'index');
};

get '/load';

get '/chart';

get '/table';

helper help => sub {
    my $c = shift;
    my $help = shift || 'index';
    
    my $ctx;
    my $base = quotemeta($c->req->url->base);
    my $ref  = $c->req->headers->referrer;
    if ($ref =~ s/^$base//) { $ctx = $ref; $ctx =~ s/^\///; }
    my $file = path('./help/', $help . '.txt');
    if ($file->is_file) {
	$c->stash('help' => markdown($file->slurp));
	return $c->render(template => 'help')
    } else { return $c->reply->not_found }
};

get '/help/*help' => sub {
    my $c = shift;
    $c->help($c->param('help'));
};

get '/help' => sub {
    my $c = shift;
    $c->help('index');
};

app->start;

__DATA__

