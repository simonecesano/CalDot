use strict;
use warnings;

use FindBin;

use Plack::Builder;
use Plack::App::File;
use Plack::Response;

use Mojo::Server::PSGI;
builder {
    # enable "Debug";
    mount '/' => sub {
    	my $res = Plack::Response->new;
    	$res->redirect('/a/v1');
    	return $res->finalize;
    };
    
    #-----------------------------
    # budgeting app
    #-----------------------------
    mount "/a/v1/static" => Plack::App::File->new(root => './public')->to_app;
    mount "/a/v1" => builder {
    	my $server = Mojo::Server::PSGI->new;
    	$server->load_app('./caldot.pl');
	$server->app->hook(before_dispatch => sub { shift->req->url->base->path('/a/v1') });
	$server->app->secrets([qw/uno due tre/]);
    	$server->to_psgi_app;
    };
};

