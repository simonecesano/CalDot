#!/usr/bin/env perl
use Mojolicious::Lite;
use String::Koremutake;
use DateTime;

# Documentation browser under "/perldoc"
plugin 'PODRenderer';

get '/' => sub {
  my $c = shift;
  $c->render(template => 'index');
};

post '/' => sub {
  my $c = shift;
  $c->render(json => { message => 'done'});
};


get '/holidays' => [ format => [qw/json/]] => sub {
    my $c = shift;
    my $k = String::Koremutake->new;
    my $dt = DateTime->new(year => 2016);
    my $dates = [ map { { name => $k->integer_to_koremutake(rand(100000)), date => $dt->clone->add( days => rand(365)) } } (0..10) ];
    $c->render(json => $dates)
};

get '/holidays';

get '/show';

app->start;
__DATA__

