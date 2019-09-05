# README

Note: I expect these instructions to change after Jason 'dockerizes' us. Because of this I won't be getting too
specific on versions of some things, if I expect it not to matter.

Download and install JRuby 9.2.8 on your system:

https://www.jruby.org/download

Download jruby complete jar file and put it in the jruby root directory:

https://www.jruby.org/download

```bazaar
gbowman@MSI c:\languages\jruby\jruby9.2.8.0\jruby-9.2.8.0                    
$ ls -la                                                                     
total 25625                                                                  
drwxr-xr-x 1 gbowman 197121        0 Aug 19 15:37 .                          
drwxr-xr-x 1 gbowman 197121        0 Aug 19 15:35 ..                         
-rw-r--r-- 1 gbowman 197121     1282 Aug 12 10:19 BSDL                       
-rw-r--r-- 1 gbowman 197121   131622 Aug 12 10:19 COPYING                    
-rw-r--r-- 1 gbowman 197121      218 Aug 12 10:19 LEGAL                      
-rw-r--r-- 1 gbowman 197121     2581 Aug 12 10:19 LICENSE.RUBY               
drwxr-xr-x 1 gbowman 197121        0 Aug 12 10:29 bin                        
-rw-r--r-- 1 gbowman 197121 26083456 Aug 19 15:31 jruby-complete-9.2.8.0.jar 
drwxr-xr-x 1 gbowman 197121        0 Aug 12 10:29 lib                        
drwxr-xr-x 1 gbowman 197121        0 Aug 12 10:29 samples                    
drwxr-xr-x 1 gbowman 197121        0 Aug 12 10:29 tool                       
```

Make yourself a bat/bash file and make the obvious changes (This is mine):
```bazaar
set JRUBY_OPTS=--dev -J-Xmx2g -J-Djava.awt.headless=true -J-Dcatalina.base=./logs/java_logs -J-Djava.net.preferIPv4Stack=true
set GEM_HOME=C:\work\digital_services_bpa\gem_home
set JRUBY_HOME=C:\languages\jruby\jruby9.2.8.0\jruby-9.2.8.0
set JRUBY_JAR=C:\languages\jruby\jruby9.2.8.0\jruby-9.2.8.0\jruby-complete-9.2.8.0.jar
set JAVA_HOME=C:\languages\Java\jdk-11.0.4
set PATH=%GEM_HOME%\bin;%JRUBY_HOME%\bin;%JAVA_HOME%\bin;.\bin;%PATH%;
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.base/java.io=org.jruby.dist
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.base/java.nio.channels=org.jruby.dist
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.base/sun.nio.ch=org.jruby.dist
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.base/sun.nio.ch=org.jruby.core
set JAVA_OPTS=%JAVA_OPTS% --add-opens java.logging/java.util.logging=org.jruby.dist
```

You will run your bat or source your bash.

Install Java 11 JDK.
https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html

Install Maven, Yarn and Node. The latest should be fine.

At a terminal run in the project root run the following:
```bazaar
gem install bundler.
```

From rails root do a (For the full build maven will do this):
```bazaar
bundle install
```

Run the following at rails root:
```
yarn install
```

Setup your database.  We will use postgres, so install that on your system.
Create a user: 
```bazaar
dsbpa
```

Assign that user all permissions.

Create the following databases, owner is dsbpa:
```bazaar
dsbpa_development
dsbpa_test
dsbpa_production
```

Run:

```bazaar
rake db:migrate
```

There is a bat file to bring up the webpack dev server for development.   Convert it to bash if on a Mac.
$ wds.bat

```bazaar
wds.bat
```

There is a startup.bat file to bring up the webserver outside of Tomcat.  Convert it to bash if on a Mac.
$ startup.bat

Running shows:
```bazaar
$ startup.bat

@ C:\work\digital_services_bpa\dsbpa
$ C:\languages\Java\jdk-11.0.4\bin\java  -server  -jar C:\languages\jruby\jruby9.2.8.0\jruby-9.2.8.0\jruby-complete-9.2.8.0.jar C:\work\digital_services_bpa\gem_home\bin\trinidad
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by org.jruby.runtime.encoding.EncodingService (file:/C:/languages/jruby/jruby9.2.8.0/jruby-9.2.8.0/jruby-complete-9.2.8.0.jar) to field java.io.Console.cs
WARNING: Please consider reporting this to the maintainers of org.jruby.runtime.encoding.EncodingService
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release
Deploying from C:/work/digital_services_bpa/dsbpa as /dsbpa
Initializing ProtocolHandler ["http-bio-0.0.0.0-3000"]
Unknown loader jdk.internal.loader.ClassLoaders$AppClassLoader@2cdf8d8a class jdk.internal.loader.ClassLoaders$AppClassLoader
jruby 9.2.8.0 (2.5.3) 2019-08-12 a1ac7ff Java HotSpot(TM) 64-Bit Server VM 11.0.4+10-LTS on 11.0.4+10-LTS +jit [mswin32-x86_64]
using a shared (threadsafe!) runtime
uri:classloader:/jruby/rack/response.rb:294: warning: constant ::Fixnum is deprecated
uri:classloader:/jruby/rack/core_ext.rb:26: warning: constant ::NativeException is deprecated
Starting ProtocolHandler ["http-bio-0.0.0.0-3000"]

```
When you see 'Starting ProtocolHandler' it is listening. Do not worry about the warnings.

Try:

http://localhost:3000/dsbpa

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



# Docker notes
###bring docker up in foreground
```
docker-compose up 
```

###pull latest war
```
docker-compose pull
```

###test my local changes (run maven build first)
```
docker-compose up --build 
```

### run in background
```
docker-compose up -d 
```

###kill my background docker
```
docker-compose down 
```

###execute command in docker container
```
docker-compose exec dsbpa ls -la 
```

###show stdout
```
docker-compose logs dsbpa 
```
