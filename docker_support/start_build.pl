use strict;
use warnings;

#start the DB
system "cd /postgres/ && rm -rf ./data";
system "runuser -l postgres -c '/usr/lib/postgresql/10/bin/pg_ctl -D /postgres/data initdb'";
system "runuser -l postgres -c '/usr/lib/postgresql/10/bin/pg_ctl -D /postgres/data -l logfile start'";
system "runuser -l postgres -c 'psql -c \"SELECT version();\"'";
my $sql = <<EOS;
CREATE USER $ENV{DATABASE_USER} WITH PASSWORD '$ENV{DATABASE_PASSWORD}';
CREATE DATABASE dsbpa_development;
CREATE DATABASE dsbpa_test;
CREATE DATABASE dsbpa_production;
GRANT ALL PRIVILEGES ON DATABASE dsbpa_development TO $ENV{DATABASE_USER};
GRANT ALL PRIVILEGES ON DATABASE dsbpa_test TO $ENV{DATABASE_USER};
GRANT ALL PRIVILEGES ON DATABASE dsbpa_production TO $ENV{DATABASE_USER};
EOS
open (FH, '>', '/app/docker_support/db_setup.psql') or die $!;
print FH $sql;
close FH;
my $command = "runuser -l postgres -c 'psql -f /app/docker_support/db_setup.psql'";
print "Running:\n";
print $command."\n";
system($command);
#start maven
system("mvn -Dmaven.repo.local=../mvn_repo clean package");
