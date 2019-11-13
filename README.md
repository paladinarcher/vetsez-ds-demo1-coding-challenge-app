# README

## Setup for Ruby on Rails
##### Note for Windows 10 Pro users:  When installing programs, ensure that none of file paths have spaces in them (e.g. C:\Users\Program Location vs C:\Users\ProgramLocation).  The first one will cause problems with Ruby on Rails.

1. Download and install the current stable versions of:  
JAVA 11 JDK, JRuby ((<= 9.2.8.0) - Desired Executable Setup File), Maven, Yarn, PostgreSQL, and Node  
(When acquiring the JDK and JRuby, ensure they are both the 64-bit versions and allow paths to be modified)
```
https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
https://www.jruby.org/download
https://maven.apache.org/download.cgi  (install instructions at https://maven.apache.org/install.html)
https://yarnpkg.com/lang/en/docs/install/#windows-stable
https://nodejs.org/en/download/  
https://www.postgresql.org/download/ (Remember the password assigned during installation)
```
2. Download JRuby JAR complete file (and place it into the base directory JRuby was installed into)
```
https://www.jruby.org/download
```
3.  Ensure GIT is working on the development machine and clone the following Repo:
```
https://github.com/meetveracity/coding-challenge-app.git
```
***Wherever the clone is created will hereafter be referred to as the Rails root.***

4.  Create a batch file in the Rails root named options.bat and copy the following into it and changing the marked lines as needed for the local environment (Including removing the > at the beginning of the lines):
```bazaar
@echo off
set JRUBY_OPTS=--dev -J-Xmx2g -J-Djava.awt.headless=true -J-Dcatalina.base=./logs/java_logs -J-Djava.net.preferIPv4Stack=true
>set GEM_HOME=<Up one directory from the repo then mkdir gem_home.  That entire absolute path (up one from repo + \gem_home)>
>set JRUBY_HOME=<Full absolute path of the install folder for ruby>
>set JRUBY_JAR=<Full absolute path of the install folder for ruby and full name of JAR File that was copied earlier>
>set JAVA_HOME=<Full absolute path of the install folder for the Java JDK>
set PATH=%GEM_HOME%\bin;%JRUBY_HOME%\bin;%JAVA_HOME%\bin;.\bin;%PATH%;
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.base/java.io=org.jruby.dist
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.base/java.nio.channels=org.jruby.dist
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.base/sun.nio.ch=org.jruby.dist
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.base/sun.nio.ch=org.jruby.core
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.logging/java.util.logging=org.jruby.dist
set DATABASE_USER=dsbpa
set DATABASE_PASSWORD=dsbpa
```

5.  At a command prompt, run the following commands while in Rails root:  
```
options
gem install bundler
bundle install
yarn install
```
6.  At the command prompt run the following command to bring up the PostgreSQL command line interface (CLI)
```
psql -U postgres
```
(The password will be the one that was set during postgreSQL installation)  

7.  Once the CLI is available, type the following commands
```
CREATE USER dsbpa WITH PASSWORD 'dsbpa';
CREATE DATABASE dsbpa_development;
CREATE DATABASE dsbpa_test;
CREATE DATABASE dsbpa_production;
GRANT ALL PRIVILEGES ON DATABASE dsbpa_development TO dsbpa;
GRANT ALL PRIVILEGES ON DATABASE dsbpa_test TO dsbpa;
GRANT ALL PRIVILEGES ON DATABASE dsbpa_production TO dsbpa;
\q
```
8.  At a command prompt, run the following commands while in the Rails root and then restart the Rails server (if the rails server says you have pending migrations, rerun this):
```
options.bat
rake db:migrate
rake db:seed
```
9.  After you restart the Rails server, run the following commands while in the Rails root:
```
options.bat
wds.bat
```
10.  Open a second command prompt/terminal and run the following while in the Rails root:
```
options.bat
startup.bat
```
11.  After this is running, the website should be running locally.  To test, go to:
```
http://localhost:3000/dsbpa
```

## Notes



To build a war:

```bazaar
mvn clean package
```

To build a war without running any tests (useful when you want to avoid a dependency on a database).

```bazaar
 mvn -f no_test_pom.xml clean package
```

Look in the target directory when done for dsbpa-1.00-SNAPSHOT.war.
When deploying to Tomcat rename the war file to 'dsbpa.war' so the initial context is only 'dsbpa'



## Docker notes
#### Bring docker up in foreground
```
docker-compose up
```

#### Pull latest war
```
docker-compose pull
```

#### Test my local changes after running the maven build locally
```
docker-compose up --build
```

#### If you are having database issues with connections you can remove the local volumes
```
docker-compose down -v
```

#### Run in background
```
docker-compose up -d
```

#### Kill my background docker
```
docker-compose down
```

#### Execute command in docker container
```
docker-compose exec dsbpa ls -la
```

#### Show stdout
```
docker-compose logs dsbpa
```

## Running Selenium Tests
#### Prerequisites

You must install the Selenium side runner and add it to your PATH. Make sure you have Chrome installed on your machine.
```
yarn global add selenium-side-runner
```
Add the chromedriver.exe to your Windows PATH. This file can be downloaded from test/selenium

#### Running the test in the command line

To run a suite of tests in the command line, open up a new Bash instance and run the following:

```
selenium-side-runner -c "browserName=chrome chromeOptions.args=[headless,no-sandbox,disable-dev-shm-usage]" ./test/selenium/coding-challenge-app.side
```

You may create your own test cases by using the Selenium IDE Chrome extension and exporting the .side file. The coding-challenge-app.side is the default test suite that is used in the Jenkins build.

#### Running a local build to test new changes
```
docker-compose pull
mvn -f no_test_pom.xml clean package
docker-compose up
```
#### Additional Notes

To run the scripts on a different URL (such as a production environment, you may pass it in as a parameter:

```
selenium-side-runner --base-url https://localhost
```

The official build process exports the test results in a report format. To produce a report locally, pass in the output directory and the format you want the report in:

```
selenium-side-runner --output-directory=results --output-format=jest
```

Additional information on the side runner can be found at https://docs.seleniumhq.org/selenium-ide/docs/en/introduction/command-line-runner/
